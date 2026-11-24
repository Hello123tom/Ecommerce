import React, { useState } from 'react'
import '../pageStyles/ProductDetails.css'
import PageTittle from '../components/pageTitle.jsx'
import Footer from '../components/footer'
import Navbar from '../components/navbar.jsx'
import Rating from '../components/rating'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { createReview, getProductDetails, removeErrors, removeSuccess } from '../features/products/productSlice.js'
import { toast } from 'react-toastify'
import Loader from '../components/loader.jsx'
import { addItemsToCart, removeMessage } from '../features/cart/cartSlice.js'

function ProductDetail() {
    const [userRating, setUserRating] = React.useState(0);
    const [comment, setComment] = useState('')
    const [quantity, setQuantity] = useState(1)
    const handleRatingChange = async(newRating) => {
        setUserRating(newRating);
        console.log('userRating:', userRating)
        console.log('newRating:', newRating)
    };

    const { loading, error, product, reviewSuccess, reviewLoading } = useSelector((state) => state.product);
    const { loading: cartLoading, error: cartError, success, message, cartItems } = useSelector((state) => state.cart)
    const dispatch = useDispatch();
    const { id } = useParams()
    console.log('before add:', cartItems)
    console.log(id)
    useEffect(() => {
        if (id) {
            dispatch(getProductDetails(id))
        } return () => {
            dispatch(removeErrors())
        }
    }, [dispatch, id])
    useEffect(() => {
        if (error) {
            toast.error(error.message, { position: 'top-center', autoClose: 3000 })
            dispatch(removeErrors())
        }
        if (cartError) {
            toast.error(cartError, { position: 'top-center', autoClose: 3000 })
        }
    }, [dispatch, error, cartError])

    useEffect(() => {
        if (success) {
            toast.success(message, { position: 'top-center', autoClose: 3000 })
            dispatch(removeMessage())
        }

    }, [dispatch, success, message])


    const decreaseQuantity = () => {
        if (quantity <= 1) {
            toast.error('Cannot decrease any more', { position: 'top-center', autoClose: 3000 })
            dispatch(removeErrors())
            return
        }
        setQuantity(qty => qty - 1)
    }

    const increaseQuantity = () => {
        if (product.stock <= quantity) {
            toast.error('Cannot exceed available Stock!!', { position: 'top-center', autoClose: 3000 })
            dispatch(removeErrors())
            return
        }
        setQuantity(qty => qty + 1)
    }

    const addToCard = () => {
        dispatch(addItemsToCart({ id, quantity }))
    }

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        if (!userRating) {
            toast.error('Please Select a rating', { position: 'top-center', autoClose: 3000 });
            return;
        }
        dispatch(createReview({
            rating: userRating,
            comment,
            productId: id
        }));
    }

    useEffect(() => {
        if (reviewSuccess) {
            toast.success('Review Submitted Successfully', { position: 'top-center', autoClose: 3000 });
            setUserRating(0);
            setComment("");
            dispatch(removeSuccess());
            dispatch(getProductDetails(id));
        }
    }, [dispatch, id, reviewSuccess])

    if (loading) {
        return (
            <>
                <Navbar />
                <Loader />
                <Footer />
            </>
        )
    }

    if (error || !product) {
        return (
            <>
                <PageTittle title={`Product Detail`} />
                <Navbar />
                <Footer />
            </>
        )
    }


    return (
        <>
            <PageTittle title={`${product.name} - Detail`} />
            <Navbar />
            <div className="product-details-container">
                <div className="product-detail-container">
                    <div className="product-detail-image">
                        <img src={product.images[0].url.replace('./', '/')} alt={product.name} className="product-detail-image" />
                    </div>

                    <div className="product-info">
                        <h2>{product.name}</h2>
                        <p className="product-description">{product.description}</p>
                        <p className="product-price">Price: {product.price.toFixed(2)}$</p>

                        <div className="product-rating">
                            <Rating
                                value={product.ratings}
                                disabled={true}
                            />
                            <span className="productCardSpan">{product.numOfReviews} reviews</span>
                        </div>

                        <div className="stock-status">
                            <span className={product.stock > 0 ? 'in-stock' : 'out-of-stock'}>
                                {product.stock > 0 ? `In Stock ${product.stock}` : 'Out of Stock'}
                            </span>
                        </div>

                        {product.stock > 0 && (<><div className="quantity-controls">
                            <span className="quantity-label" >Quantity:</span>
                            <button className="quantity-button" onClick={decreaseQuantity}>-</button>
                            <input type="number" className="quantity-value" value={quantity} readOnly />
                            <button className="quantity-button" onClick={increaseQuantity}>+</button>

                        </div></>)}

                        <button className="add-to-cart-btn" onClick={addToCard} disabled={cartLoading}>{cartLoading ? 'Adding...' : 'Add to Cart'}</button>

                        <form className='review-form' onSubmit={handleReviewSubmit}>
                            <h3>write a review</h3>
                            <Rating
                                value={0}
                                disabled={false}
                                onRatingChange={handleRatingChange} />
                            <textarea placeholder='Write your review here...' className="review-input" value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
                            <button className='submit-review-btn' disabled={reviewLoading}>{reviewLoading ? 'Submitting...' : 'Submit'}</button>
                        </form>


                    </div>
                </div>

                <div className="review-container">
                    <h3>reviews</h3>
                    {product.reviews && product.reviews.length > 0 ? (<div className="review-section">
                        {product.reviews.map((review, index) => {
                            return (
                                <div className="review-item" key={index}>
                                    <div className="review-header">
                                        <Rating
                                            value={review.rating}
                                            disabled={true}
                                        />
                                        <p className="review-comment">
                                            {review.comment}
                                        </p>
                                        <p className="review-name">{review.name}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>) : (<p className="no-reviews">No reviews yet.</p>)}
                </div>
            </div>
        </>
    )
}

export default ProductDetail