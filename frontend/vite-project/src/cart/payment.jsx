import { useState } from 'react'
import '../CartStyles/Payment.css'
import Navbar from '../components/navbar'
import PageTitle from '../components/pageTitle'
import { Link } from 'react-router-dom'
import Footer from '../components/footer'
import CheckoutPath from './checkoutPath'
import axios from 'axios'
import { useSelector } from 'react-redux'

function Payment() {
    const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo') || 'null')
    const { cartItems, shippingInfo } = useSelector((state) => state.cart)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const completePayment = async () => {
        setIsSubmitting(true)
        setErrorMessage('')

        try {
            const items = cartItems.map((item) => ({
                productId: item.product,
                quantity: item.quantity
            }))
            const { data } = await axios.post('/api/v1/payment', { items, shippingInfo })
            if (!data.url) {
                throw new Error('Checkout URL was not returned by the server')
            }
            window.location.assign(data.url)
        } catch (error) {
            setErrorMessage(error.response?.data?.message || error.message || 'Unable to start checkout')
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <Navbar />
            <PageTitle title='Payment' />
            <CheckoutPath activePath={2} />
            <div className="payment-container">
                <Link to="/order/confirm" className='payment-go-back'>Go Back</Link>
                {errorMessage && <p role="alert">{errorMessage}</p>}
                <button className="payment-btn" onClick={completePayment} disabled={isSubmitting}>
                    {isSubmitting ? 'Redirecting...' : `Pay ($${Number(orderInfo?.total || 0).toFixed(2)})`}
                </button>
            </div>
            <Footer />
        </>
    )
}

export default Payment
