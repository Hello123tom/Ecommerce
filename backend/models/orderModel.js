import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    shippingInfo: {
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        pinCode: {
            type: String,
            required: true
        },
        phoneNo: {
            type: String,
            required: true
        }
    },
    orderItems: [{
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        image: {
            type: String,
            default: ""
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        }
    }],
    orderStatus: {
        type: String,
        enum: ["Awaiting Payment", "Processing", "Shipped", "Delivered", "Cancelled"],
        required: true,
        default: "Awaiting Payment"
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed", "expired"]
    },
    stripeSessionId: {
        type: String,
        unique: true,
        sparse: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    paymentInfo: {
        id: String,
        status: String
    },
    paidAt: Date,
    itemsPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    taxPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    shippingPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    deliveredAt: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Order", orderSchema);
