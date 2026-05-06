import { combineReducers } from "@reduxjs/toolkit";
import {
  persistReducer,
} from "redux-persist";

import AsyncStorage from "@react-native-async-storage/async-storage";
import authReducer from "../auth/authSlice";
import chatReducer from "../chat/chatSlice";
import connectionReducer from "../connectionReqest/connectionSlice";
import interestReducer from "../interest/interestSlice";

const persistConfig = {
  key: "feature/auth",
  storage: AsyncStorage,
  whitelist: ["user"],
};

export const rootReducer = combineReducers({
  auth: persistReducer(persistConfig, authReducer),
  interest: interestReducer,
  connection: connectionReducer,
  chat: chatReducer
  
});