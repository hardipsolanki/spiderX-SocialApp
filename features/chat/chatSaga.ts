// sagas/chatSaga.ts
import { chatService } from "@/firebase/chatService";
import { Chat, Message } from "@/types";
import { eventChannel } from "redux-saga";
import { call, cancelled, put, take, takeLatest } from "redux-saga/effects";
import {
    fetchChats,
    fetchChatsFailure,
    fetchChatsSuccess,
    openOrCreateChat,
    openOrCreateChatFailure,
    openOrCreateChatSuccess,
    sendMessage,
    sendMessageFailure,
    sendMessageSuccess,
    setMessages
} from "./chatSlice";

// ─── Fetch All Chats ───────────────────────────────────────────
function* handleFetchChats(action: ReturnType<typeof fetchChats>) {
    try {
        const chats: Chat[] = yield call(
            [chatService, chatService.getAllChats],
            action.payload
        );
        yield put(fetchChatsSuccess(chats));
    } catch (error: any) {
        yield put(fetchChatsFailure());
    }
}

// ─── Open Or Create Chat ───────────────────────────────────────
function* handleOpenOrCreateChat(action: ReturnType<typeof openOrCreateChat>) {
    try {
        const { currentUid, otherUid } = action.payload;
        const chatId: string = yield call(
            [chatService, chatService.getOrCreateChat],
            currentUid,
            otherUid
        );
        yield put(openOrCreateChatSuccess(chatId));
    } catch (error: any) {
        yield put(openOrCreateChatFailure());
    }
}

// ─── Send Message ──────────────────────────────────────────────
function* handleSendMessage(action: ReturnType<typeof sendMessage>) {
    try {
        const { chatId, senderUid, text } = action.payload;
        yield call(
            [chatService, chatService.sendMessage],
            chatId,
            senderUid,
            text
        );
        yield put(sendMessageSuccess());
    } catch (error: any) {
        yield put(sendMessageFailure());
    }
}

// ─── Real Time Messages Listen ─────────────────────────────────
function createMessagesChannel(chatId: string) {
    return eventChannel((emit) => {
        // onSnapshot — real time listener
        const unsubscribe = chatService.listenMessages(chatId, (messages) => {
            emit(messages);
        });
        // Cleanup — channel close થાય ત્યારે unsubscribe
        return () => unsubscribe();
    });
}

function* handleListenMessages(chatId: string) {
    const channel: ReturnType<typeof createMessagesChannel> = 
        yield call(createMessagesChannel, chatId);
    try {
        while (true) {
            const messages: Message[] = yield take(channel);
            yield put(setMessages(messages));
        }
    } finally {
        // clearChat dispatch થાય ત્યારે channel close
        if (yield cancelled()) {
            channel.close();
        }
    }
}

// ─── Watcher ───────────────────────────────────────────────────
export function* chatSaga() {
    yield takeLatest(fetchChats.type, handleFetchChats);
    yield takeLatest(openOrCreateChat.type, handleOpenOrCreateChat);
    yield takeLatest(sendMessage.type, handleSendMessage);
}