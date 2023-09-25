import { configureStore } from '@reduxjs/toolkit'

import invoiceReducer from './invoiceStore';

const store = configureStore({
    reducer: {
        invoice: invoiceReducer
    }
})

export default store;