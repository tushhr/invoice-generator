import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';

import { removeInvoice, clearInvoiceList } from "../store/invoiceStore";
import { clearLocalStorage } from "../utils/localStorage";
import { 
    INVOICE_ACTIONS, 
    INVOICE_TABLE_HEADERS, 
    TABLE_HEADER_TO_INVOICE_KEY, 
    INT_FIELD_COLOUMNS, 
    STRING_FIELD_COLOUMNS, 
    DATE_FIELD_COLOUMNS 
} from "../utils/constant";
import InvoiceForm from "./InvoiceForm";

export default function Home() {
    const invoiceListStore = useSelector(store => store.invoice.invoiceList)
    const dispatch = useDispatch()

    const [invoiceList, setInvoiceList] = useState(invoiceListStore)
    const [invoice, setInvoice] = useState(null)
    const [invoiceAction, setInvoiceAction] = useState(INVOICE_ACTIONS.NEW_INVOICE)
    const [tableHeader, setTableHeader] = useState(INVOICE_TABLE_HEADERS)

    const nameToKey = TABLE_HEADER_TO_INVOICE_KEY

    const sortByInt = (array, key) => {
        return [...array].sort((a, b) =>  a.info[key] - b.info[key]);
    }

    const sortByString = (array, key) => {
        return [...array].sort((a, b) => a.info[key].localeCompare(b.info[key]));;
    }

    const sortByDate = (array, key) => {
        return [...array].sort((a, b) => new Date(a.info[key]) - new Date(b.info[key]));
    }

    const handleSorting = (index, sortOrder) => {
        const colHeader = tableHeader[index].title.toLowerCase()
        const key = nameToKey[colHeader]
        let newInvoiceList = [...invoiceList];

        if(INT_FIELD_COLOUMNS.has(colHeader)) {
            newInvoiceList = sortByInt(newInvoiceList, key)
        } else if(STRING_FIELD_COLOUMNS.has(colHeader)){
            newInvoiceList = sortByString(newInvoiceList, key)
        } else if(DATE_FIELD_COLOUMNS.has(colHeader)) {
            newInvoiceList = sortByDate(newInvoiceList, key)
        }

        sortOrder === 1 ? setInvoiceList(newInvoiceList) : setInvoiceList(newInvoiceList.reverse());
    }

    const handleSortingClick = (index) => {
        const newTableHeader = [...tableHeader]
        if (newTableHeader[index].icon === "fa-chevron-down") {
            newTableHeader[index].icon = "fa-chevron-up"
            handleSorting(index, 1)
        } else if (newTableHeader[index].icon === "fa-chevron-up") {
            newTableHeader[index].icon = "fa-chevron-down"
            handleSorting(index, -1)
        }
        setTableHeader(newTableHeader)
    }

    const handleCopy = (invoice) => {
        const newInvoice = {...invoice}
        newInvoice.info = {...invoice.info}
        newInvoice.info.invoiceNumber = undefined

        setInvoiceAction(INVOICE_ACTIONS.COPY_INVOICE)
        setInvoice(newInvoice)
    }

    const clearInvoiceStore = () =>{
        clearLocalStorage();
        dispatch(clearInvoiceList())
    }

    useEffect(() => {
        setInvoiceList(invoiceListStore)
    }, [invoiceListStore])

    return (
        <div>
          <div className="ribbon">We save your data in your browser, please <button className="clear-button" onClick={() => clearInvoiceStore()}>Click here</button> to clear the storage.</div>
            <div className="header">
                <Button variant="primary" type="submit" className="d-block" onClick={() => { setInvoiceAction(INVOICE_ACTIONS.NEW_INVOICE); setInvoice({})}}>Create a New Invoice</Button>
                {invoice && <Button variant="primary" type="submit" className="d-block" onClick={() => setInvoice(null)}>Home</Button>}
            </div>
            { !invoice && 
                <>
                {
                    invoiceList.length ? 
                        <table className="invoice-table">
                            <thead>
                                <tr>
                                    {tableHeader.map((header, index) => 
                                        <th className="invoice-table__col-head invoice-table__col-head--left-align">
                                            {header.title}
                                            <i className={"fa " + header.icon} onClick={() => handleSortingClick(index)}></i>
                                        </th>
                                    )}
                                    <th className="invoice-table__col-head invoice-table__col-head--left-align hide-in-mobile"></th>
                                    <th className="invoice-table__col-head invoice-table__col-head--left-align hide-in-mobile"></th>
                                    <th className="invoice-table__col-head invoice-table__col-head--left-align"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoiceList.map((invoice, index) => {
                                    return (
                                        <tr key={invoice.id}>
                                            <td className="invoice-table__row invoice-table__row--active">{invoice.info.invoiceNumber}</td>
                                            <td className="invoice-table__row"> {invoice.info.billFrom}</td>
                                            <td className="invoice-table__row">{invoice.info.billTo}</td>
                                            <td className="invoice-table__row ">{invoice.info.dateOfIssue}</td>
                                            <td className="invoice-table__row ">{invoice.currency + invoice.info.total}</td>
                                            <td className="invoice-table__row hide-in-mobile" onClick={() =>  handleCopy(invoice)}><Button variant="primary" type="submit" className="d-block w-100">Copy</Button></td>
                                            <td className="invoice-table__row hide-in-mobile" onClick={() =>  { setInvoice(invoice); setInvoiceAction(INVOICE_ACTIONS.EDIT_INVOICE)}}><Button variant="primary" type="submit" className="d-block w-100">Edit</Button></td>
                                            <td className="invoice-table__row hide-in-mobile" onClick={() =>  dispatch(removeInvoice(invoice.id))}><Button variant="primary" type="submit" className="d-block w-100">Delete</Button></td>
                                            <Dropdown className="invoice-table__row table-dropdown show-in-mobile">
                                                <Dropdown.Toggle variant="success" id="dropdown-basic">
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu>
                                                    <Dropdown.Item onClick={() =>  handleCopy(invoice)}>Copy</Dropdown.Item>
                                                    <Dropdown.Item onClick={() =>  { setInvoice(invoice); setInvoiceAction(INVOICE_ACTIONS.EDIT_INVOICE)}}>Edit</Dropdown.Item>
                                                    <Dropdown.Item onClick={() =>  dispatch(removeInvoice(invoice.id))}>Delete</Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    :
                        <div className="no-invoice invoice-table">No Invoice Found</div>
                }
                </>
            }
            { invoice && <InvoiceForm {...invoice} key={invoiceAction} invoiceAction={invoiceAction} setInvoice={setInvoice} /> }
        </div>
    )
}