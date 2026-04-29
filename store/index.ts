import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import interestSlice from "../features/interestSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    interest: interestSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;