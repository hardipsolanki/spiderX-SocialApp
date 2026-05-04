import { interestsService } from "@/firebase/interests";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface AuthState {
    interests: { name: [string] } | { name: [] };
    isLoading: "idle" | "pending" | "succeeded" | "failed";
}

const initialState: AuthState = {
    interests: { name: [] },
    isLoading: "idle",
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
    },
});

export default interestsSlice.reducer;