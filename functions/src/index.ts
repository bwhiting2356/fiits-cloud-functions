import * as functions from 'firebase-functions';
import { fetchAndSaveToBigQuery } from './fetchData';
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const getBikeShareData = functions.pubsub
    .topic('get-bikeshare-data')
    .onPublish(() => {
        return fetchAndSaveToBigQuery();
    });

