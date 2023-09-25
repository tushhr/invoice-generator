import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    invoiceList: [],
}

const invoiceSlice = createSlice({
    name: 'invoiceStore',
    initialState,
    reducers: {
        loadInvoice(state, action) {
            state.invoiceList = action.payload.invoiceList
        },
        addInvoice(state, action) {
            state.invoiceList.push(action.payload)
        },
        removeInvoice(state, action) {
            state.invoiceList = state.invoices.filter(invoice => invoice.id !== action.payload)
        },
        updateInvoice(state, action) {
            const index = state.invoiceList.findIndex(invoice => invoice.id === action.payload.id)
            state.invoiceList[index] = action.payload
        }
    }
})

export const { loadInvoice, addInvoice, removeInvoice, updateInvoice } = invoiceSlice.actions;
export default invoiceSlice.reducer;