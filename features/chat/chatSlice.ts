import { Chat, Message } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatState {
  chats: Chat[];
  currentChatId: string | null;
  messages: Message[];
  chatLoading: boolean;
  messageSending: boolean;
  searchResults: Chat[];
}

const initialState: ChatState = {
  chats: [],
  currentChatId: null,
  messages: [],
  searchResults: [],
  chatLoading: false,
  messageSending: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    fetchChats: (state, action: PayloadAction<string>) => {
      state.chatLoading = true;
    },
    fetchChatsSuccess: (state, action: PayloadAction<Chat[]>) => {
      state.chatLoading = false;
      state.chats = action.payload;
    },

    openChat: (
      state,
      action: PayloadAction<{ currentUid: string; otherUid: string }>
    ) => {
      state.chatLoading = true;
    },
    openChatSuccess: (state, action: PayloadAction<string>) => {
      state.chatLoading = false;
      state.currentChatId = action.payload;
    },

    sendMessage: (
      state,
      action: PayloadAction<{
        chatId: string;
        senderUid: string;
        text: string;
      }>
    ) => {
      state.messageSending = true;
    },
    sendMessageSuccess: (
      state,
      action: PayloadAction<{ chatId: string; text: string }>
    ) => {
      state.messageSending = false;

      const chat = state.chats.find(c => c.chatId === action.payload.chatId);

      if (chat) {
        chat.lastMessage = action.payload.text;
        chat.lastMessageTime = new Date();
      }
    },

    startListeningMessages: (state, action: PayloadAction<string>) => { },

    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },

    stopListeningMessages: (state) => {
      state.currentChatId = null;
      state.messages = [];
    },

    clearChat: (state) => {
      state.currentChatId = null;
      state.messages = [];
    },
    markChatAsRead: (
      state,
      action: PayloadAction<{ chatId: string; uid: string }>
    ) => {
      const chat = state.chats.find(c => c.chatId === action.payload.chatId);
      if (chat) {
        chat.unreadCount = 0;
      }
    },
    handleChatUserSearch: (
      state,
      action: { payload: { search: string } }
    ) => {
      const search = action.payload.search.toLowerCase();

      if (!search) {
        state.searchResults = [];
        return;
      }

      state.searchResults = state.chats.filter((item) =>
        `${item.otherUser?.first_name} ${item.otherUser?.last_name}`
          .toLowerCase()
          .includes(search)
      );
    },
  },
});

export const {
  fetchChats,
  fetchChatsSuccess,
  openChat,
  openChatSuccess,
  sendMessage,
  sendMessageSuccess,
  startListeningMessages,
  setMessages,
  stopListeningMessages,
  clearChat,
  markChatAsRead,
  handleChatUserSearch,
} = chatSlice.actions;

export default chatSlice.reducer;