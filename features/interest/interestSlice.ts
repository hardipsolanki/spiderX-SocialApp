import { interestsService } from "@/firebase/interests";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface AuthState {
    interests: { name: [string] } | { name: [] };
    userInterests: { name: [string] } | { name: [] };
    isLoading: "idle" | "pending" | "succeeded" | "failed";
}

const initialState: AuthState = {
    interests: { name: [] },
    isLoading: "idle",
    userInterests: { name: [] },
};

;
export const getInterests = createAsyncThunk(
    "interests/getInterests",
    async (_, { rejectWithValue }) => {
        try {
            const res = await interestsService.getInterests()
            return res as { name: [string] };
        } catch (error: any) {
            return rejectWithValue(error.message || "Interest fetch failed");
        }
    },
)

export const addUserInterest = createAsyncThunk(
    "interests/addUserInterest",
    async ({ userRef, interest }: { userRef: FirebaseFirestoreTypes.DocumentReference, interest: string[] }, { rejectWithValue }) => {
        try {
            await interestsService.addUserInterest(userRef, interest)
        } catch (error: any) {
            return rejectWithValue(error.message || "Interest add failed");
        }
    },
)

// export const updateUserInterest = createAsyncThunk(
//     "interests/updateUserInterest",
//     async ({ uid, interest }: { uid: string, interest: string[] }, { rejectWithValue }) => {
//         try {
//             await interestsService.updateUserInterest(uid, interest)
//             return interest
//         } catch (error: any) {
//             return rejectWithValue(error.message || "Interest update failed");
//         }
//     },
// )

export const getUserInterests = createAsyncThunk(
    "interests/getUserInterests",
    async ({ uid }: { uid: string }, { rejectWithValue }) => {
        try {
            const res = await interestsService.getUserInterests(uid)
            return res as any
        } catch (error: any) {
            return rejectWithValue(error.message || "Interest fetch failed");
        }
    },
)

export const updateUserIntrestAction = createAction("interests/updateUserInterest");
export const updateUserInterestFulfilledAction = createAction("interests/updateUserInterestFulfilled");
export const updateUserInterestRejectedAction = createAction("interests/updateUserInterestRejected");

const interestsSlice = createSlice({
    name: "interests",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getInterests.pending, (state) => {
                state.isLoading = "pending";
            })
            .addCase(getInterests.fulfilled, (state, action) => {
                state.isLoading = "succeeded";
                state.interests.name = action.payload.name;
            })
            .addCase(getInterests.rejected, (state, action) => {
                state.isLoading = "failed";
            })
            .addCase(addUserInterest.pending, (state) => {
                state.isLoading = "pending";
            })
            .addCase(addUserInterest.fulfilled, (state) => {
                state.isLoading = "succeeded";
            })
            .addCase(addUserInterest.rejected, (state, action) => {
                state.isLoading = "failed";
            })
            .addCase(updateUserIntrestAction, (state) => {
                state.isLoading = "pending";
            })
            .addCase(updateUserInterestFulfilledAction, (state, action) => {
                state.isLoading = "succeeded";
            })
            .addCase(updateUserInterestRejectedAction, (state, action) => {
                state.isLoading = "failed";
            })
            .addCase(getUserInterests.pending, (state) => {
                state.isLoading = "pending";
            })
            .addCase(getUserInterests.fulfilled, (state, action) => {
                state.isLoading = "succeeded";
                state.userInterests.name = action.payload.name

            })
            .addCase(getUserInterests.rejected, (state, action) => {
                state.isLoading = "failed";
            });
    },
});

export default interestsSlice.reducer;