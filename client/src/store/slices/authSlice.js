import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

export const login = createAsyncThunk("login", async (data , thunkAPI) => {
  try {
    const res = await axiosInstance.post("/auth/login", data, {
      headers:{
        "Content-Type": "application/json",
      }
    })
    toast.success(res.data.message)
    return res.data.user;
  } catch (error) {
    toast.error(error.response?.data?.error || "Login failed");
    return thunkAPI.rejectWithValue(error.response?.data);
  }
});

export const forgotPassword = createAsyncThunk("forgotPassword", async (email , thunkAPI) => {
  try {
    const res = await axiosInstance.post("/auth/password/forgot", email );
    toast.success(res.data.message)
    return null;
  } catch (error) {
    toast.error(error.response?.data?.error || "Failed to request password reset");
    return thunkAPI.rejectWithValue(error.response?.data);
  }
});

export const resetPassword = createAsyncThunk("resetPassword", async ({ token, password, confirmPassword } , thunkAPI) => {
  try {
    const res = await axiosInstance.put(`/auth/password/reset/${token}`, { password, confirmPassword });
    toast.success(res.data.message)
    return res.data.user;
  } catch (error) {
    toast.error(error.response?.data?.error || "Failed to reset password");
    return thunkAPI.rejectWithValue(error.response?.data);
  }
});

export const getUser = createAsyncThunk("getUser", async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data.user;
  }
  catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data);
  }
});

export const logout = createAsyncThunk("logout", async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get("/auth/logout");
    toast.success(res.data.message)
    return null;
  } catch (error) {
    toast.error(error.response?.data?.error || "Logout failed");
    return thunkAPI.rejectWithValue(error.response?.data);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isUpdatingPassword: false,
    isRequestingForToken: false,
    isCheckingAuth: true,
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.isLoggingIn = true;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoggingIn = false;
      state.authUser = action.payload;
    });
    builder.addCase(login.rejected, (state) => {
      state.isLoggingIn = false;
    });

    builder.addCase(forgotPassword.pending, (state) => {
      state.isRequestingForToken = true;
    });
    builder.addCase(forgotPassword.fulfilled, (state) => {
      state.isRequestingForToken = false;
    });
    builder.addCase(forgotPassword.rejected, (state) => {
      state.isRequestingForToken = false;
    });

    builder.addCase(resetPassword.pending, (state) => {
      state.isUpdatingPassword = true;
    });
    builder.addCase(resetPassword.fulfilled, (state,action) => {
      state.isUpdatingPassword = false;
      state.authUser = action.payload;
    });
    builder.addCase(resetPassword.rejected, (state) => {
      state.isUpdatingPassword = false;
    });

    builder.addCase(getUser.pending, (state) => {
      state.isCheckingAuth = true;
      state.authUser = null;
    }
    );
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.isCheckingAuth = false;
      state.authUser = action.payload;
    });
    builder.addCase(getUser.rejected, (state) => {
      state.isCheckingAuth = false;
      state.authUser = null;
    });

    builder.addCase(logout.fulfilled, (state) => {
      state.authUser = null;
    });
    
    
  },
});

export default authSlice.reducer;
