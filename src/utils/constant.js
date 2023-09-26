export const INVOICE_ACTIONS = {
    NEW_INVOICE: 'NEW_INVOICE',
    EDIT_INVOICE: 'EDIT_INVOICE',
    COPY_INVOICE: 'COPY_INVOICE',
}

export const INVOICE_TABLE_HEADERS = [
    {
        title: "Invoice",
        icon: "fa-chevron-down",
    },
    {
        title: "From",
        icon: "fa-chevron-down",
    },
    {
        title: "To",
        icon: "fa-chevron-down",
    },
    {
        title: "Date",
        icon: "fa-chevron-down",
    },
    {
        title: "Total Amount",
        icon: "fa-chevron-down",
    },
    {
        title: "",
        icon: "",
    },
    {
        title: "",
        icon: "",
    },
    {
        title: "",
        icon: "",
    }
]

export const TABLE_HEADER_TO_INVOICE_KEY = {
    'invoice': 'invoiceNumber',
    'from': 'billFrom',
    'to': 'billTo',
    'date': 'dateOfIssue',
    'total amount': 'total',
}

export const INT_FIELD_COLOUMNS = ['invoice', 'total amount']
export const STRING_FIELD_COLOUMNS = ['from', 'to']
export const DATE_FIELD_COLOUMNS = ['date']