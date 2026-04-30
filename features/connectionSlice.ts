import { connectionService } from "@/firebase/connection";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface AuthState {
    isLoading: "idle" | "pending" | "succeeded" | "failed";
}

const initialState: AuthState = {
    isLoading: "idle",
};

export const sendConnectionRequest = createAsyncThunk(
    "connection/sendConnectionRequest",
    async ({ sendUserUid, receiverUid }: { sendUserUid: string, receiverUid: string, }, { rejectWithValue }) => {
        try {
            await connectionService.sendConnectionRequest(sendUserUid, receiverUid)
        } catch (error: any) {
            return rejectWithValue(error.message || "Interest add failed");
        }
    },
)

const connectionSlice = createSlice({
    name: "connection",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(sendConnectionRequest.pending, (state) => {
                state.isLoading = "pending";
            })
            .addCase(sendConnectionRequest.fulfilled, (state) => {
                state.isLoading = "succeeded";
            })
            .addCase(sendConnectionRequest.rejected, (state) => {
                state.isLoading = "failed";
            })
    },
});

export default connectionSlice.reducer;