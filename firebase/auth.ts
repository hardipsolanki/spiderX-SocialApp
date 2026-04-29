import { CreateUser } from '@/types';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

class Authentication {
    private confirmation: any;
    private usersCollection = firestore().collection('users');
    private addInterestsCollection = firestore().collection('user-interests');
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
                if (!userDoc?.exists()) {
                    const snapshot = await this.usersCollection
                        .where("phone_number", "==", phoneNumber)
                        .get();
                    if (snapshot.empty) {
                        throw new Error("User not found");
                    } else {
                        snapshot.docs[0].ref.set({
                            uid: result.user.uid
                        },
                            { merge: true }
                        );
                    }
                } else return userDoc.data();
            }

            return result.user.uid;
        } catch (error) {
            console.log("Error confirming code:", error);
            throw error;
        }
    }
    async createUser(user: CreateUser) {
        try {
            const emailSnapshot = await this.usersCollection
                .where("email", "==", user.email)
                .get();

            // check phone
            const phoneSnapshot = await this.usersCollection
                .where("phone_number", "==", user.phone_number)
                .get();
            if (!emailSnapshot.empty || !phoneSnapshot.empty) {
                throw new Error("User already exists");
            }
            if (!emailSnapshot.empty || !phoneSnapshot.empty) {
                throw new Error("User already exists");
            }
            const result = await this.usersCollection.add(user)
            return result

        } catch (error) {
            console.log("Error creating user:", error);
            throw error;
        }
    }
    async getUser() {
        try {
            const user = auth().currentUser;
            if (user) {
                const snapshot = await this.usersCollection
                    .where("uid", "==", user.uid)
                    .get();
                if (!snapshot.empty) {
                    return snapshot.docs[0].data();
                }
            } else throw new Error("User not found");

        } catch (error) {
            console.log("Error getting user:", error);
            throw error;
        }
    }
    async getUserRef(uid: string) {
        try {
            const snapshot = await this.usersCollection
                .where("uid", "==", uid)
                .get();
            if (!snapshot.empty) {
                return snapshot.docs[0].ref;
            }
        } catch (error) {
            console.log("Error getting user:", error);
            throw error;
        }
    }
    async getUsersWithInterests() {
        try {
            const snapshot = await this.addInterestsCollection.get();
            const result = await Promise.all(
                snapshot.docs.map(async (doc) => {
                    const data = doc.data();
                    if (data.user) {
                        const userSnap = await data.user.get()
                        return {
                            id: doc.id,
                            interest: data.interest,
                            user: userSnap.data(),
                        };
                    }
                })
            );
            return result[1]
        } catch (error) {
            console.log("Error getting users with interests:", error);
            throw error;
        }
    }


}


export const authServices = new Authentication();
