import React from 'react'
import '../UserStyles/Form.css'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import PageTitle from '../components/pageTitle'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useState } from 'react'
import Loader from '../components/loader.jsx'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { updateProfile,removeErrors,removeSuccess } from '../features/User/UserSlice'
import { toast } from 'react-toastify'
function ChangePassword() {
    const [oldPassword,setOldPassword] = useState('')
    const [newPassword,setNewPassword] = useState('')
    const [confirmPassword,setConfirmPassword] = useState('')
    const {success,loading,error} = useSelector(state=>state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const updatePasswordSubmit = (e) => {
        e.preventDefault()
        const myForm = new FormData()
        myForm.set('oldPassword', oldPassword)
        myForm.set('newPassword', newPassword)
        myForm.set('confirmPassword', confirmPassword)
        for (let pair of myForm.entries()) {
            console.log(pair[0]+'-'+pair[1])
        }
        dispatch(updateProfile(myForm))
    }

    useEffect(()=>{
                if(error){
                    toast.error(error.message,{position:'top-center',autoClose:3000})
                    dispatch(removeErrors())
                }
            },[dispatch, error])
    
        useEffect(()=>{
                if(success){
                    toast.success("Update Password Successfully",{position:'top-center',autoClose:3000})
                    dispatch(removeSuccess())
                    navigate('/profile')
                }
            },[dispatch, success])
    return (
        <>
            {loading ? (<Loader />) : (<>
                <Navbar />
                <PageTitle title={'Change Password'} />
                <div className="container update-container">
                    <div className="form-content">
                        <form action="" className="form" onSubmit={updatePasswordSubmit}>
                            <h2>Change Password</h2>


                            <div className="input-group">
                                <input type="password" name='oldPassword' placeholder='Your Password' value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                            </div>
                            <div className="input-group">
                                <input type="password" name='newPassword' placeholder='Your new Password' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                            </div>
                            <div className="input-group">
                                <input type="password" name='confirmPassword' placeholder='Confirm Password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                            </div>

                            <button className='authBtn'>Submit Password</button>
                        </form>
                    </div >
                </div>
                <Footer />
            </>)}
        </>

    )
} 

export default ChangePassword