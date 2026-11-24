import React from 'react'
import axios from 'axios'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'



export const register = createAsyncThunk('user/register', async (userData, { rejectWithValue }) => {
    try {

        // const config = {
        //     headers: {
        //         "Content-Type": 'multipart/form-data'
        //     }
        // }
        // const { data } = await axios.post('/api/v1/register', userData, config)
        const { data } = await axios.post('/api/v1/register', userData)
        console.log('registor',data)
        return data

    } catch (error) {
        return rejectWithValue(error.response?.data || 'Registration failed Please try again')
    }
})

export const login = createAsyncThunk('user/login', async ({email,password}, { rejectWithValue }) => {
    try {

        const config = {
            headers: {
                "Content-Type": 'application/json'
            }

        }
        const { data } = await axios.post('/api/v1/login', {email,password}, config)
        console.log('login',data)
        return data

    } catch (error) {
        return rejectWithValue(error.response?.data || 'login failed Please try again')
    }
})

export const loadUser = createAsyncThunk('user/loadUser', async (_, { rejectWithValue }) => {
    try {
        const {data} = await axios.get('/api/v1/me')
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Registration failed Please try again')
    }
})

export const logout = createAsyncThunk('user/logout', async (_, { rejectWithValue }) => {
    try {

        
        const { data } = await axios.post('/api/v1/logout', null,{withCredentials:true})
        
        return data

    } catch (error) {
        return rejectWithValue(error.response?.data || 'logout failed Please try again')
    }
})

export const updateProfile = createAsyncThunk('user/updateProfile', async (userData, { rejectWithValue }) => {
    try {
        const config = {
            headers:{
                'Content-Type':'multipart/form-data'
            }
        }
        const { data } = await axios.put('/api/v1/me/profile', userData,config)
        return data

    } catch (error) {
        return rejectWithValue(error.response?.data || {message:'Update failed Please try again'})
    }
})

export const changePassword = createAsyncThunk('user/updatePassword', async (formData, { rejectWithValue }) => {
    try {
        const config = {
            headers:{
                'Content-Type':'application/json'
            }
        }
        const { data } = await axios.put('/password/update', formData,config)
        return data

    } catch (error) {
        return rejectWithValue(error.response?.data || 'Password Update failed Please try again')
    }
})



const userSlice = createSlice({
    name: "user",
    initialState: {
        user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
        loading: false,
        error: null,
        success: false,
        isAuthenticated: localStorage.getItem('isAuthenticated')==='true',
        message:null
    },
    reducers: {
        removeErrors: (state) => {
            state.error = null
        },
        removeSuccess: (state) => {
            state.success= null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false
                state.error = null
                state.success = action.payload.success
                state.user = action.payload?.user || null
                // state.isAuthenticated = Boolean(action.payload?.user)
                localStorage.setItem('user',JSON.stringify(state.user))
                localStorage.setItem('isAuthenticated',JSON.stringify(state.isAuthenticated))
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload?.message || 'Registration failed. Please try again later'
                state.user = null
                state.isAuthenticated = false
            })

        builder
            .addCase(login.pending, (state) => {
                state.loading = true
                state.error = null
                state.isAuthenticated = false
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false
                state.error = null
                state.success = action.payload.success
                state.user = action.payload?.user || null
                state.isAuthenticated = Boolean(action.payload?.user)
                console.log(state.user) 
                localStorage.setItem('user',JSON.stringify(state.user))
                localStorage.setItem('isAuthenticated',JSON.stringify(state.isAuthenticated))
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false,
                state.error = action.payload?.message || 'Login failed. Please try again later'
                state.user = null
                state.isAuthenticated = false
            })

        builder
            .addCase(loadUser.pending,(state)=>{
                state.loading=true
                state.error=false
            })
            .addCase(loadUser.fulfilled,(state,action)=>{
                state.loading=false
                state.error=false
                state.user=action.payload?.user || null
                state.isAuthenticated=Boolean(action.payload?.user)
                localStorage.setItem('user',JSON.stringify(state.user))
                localStorage.setItem('isAuthenticated',JSON.stringify(state.isAuthenticated))
            })
            .addCase(loadUser.rejected,(state,action)=>{
                state.loading=false
                state.error=action.payload?.message || 'loading failed. Please try again later'
                state.user=null
                state.isAuthenticated=false
                if(action.payload?.statusCode===401){
                    state.isAuthenticated=false
                    state.user=null
                    localStorage.removeItem('user')
                    localStorage.removeItem('isAuthenticated')
                }
            })

             builder
            .addCase(logout.pending,(state)=>{
                state.loading=true
                state.error=false
            })
            .addCase(logout.fulfilled,(state,action)=>{
                state.loading=false
                state.error=false
                state.user=null
                state.isAuthenticated=false
                localStorage.removeItem('user')
                localStorage.removeItem('isAuthenticated')
            })
            .addCase(logout.rejected,(state,action)=>{
                state.loading=false
                state.error=action.payload?.message || 'logout failed. Please try again later'
                
            })

            builder
            .addCase(updateProfile.pending,(state)=>{
                state.loading=true
                state.error=false
            })
            .addCase(updateProfile.fulfilled,(state,action)=>{
                state.loading=false
                state.error=false
                state.user= action.payload?.user || null
                state.success=action.payload?.success
                state.message=action.payload?.message
            })
            .addCase(updateProfile.rejected,(state,action)=>{
                state.loading=false
                state.error=action.payload?.message || 'Update failed Please try again'
                
            })

            builder
            .addCase(changePassword.pending,(state)=>{
                state.loading=true
                state.error=false
            })
            .addCase(changePassword.fulfilled,(state,action)=>{
                state.loading=false
                state.error=false
                state.success=action.payload?.success
                
            })
            .addCase(changePassword.rejected,(state,action)=>{
                state.loading=false
                state.error=action.payload?.message || 'Password Update failed Please try again'
                
            })
    }


})



export const { removeErrors, removeSuccess } = userSlice.actions
export default userSlice.reducer