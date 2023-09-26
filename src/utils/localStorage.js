const INVOICE_STORE_KEY = "invoice_data"


export const saveToLocalStorage = (storeData) => {
    try {
        localStorage.setItem(INVOICE_STORE_KEY, JSON.stringify(storeData))
    } catch(error) {
        console.log("Some error occured while saving to local storage", error)
    }
}

export const fetchFromLocalStorage = () => {
    try {
        if (INVOICE_STORE_KEY in localStorage) {
            return JSON.parse(localStorage.getItem(INVOICE_STORE_KEY))
        }
    } catch (error) {
        console.log("Some error occured while fetching from local storage", error)
    }
}

export const clearLocalStorage = () => {
    try {
        localStorage.removeItem(INVOICE_STORE_KEY)
    } catch (error) {
        console.log("Some error occured while clearing local storage", error)
    }
}