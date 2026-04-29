import { authServices } from "@/firebase/auth";
import { CreateUser, User } from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// 🔥 Types
interface AuthState {
    user: User | null;
    isLoading: "idle" | "pending" | "succeeded" | "failed";
    usersWithInterests?: {
        user: User;
        interest: string[];
    }
}

const initialState: AuthState = {
    user: null,
    isLoading: "idle",
};

// AsyncThunk (Signup)
export const createUserThunk = createAsyncThunk(
    "auth/createUser",
    async (data: CreateUser, { rejectWithValue }) => {
        try {
            const res = await authServices.createUser(data);
            return res;
        } catch (error: any) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    });

// AsyncThunk (Phone Login)
export const verifyOtpThunk = createAsyncThunk(
    "auth/verifyOtp",
    async ({ phone, otp }: { phone: string, otp: string }, { rejectWithValue }) => {
        try {
            const res = await authServices.confirmCode(phone, otp);
            return res
        } catch (error: any) {
            return rejectWithValue(error.message || "Login failed");
        }
    });

export const phoneLoginThunk = createAsyncThunk(
    "auth/phoneLogin",
    async (phone: string, { rejectWithValue }) => {
        try {
            const res = await authServices.signInWithPhoneNumber(phone);
            return res.verificationId;
        } catch (error: any) {
            return rejectWithValue(error.message || "Login failed");
        }
    });
export const getCurrentUserThunk = createAsyncThunk(
    "auth/getCurrentUser",
    async (_, { rejectWithValue }) => {
        try {
            const res = await authServices.getUser();
            return res as User;
        } catch (error: any) {
            return rejectWithValue(error.message || "Current user fetch failed");
        }
    },
)

export const getUsersWithInterestsThunk = createAsyncThunk(
    "auth/getUsersWithInterests",
    async (_, { rejectWithValue }) => {
        try {
            const res = await authServices.getUsersWithInterests();
            return res
        } catch (error: any) {
            return rejectWithValue(error.message || "Current user fetch failed");
        }
    },
)


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {

        resetAuthState: (state) => {
            state.isLoading = "idle";
        },
    },
    extraReducers: (builder) => {
        builder
            // create user
            .addCase(createUserThunk.pending, (state) => {
                state.isLoading = "pending";
            })
            .addCase(createUserThunk.fulfilled, (state) => {
                state.isLoading = "succeeded";
            })
            .addCase(createUserThunk.rejected, (state, action) => {
                state.isLoading = "failed";
            })

            // phone login
            .addCase(phoneLoginThunk.pending, (state) => {
                state.isLoading = "pending";
            })
            .addCase(phoneLoginThunk.fulfilled, (state) => {
                state.isLoading = "succeeded";
            })
            .addCase(phoneLoginThunk.rejected, (state) => {
                state.isLoading = "failed";
            })
            .addCase(verifyOtpThunk.pending, (state) => {
                state.isLoading = "pending";
            })
            .addCase(verifyOtpThunk.fulfilled, (state) => {
                state.isLoading = "succeeded";
            })
            .addCase(verifyOtpThunk.rejected, (state, action) => {
                state.isLoading = "failed";
            })

            // get current user
            .addCase(getCurrentUserThunk.pending, (state) => {
                state.isLoading = "pending";
            })
            .addCase(getCurrentUserThunk.fulfilled, (state, action) => {
                state.isLoading = "succeeded";
                state.user = action.payload
            })
            .addCase(getCurrentUserThunk.rejected, (state, action) => {
                state.isLoading = "failed";
            })

            // get users with interests
            .addCase(getUsersWithInterestsThunk.pending, (state) => {
                state.isLoading = "pending";
            })
            .addCase(getUsersWithInterestsThunk.fulfilled, (state, action) => {
                state.isLoading = "succeeded";
                // in interests, add only first two 
                // if (state.usersWithInterests?.interest) {
                    state.usersWithInterests = action.payload
                    state.usersWithInterests?.interest = state.usersWithInterests?.interest.slice(0, 2);
                // }
            })
            .addCase(getUsersWithInterestsThunk.rejected, (state, action) => {
                state.isLoading = "failed";
            })
    },
});

export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer;