import {
  fetchChats,
  fetchChatsSuccess,
  markChatAsRead,
  openChat,
  openChatSuccess,
  sendMessage,
  sendMessageSuccess,
  setMessages,
  startListeningMessages,
} from "@/features/chat/chatSlice";
import { chatService } from "@/firebase/chatService";
import { Message } from "@/types";
import { eventChannel } from "redux-saga";
import {
  call,
  cancelled,
  put,
  take,
  takeLatest,
} from "redux-saga/effects";

//
// ─────────────────────────────────────────────
// 🔥 REAL-TIME CHAT LIST (WITH UNREAD COUNT)
// ─────────────────────────────────────────────
//
function createChatsChannel(uid: string) {
  return eventChannel((emit) => {
    const unsubscribe = chatService.listenChatsWithUnreadCount(
      uid,
      (chats) => {
        emit(chats);
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  });
}

function* handleFetchChats(action: ReturnType<typeof fetchChats>): Generator {
  if (!action.payload) return;

  const channel = yield call(createChatsChannel, action.payload);

  try {
    while (true) {
      const chats = yield take(channel);
      yield put(fetchChatsSuccess(chats)); // 🔥 updates UI live
    }
  } finally {
    if (yield cancelled()) {
      channel.close();
    }
  }
}

//
// ─────────────────────────────────────────────
// 🟢 OPEN CHAT
// ─────────────────────────────────────────────
//
function* handleOpenChat(action: ReturnType<typeof openChat>): Generator {
  const { currentUid, otherUid } = action.payload;

  const chatId = yield call(
    [chatService, chatService.getOrCreateChat],
    currentUid,
    otherUid
  );

  yield put(openChatSuccess(chatId));

  // start listening messages
  yield put(startListeningMessages(chatId));
}

//
// ─────────────────────────────────────────────
// 🟢 SEND MESSAGE
// ─────────────────────────────────────────────
//
function* handleSendMessage(action: ReturnType<typeof sendMessage>): Generator {
  const { chatId, senderUid, text } = action.payload;

  yield call(
    [chatService, chatService.sendMessage],
    chatId,
    senderUid,
    text
  );
  yield put(
    sendMessageSuccess({
      chatId,
      text,
    })
  );
}

//
// ─────────────────────────────────────────────
// 🔵 MESSAGE LISTENER (REAL-TIME)
// ─────────────────────────────────────────────
//
function createMessagesChannel(chatId: string) {
  return eventChannel((emit) => {
    const unsubscribe = chatService.listenMessages(
      chatId,
      (messages) => {
        emit(messages);
      }
    );

    return () => unsubscribe();
  });
}

function* handleListenMessages(
  action: ReturnType<typeof startListeningMessages>
): Generator {
  const channel = yield call(createMessagesChannel, action.payload);

  try {
    while (true) {
      const messages: Message[] = yield take(channel);
      yield put(setMessages(messages));
    }
  } finally {
    if (yield cancelled()) {
      channel.close();
    }
  }
}


function* handleMarkChatAsRead(
  action: ReturnType<typeof markChatAsRead>
): Generator {
  const { chatId, uid } = action.payload;

  yield call(
    [chatService, chatService.markMessagesAsRead],
    chatId,
    uid
  );
}

//
// ─────────────────────────────────────────────
// 🚀 ROOT
// ─────────────────────────────────────────────
//
export function* chatSaga() {
  yield takeLatest(fetchChats.type, handleFetchChats);
  yield takeLatest(openChat.type, handleOpenChat);
  yield takeLatest(sendMessage.type, handleSendMessage);
  yield takeLatest(startListeningMessages.type, handleListenMessages);
  yield takeLatest(markChatAsRead.type, handleMarkChatAsRead);
}