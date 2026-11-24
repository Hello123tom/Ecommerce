import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


export const fetchAdminProducts = createAsyncThunk(
    'admin/fetchAdminProducts',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get('/api/v1/admin/products');
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "Error While Fetching the products"
            );
        }
    }
);

export const createProduct = createAsyncThunk(
    'admin/createProduct',
    async (productData, { rejectWithValue }) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
            const { data } = await axios.post('/api/v1/adim/products/create', productData, config);
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "Error While create the products"
            );
        }
    }
);


export const updateProduct = createAsyncThunk(
    'admin/updateProduct',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
            const { data } = await axios.put(`/api/v1/product/${id}`, formData, config);
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "Error While update the products"
            );
        }
    }
);

export const deleteProduct = createAsyncThunk(
    'admin/deleteProduct',
    async (productId, { rejectWithValue }) => {
        try {

            await axios.delete(`/api/v1/product/${productId}`);
            return { productId };
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "Error While delete the products"
            );
        }
    }
);

export const fetchUsers = createAsyncThunk('admin/fetchUsers', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`/api/v1/admin/users`)
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to fetch users")
    }
})

export const getSingleUser = createAsyncThunk('admin/getSingleUser', async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`/api/v1/admin/user/${id}`)
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to fetch users")
    }
})

export const updateUserRole = createAsyncThunk('admin/updateUserRole', async ({ userId, role }, { rejectWithValue }) => {
    try {
        const { data } = await axios.put(`/api/v1/admin/user/${userId}`, { role })
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to fetch Single user")
    }
})

export const deleteUser = createAsyncThunk('admin/deleteUser', async (userId, { rejectWithValue }) => {
    try {
        const { data } = await axios.delete(`/api/v1/admin/user/${userId}`, userId)
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to update user role")
    }
})

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        products: [],
        success: false,
        loading: false,
        error: null,
        product: {},
        deleting: {},
        users: [],
        user: {},
        message: null

    },
    reducers: {
        removeErrors: (state) => {
            state.error = null
        },
        removeSuccess: (state) => {
            state.success = null
        },
        clearMesaage: (state) => {
            state.message = null
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminProducts.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchAdminProducts.fulfilled, (state, action) => {
                state.loading = false
                state.error = null
                state.products = action.payload.products
                // state.success = action.payload.success
            })
            .addCase(fetchAdminProducts.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || 'something went wrong'
            })

        builder
            .addCase(createProduct.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.loading = false
                state.error = null
                state.products.push(action.payload.product)
                state.success = action.payload.success
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || "Error While create the products"
            })

        builder
            .addCase(updateProduct.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false
                state.error = null
                state.product = action.payload.product
                state.success = action.payload.success
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || "Error While update the products"
            })

        builder
            .addCase(deleteProduct.pending, (state, action) => {
                const productId = action.meta.arg
                state.deleting[productId] = true
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.deleting[action.payload.productId] = false
                state.error = null
                state.products = state.products.filter(product => product._id !== action.payload.productId)
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                const productId = action.meta.arg
                state.deleting[productId] = false
                state.error = action.payload || "Error While update the products"
            })

        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false
                state.error = null
                state.users = action.payload.users

            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || "Error While create the products"
            })


        builder
            .addCase(getSingleUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getSingleUser.fulfilled, (state, action) => {
                state.loading = false
                state.error = null
                state.user = action.payload.user

            })
            .addCase(getSingleUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || "Error While create the products"
            })

        builder
            .addCase(updateUserRole.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateUserRole.fulfilled, (state, action) => {
                state.loading = false
                state.error = null
                state.success = action.payload.success
            })
            .addCase(updateUserRole.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || "Error While create the products"
            })

        builder
            .addCase(deleteUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false
                state.error = null
                state.message = action.payload.message
                state.users = state.users.filter(
                    user => user._id !== action.meta.arg
                );
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || "Error While create the products"
            })

    }

})

export const { removeErrors, removeSuccess, clearMesaage } = adminSlice.actions
export default adminSlice.reducer