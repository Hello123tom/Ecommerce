import React from 'react'
import '../AdminStyles/Dashboard.css'

import { AddBox, AttachMoney, CheckCircle, Dashboard, Error, Inventory, People, ShoppingCart, Star } from '@mui/icons-material';
import Navbar from '../components/navbar';
import PageTitle from '../components/pageTitle';
import Footer from '../components/footer';
import { Link } from 'react-router-dom';

function Dashbord() {
    return (
        <>
            <Navbar />
            <PageTitle title="Admin Dashboard" />
            <div className="dashboard-container">
                <div className="sidebar">
                    <div className="logo">
                        <Dashboard className="logo-icon" />
                        Admin Dashboard
                    </div>
                    <nav className="nav-menu">

                        <div className="nav-section">
                            <h3>Products</h3>
                            <Link to="/admin/products">
                                <Inventory className='nav-icon' />
                                All Products
                            </Link>
                            <Link to='/admin/product/create'>
                                <AddBox className='nav-icon' />
                                Create Product
                            </Link>
                        </div>

                        <div className="nav-section">
                            <h3>Users</h3>
                            <Link to="/admin/users">
                                <People className='nav-icon' />
                                All Users
                            </Link>
                        </div>

                        <div className="nav-section">
                            <h3>Order</h3>
                            <Link to="/admin/users">
                                <ShoppingCart className='nav-icon' />
                                All Orders
                            </Link>
                        </div>

                        <div className="nav-section">
                            <h3>Reviews</h3>
                            <Link to="/admin/reviewId">
                                <Star className='nav-icon' />
                                All Reviews
                            </Link>
                        </div>
                    </nav>
                </div>

                <div className="main-content">
                    <div className="stats-grid">
                        <div className="stat-box">
                            <Inventory className='icon' />
                            <h3>Total Products</h3>
                            <p>4</p>
                        </div>
                        <div className="stat-box">
                            <ShoppingCart className='icon' />
                            <h3>Total Order</h3>
                            <p>4</p>
                        </div>
                        <div className="stat-box">
                            <Star className='icon' />
                            <h3>Total Reviews</h3>
                            <p>4</p>
                        </div>

                        <div className="stat-box">
                            <AttachMoney className='icon' />
                            <h3>Total Revenue</h3>
                            <p>4</p>
                        </div>

                        <div className="stat-box">
                            <Error className='icon' />
                            <h3>Out of Stock</h3>
                            <p>4</p>
                        </div>

                        <div className="stat-box">
                            <CheckCircle className='icon' />
                            <h3>In Stock</h3>
                            <p>4</p>
                        </div>

                    </div>
                    
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Dashbord