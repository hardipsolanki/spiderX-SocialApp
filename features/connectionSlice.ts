import { connectedUserServices } from "@/firebase/connectedUsers";
import { connectionService } from "@/firebase/connection";
import { User } from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface ConnectionRequest extends User {
    requestId: string
}

interface ConnectionState {
    isLoading: "idle" | "pending" | "succeeded" | "failed";
    sendConnectionRequest: ConnectionRequest[] | null
    receivedConnectionRequest: ConnectionRequest[] | null
    connections: ConnectionRequest[] | null;
}

const initialState: ConnectionState = {
    isLoading: "idle",
    sendConnectionRequest: null,
    receivedConnectionRequest: null,
    connections: null,
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
    async ({requestId,rejectedUserUid}: {requestId: string, rejectedUserUid: string}, { rejectWithValue }) => {
        try {
            await connectionService.rejectAndRenoveConnectionRequest(requestId, rejectedUserUid)
            return requestId as string
        } catch (error: any) {
            return rejectWithValue(error.message || "failed to reject and remove connection request");
        }
    },
)


export const acceptConnectionRequest = createAsyncThunk(
    'connection/acceptRequest',
    async (
        {
            requestId,
            senderUid,
            receiverUid,
        }: { requestId: string; senderUid: string; receiverUid: string },
        { rejectWithValue }
    ) => {
        try {
            await connectedUserServices.acceptConnectionRequest(requestId, senderUid, receiverUid);
            return { requestId, senderUid };
        } catch (error: any) {
            return rejectWithValue(error.message || 'Accept failed');
        }
    }
);

export const fetchConnections = createAsyncThunk(
    'connection/fetchConnections',
    async (uid: string, { rejectWithValue }) => {
        try {
            const connections = await connectedUserServices.getConnections(uid);
            return connections;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch connections');
        }
    }
);

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

            // accespt request
            .addCase(acceptConnectionRequest.pending, (state) => {
                state.isLoading = "pending";
            })
            .addCase(acceptConnectionRequest.fulfilled, (state, action) => {
                state.isLoading = "succeeded";
                if (state.receivedConnectionRequest) {
                    state.receivedConnectionRequest = state.receivedConnectionRequest?.filter(
                        (req) => req.requestId !== action.payload.requestId
                    );
                }
                if (state.sendConnectionRequest) {
                    state.sendConnectionRequest = state.sendConnectionRequest?.filter(
                        (req) => req.requestId !== action.payload.requestId
                    );
                }
            })
            .addCase(acceptConnectionRequest.rejected, (state) => {
                state.isLoading = "failed";
            })

            // fetch connections
            .addCase(fetchConnections.pending, (state) => {
                state.isLoading = "pending";
            })
            .addCase(fetchConnections.fulfilled, (state, action) => {
                state.isLoading = "succeeded";
                state.connections = action.payload as ConnectionRequest[];
            })
            .addCase(fetchConnections.rejected, (state) => {
                state.isLoading = "failed";
            });
    },
});

export default connectionSlice.reducer;