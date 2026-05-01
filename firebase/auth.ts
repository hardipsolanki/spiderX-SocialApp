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
                if (userDoc?.exists()) {
                    const userWithThieInterests = await this.addInterestsCollection.where('user', '==', userDoc.ref).get()
                    return{
                        ...userDoc.data(),
                        interests: userWithThieInterests.docs[0]?.data().interest ? userWithThieInterests.docs[0]?.data().interest : []
                    }
                } else {
                    const removePlushAndNineOneFromNumber = phoneNumber.replace("+91", "");
                    const snapshot = await this.usersCollection
                        .where("phone_number", "==", removePlushAndNineOneFromNumber)
                        .get();
                    if (snapshot.empty) {
                       await this.usersCollection.add({
                            uid: result.user.uid,
                            phone_number: removePlushAndNineOneFromNumber
                        });

                        return {
                            uid: result.user.uid,
                            phone_number: removePlushAndNineOneFromNumber,
                            interests: []
                        };
                    }
                }
            }
        } catch (error) {
            console.log("Error confirming code:", error);
            throw error;
        }
    }

    async createProfile(user: CreateUser) {
        try {
            const emailSnapshot = await this.usersCollection
                .where("email", "==", user.email)
                .get();

            if (!emailSnapshot.empty) {
                throw new Error("User with email already exists");
            }

            // check phone
            const profile = await this.usersCollection
                .where("phone_number", "==", user.phone_number)
                .get();

            const result = await profile.docs[0].ref.set({
                ...user
            },
                { merge: true }
            )
            return {
                ...user,
                id: profile.docs[0].id,
                uid: profile.docs[0].data().uid
            }

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
                    const userInterests = await this.addInterestsCollection.where('user', '==', snapshot.docs[0].ref).get()
                    if (!userInterests.empty) {
                        return {
                            ...snapshot.docs[0].data(),
                            interests: userInterests.docs[0].data().interest
                        }
                    }
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
            // remoeve the first element
            const data = result.filter((item) => item !== undefined);
            return data
        } catch (error) {
            console.log("Error getting users with interests:", error);
            throw error;
        }
    }
    async logOut() {
        try {
            await auth().signOut();
        } catch (error) {
            console.log("Error logging out:", error);
            throw error;
        }
    }
    async getSingleUser (uid: string) {
        try {
            const snapshot = await this.usersCollection
                .where("uid", "==", uid)
                .get();
            if (!snapshot.empty) {
                const userIntrests = await this.addInterestsCollection.where('user', '==', snapshot.docs[0].ref).get()

                return {
                    ...snapshot.docs[0].data(),
                    interests: userIntrests.docs[0].data().interest
                }
            }
        } catch (error) {
            console.log("Error getting user:", error);
            throw error;
        }
    }


}


export const authServices = new Authentication();
