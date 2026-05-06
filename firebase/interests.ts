import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { authServices } from './auth';

class InterestsService {
    private interestsCollection = firestore().collection('interests');
    private addInterestsCollection = firestore().collection('user-interests');
    async getInterests() {
        try {
            const intrests = await this.interestsCollection.get()
            return intrests.docs[0].data()
        } catch (error) {
            console.error('Error getting user interests:', error);
        }
    }

    async addUserInterest(userRef: FirebaseFirestoreTypes.DocumentReference, interest: string[]) {
        try {
            await this.addInterestsCollection.add({
                user: userRef,
                interest
            })
        } catch (error) {
            console.error('Error adding user interest:', error);
        }
    }

    async updateUserInterest(uid: string, interest: string[]) {
        try {
            const userRef = await authServices.getUserRef(uid)
            if (userRef) {
                const userInterests = await this.addInterestsCollection.where('user', '==', userRef).get()
                if (userInterests.empty) throw new Error("User interest not found");
                const res = await userInterests.docs[0].ref.update({ interest })
                return res


            }
        } catch (error) {
            console.log("Error while update user interest: ", error)
            throw error
        }
    }
    async getUserInterests(uid: string) {
        try {
            const userRef = await authServices.getUserRef(uid)
            if (userRef) {
                const userInterests = await this.addInterestsCollection.where('user', '==', userRef).get()
                if (userInterests.empty) throw new Error("User interest not found");
                const res = {
                    name: userInterests.docs[0].data().interest
                }
                return res
            }
        } catch (error) {
            console.log("Error while get user interest: ", error)
            throw error
        }
    }
}


export const interestsService = new InterestsService()
