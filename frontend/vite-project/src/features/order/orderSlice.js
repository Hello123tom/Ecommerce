import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';


// export const createOrder = createAsyncThunk('order/createOrder', async (order, { rejectWithValue }) => {
//     try {
//         const config = {
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         }
//         const { data } = await axios.post('/api/v1/new/order', order, config) // หรือใช้งานตามโครงสร้างในภาพ
//     } catch (error) {
//         return rejectWithValue(error.response?.data || 'Order Creating Failed')
//     }
// })

export const getAllMyOrders = createAsyncThunk('order/getAllMyOrders', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get('/api/v1/orders/user')
        console.log('555555')
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Order Creating Failed')
    }
})

export const getOrderDetails = createAsyncThunk(
  'order/getOrderDetails',
  async (orderId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/v1/order/${orderId}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch orders');
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    success: false,
    loading: false,
    error: null,
    orders: [],
    order: {}
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
            .addCase(getAllMyOrders.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getAllMyOrders.fulfilled, (state, action) => {
                state.loading = false
                state.error = null
                state.orders = action.payload.orders
                state.success = action.payload.success
            })
            .addCase(getAllMyOrders.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || 'something went wrong'
            })

        builder
            .addCase(getOrderDetails.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getOrderDetails.fulfilled, (state, action) => {
                state.loading = false
                state.error = null
                state.order = action.payload.order
                state.success = action.payload.success
            })
            .addCase(getOrderDetails.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || 'something went wrong'
            })
    }
});


export const { removeErrors,removeSuccess } = orderSlice.actions
export default orderSlice.reducer

