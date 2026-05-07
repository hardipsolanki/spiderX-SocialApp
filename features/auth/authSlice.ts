import { authServices } from "@/firebase/auth";
import { connectedUserServices } from "@/firebase/connectedUsers";
import { Connection, CreateUser, User } from "@/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { REHYDRATE } from "redux-persist";

// 🔥 Types


export interface UsersWithInterests {
    id: string;
    interest: string[];
    user: User;
    connectionReqStatus: "pending" | "rejected" | "accepted" | null;
}
interface AuthState {
    user: User | null;
    isLoading: "idle" | "pending" | "succeeded" | "failed";
    usersWithInterests?: Array<UsersWithInterests>
    singleUser?: User,
    searchText: string
    searchResults?: Array<UsersWithInterests> | null,
    connectedUsers?: Connection[] | null,
}

const initialState: AuthState = {
    user: null,
    searchText: "",
    isLoading: "idle",
};

// AsyncThunk (Signup)
export const createUserThunk = createAsyncThunk(
    "auth/createUser",
    async (data: CreateUser, { rejectWithValue }) => {
        try {
            const res = await authServices.createProfile(data);
            return res as any
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
            return res as any
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
            return res as User
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
            return res as Array<UsersWithInterests>
        } catch (error: any) {
            return rejectWithValue(error.message || "Current user fetch failed");
        }
    },
)

export const logoutThunk = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            await authServices.logOut();
        } catch (error: any) {
            return rejectWithValue(error.message || "Logout failed");
        }
    },
)

export const getSingleUserThunk = createAsyncThunk(
    "auth/getSingleUser",
    async (uid: string, { rejectWithValue }) => {
        try {
            const res = await authServices.getSingleUser(uid);
            return res as User
        } catch (error: any) {
            return rejectWithValue(error.message || "Current user fetch failed");
        }
    },
)

export const getConnectedUserThunk = createAsyncThunk(
    "auth/getConnectedUser",
    async (uid: string, { rejectWithValue }) => {
        try {
            const res = await connectedUserServices.getConnections(uid);
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
        handleUserSearch: (
            state,
            action: { payload: { search: string } }
        ) => {
            const search = action.payload.search.toLowerCase().trim();

            state.searchText = search;

            if (search === "") {
                state.searchResults = [];
                return;
            }

            state.searchResults = state.usersWithInterests?.filter((item) =>
        `${item?.user.first_name || ""} ${item.user?.last_name || ""
          }`
          .toLowerCase()
          .includes(search)
      );
        },
        updateConnectionStatus: (
            state,
            action: PayloadAction<{ uid: string; status: "pending" | "rejected" | "accepted" | null }>
        ) => {
            const user = state.usersWithInterests?.find(
                (u) => u.user.uid === action.payload.uid
            );
            if (user) {
                user.connectionReqStatus = action.payload.status as any;
            }
            state.singleUser = state.singleUser && state.singleUser.uid === action.payload.uid
                ? { ...state.singleUser, connectionReqStatus: action.payload.status as any }
                : state.singleUser;

            const searchUser = state.usersWithInterests?.find(
                (u) => u.user.uid === action.payload.uid
            );
            if (searchUser) {
                searchUser.connectionReqStatus = action.payload.status as any;
            }
        },
        updateUserInterest: (state, action: PayloadAction<{ interest: string[] }>) => {
            if (state.user) state.user.interest = action.payload.interest
        }

    },

    extraReducers: (builder) => {
        builder
            .addCase(REHYDRATE, (state: any, action: any) => {
                if (action.payload?.auth) {
                    state.isLoading = "idle";
                }
            })
            // create user
            .addCase(createUserThunk.pending, (state) => {
                state.isLoading = "pending";
            })
            .addCase(createUserThunk.fulfilled, (state, action) => {
                state.isLoading = "succeeded";
                state.user = action.payload
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

            // verify otp
            .addCase(verifyOtpThunk.pending, (state) => {
                state.isLoading = "pending";
            })
            .addCase(verifyOtpThunk.fulfilled, (state, action) => {
                state.isLoading = "succeeded";
                state.user = action.payload
            })
            .addCase(verifyOtpThunk.rejected, (state, action) => {
                state.isLoading = "failed";
            })

            // get current user
            .addCase(getCurrentUserThunk.pending, (state) => {
                state.isLoading = "pending";
                state.user = null
            })
            .addCase(getCurrentUserThunk.fulfilled, (state, action) => {
                state.isLoading = "succeeded";
                state.user = action.payload
            })
            .addCase(getCurrentUserThunk.rejected, (state, action) => {
                state.isLoading = "failed";
                state.user = null

            })

            // get users with interests
            .addCase(getUsersWithInterestsThunk.pending, (state) => {
                state.isLoading = "pending";
            })
            .addCase(getUsersWithInterestsThunk.fulfilled, (state, action) => {
                state.isLoading = "succeeded";
                // add only first two intesersts

                state.usersWithInterests = action.payload.map((data) => ({
                    id: data.id,
                    connectionReqStatus: data.connectionReqStatus,
                    user: { ...data.user },
                    interest: data.interest.slice(0, 2),
                })).filter(u => u.user.uid !== state.user?.uid);
            })
            .addCase(getUsersWithInterestsThunk.rejected, (state, action) => {
                state.isLoading = "failed";
            })

            // logout
            .addCase(logoutThunk.pending, (state) => {
                state.isLoading = "pending";
            })
            .addCase(logoutThunk.fulfilled, (state) => {
                state.isLoading = "succeeded";
                state.user = null
                state.usersWithInterests = []
            })
            .addCase(logoutThunk.rejected, (state, action) => {
                state.isLoading = "failed";
            })

            // get single user
            .addCase(getSingleUserThunk.pending, (state) => {
                state.isLoading = "pending";
            })
            .addCase(getSingleUserThunk.fulfilled, (state, action) => {
                state.isLoading = "succeeded";
                state.singleUser = action.payload
            })
            .addCase(getSingleUserThunk.rejected, (state, action) => {
                state.isLoading = "failed";
            })

            // get connected user
            .addCase(getConnectedUserThunk.pending, (state) => {
                state.isLoading = "pending";
            })
            .addCase(getConnectedUserThunk.fulfilled, (state, action) => {
                state.isLoading = "succeeded";
                state.connectedUsers = action.payload
            })
            .addCase(getConnectedUserThunk.rejected, (state, action) => {
                state.isLoading = "failed";
            })
    },
});

export const { handleUserSearch, updateConnectionStatus, updateUserInterest } = authSlice.actions;
export default authSlice.reducer;