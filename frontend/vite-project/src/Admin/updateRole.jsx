import React, { useEffect, useState } from 'react'
import '../AdminStyles/UpdateRole.css'
import Navbar from '../components/navbar'
import PageTitle from '../components/pageTitle'
import Footer from '../components/footer'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getSingleUser, removeErrors, removeSuccess, updateUserRole } from '../features/admin/adminSlice'
import { toast } from 'react-toastify'
function UpdateRole() {
    const { userId } = useParams();
    const { user, success, loading, error } = useSelector(state => state.admin);
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: ""
    })
    const { name, email, role } = formData
    useEffect(() => {
        
        dispatch(getSingleUser(userId))
    },[dispatch])
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                role: user.role || "",
            })
        }
    }, [user])
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        dispatch(updateUserRole({ userId, role }))
    }

    useEffect(() => {
            if (error) {
                toast.error(error, { position: 'top-center', autoClose: 3000 });
                dispatch(removeErrors());
            }
            if (success) {
                toast.success("Product Created successfully", { position: 'top-center', autoClose: 3000 });
                dispatch(removeSuccess());
    
            }
        }, [dispatch, error, success]);
    return (
        <>
            <Navbar />
            <PageTitle title="Update User Role" />
            <div className="page-wrapper">
                <div className="update-user-role-container">
                    <h1>Update User Role</h1>
                    <form className="update-user-role-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input type="text" id="name" name="name" readOnly value={name} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input value={email} type="email" id="email" name="email" readOnly />
                        </div>
                        <div className="form-group">
                            <label htmlFor="role">Role</label>
                            <select name="role" id="role" required value={role} onChange={handleChange}>
                                <option value="">Select Role</option>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <button className="btn btn-primary">Update Role</button>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default UpdateRole