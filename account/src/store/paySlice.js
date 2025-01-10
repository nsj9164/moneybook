import { configureStore, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';
import { logout } from './loginSlice';

// const [host, port] = fetch('/config')
//                         .then(response => response.json())
//                         .then(config => {
//                             console.log(`Server running on http://${config.host}:${config.port}`);
//                             return [`${config.host}`,`${config.port}`]
//                         })
// console.log(host, port, '!!!!!!!!!!')

// 비동기 thunk : MySQL에서 데이터 가져오기
export const fetchData = createAsyncThunk('payList/fetchData', async (data) => {
    const response = await axios.post('http://localhost:8009/payList', data, { withCredentials: true });
    return response.data;
});

// 비동기 thunk : MySQL에서 데이터 저장하기
export const saveData = createAsyncThunk('payList/saveData', async (data) => {
    const response = await axios.post('http://localhost:8009/payList/insert', data);
    return response.data;
})

export const deleteData = createAsyncThunk('payList/deleteData', async (data) => {
    const response = await axios.post('http://localhost:8009/payList/delete', data);
})

let payList = createSlice({
    name : 'payList',
    initialState : {
        items: [],
        status: 'idle',
        error: null,
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
            .addCase(logout.fulfilled, (state) => {
                state.items = [];
                state.status = 'idle';
            })
    }
})

export default payList.reducer;