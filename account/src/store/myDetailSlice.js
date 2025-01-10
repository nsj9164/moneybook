import { configureStore, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';

export const fetchData = createAsyncThunk('fixedItemList/fetchData', async () => {
    const response = await axios.get('http://localhost:8009/fixedItemList', data, { withCredentials: true });
    return response.data;
});

export const saveData = createAsyncThunk('fixedItemList/saveData', async (data) => {
    const response = await axios.post('http://localhost:8009/fixedItemList/insert', data);
    return response.data;
})

export const deleteData = createAsyncThunk('fixedItemList/deleteData', async (data) => {
    const response = await axios.post('http://localhost:8009/fixedItemList/delete', data);
})

let myDetailList = createSlice({
    name : 'myDetailList',
    initialState : {
        items: [],
        status: 'idle',
        error: null
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchData.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchData.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(saveData.fulfilled, (state, action) => {
                state.items = action.payload;
            })
            .addCase(deleteData.fulfilled, (state, action) => {
                state.items = action.payload;
            })
    }
})

export default myDetailList.reducer;