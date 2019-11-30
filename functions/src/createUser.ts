import { auth } from "firebase-admin";
import axios from 'axios';

interface UserAccount {
    id: string;
    balance: number;
    email: string | undefined;
    photoURL: string | undefined;
}

export const createUser = (event: auth.UserRecord) => {
    const { photoURL, uid, email } = event;
    const newUser: UserAccount = { id: uid, email, photoURL, balance: 10.00 }
    return axios.post('https://fiits-backend.herokuapp.com/create-user', newUser)
}