import AsyncStorage from "@react-native-async-storage/async-storage";
import { configureStore } from "@reduxjs/toolkit";
import {
  persistReducer,
  persistStore,
} from "redux-persist";

import { combineReducers } from "redux";
import authReducer from "../features/authSlice";
import connectionReducer from "../features/connectionSlice";
import interestReducer from "../features/interestSlice";

const persistConfig = {
  key: "feature/auth",
  storage: AsyncStorage,
  whitelist: ["user"],
};

const rootReducer = combineReducers({
  auth: persistReducer(persistConfig, authReducer),
  interest: interestReducer,
  connection: connectionReducer
});



export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);



export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;