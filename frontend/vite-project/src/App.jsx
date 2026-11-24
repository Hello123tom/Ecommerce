// import { Router } from 'express'
import { useEffect } from 'react'
// import { Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProductDetail from './pages/ProductDetail.jsx'
import Product from './pages/product.jsx'
import Registor from './User/registor.jsx'
import Login from './User/login.jsx'
import { useSelector, useDispatch } from 'react-redux'
import { loadUser } from './features/User/UserSlice.js'
import DashBord from './User/userDashBoard.jsx'
import Profile from './User/profile.jsx'
import ProtectedRoute from './components/protectedRoute.jsx'
import UpdateProfile from './User/updateProfile.jsx'
import ChangePassword from './User/changePassword.jsx'
import Cart from './cart/cart.jsx'
import Shipping from './cart/shipping.jsx'
import OrderConfirm from './cart/orderConfirm.jsx'
import Payment from './cart/payment.jsx'
import CheckoutResult from './cart/checkoutResult.jsx'
import MyOrder from './orders/myOrder.jsx'
import OrderDetails from './orders/orderDetail.jsx'
import Dashbord from './Admin/admin.jsx'
import ProductList from './Admin/productList.jsx'
import CreateProduct from './Admin/createProduct.jsx'
import UpdateProduct from './Admin/updateProduct.jsx'
import UserList from './Admin/userList.jsx'
import UpdateRole from './Admin/updateRole.jsx'

function App() {
    const dispatch = useDispatch()
    const { isAuthenticated, user } = useSelector(state => state.user)
    useEffect(() => {
        if (isAuthenticated) {
            dispatch(loadUser())
        }
    }, [dispatch, isAuthenticated])
    console.log('this is:', user, 'and', isAuthenticated)
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/products" element={<Product />} />
                <Route path="/products/:keyword" element={<Product />} />
                <Route path='/registor' element={<Registor />} />
                <Route path='/login' element={<Login />} />
                <Route path='/profile' element={<ProtectedRoute element={<Profile />} />} />
                {/* <Route path='/profile/update' element={<UpdateProfile/>} /> */}
                <Route path='/profile/update' element={<ProtectedRoute element={<UpdateProfile />} />} />
                {/* <Route path='/password/update' element={<ChangePassword/>} /> */}
                <Route path='/password/update' element={<ProtectedRoute element={<ChangePassword />} />} />
                <Route path='/cart' element={<Cart />} />
                <Route path='/shipping' element={<Shipping />} />
                <Route path='/order/confirm' element={<OrderConfirm />} />
                {/* <Route path='/order/confirm' element={<ProtectedRoute element={<OrderConfirm/>}/>} /> */}
                <Route path='/process/payment' element={<Payment />} />
                <Route path='/checkout/result' element={<CheckoutResult />} />
                <Route path='/orders/user' element={<MyOrder />} />
                <Route path='/order/:orderId' element={<OrderDetails />} />
                {/* <Route path='/admin/dashbord' element={<Dashbord />} /> */}
                <Route path='/admin/dashboard' element={<ProtectedRoute element={<Dashbord />} adminOnly={true}/>} />
                <Route path='/admin/products' element={<ProtectedRoute element={<ProductList />} adminOnly={true} />} /> 
                <Route path='/admin/product/create' element={<ProtectedRoute element={<CreateProduct />} adminOnly={true} />} /> 
                <Route path='/admin/product/:updateId' element={<ProtectedRoute element={<UpdateProduct />} adminOnly={true} />} /> 
                <Route path='/admin/users' element={<ProtectedRoute element={<UserList />} adminOnly={true} />} /> 
                <Route path='/admin/user/:userId' element={<ProtectedRoute element={<UpdateRole />} adminOnly={true} />} /> 
                
            </Routes>
            {isAuthenticated && <DashBord user={user} />}
        </Router>
    )
}

export default App