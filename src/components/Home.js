import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from 'react-bootstrap/Button';

import { removeInvoice, clearInvoiceList } from "../store/invoiceStore";
import { clearLocalStorage } from "../utils/localStorage";
import InvoiceForm from "./InvoiceForm";

export default function Home() {
    const invoiceListStore = useSelector(store => store.invoice.invoiceList)
    const [invoiceList, setInvoiceList] = useState(invoiceListStore)
    const [invoice, setInvoice] = useState(null)
    const [tableHeader, setTableHeader] = useState([
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
    ])

    const nameToKey = {
        'invoice': 'invoiceNumber',
        'from': 'billFrom',
        'to': 'billTo',
        'date': 'dateOfIssue',
        'total amount': 'total',
    }

    const dispatch = useDispatch()

    const sortByInt = (array, name) => {
        const key = nameToKey[name]
        const newInvoiceList = [...array].sort((a, b) =>  a.info[key] - b.info[key]);
        return newInvoiceList
    }

    const sortByString = (array, name) => {
        const key = nameToKey[name]
        const newInvoiceList = [...array].sort((a, b) => a.info[key].localeCompare(b.info[key]));
        return newInvoiceList;
    }

    const sortByDate = (array, name) => {
        const key = nameToKey[name]
        const newInvoiceList = [...array].sort((a, b) => new Date(a.info[key]) - new Date(b.info[key]));
        return newInvoiceList
    }

    const handleSorting = (index, sortOrder) => {
        const colHeader = tableHeader[index].title.toLowerCase()
        let newInvoiceList = invoiceList;

        if(colHeader === "invoice" || colHeader === "total amount") {
            newInvoiceList = sortByInt(invoiceList, colHeader)
        } else if(colHeader === "from" || colHeader === "to") {
            newInvoiceList = sortByString(invoiceList, colHeader)
        } else if(colHeader === "date") {
            newInvoiceList = sortByDate(invoiceList, colHeader)
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
                <Button variant="primary" type="submit" className="d-block" onClick={() => setInvoice(-1)}>Create a New Invoice</Button>
                {invoice && <Button variant="primary" type="submit" className="d-block" onClick={() => setInvoice(null)}>Home</Button>}
            </div>
            { !invoice && 
                <>
                {
                    invoiceList.length ? <table className="invoice-table">
                <thead>
                    <tr>
                        {tableHeader.map((header, index) => 
                            <th className="invoice-table__col-head invoice-table__col-head--left-align">
                                {header.title}
                                <i className={"fa " + header.icon} onClick={() => handleSortingClick(index)}></i>
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {invoiceList.map((invoice, index) => {
                        return (
                            <tr key={invoice.id}>
                                <td className="invoice-table__row invoice-table__row--active">{invoice.info.invoiceNumber}</td>
                                <td className="invoice-table__row"> {invoice.info.billFrom}</td>
                                <td className="invoice-table__row">{invoice.info.billTo}</td>
                                <td className="invoice-table__row">{invoice.info.dateOfIssue}</td>
                                <td className="invoice-table__row">{invoice.currency + invoice.info.total}</td>
                                <td className="invoice-table__row" onClick={() =>  setInvoice(invoice)}><Button variant="primary" type="submit" className="d-block w-100">Edit</Button></td>
                                <td className="invoice-table__row" onClick={() =>  dispatch(removeInvoice(invoice.id))}><Button variant="primary" type="submit" className="d-block w-100">Delete</Button></td>
                                <td className="invoice-table__row" onClick={() =>  handleCopy(invoice)}><Button variant="primary" type="submit" className="d-block w-100">Copy</Button></td>
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
            {/* If invoice is -1 i.e we are creating a new Invoice Form from the Button "Create New Invoice" */}
            {invoice === -1 ? <InvoiceForm key="newInvoice" setInvoice={setInvoice} /> : invoice && <InvoiceForm {...invoice} key="editInvoice" updateInvoice = {true} setInvoice={setInvoice} />}
        </div>
    )
}