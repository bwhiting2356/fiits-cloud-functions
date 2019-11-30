import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';

admin.initializeApp(functions.config().firebase);

const ref = admin.database().ref();

import { fetchAndSaveToBigQuery } from './fetchData';

export const getBikeShareData = functions.pubsub
    .topic('get-bikeshare-data')
    .onPublish(() => {
        return fetchAndSaveToBigQuery();
    });


export const newUser = functions.auth.user().onCreate(event => {
    const { photoURL, uid, email } = event;
    return axios.post('https://fiits-backend.herokuapp.com', { id: uid, email, photoURL, balance: 10.00 })
})
