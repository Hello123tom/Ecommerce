import React, { useEffect } from 'react'
import '../UserStyles/Form.css'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux'
// import { register } from '../features/User/UserSlice.js'
import { register, removeErrors, removeSuccess } from '../features/User/UserSlice.js'
import { useNavigate } from 'react-router-dom'
import '../componentStyles/Loader.css'

function registor() {
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: ''
    })

    const { name, email, password } = user
    const [avatar, setAvatar] = useState('')
    const [avatarPreview, setAvatarPreview] = useState('./images/images2.jpeg')
    const { success, loading, error } = useSelector(state => state.user)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    // const myForm = new  FormData()
    //     myForm.set('name',name)
    //     myForm.set('email',email)
    //     myForm.set('password',password)
    //     myForm.set('avatar',avatar)
    //     for (let pair of myForm.entries()) {
    //         console.log(pair[0]+ ', ' + pair[1]);
    //     }
    //     dispatch(register(myForm))

    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'top-center', autoClose: 3000 })
            dispatch(removeErrors())
        }
    }, [dispatch, error])

    useEffect(() => {
        if (success) {
            toast.success('Registered Successfully', { position: 'top-center', autoClose: 3000 })
            dispatch(removeSuccess())
            navigate('/')
        }
    }, [dispatch, success, navigate])

    const registorDataChange = (e) => {
        console.log(e)
        if (e.target.name === 'avatar') {
            const reader = new FileReader()
            console.log(reader)
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatarPreview(reader.result)
                    setAvatar(e.target.files[0])
                }
            }
            reader.readAsDataURL(e.target.files[0])

        } else {
            setUser({ ...user, [e.target.name]: e.target.value })
        }
    }

    const registerSubmit = (e) => {
        e.preventDefault()
        if (!name || !email || !password) {
            toast.error('Please fill all the fields', { position: 'top-center', autoClose: 3000 })
            return
        }
        const myForm = new FormData()
        myForm.set('name', name)
        myForm.set('email', email)
        myForm.set('password', password)
        myForm.set('avatar', avatar)
        for (let pair of myForm.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }
        dispatch(register(myForm))

    }



    return (
        <div className="form-container container">
            <div className="form-conten">
                <form action="" className='form' onSubmit={registerSubmit} encType='multipart/form-data'>
                    <h2>Sign Up</h2>
                    <div className="input-group">
                        <input type="text" placeholder='User Name' name='name' value={name} onChange={registorDataChange} />
                    </div>

                    <div className="input-group">
                        <input type="email" placeholder='Email' name='email' value={email} onChange={registorDataChange} />
                    </div>

                    <div className="input-group">
                        <input type="password" placeholder='Your Password' name='password' value={password} onChange={registorDataChange} />
                    </div>

                    <div className="input-group avatar-group">
                        <input type="file" name='avatar' className='file-input' accept='iamge/' onChange={registorDataChange} />
                        <img src={avatarPreview} alt="Avatar Preview" className='avatar' />
                    </div>
                    <button className='authBtn'>{loading ? <span className="button-loader" /> : 'Sign Up'}</button>
                    <p className="form-links">Already have an account?<Link to="/login">Login</Link></p>
                </form>

            </div>
        </div>
    )
}

export default registor