import React from 'react'
import '../UserStyles/Profile.css'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import {useState} from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch,useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { updateProfile,removeErrors,removeSuccess } from '../features/User/UserSlice'
import Loader from '../components/loader'



function UpdateProfile() {
   
    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [avatar,setAvatar] = useState('')
    const [avatarPreview,setAvatarPreview] = useState('./images/images.png')
    const navigate = useNavigate()
    const {success,loading,error,user,message} = useSelector(state=>state.user)
    const dispatch = useDispatch()
    console.log('preview',avatarPreview)
    console.log('avatar',avatar)
    const profileImageUpdate =(e)=>{
        console.log('e',e)
            const reader = new FileReader()
            console.log(reader)
            reader.onload=()=>{
                if(reader.readyState===2){
                    setAvatarPreview(reader.result)
                    setAvatar(e.target.files[0])
                }
            }
            reader.onerror=(error)=>{
                toast.error('Error reading file')
            }
            reader.readAsDataURL(e.target.files[0])

        
    }
    const updateSubmit = (e)=>{
        e.preventDefault()
        const myForm = new FormData()
        myForm.set('name',name)
        myForm.set('email',email)
        myForm.set('avatar',avatar)
        dispatch(updateProfile(myForm))
    }

    useEffect(()=>{
            if(error){
                toast.error(error,{position:'top-center',autoClose:3000})
                dispatch(removeErrors())
            }
        },[dispatch, error])

    useEffect(()=>{
            if(success){
                toast.success(message,{position:'top-center',autoClose:3000})
                dispatch(removeSuccess())
                navigate('/profile')
            }
        },[dispatch, success])


    useEffect(()=>{
        if(user){
            setName(user.name)
            setEmail(user.email)
            setAvatarPreview(user.avatar.url || './images/images.png')
        }
    },[user])

    return (
        <>
       {loading?(<Loader/>) : (<>
            <Navbar />
            <div className="container update-container">
                <div className="form-content">
                    <form action="" className="form" encType="multipart/form-data" onSubmit={updateSubmit}>
                        <h2>Update Profile</h2>
                        <div className="input-group avatar-group">
                            <input type="file" className="file-input" accept="image/*" onChange={profileImageUpdate} name='avatar'/>
                            <img src={avatarPreview} alt="User Profile" className="avatar" />
                        </div>

                        <div className="input-group">
                            <input type="text" value={name} name='name' placeholder='Your new Name'  onChange={(e)=>setName(e.target.value)}/>
                        </div>
                        <div className="input-group">
                            <input type="email" name='email' value={email} placeholder='Your new email' onChange={(e)=>setEmail(e.target.value)} />
                        </div>

                        <button className='authBtn'>Submit</button>
                    </form>
                </div>
            </div>
            <Footer />
        </>)}
        </>
    )
}

export default UpdateProfile