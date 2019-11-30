import * as functions from 'firebase-functions';

import { fetchAndSaveToBigQuery } from './fetchAndSaveData';
import { createUser } from './createUser';

export const getBikeShareData = functions.pubsub
    .topic('get-bikeshare-data')
    .onPublish(fetchAndSaveToBigQuery);

export const newUser = functions.auth
    .user()
    .onCreate(createUser)
