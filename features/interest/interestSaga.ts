import { interestsService } from "@/firebase/interests";
import { call, put, takeLatest } from "redux-saga/effects";
import { updateUserInterest } from "../auth/authSlice";
import { updateUserInterestFulfilledAction, updateUserInterestRejectedAction, updateUserIntrestAction } from "./interestSlice";


function* updateUserInterests (action: any) {
    try {
          yield call(
                    [interestsService, interestsService.updateUserInterest],
                    action.payload.uid,
                    action.payload.interest
                );
        yield put({type: updateUserInterestFulfilledAction.toString()});
        yield put ({type: updateUserInterest.type, payload: {interest: action.payload.interest}},)

    } catch (error) {
        yield put({type: updateUserInterestRejectedAction.toString()});
        console.log("error while upate stat and call db: ", error)
    }
}

export function* interestSaga() {
    yield takeLatest(updateUserIntrestAction.toString() as any, updateUserInterests);
   
}