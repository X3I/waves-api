import { TTransactionRequest } from '../../../utils/request';

import Transactions from '../../../classes/Transactions';
import { createFetchWrapper, PRODUCTS, VERSIONS, processJSON, wrapTransactionRequest } from '../../../utils/request';
import { createRemapper } from '../../../utils/remap';
import { cancelLeasingSchema, leaseSchema } from './leasing.x';


const fetch = createFetchWrapper(PRODUCTS.NODE, VERSIONS.V1, processJSON);

const preLease = (data) => leaseSchema.parse(data);
const postLease = createRemapper({
    transactionType: null
});

const preCancelLeasing = (data) => cancelLeasingSchema.parse(data);
const postCancelLeasing = createRemapper({
    transactionType: null,
    transactionId: 'txId'
});


export default {

    lease: wrapTransactionRequest(Transactions.LeaseTransaction, preLease, postLease, (postParams) => {
        return fetch('/leasing/broadcast/lease', postParams);
    }) as TTransactionRequest,

    cancelLeasing: wrapTransactionRequest(Transactions.CancelLeasingTransaction, preCancelLeasing, postCancelLeasing, (postParams) => {
        return fetch('/leasing/broadcast/cancel', postParams);
    }) as TTransactionRequest

};
