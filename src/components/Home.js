import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from 'react-bootstrap/Button';

import InvoiceForm from "./InvoiceForm";

export default function Home() {
    const [invoice, setInvoice] = useState(null)

    const invoiceList = useSelector(store => store.invoice.invoiceList)

    return (
        <div>
            <Button variant="primary" type="submit" className="d-block" onClick={() => setInvoice(-1)}>Create a New Invoice</Button>

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
                    </tr>
                </thead>
                <tbody>
                    {invoiceList.map((invoice) => {
                        return (
                            <tr key={invoice.id}>
                                <td class="invoice-table__row invoice-table__row--active">{invoice.info.invoiceNumber}</td>
                                <td class="invoice-table__row"> {invoice.info.billFrom}</td>
                                <td class="invoice-table__row invoice-table__row--center-align">{invoice.info.billTo}</td>
                                <td class="invoice-table__row invoice-table__row--right-align">{invoice.info.dateOfIssue}</td>
                                <td class="invoice-table__row invoice-table__row--right-align">{invoice.info.total}</td>
                                <td class="invoice-table__row invoice-table__row--right-align" onClick={() =>  setInvoice(invoice)}><Button variant="primary" type="submit" className="d-block w-100">Edit</Button></td>
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