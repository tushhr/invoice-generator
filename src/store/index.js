import { configureStore } from '@reduxjs/toolkit'

import invoiceReducer, {loadInvoice} from './invoiceStore';
import { saveToLocalStorage, fetchFromLocalStorage } from '../utils/localStorage'

const store = configureStore({
    reducer: {
        invoice: invoiceReducer
    }
})

// To update data in local storage whenever store changes
store.subscribe(() => {
    saveToLocalStorage(store.getState())
})

// To load data from local storage to store
const preLoadedData = fetchFromLocalStorage()
if(preLoadedData) {
    store.dispatch(loadInvoice(preLoadedData.invoice))
}

export default store;