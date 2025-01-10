import { configureStore, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';

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

let login = createSlice({
    name : 'login',
    initialState : {
        loginStatus: 'idle',
        loginMessage: '',
        isLoggedIn: document.cookie.includes('token=')
    },
    extraReducers: (builder) => {
        builder
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
            })
            .addCase(logout.rejected, (state) => {
                state.loginStatus = 'failed';
            })
    }
})

export default login.reducer;