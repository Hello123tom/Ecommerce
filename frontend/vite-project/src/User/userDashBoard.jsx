import React from 'react'
import '../UserStyles/UserDashBoard.css'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { logout,removeSuccess } from '../features/User/UserSlice.js'
import {toast} from 'react-toastify'
import { useState } from 'react'


function userDashBoard({user}) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [menuVisible,setMenuVisible] = useState(false)
  function toggleMenu(){
    setMenuVisible(!menuVisible)
  }
  
  const orders = ()=>{
    navigate('/orders/user')
  }

  const profile = ()=>{
    navigate('/profile')
  }
  const Logout = async()=>{
    try {
    await dispatch(logout()).unwrap()
    toast.success('Logout Successfully', {
      position: 'top-center',
      autoClose: 3000
    })
    dispatch(removeSuccess())

    navigate('/')
  } catch (error) {
    toast.error(error?.message || 'Logout failed')
  }
  }

  const dashboard = ()=>{
    navigate('/admin/dashboard')
  } 
  
  const options = [
    {name:'Orders',funcName:orders},
    {name:'Account',funcName:profile},
    {name:'Logout',funcName:Logout}
  ]
  if(user.role==='admin'){
    options.unshift({
      name:"Admin Dashboard",funcName:dashboard
    })
  }


  
 
  return (
    <>
    <div className={`overlay ${menuVisible?'show':''}`} onClick={toggleMenu}></div>
    <div className='dashbord-container'>
        <div className="profile-header" onClick={toggleMenu}>
            <img src={user.avatar.url?user.avatar.url:'./images/images2.jpeg'} alt="Profile Picture" className='profile-avatar' />
            <span className="profile-name">{user.name}</span>
        </div>

        {menuVisible && (<div className="menu-options">
          {options.map((option,index)=><button key={index} className="menu-option-btn" onClick={option.funcName} user={user}>{option.name}</button>)}
        </div>)}

        
    </div>
    {/* // <img src="./images/images2.jpeg" alt="" /> */}
    </>
  )
}

export default userDashBoard