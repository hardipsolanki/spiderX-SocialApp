// features/chatSlice.ts
import { Chat, Message } from "@/types/";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatState {
    isLoading: "idle" | "pending" | "succeeded" | "failed";
    chats: Chat[];
    currentChatId: string | null;
    messages: Message[];
}

const initialState: ChatState = {
    isLoading: "idle",
    chats: [],
    currentChatId: null,
    messages: [],
};

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        // Get all chats
        fetchChats: (state, action: PayloadAction<string>) => {
            state.isLoading = "pending";
        },
        fetchChatsSuccess: (state, action: PayloadAction<Chat[]>) => {
            state.isLoading = "succeeded";
            state.chats = action.payload;
        },
        fetchChatsFailure: (state) => {
            state.isLoading = "failed";
        },

        // Open chat
        openOrCreateChat: (state, action: PayloadAction<{ 
            currentUid: string; 
            otherUid: string 
        }>) => {
            state.isLoading = "pending";
        },
        openOrCreateChatSuccess: (state, action: PayloadAction<string>) => {
            state.isLoading = "succeeded";
            state.currentChatId = action.payload;
        },
        openOrCreateChatFailure: (state) => {
            state.isLoading = "failed";
        },

        // Send message
        sendMessage: (state, action: PayloadAction<{ 
            chatId: string; 
            senderUid: string; 
            text: string 
        }>) => {
            state.isLoading = "pending";
        },
        sendMessageSuccess: (state) => {
            state.isLoading = "succeeded";
        },
        sendMessageFailure: (state) => {
            state.isLoading = "failed";
        },

        // Real time messages update
        setMessages: (state, action: PayloadAction<Message[]>) => {
            state.messages = action.payload;
        },

        clearChat: (state) => {
            state.currentChatId = null;
            state.messages = [];
        },
    },
});

export const {
    fetchChats, fetchChatsSuccess, fetchChatsFailure,
    openOrCreateChat, openOrCreateChatSuccess, openOrCreateChatFailure,
    sendMessage, sendMessageSuccess, sendMessageFailure,
    setMessages, clearChat,
} = chatSlice.actions;

export default chatSlice.reducer;