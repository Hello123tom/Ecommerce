import mongoose from "mongoose";
import { stripe } from "../config/stripe.js";
import handleAsyncError from "../middleware/handleAsyncError.js";
import handleError from "../utils/handleError.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";


//*** */ ກວດຄວາມຖືກຂອງຂໍ້ມູນ
const isValidShippingInfo = (shippingInfo) => {
    const requiredFields = [
        "address",
        "city",
        "state",
        "country",
        "pinCode",
        "phoneNumber"
    ];

    return shippingInfo &&
        typeof shippingInfo === "object" &&
        requiredFields.every((field) =>
            typeof shippingInfo[field] === "string" &&
            shippingInfo[field].trim().length > 0
        );
};

const findOrderForSession = async (session) => {
    const orderId = session.metadata?.orderId;
    if (!orderId) {
        return null;
    }
    if (!mongoose.isValidObjectId(orderId)) {
        throw new Error("Stripe session has an invalid order reference");
    }

    const order = await Order.findOne({
        _id: orderId,
        stripeSessionId: session.id
    });
    if (!order) {
        throw new Error("No order matches the Stripe session");
    }
    if (session.metadata?.userId !== order.user.toString()) {
        throw new Error("Stripe session user does not match the order");
    }

    return order;
};

const markOrderPaid = async (session) => {
    if (session.payment_status !== "paid") {
        return;
    }

    const order = await findOrderForSession(session);
    if (!order) {
        return;
    }
    if (
        session.currency !== "usd" ||
        session.amount_total !== Math.round(order.totalPrice * 100)
    ) {
        throw new Error("Stripe session amount does not match the order");
    }
    if (order.paymentStatus === "paid") {
        return;
    }
    if (order.paymentStatus !== "pending") {
        throw new Error(`Cannot mark an order with status ${order.paymentStatus} as paid`);
    }

    const paymentIntentId = typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id;

    const result = await Order.updateOne(
        {
            _id: order._id,
            stripeSessionId: session.id,
            paymentStatus: "pending"
        },
        {
            $set: {
                paymentStatus: "paid",
                orderStatus: "Processing",
                paymentInfo: {
                    id: paymentIntentId || session.id,
                    status: "succeeded"
                },
                paidAt: new Date()
            }
        }
    );

    if (result.modifiedCount === 0) {
        const currentOrder = await Order.findById(order._id);
        if (currentOrder?.paymentStatus !== "paid") {
            throw new Error("Order payment status could not be updated");
        }
    }
};

const markOrderUnpaid = async (session, paymentStatus) => {
    const order = await findOrderForSession(session);
    if (!order || order.paymentStatus !== "pending") {
        return;
    }

    await Order.updateOne(
        {
            _id: order._id,
            stripeSessionId: session.id,
            paymentStatus: "pending"
        },
        {
            $set: {
                paymentStatus,
                orderStatus: "Cancelled",
                "paymentInfo.status": paymentStatus
            }
        }
    );
};

export const Payment = handleAsyncError(async (req, res, next) => {
    const { items, shippingInfo } = req.body || {};
    if (
        !Array.isArray(items) ||
        items.length === 0 ||
        items.some((item) =>
            !item ||
            typeof item.productId !== "string" ||
            !mongoose.isValidObjectId(item.productId) ||
            !Number.isSafeInteger(item.quantity) ||
            item.quantity < 1
        )
    ) {
        return next(new handleError("Invalid cart", 400));
    }
    if (!isValidShippingInfo(shippingInfo)) {
        return next(new handleError("Invalid shipping information", 400));
    }

    const quantitiesByProduct = new Map();
    for (const item of items) {
        const productId = item.productId;
        const quantity = (quantitiesByProduct.get(productId) || 0) + item.quantity;
        if (!Number.isSafeInteger(quantity)) {
            return next(new handleError("Invalid product quantity", 400));
        }
        quantitiesByProduct.set(productId, quantity);
    }

    const productIds = [...quantitiesByProduct.keys()];
    if (productIds.length > 98) {
        return next(new handleError("Cart contains too many different products", 400));
    }
    const products = await Product.find({ _id: { $in: productIds } });
    if (products.length !== productIds.length) {
        return next(new handleError("One or more products were not found", 404));
    }

    const productsById = new Map(
        products.map((product) => [product._id.toString(), product])
    );
    const lineItems = [];
    const orderItems = [];
    let subtotalCents = 0;

    for (const [productId, quantity] of quantitiesByProduct) {
        const product = productsById.get(productId);
        const unitAmount = Math.round(product.price * 100);
        if (!Number.isSafeInteger(unitAmount) || unitAmount < 1) {
            return next(new handleError("Product has an invalid price", 400));
        }
        if (quantity > product.stock) {
            return next(new handleError("Insufficient stock", 400));
        }

        const lineTotal = unitAmount * quantity;
        if (!Number.isSafeInteger(lineTotal)) {
            return next(new handleError("Order total is invalid", 400));
        }
        subtotalCents += lineTotal;

        lineItems.push({
            price_data: {
                currency: "usd",
                product_data: { name: product.name },
                unit_amount: unitAmount
            },
            quantity
        });
        orderItems.push({
            name: product.name,
            price: unitAmount / 100,
            quantity,
            image: product.images?.[0]?.url || "",
            product: product._id
        });
    }

    const taxCents = Math.round(subtotalCents * 0.18);
    const shippingCents = subtotalCents > 100000 ? 0 : 5000;
    const totalCents = subtotalCents + taxCents + shippingCents;
    if (!Number.isSafeInteger(totalCents)) {
        return next(new handleError("Order total is invalid", 400));
    }

    if (taxCents > 0) {
        lineItems.push({
            price_data: {
                currency: "usd",
                product_data: { name: "Tax (18%)" },
                unit_amount: taxCents
            },
            quantity: 1
        });
    }
    if (shippingCents > 0) {
        lineItems.push({
            price_data: {
                currency: "usd",
                product_data: { name: "Shipping" },
                unit_amount: shippingCents
            },
            quantity: 1
        });
    }

    const order = await Order.create({
        shippingInfo: {
            address: shippingInfo.address.trim(),
            city: shippingInfo.city.trim(),
            state: shippingInfo.state.trim(),
            country: shippingInfo.country.trim(),
            pinCode: shippingInfo.pinCode.trim(),
            phoneNo: shippingInfo.phoneNumber.trim()
        },
        orderItems,
        user: req.user._id,
        orderStatus: "Awaiting Payment",
        paymentStatus: "pending",
        paymentInfo: { status: "pending" },
        itemsPrice: subtotalCents / 100,
        taxPrice: taxCents / 100,
        shippingPrice: shippingCents / 100,
        totalPrice: totalCents / 100
    });

    const clientUrl = (process.env.CLIENT_URL || "http://localhost:5173").replace(/\/+$/, "");
    let session;
    try {
        session = await stripe.checkout.sessions.create({
            line_items: lineItems,
            mode: "payment",
            client_reference_id: order._id.toString(),
            metadata: {
                orderId: order._id.toString(),
                userId: req.user._id.toString()
            },
            success_url: `${clientUrl}/checkout/result?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${clientUrl}/checkout/result?checkout=cancel`
        });
    } catch (error) {
        await Order.updateOne(
            { _id: order._id, paymentStatus: "pending" },
            { $set: { paymentStatus: "failed", orderStatus: "Cancelled" } }
        );
        throw error;
    }

    order.stripeSessionId = session.id;
    try {
        await order.save();
    } catch (error) {
        try {
            await stripe.checkout.sessions.expire(session.id);
        } catch (expireError) {
            console.error("Failed to expire an unlinked Stripe session:", expireError);
        }
        await Order.updateOne(
            { _id: order._id, paymentStatus: "pending" },
            { $set: { paymentStatus: "failed", orderStatus: "Cancelled" } }
        );
        throw error;
    }

    res.status(201).json({
        success: true,
        url: session.url,
        sessionId: session.id
    });
});

export const getPaymentStatus = handleAsyncError(async (req, res, next) => {
    const order = await Order.findOne({
        stripeSessionId: req.params.sessionId,
        user: req.user._id
    }).select("_id paymentStatus orderStatus");

    if (!order) {
        return next(new handleError("Payment session not found", 404));
    }

    res.status(200).json({
        success: true,
        orderId: order._id,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus
    });
});

export const stripeWebhook = handleAsyncError(async (req, res) => {
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
        return res.status(500).json({
            success: false,
            message: "Stripe webhook secret is not configured"
        });
    }

    let event;
    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            req.headers["stripe-signature"],
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        console.error("Stripe webhook signature verification failed:", error.message);
        return res.status(400).json({
            success: false,
            message: "Invalid Stripe webhook signature"
        });
    }

    try {
        switch (event.type) {
            case "checkout.session.completed":
            case "checkout.session.async_payment_succeeded":
                await markOrderPaid(event.data.object);
                break;
            case "checkout.session.async_payment_failed":
                await markOrderUnpaid(event.data.object, "failed");
                break;
            case "checkout.session.expired":
                await markOrderUnpaid(event.data.object, "expired");
                break;
            default:
                break;
        }
    } catch (error) {
        console.error(
            `Failed to process Stripe webhook ${event.id} (${event.type}):`,
            error
        );
        return res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Webhook processing failed"
        });
    }

    res.status(200).json({ received: true });
});


