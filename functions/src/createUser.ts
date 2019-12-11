import { auth } from "firebase-admin";
import axios from 'axios';

interface UserAccount {
    id: string;
    email: string | undefined;
}

export const createUser = (event: auth.UserRecord) => {
    const { uid, email } = event;
    const newUser: UserAccount = { id: uid, email }
    return axios.post('https://fiits-backend.herokuapp.com/create-user', newUser)
        .then(() => Promise.resolve)
}