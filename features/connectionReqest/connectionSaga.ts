import { connectedUserServices } from "@/firebase/connectedUsers";
import { connectionService } from "@/firebase/connection";
import { User } from "@/types";
import Toast from "react-native-toast-message";
import { call, put, takeLatest } from "redux-saga/effects";
import {
  updateConnectionStatus
} from "../auth/authSlice";
import {
  acceptRequest,
  acceptRequestFailure,
  acceptRequestSuccess,
  fetchConnectionsList,
  fetchConnectionsListFailure,
  fetchConnectionsListSuccess,
  getReceivedRequests,
  getReceivedRequestsFailure,
  getReceivedRequestsSuccess,
  getSentRequests,
  getSentRequestsFailure,
  getSentRequestsSuccess,
  rejectAndRemoveRequest,
  rejectAndRemoveRequestFailure,
  rejectAndRemoveRequestSuccess,
  sendConnection,
  sendConnectionFailure,
  sendConnectionSuccess,
} from "./connectionSlice";

interface ConnectionRequest extends User {
    requestId: string
}


// ─── Send Connection ───────────────────────────────────────────
function* handleSendConnection(action: ReturnType<typeof sendConnection>) {
    const { sendUserUid, receiverUid } = action.payload;
    try {
        yield put(updateConnectionStatus({ uid: receiverUid, status: "pending" }));

        yield call(
            [connectionService, connectionService.sendConnectionRequest],
            sendUserUid,
            receiverUid
        );
        yield put(sendConnectionSuccess());

        yield put(getSentRequests(sendUserUid));

        Toast.show({ type: "success", text1: "Request sent successfully!" });

    } catch (error: any) {
        yield put(updateConnectionStatus({ uid: receiverUid, status: null }));
        yield put(sendConnectionFailure());
        Toast.show({ type: "error", text1: error.message });
    }
}

// ─── Get Sent Requests ─────────────────────────────────────────
function* handleGetSentRequests(action: ReturnType<typeof getSentRequests>) {
    try {
        const result: ConnectionRequest[] = yield call(
            [connectionService, connectionService.getSendConnectionRequests],
            action.payload
        );
        yield put(getSentRequestsSuccess(result));
    } catch (error: any) {
        yield put(getSentRequestsFailure());
    }
}

// ─── Get Received Requests ─────────────────────────────────────
function* handleGetReceivedRequests(action: ReturnType<typeof getReceivedRequests>) {
    try {
        const result: ConnectionRequest[] = yield call(
            [connectionService, connectionService.getReceivedConnectionRequests],
            action.payload
        );
        yield put(getReceivedRequestsSuccess(result));
    } catch (error: any) {
        yield put(getReceivedRequestsFailure());
    }
}

// ─── Reject and Remove ─────────────────────────────────────────
function* handleRejectAndRemove(action: ReturnType<typeof rejectAndRemoveRequest>) {
    try {
        const { requestId, rejectedUserUid } = action.payload;
        yield call(
            [connectionService, connectionService.rejectAndRenoveConnectionRequest],
            requestId
        );
        yield put(rejectAndRemoveRequestSuccess(requestId));
        yield put(updateConnectionStatus({ uid: rejectedUserUid, status: "rejected" }));
        Toast.show({ type: "success", text1: "Request removed!" });
    } catch (error: any) {
        yield put(rejectAndRemoveRequestFailure());
        Toast.show({ type: "error", text1: error.message });
    }
}

// ─── Accept Request ────────────────────────────────────────────ss
function* handleAcceptRequest(action: ReturnType<typeof acceptRequest>) {
    try {
        const { senderUid, receiverUid } = action.payload;
        yield call(
            [connectedUserServices, connectedUserServices.acceptConnectionRequest],
            senderUid,
            receiverUid
        );
        yield put(acceptRequestSuccess({ senderUid }));
        yield put(updateConnectionStatus({ uid: senderUid, status: "accepted" }));
        Toast.show({ type: "success", text1: "Request accepted!" });
        yield put(fetchConnectionsList(receiverUid));
    } catch (error: any) {
        yield put(acceptRequestFailure());
        Toast.show({ type: "error", text1: error.message });
    }
}

// ─── Fetch Connections ─────────────────────────────────────────
function* handleFetchConnections(action: ReturnType<typeof fetchConnectionsList>) {
    try {
        const result: ConnectionRequest[] = yield call(
            [connectedUserServices, connectedUserServices.getConnections],
            action.payload
        );
        yield put(fetchConnectionsListSuccess(result));
    } catch (error: any) {
        yield put(fetchConnectionsListFailure());
    }
}

// ─── Watcher ───────────────────────────────────────────────────
export function* connectionSaga() {
    yield takeLatest(sendConnection.type, handleSendConnection);
    yield takeLatest(getSentRequests.type, handleGetSentRequests);
    yield takeLatest(getReceivedRequests.type, handleGetReceivedRequests);
    yield takeLatest(rejectAndRemoveRequest.type, handleRejectAndRemove);
    yield takeLatest(acceptRequest.type, handleAcceptRequest);
    yield takeLatest(fetchConnectionsList.type, handleFetchConnections);
}