import '../CartStyles/OrderConfirm.css'
import Navbar from '../components/navbar'
import PageTitle from '../components/pageTitle'
import CheckoutPath from './checkoutPath'
import Footer from '../components/footer'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const formatUSD = (cents) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
}).format(cents / 100)

function OrderConfirm() {
    const {shippingInfo,cartItems} = useSelector((state)=>state.cart)
    const {user} = useSelector((state)=>state.user)
    const subtotalCents = cartItems.reduce(
        (sum, item) => sum + Math.round(item.price * 100) * item.quantity,
        0
    )
    const taxCents = Math.round(subtotalCents * 0.18)
    const shippingCents = subtotalCents > 100000 ? 0 : 5000
    const subtotal = subtotalCents / 100
    const tax = taxCents / 100
    const shipping = shippingCents / 100
    const total = (subtotalCents + taxCents + shippingCents) / 100
    const navigate = useNavigate()
    const proceedToPayment = ()=>{
        const data = {
            subtotal,
            tax,
            shipping,
            total
        }
        sessionStorage.setItem('orderInfo',JSON.stringify(data))
        navigate('/process/payment')
    }
    return (
        <>
            <Navbar />
            <PageTitle title='Order Confirmation'/>
            <CheckoutPath activePath={1} />
            <div className="confirm-container">
                <h1 className="confirm-header">Order Confirmation</h1>
                <div className="confirm-table-container">
                    <table className="confirm-table">
                        <caption>Shipping Details</caption>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{user.name}</td>
                                <td>{shippingInfo.phoneNumber}</td>
                                <td>{shippingInfo.address}</td>
                            </tr>
                        </tbody>
                    </table>

                    <table className="confirm-table cart-table">
                        <caption>cart items</caption>
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Product Name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item) => (
                                <tr key={item.product}>
                                    <td><img src={item.image} alt={item.name} className='order-product-image' /></td>
                                    <td>{item.name} </td>
                                    <td>{formatUSD(Math.round(item.price * 100))}</td>
                                    <td>{item.quantity} </td>
                                    <td>{formatUSD(Math.round(item.price * 100) * item.quantity)}</td>
                                </tr>
                            ))}
                        </tbody>

                    </table>

                    <table className="confirm-table">
                        <caption>Order Summary</caption>
                        <thead>
                            <tr>
                                <th>Subtotal</th>
                                <th>Shipping Charges</th>
                                <th>GST</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{formatUSD(subtotalCents)}</td>
                                <td>{formatUSD(shippingCents)}</td>
                                <td>{formatUSD(taxCents)}</td>
                                <td>{formatUSD(subtotalCents + taxCents + shippingCents)}</td>
                            </tr>
                        </tbody>

                    </table>

                    <button className="proceed-button" onClick={proceedToPayment}>Proceed Payment</button>

                </div>
            </div>
            <Footer />
        </>
    )
}

export default OrderConfirm