import React, { useEffect } from 'react';
import '../OrderStyles/OrderDetails.css';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import PageTitle from '../components/pageTitle';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetails, removeErrors } from '../features/order/orderSlice';
import { toast } from 'react-toastify';
import Loader from '../components/loader';

function OrderDetails() {

    const { orderId } = useParams();

    const { order, loading, error } = useSelector((state) => state.order);
    console.log(order);
    const dispatch = useDispatch();
    const {
        shippingInfo = {},
        orderItems = [],
        paymentInfo = {},
        orderStatus,
        totalPrice,
        taxPrice,
        shippingPrice,
        itemsPrice,
        paidAt
    } = order;
    // console.log(itemPrice);
    const paymentStatus = paymentInfo?.status === 'succeeded' ? 'Paid' : 'Not Paid';
    const finalOrderStatus = paymentStatus === 'Not Paid' ? 'Cancelled' : orderStatus;
    const orderStatusClass =
        finalOrderStatus === 'Delivered'
            ? 'status-tag delivered'
            : `status-tag ${finalOrderStatus.toLowerCase()}`
    const paymentStatusClass = `pay-tag ${paymentStatus === 'Paid' ? 'paid' : 'not-paid'}`;
    
    
    useEffect(() => {
        dispatch(getOrderDetails(orderId));
    }, [dispatch, orderId]);

    useEffect(() => {
        if (error) {
            toast.error(error, { position: "top-center", autoClose: 3000 });
            dispatch(removeErrors());
        }
    }, [dispatch, error]);
    return (
        <>
            <PageTitle title={`Order #${orderId}`} />
            <Navbar />
            {loading ? (<Loader />) : (<div className="order-box">
                {/* Order Items table */}
                <div className="table-block">
                    <h2 className="table-title">Order Items</h2>
                    <table className="table-main">
                        <thead>
                            <tr>
                                <th className="head-cell">Image</th>
                                <th className="head-cell">Name</th>
                                <th className="head-cell">Quantity</th>
                                <th className="head-cell">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderItems.map((item) => (
                                <tr className='table-row'>
                                    <td className="table-cell">
                                        <img src={`${item.image}`} alt="Image Item" className='item-img' />
                                    </td>
                                    <td className="table-cell">{item.name}</td>
                                    <td className="table-cell">{item.quantity}</td>
                                    <td className="table-cell">${item.price}</td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>

                <div className="table-block">
                    <h2 className="table-title">Shipping Info</h2>
                    <table className="table-main">
                        <tbody>
                            <tr className="table-row">
                                <th className="table-cell">Address</th>
                                <td className="table-cell">{shippingInfo.address}, {shippingInfo.city}, {shippingInfo.state}, {shippingInfo.country}-{shippingInfo.pinCode}</td>
                            </tr>
                            <tr className="table-row">
                                <th className="table-cell">Phone</th>
                                <td className="table-cell">020 {shippingInfo.phoneNo}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="table-block">
                    <h2 className="table-title">Order Summary</h2>
                    <table className="table-main">
                        <tbody>
                            <tr className="table-row">
                                <th className="table-cell">Order Status</th>
                                <td className="table-cell">
                                    <span className={orderStatusClass}>{finalOrderStatus}</span>
                                </td>
                            </tr>
                            <tr className="table-row">
                                <th className="table-cell">Payment</th>
                                <td className="table-cell">
                                    <span className={paymentStatusClass}>{paymentStatus}</span>
                                </td>
                            </tr>
                            {paidAt && (
                                <tr className="table-row">
                                    <th className="table-cell">Paid At</th>
                                    <td className="table-cell">{new Date(paidAt).toLocaleString()}</td>
                                </tr>
                            )}
                            {/* <tr className="table-row">
                                <th className="table-cell">Subtotal Price</th>
                                <td className="table-cell">
                                    {itemPrice}
                                </td>
                            </tr> */}
                            <tr className="table-row">
                                <th className="table-cell">Items Price</th>
                                <td className="table-cell">
                                    {itemsPrice}
                                </td>
                            </tr>
                            <tr className="table-row">
                                <th className="table-cell">Tax Price</th>
                                <td className="table-cell">
                                    {taxPrice}
                                </td>
                            </tr>
                            <tr className="table-row">
                                <th className="table-cell">Shipping Price</th>
                                <td className="table-cell">
                                    {shippingPrice}
                                </td>
                            </tr>
                            <tr className="table-row">
                                <th className="table-cell">Total Price</th>
                                <td className="table-cell">
                                    {totalPrice}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>)}
            <Footer />
        </>
    );
}

export default OrderDetails;