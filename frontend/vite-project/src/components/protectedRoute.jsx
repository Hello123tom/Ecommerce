import React from 'react'
import {useSelector} from 'react-redux'
import Loader from '../components/loader'
import { Navigate } from 'react-router-dom'


function protectedRoute({ element,adminOnly=false }) {
    const { isAuthenticated, loading, user } = useSelector(state => state.user)
    if(loading){
        return < Loader/>
    }

    if(!isAuthenticated){
        return <Navigate to="/login" />
    }
    if(adminOnly && user.role !== 'admin'){
        return <Navigate to="/" />
    } 
    return (
        element
    )
}

export default protectedRoute