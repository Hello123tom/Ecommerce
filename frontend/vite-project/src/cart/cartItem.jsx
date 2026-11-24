import {React, useEffect} from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { removeErrors } from '../features/products/productSlice'
import { addItemsToCart, removeItemFromCart, removeMessage } from '../features/cart/cartSlice'

function cartItem({ item }) {
    const { loading, error, success, message, cartItems } = useSelector((state) => state.cart)
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(item.quantity)
    const decreaseQuantity = () => {
        if (quantity <= 1) {
            toast.error('Cannot decrease any more', { position: 'top-center', autoClose: 3000 })
            dispatch(removeErrors())
            return
        }
        setQuantity(qty => qty - 1)
    }

    const increaseQuantity = () => {
        if (item.stock <= quantity) {
            toast.error('Cannot exceed available Stock!!', { position: 'top-center', autoClose: 3000 })
            dispatch(removeErrors())
            return
        }
        setQuantity(qty => qty + 1)
    }

    const handleUpdate = () => {
        if (loading) return

        if (quantity !== item.quantity) {
            console.log(item)
            console.log(item.id, quantity)
            dispatch(addItemsToCart({ id: item.product, quantity }))
        }

    }

    useEffect(() => {
        if (success) {
            toast.success(message, { position: 'top-center', autoClose: 3000, toastId: 'cart-update' })
            dispatch(removeMessage())
        }

    }, [dispatch, success, message])


    useEffect(() => {
        if (error) {
            toast.error(error.message, { position: 'top-center', autoClose: 3000 })
            dispatch(removeErrors())
        }

    }, [dispatch, error])

    useEffect(() => {
        if (!message) return

        toast.success(message, {
            position: 'top-center',
            autoClose: 3000,
            toastId: 'cart-update',
        })
        dispatch(removeMessage())
    }, [dispatch, message])

    const handleRemove = () => {
        if (loading) return
        dispatch(removeItemFromCart(item.product))
        // if (success) {
        //         toast.success(message, { position: 'top-center', autoClose: 3000 ,toastId:'cart-update'})
        //         dispatch(removeMessage())
        //     }
    }

    return (
        <div className="cart-item">
            <div className="item-info">
                <img src={item.image} alt="Product Image" className='item-image' />
                <div className='item-details'>
                    <h3 className='item-name'>{item.name}</h3>
                    <p className='item-price'><strong>Price</strong>: {item.price}</p>
                    <p className="item-quantity"><strong>Quantity</strong>: {item.quantity}</p>

                </div>
            </div>

            <div className="quantity-controls">
                <button className="quantity-button decrease-btn" onClick={decreaseQuantity} disabled={loading}>-</button>
                <input type="number" value={quantity} className='quantity-input' readOnly min="1" />
                <button className="quantity-button increase-btn" onClick={increaseQuantity} disabled={loading}>+</button>
            </div>

            <div className="item-total">
                <span className="item-total-price">{(item.price * item.quantity).toFixed(2)}</span>
            </div>

            <div className="item-actions">
                <button className="update-item-btn" onClick={handleUpdate} disabled={loading || item.quantity === quantity} >{loading ? 'Updating' : 'Update'}</button>
                <button className="remove-item-btn" disabled={loading} onClick={handleRemove}>Remove</button>
            </div>
        </div>
    )
}

export default cartItem