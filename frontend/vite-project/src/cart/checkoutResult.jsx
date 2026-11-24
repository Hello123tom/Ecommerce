import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import '../CartStyles/CheckoutResult.css'
import Navbar from '../components/navbar'
import PageTitle from '../components/pageTitle'
import Footer from '../components/footer'

function CheckoutResult() {
    const [searchParams] = useSearchParams()
    const sessionId = searchParams.get('session_id')
    const isCancelled = searchParams.get('checkout') === 'cancel'
    const [status, setStatus] = useState(
        isCancelled ? 'cancelled' : sessionId ? 'checking' : 'error'
    )
    const [message, setMessage] = useState(
        !isCancelled && !sessionId ? 'Checkout session was not provided.' : ''
    )
    const [retryCount, setRetryCount] = useState(0)

    useEffect(() => {
        if (isCancelled || !sessionId) {
            return undefined
        }

        let isActive = true
        let timer

        const checkPayment = async (attempt = 0) => {
            try {
                const { data } = await axios.get(
                    `/api/v1/payment/session/${encodeURIComponent(sessionId)}`
                )
                if (!isActive) return

                if (data.paymentStatus === 'paid') {
                    setStatus('paid')
                    sessionStorage.removeItem('orderInfo')
                    return
                }
                if (['failed', 'expired'].includes(data.paymentStatus)) {
                    setStatus('failed')
                    return
                }
                if (attempt >= 14) {
                    setStatus('pending')
                    return
                }

                setStatus('checking')
                timer = setTimeout(() => checkPayment(attempt + 1), 2000)
            } catch (error) {
                if (!isActive) return
                setStatus('error')
                setMessage(error.response?.data?.message || 'Unable to confirm payment status.')
            }
        }

        checkPayment()
        return () => {
            isActive = false
            clearTimeout(timer)
        }
    }, [isCancelled, retryCount, sessionId])

    const content = {
        cancelled: {
            title: 'Checkout cancelled',
            description: 'You left the secure checkout before completing your payment.',
            icon: '×',
            label: 'Cancelled'
        },
        checking: {
            title: 'Confirming your payment',
            description: 'We are checking your payment status with Stripe. This usually takes a few moments.',
            icon: '',
            label: 'Checking status'
        },
        pending: {
            title: 'Still confirming your payment',
            description: 'Your order has not received final payment confirmation yet. This can take a little longer.',
            icon: '…',
            label: 'Awaiting confirmation'
        },
        paid: {
            title: 'Payment confirmed',
            description: 'Your payment was successful and your order is now being processed.',
            icon: '✓',
            label: 'Paid'
        },
        failed: {
            title: 'Payment was not completed',
            description: 'Stripe reported that this payment did not complete. You can return to your cart and try again.',
            icon: '!',
            label: 'Not paid'
        },
        error: {
            title: 'We could not verify your payment',
            description: 'We could not reach the payment status service.',
            icon: '!',
            label: 'Unable to verify'
        }
    }
    const currentContent = content[status]

    return (
        <>
            <Navbar />
            <PageTitle title="Checkout result" />
            <main className={`checkout-result-page checkout-result-${status}`} aria-live="polite">
                <section className="checkout-result-card">
                    <div className="checkout-result-brand-mark" aria-hidden="true">E</div>
                    <div className={`checkout-result-icon checkout-result-icon-${status}`} aria-hidden="true">
                        {status === 'checking'
                            ? <span className="checkout-result-spinner" />
                            : currentContent.icon}
                    </div>
                    <p className="checkout-result-eyebrow">ORDER UPDATE</p>
                    <h1 className="checkout-result-title">{currentContent.title}</h1>
                    <p className="checkout-result-description">{currentContent.description}</p>
                    <div className={`checkout-result-status checkout-result-status-${status}`}>
                        <span className="checkout-result-status-dot" />
                        {currentContent.label}
                    </div>

                    {status === 'pending' && (
                        <div className="checkout-result-note">
                            Please do not start another payment while this one is being confirmed.
                        </div>
                    )}
                    {status === 'error' && message && (
                        <p className="checkout-result-error" role="alert">{message}</p>
                    )}

                    <div className="checkout-result-actions">
                        {(status === 'pending' || status === 'error') && sessionId && (
                            <button
                                className="checkout-result-button checkout-result-button-primary"
                                type="button"
                                onClick={() => {
                                    setStatus('checking')
                                    setMessage('')
                                    setRetryCount((count) => count + 1)
                                }}
                            >
                                Check payment status
                            </button>
                        )}
                        <Link
                            className="checkout-result-button checkout-result-button-primary"
                            to={status === 'paid' ? '/' : '/cart'}
                        >
                            {status === 'paid' ? 'Continue shopping' : 'Return to cart'}
                        </Link>
                        {status === 'paid' &&(
                            <Link
                            className="checkout-result-button checkout-result-button-primary"
                            to='/order/user'
                        >
                           View My Order
                        </Link>
                         )}
                        {status !== 'paid' && (
                            <Link className="checkout-result-link" to="/">Back to home</Link>
                        )}
                    </div>
                    <p className="checkout-result-security">
                        Payment status is confirmed securely through Stripe.
                    </p>
                </section>
            </main>
            <Footer />
        </>
    )
}

export default CheckoutResult
