import React from 'react'
import '../UserStyles/Form.css'
import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { login } from '../features/User/UserSlice.js'
import { useEffect } from 'react'
import { removeErrors } from '../features/User/UserSlice.js'
import { useNavigate } from 'react-router-dom'

function Login() {
    const [loginEmail,setLoginEmail] = useState('')
    const [loginPassword,setLoginPassword] = useState('')
    const {loading,error,isAuthenticated} = useSelector(state=>state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const redirect = new URLSearchParams(location.search).get('redirect') || '/'

     

    const loginSubmit = (e) =>{
        e.preventDefault()
        console.log(e)
        dispatch(login({email:loginEmail,password:loginPassword}))
    }

    useEffect(()=>{
                if(error){
                    toast.error(error,{position:'top-center',autoClose:3000 })
                    dispatch(removeErrors())
                }
            },[dispatch,error])

    // useEffect(()=>{
    //     if(isAuthen){
    //         navigate('/')
    //     }
    // },[isAuthen,navigate])

    useEffect(()=>{
                if(isAuthenticated){
                   
                    navigate(redirect)
                }
            },[isAuthenticated,navigate,redirect])


  return (
    <div className="form-container contrainer">
        <div className="form-content">
            <form className='form' onSubmit={loginSubmit}>
                <div className="input-group">
                    <input type="email"  placeholder='Email' value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)}/>
                </div>

                <div className="input-group">
                    <input type="password"  placeholder='Pass word'value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}/>
                </div>

                <button className='authBtn'>Login in</button>
                <p className='form-links'>Forgot your password? <Link to='/password/forgot'>Click Here</Link></p>
                <p className='form-links'>Sign in Here if you don't have account <Link to='/registor'>Sign Up here</Link></p>

            </form>
        </div>
    </div>

  )
}

export default Login