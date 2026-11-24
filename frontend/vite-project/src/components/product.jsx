import React from 'react'
import '../componentStyles/product.css'
import { Link } from 'react-router-dom'
import Rating from './rating'
function Product({product}){

    const [rating, setRating] = React.useState(0);
    const handleRatingChange = (newRating) => {
        setRating(newRating);
        console.log(`newRating: ${newRating}`);
    };
    return(
        <Link to ={`/product/${product._id}`} className='product_id'>
        <div className="product-card">
            {/* src="/images/DIBE07912-1.jpg" */}
            <img className="product-image-card" src={product.images[0].url}  alt={product.name} />
            <div className="product-details">
                <h3 className="product-title">{product.name}</h3>
                <p className="home-price"><strong>Price: </strong>{`${product.price}/-`}</p>
                <div className="rating_container">
                    <Rating
                    value ={product.ratings}
                    onRatingChange={handleRatingChange}
                    disable={true}/>
                </div>
                <span className="productCardSpan">
                    {product.numOfReviews} {product.numOfReviews===1?'Review':'Reviews'}
                </span>
                <button className="add-to-cart">Add to Cart</button>
            </div>
        </div>
        </Link>
    )
}


export default Product