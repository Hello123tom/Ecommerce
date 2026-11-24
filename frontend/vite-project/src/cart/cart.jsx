import React from 'react'
import '../CartStyles/Cart.css'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import PageTitle from '../components/pageTitle'
import CartItem from './cartItem'
import { useSelector } from 'react-redux'
import Container from '@mui/material/Container'
import { Link, useNavigate } from 'react-router-dom'
function cart() {
    const { cartItems } = useSelector((state) => state.cart)
    const subtotal = cartItems.reduce((acc,item)=>acc+item.price*item.quantity,0)
    const tax= subtotal*0.18
    const shipping = subtotal>1000?0:50
    const total = subtotal+tax+shipping
    const navigate = useNavigate()

    const checkoutHandler =()=>{
        navigate('/login?redirect=/shipping')
    }

    return (
        <>
            {cartItems.length === 0 ? (
                <>
                <Navbar />
                <div className="empty-cart-container">
                    <p className='empty-cart-message'>Your Cart is empty</p>
                    <Link to='/products' className='viewProducts'>Shop Now</Link >
                </div>
                <Footer/>
                </>
            ) :
                (<>
                    <Navbar />
                    <PageTitle title='Your Cart' />
                    <div className="cart-page">




                        <div className="cart-items">
                            <div className="cart-items-heading">Your cart</div>
                            <div className="cart-table">
                                <div className="cart-table-header">
                                    <div className="header-product">Product</div>
                                    <div className="header-quantity">Quantity</div>
                                    <div className="header-total item-total-heading">Item total</div>
                                    <div className="header-action">Actions</div>
                                </div>



                                {cartItems && cartItems.map((item) => <CartItem key={item.name} item={item} />)}

                            </div>
                        </div>

                        <div className="price-summary">
                            <h3 className="price-summary-heading">Price Summary</h3>
                            <div className="summary-item">
                                <p className="summary-label">Subtotal :</p>
                                <p className="summary-value">{subtotal}/-</p>
                            </div>
                            <div className="summary-item">
                                <p className="summary-label">Tax(18%):</p>
                                <p className="summary-value">{tax}/-</p>
                            </div>

                            <div className="summary-item">
                                <p className="summary-label">shipping:</p>
                                <p className="summary-value">{shipping}/-</p>
                            </div>
                            <div className="summary-total">
                                <p className="total-label">Total:</p>
                                <p className="total-value">{total}/-</p>
                            </div>
                            <button className="checkout-btn" onClick={checkoutHandler}>Checkout</button>
                        </div>
                    </div>
                    <Footer />
                </>)}</>
    )
}

export default cart