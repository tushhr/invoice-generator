import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from 'react-bootstrap/Button';

import { removeInvoice } from "../store/invoiceStore";
import InvoiceForm from "./InvoiceForm";

export default function Home() {
    const [invoice, setInvoice] = useState(null)
    const dispatch = useDispatch()

    const invoiceList = useSelector(store => store.invoice.invoiceList)

    return (
        <div>
            <div className="header">
                <Button variant="primary" type="submit" className="d-block" onClick={() => setInvoice(-1)}>Create a New Invoice</Button>
                {invoice && <Button variant="primary" type="submit" className="d-block" onClick={() => setInvoice(null)}>Home</Button>}
            </div>
            { !invoice && 
                <table class="invoice-table">
                <thead>
                    <tr>
                        <th class="invoice-table__col-head invoice-table__col-head--left-align">Invoice</th>
                        <th class="invoice-table__col-head invoice-table__col-head--left-align">From</th>
                        <th class="invoice-table__col-head">To</th>
                        <th class="invoice-table__col-head invoice-table__col-head--right-align">Date</th>
                        <th class="invoice-table__col-head invoice-table__col-head--right-align">Total Amount</th>
                        <th class="invoice-table__col-head invoice-table__col-head--right-align"></th>
                        <th class="invoice-table__col-head invoice-table__col-head--right-align"></th>
                    </tr>
                </thead>
                <tbody>
                    {invoiceList.map((invoice) => {
                        return (
                            <tr key={invoice.id}>
                                <td class="invoice-table__row invoice-table__row--active">{invoice.info.invoiceNumber}</td>
                                <td class="invoice-table__row"> {invoice.info.billFrom}</td>
                                <td class="invoice-table__row">{invoice.info.billTo}</td>
                                <td class="invoice-table__row">{invoice.info.dateOfIssue}</td>
                                <td class="invoice-table__row">{invoice.info.total}</td>
                                <td class="invoice-table__row" onClick={() =>  setInvoice(invoice)}><Button variant="primary" type="submit" className="d-block w-100">Edit</Button></td>
                                <td class="invoice-table__row" onClick={() =>  dispatch(removeInvoice(invoice.id))}><Button variant="primary" type="submit" className="d-block w-100">Delete</Button></td>
                            </tr>
                        )
                    })}
                </tbody>
                </table>
            }
            {/* If invoice is -1 i.e we are creating a new Invoice Form from the Button "Create New Invoice" */}
            {invoice === -1 ? <InvoiceForm /> : invoice && <InvoiceForm {...invoice} updateInvoice = {true} />}
        </div>
    )
}