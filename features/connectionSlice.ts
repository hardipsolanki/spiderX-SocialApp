import { connectionService } from "@/firebase/connection";
import { User } from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface ConnectionRequest extends User {
    requestId: string
}

interface AuthState {
    isLoading: "idle" | "pending" | "succeeded" | "failed";
    sendConnectionRequest: ConnectionRequest[] | null
    receivedConnectionRequest: ConnectionRequest[] | null
    isConnectionReqSended?: boolean
}

const initialState: AuthState = {
    isLoading: "idle",
    sendConnectionRequest: null,
    receivedConnectionRequest: null
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

export const getReceivedConnectionRequests = createAsyncThunk(
    "connection/getReceivedConnectionRequests",
    async (receiverUid: string, { rejectWithValue }) => {
        try {
            const res = await connectionService.getReceivedConnectionRequests(receiverUid)
            return res
        } catch (error: any) {
            return rejectWithValue(error.message || "failed to get received connection requests");
        }
    },
)

export const getSentConnectionRequests = createAsyncThunk(
    "connection/getSentConnectionRequests",
    async (sendUserUid: string, { rejectWithValue }) => {
        try {
            const res = await connectionService.getSendConnectionRequests(sendUserUid)
            return res
        } catch (error: any) {
            return rejectWithValue(error.message || "failed to get send connection requests");
        }
    },
)

export const rejectAndRemoveConnectionRequest = createAsyncThunk(
    "connection/rejectAndRemoveConnectionRequest",
    async (requestId: string, { rejectWithValue }) => {
        try {
            await connectionService.rejectAndRenoveConnectionRequest(requestId)
            return requestId as string
        } catch (error: any) {
            return rejectWithValue(error.message || "failed to reject and remove connection request");
        }
    },
)

export const checkIsConnectionReqSended = createAsyncThunk(
    "connection/checkIsConnectionReqSended",
    async ({ sendUserUid, receiverUid }: { sendUserUid: string, receiverUid: string },
         { rejectWithValue }) => {
        try {
            const res = await connectionService.checkIsConnectionReqSended(sendUserUid, receiverUid)
            return res
        } catch (error: any) {
            return rejectWithValue(error.message || "failed to check is connection request sended");
        }
    }
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

            // get sent connection requests
            .addCase(getSentConnectionRequests.pending, (state) => {
                state.isLoading = "pending";
            })
            .addCase(getSentConnectionRequests.fulfilled, (state, action) => {
                state.isLoading = "succeeded";
                state.sendConnectionRequest = action.payload
            })
            .addCase(getSentConnectionRequests.rejected, (state) => {
                state.isLoading = "failed";
            })

            // get received connection requests
            .addCase(getReceivedConnectionRequests.pending, (state) => {
                state.isLoading = "pending";
            })
            .addCase(getReceivedConnectionRequests.fulfilled, (state, action) => {
                state.isLoading = "succeeded";
                state.receivedConnectionRequest = action.payload
            })
            .addCase(getReceivedConnectionRequests.rejected, (state) => {
                state.isLoading = "failed";
            })

            // reject and remove connection request
            .addCase(rejectAndRemoveConnectionRequest.pending, (state) => {
                state.isLoading = "pending";
            })
            .addCase(rejectAndRemoveConnectionRequest.fulfilled, (state, action) => {
                state.isLoading = "succeeded";
                const index = state.sendConnectionRequest?.findIndex((request) => request.requestId === action.payload)
                if (index !== undefined && index !== -1) {
                    state.sendConnectionRequest?.splice(index, 1)
                } else {
                    const index = state.receivedConnectionRequest?.findIndex((request) => request.requestId === action.payload)
                    if (index !== undefined && index !== -1) {
                        state.receivedConnectionRequest?.splice(index, 1)
                    }
                }
            
            })
            .addCase(rejectAndRemoveConnectionRequest.rejected, (state) => {
                state.isLoading = "failed";
            })

            // check is connection request sended
            .addCase(checkIsConnectionReqSended.pending, (state) => {
                state.isLoading = "pending";
            })
            .addCase(checkIsConnectionReqSended.fulfilled, (state, action) => {
                state.isLoading = "succeeded";
                state.isConnectionReqSended = action.payload
            })
            .addCase(checkIsConnectionReqSended.rejected, (state) => {
                state.isLoading = "failed";
            })
    },
});

export default connectionSlice.reducer;