import axios from 'axios'

export const createOrder = createAsyncThunk('payment', async (orderData, { rejectWithValue }) => {
    try {
        const { data } = await axios.post('/api/v1/payment', orderData)
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data || 'An error occurred')
    }
})