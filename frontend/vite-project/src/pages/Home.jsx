import React, { useEffect } from 'react'
import Footer from '../components/footer'
import '../pageStyles/Home.css'
import Navbar from '../components/navbar.jsx'
import ImageSlider from '../components/imageSlide.jsx'
import Product from '../components/product.jsx'
import PageTitle from '../components/pageTitle.jsx'
import { useSelector, useDispatch } from 'react-redux'
import { getProducts,removeErrors } from '../features/products/productSlice.js'
import Loader from '../components/loader.jsx'
import { toast } from 'react-toastify'

const products = [{
    _id: "60c72b2f9b1d8b2ad8f3c111",
    name: "Wireless Bluetooth Headphones",
    description: "High-quality wireless headphones with active noise cancellation and long battery life.",
    price: 2990,
    ratings: 4.5,
    images: [
        {
            public_id: "products/headphones_01",
            url: "https://svtmjewels.com/cdn/shop/files/SV-203-0003.jpg?v=1743589071"
        }
    ],
    category: "Electronics",
    stock: 50,
    numOfReviews: 1,
    reviews: [
        {
            user: "60c72b2f9b1d8b2ad8f3c1a2", // จำลอง ObjectId ของ User
            name: "Somchai Jaidee",
            rating: 5,
            comment: "เสียงดีมาก ตัดเสียงรบกวนได้เยี่ยมครับ"
        }
    ],
    user: "60c72b2f9b1d8b2ad8f3c1b3", // จำลอง ObjectId ของ Admin/Seller ผู้สร้างสินค้า
    createdAt: new Date(),

}, {
    _id: "60c72b2f9b1d8b2ad8f3c221",
    name: "Classic Oversized Hoodie",
    description: "Comfortable fleece cotton hoodie with a relaxed fit, perfect for everyday wear.",
    price: 1290,
    ratings: 4.8,
    images: [
        {
            _id: "60c72b2f9b1d8b2ad8f3c222",
            public_id: "products/hoodie_black_01",
            url: "https://hips.hearstapps.com/hmg-prod/images/7f5d6218-4a51-40f3-a09b-2291f00d853e.png"
        },
        {
            _id: "60c72b2f9b1d8b2ad8f3c223",
            public_id: "products/hoodie_black_02",
            url: "https://res.cloudinary.com/example/image/upload/v1234567890/products/hoodie_black_02.jpg"
        }
    ],
    category: "Apparel",
    stock: 120,
    numOfReviews: 2,
    reviews: [
        {
            _id: "60c72b2f9b1d8b2ad8f3c224",
            user: "60c72b2f9b1d8b2ad8f3c2a1",
            name: "Anan Sookjai",
            rating: 5,
            comment: "ผ้าหนานุ่ม ใส่สบายมากครับ ขนาดกำลังดีเลย"
        },
        {
            _id: "60c72b2f9b1d8b2ad8f3c225",
            user: "60c72b2f9b1d8b2ad8f3c2a2",
            name: "Kanya Wongsuwan",
            rating: 4.5,
            comment: "สีสวยตรงปก ส่งไวทันใจค่ะ"
        }
    ],
    user: "60c72b2f9b1d8b2ad8f3c2b9",
    createdAt: new Date().toISOString()
}, {
    _id: "60c72b2f9b1d8b2ad8f3c331",
    name: "Smart Air Fryer 5.5L",
    description: "Digital oil-free air fryer with touch screen control, multiple preset cooking modes, and non-stick basket.",
    price: 3490,
    ratings: 4.7,
    images: [
        {
            _id: "60c72b2f9b1d8b2ad8f3c332",
            public_id: "products/airfryer_01",
            url: "https://curatedoptics.com/wp-content/uploads/2026/04/Lotos-Eyewear-3-819x1024.jpg"
        }
    ],
    category: "Home Appliances",
    stock: 25,
    numOfReviews: 1,
    reviews: [
        {
            _id: "60c72b2f9b1d8b2ad8f3c333",
            user: "60c72b2f9b1d8b2ad8f3c3a1",
            name: "Pichai Rakthai",
            rating: 5,
            comment: "ใช้งานง่าย ทำความสะอาดสะดวก อาหารกรอบอร่อยไร้น้ำมันครับ"
        }
    ],
    user: "60c72b2f9b1d8b2ad8f3c3b9",
    createdAt: new Date().toISOString()
}, {
    _id: "60c72b2f9b1d8b2ad8f3c441",
    name: "MagSafe Fast Wireless Charger",
    description: "Magnetic wireless charging pad with high-speed power delivery and durable braided cable.",
    price: 890,
    ratings: 4.6,
    images: [
        {
            _id: "60c72b2f9b1d8b2ad8f3c442",
            public_id: "products/charger_01",
            url: "https://www.apetogentleman.com/wp-content/uploads/2020/07/luxury-shoes-1.jpg"
        },
        {
            _id: "60c72b2f9b1d8b2ad8f3c443",
            public_id: "products/charger_02",
            url: "https://res.cloudinary.com/example/image/upload/v1234567890/products/charger_02.jpg"
        }
    ],
    category: "Accessories",
    stock: 85,
    numOfReviews: 1,
    reviews: [
        {
            _id: "60c72b2f9b1d8b2ad8f3c444",
            user: "60c72b2f9b1d8b2ad8f3c4a1",
            name: "Sittichai Promrit",
            rating: 5,
            comment: "แม่เหล็กดูดแน่นดีมาก ชาร์จไวไม่ค่อยร้อนครับ"
        }
    ],
    user: "60c72b2f9b1d8b2ad8f3c1b3",
    createdAt: new Date().toISOString()
}];
function Home() {
    const { loading, error, products, productCounts } = useSelector((state) => state.product);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getProducts({keyword:''}))
    }, [dispatch])
    useEffect(()=>{
        if(error){
            toast.error(error.message,{position:'top-center',autoClose:3000})
            dispatch(removeErrors())
        }
    },[dispatch, error])
    return (
        <>
            
            {loading ? <Loader/> : (<>
                <PageTitle title="Home" />
                <Navbar />
                <ImageSlider />
                <div className="home-container">
                    <h2 className="home-heading">Trending now</h2>
                    <div className="home-product-container">
                        {products.map((product, index) => (
                            <Product key={index} product={product} />
                        ))}
                        {/* <Product Product={products}/> */}
                    </div>
                </div>
                <Footer />
            </>)}
            
        </>
    )
}

export default Home