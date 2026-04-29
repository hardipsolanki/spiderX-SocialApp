import { CreateUser } from '@/types';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
class Authentication {
    confirmation: any;
    usersCollection = firestore().collection('users');
    async signInWithPhoneNumber(phoneNumber: string) {
        try {
            const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
            this.confirmation = confirmation;
            return confirmation;
        } catch (error) {
            console.log("Error signing in with phone number:", error);
            throw error;
        }
    }
    async confirmCode(phoneNumber: string, code: string) {
        try {
            if (!this.confirmation) {
                console.log("No confirmation code available");
                return;
            }
            const result = await this.confirmation.confirm(code);
            if (result.user.uid) {
                const snapshot = await this.usersCollection
                    .where("uid", "==", result.user.uid)
                    .get();
                const userDoc = snapshot.docs[0];
                if (userDoc?.exists()) {
                    await userDoc.ref.set({
                        lastLoginAt: new Date(),
                    },
                        { merge: true }
                    );
                } else {
                    const snapshot = await this.usersCollection
                        .where("phone_number", "==", phoneNumber)
                        .get();
                    if (snapshot.empty) {
                        throw new Error("User not found");
                    } else {
                        snapshot.docs[0].ref.set({
                            lastLoginAt: new Date(),
                            uid: result.user.uid
                        },
                            { merge: true }
                        );
                    }
                }
            }

            return result;
        } catch (error) {
            console.log("Error confirming code:", error);
            throw error;
        }
    }
    async createUser(user: CreateUser) {
        try {
            const useDoc = await this.usersCollection.doc(user.email).get()
            if (!!useDoc.exists) {
                throw new Error("User already exists");
            }
            const result = await this.usersCollection.add(user)
            return result

        } catch (error) {
            console.log("Error creating user:", error);
            throw error;
        }
    }
    async uploadAvatar(uri: string): Promise<string> {
        const filename = `avatars/${Date.now()}.jpg`
        const ref = storage().ref(filename)

        await ref.putFile(uri)
        const url = await ref.getDownloadURL()
        return url
    }

}


export const authServices = new Authentication();
