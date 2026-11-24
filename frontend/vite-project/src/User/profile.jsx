import React from 'react'
import '../UserStyles/Profile.css'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useState } from 'react'
import PageTitle from '../components/pageTitle'
import Loader from '../components/loader.jsx'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {loadUser} from '../features/User/UserSlice.js'
import Navbar from '../components/navbar'
import Footer from '../components/footer'

function Profile() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user, loading, isAuthenticated,error } = useSelector(state => state.user)
    // console.log('this is profile', user)
    console.log(isAuthenticated)
    console.log(!isAuthenticated)
    console.log('user state:',user)
    console.log('loading state:',loading)
    useEffect(() => {
        if(isAuthenticated===false){
            navigate('/login')
            console.log('hihi')
        }
    },[isAuthenticated,navigate])

    useEffect(()=>{
        if(user===null){
            dispatch(loadUser())
            console.log('55555')
        }
    },[dispatch,user])
    return (
        <>
            {loading || user===null ?(<Loader />) : (
                <>
                <Navbar/>
                <div className='profile-container'>
                <PageTitle title={`${user.name} Profile`} />
                <div className="profile-image">
                    <h1 className="profile-heading">Profile</h1>
                    <img src={user.avatar.url} alt="User Profile" className="profile-image" />
                    <Link to='/profile/update'>Edit Profile</Link>
                </div>
                <div className="profile-details">
                    <div className="profile-detail">
                        <h2>User Name:</h2>
                        <p>{user.name}</p>
                    </div>
                    <div className="profile-detail">
                        <h2>Email:</h2>
                        <p>{user.email}</p>
                    </div>
                    <div className="profile-detail">
                        <h2>Joined on:</h2>
                        <p>{String(user.createdAt).substring(0, 10)}</p>
                    </div>
                </div>

                <div className="profile-buttons">
                    <Link to='/orders/user'>My Orders</Link>
                    <Link to='/password/update'>Chagne Password</Link>
                </div>
            </div>
            <Footer/>
            </>
        )}
        </>
    )
}

export default Profile