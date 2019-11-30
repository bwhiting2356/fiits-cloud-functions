import { auth } from "firebase-admin";
import axios from 'axios';

interface UserAccount {
    id: string;
    email: string | undefined;
    photoURL: string | undefined;
}

export const createUser = (event: auth.UserRecord) => {
    const { photoURL, uid, email } = event;
    const newUser: UserAccount = { id: uid, email, photoURL }
    return axios.post('https://fiits-backend.herokuapp.com/create-user', newUser)
        .then(() => Promise.resolve)
}