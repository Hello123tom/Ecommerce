import {createSlice,createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'



export const addItemsToCart = createAsyncThunk('cart/addItemsToCart', async(
    {id,quantity},{rejectWithValue})=>{
        try{
            const {data} = await axios.get(`/api/v1/product/${id}`)
            return {
                product:data.product._id,
                name:data.product.name,
                price:data.product.price,
                image:data.product.images[0].url,
                stock:data.product.stock,
                quantity
            }
        }catch(error){
            return rejectWithValue(error.response?.data || 'An error occurred')
        }
    }
)



const cartSlice = createSlice({
    name:'cart',
    initialState:{
        cartItems: JSON.parse(localStorage.getItem('cartItems')) || [],
        loading:false,
        error:null,
        success:false,
        message:null,
        removingId:null,
        shippingInfo:JSON.parse(localStorage.getItem('shippingInfo')) || []
    },
    reducers:{
        removeSuccess:(state)=>{
            state.success=null
        },
        removeMessage:(state)=>{
            state.message=null
        },
        removeItemFromCart:(state,action)=>{
            state.removingId = action.payload
            state.cartItems = state.cartItems.filter(item=>item.product!==action.payload)
            localStorage.setItem('cartItems',JSON.stringify(state.cartItems))
            state.removingId = null
            state.message = 'Item removed from cart successfully'
        },

        saveShippingInfo:(state,action)=>{
            state.shippingInfo = action.payload
            localStorage.setItem('shippingInfo',JSON.stringify(state.shippingInfo))
        }
    },
    extraReducers:(builder)=>{
        builder.
        addCase(addItemsToCart.pending,(state)=>{
            state.loading=true
            state.error=null
        }).
        addCase(addItemsToCart.fulfilled,(state,action)=>{
            // state.cartItems=action.payload.cartItem
            const item = action.payload
            console.log(item)
            
            const existingItems = state.cartItems.find((i) => i.product === item.product) 
            if(existingItems){
                existingItems.quantity = item.quantity
                state.message = `Update ${item.name} quantity to ${item.quantity}`
            }else{
                state.cartItems.push(item)
                state.message= `${item.name} Item added to cart successfully`
            }
            
            state.error=null
            state.success=true
            state.loading=false
            localStorage.setItem('cartItems',JSON.stringify(state.cartItems))
            
        }).
        addCase(addItemsToCart.rejected,(state,action)=>{
            state.loading=false,
            state.error = action.payload?.message || 'An Error Occurred'
        })
    }

// .addCase(changePassword.rejected, (state, action) => {
//     state.loading = false
//     state.error = action.payload?.message || 'Password Update failed Please try again'

// })
})

export const {removeSuccess,removeMessage,removeItemFromCart,saveShippingInfo} = cartSlice.actions
export default cartSlice.reducer