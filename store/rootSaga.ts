// sagas/rootSaga.ts
import { chatSaga } from "@/features/chat/chatSaga";
import { all } from "redux-saga/effects";
import { connectionSaga } from "../features/connectionReqest/connectionSaga";

export function* rootSaga() {
  yield all([
    connectionSaga(),
    chatSaga(),
  ]);
}