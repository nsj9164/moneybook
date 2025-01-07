import { configureStore, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';

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

// withCredentials : 서버가 설정한 쿠키를 자동으로 저장하고, 이후 API 요청에서 쿠키가 자동으로 전송되도록 합니다.
// rejectWithValue : rejected 상태를 반환하기 위해 사용 (+unwrap)
export const loginData = createAsyncThunk('loginCheck/loginData', async (data, { rejectWithValue }) => {
    try {
        const response = await axios.post('http://localhost:8009/loginCheck', data, { withCredentials: true });
        return response.data;
    } catch(error) {
        if(error.response &&  error.response.status === 401) {
            return rejectWithValue(error.response.data.isLogin);
        }
        return rejectWithValue("서버에 연결할 수 없습니다.");
    }
})

export const logout = createAsyncThunk('logout/loginData', async (data) => {
    const response = await axios.post('http://localhost:8009/logout');
    return response.data;
})

let payList = createSlice({
    name : 'payList',
    initialState : {
        items: [],
        status: 'idle',
        error: null,
        loginStatus: 'idle',
        loginMessage: '',
        isLoggedIn: document.cookie.includes('token=')
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
            .addCase(loginData.pending, (state) => {
                state.loginStatus = 'loading';
            })
            .addCase(loginData.fulfilled, (state, action) => {
                state.loginStatus = 'succeeded';
                state.loginMessage = action.payload.isLogin;
                if(action.payload.isLogin === 'True') {
                    state.isLoggedIn = true;
                } else {
                    state.isLoggedIn = false;
                }
            })
            .addCase(loginData.rejected, (state, action) => {
                state.loginStatus = 'failed';
                state.loginMessage = action.payload || "서버 오류 발생";
                state.isLoggedIn = false;
            })
            .addCase(logout.pending, (state) => {
                state.loginStatus = 'loading';
            })
            .addCase(logout.fulfilled, (state) => {
                state.loginStatus = 'succeeded';
                state.isLoggedIn = false;
                state.items = [];
                state.status = 'idle';
                state.error = null;
            })
            .addCase(logout.rejected, (state) => {
                state.loginStatus = 'failed';
            })
    }
})

export default configureStore({
    reducer: {
        payList : payList.reducer
    }
})