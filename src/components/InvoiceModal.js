import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Toast from 'react-bootstrap/Toast';
import Spinner from 'react-bootstrap/Spinner';

import { BiPaperPlane, BiCloudDownload } from "react-icons/bi";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf'
import { connect } from "react-redux";
import { addInvoice, updateInvoice } from "../store/invoiceStore";


class InvoiceModal extends React.Component {
  constructor(props) {
    super(props);
    this.state= {
      toast: {
        show: false,
        variant: '',
        text: '',
      },
      loader: false
    }
  }
  
  UpdateInvoice = () => {
    const isValidData = this.validateData()
    if(isValidData) {
      this.props.updateInvoice({
        id: this.props.id,
        info: this.props.info, 
        items: this.props.items,
        currency: this.props.currency,
        total: this.props.total,
        subtotal: this.props.subTotal, 
        taxAmmount: this.props.taxAmmount, 
        discountAmmount: this.props.discountAmmount,
        updateModal: this.props.updateModal,
      })
      this.setState({loader: true})

      setTimeout(() => {
        this.props.onComplete(null)
      }, 1000)

    } else {
      this.setState({
        toast: {
          show: true,
          variant: 'danger',
          text: 'Some error occured, possibly redundant invoice number or no invoice',
        }
      })
    }
  }

  validateData = () => {
    return !this.props.invoiceList.some(invoice => invoice.info.invoiceNumber === this.props.info.invoiceNumber) ?? this.props.info.invoiceNumber 
  }

  GenerateInvoice = () => {
    const isValidData = this.validateData()
    if(isValidData) {
      this.setState({
        toast: {
          show: true,
          variant: 'Success',
          text: 'Inovice Generated Successfully',
        }
      })
      this.props.addInvoice({
        info: this.props.info, 
        items: this.props.items,
        currency: this.props.currency,
        total: this.props.total,
        subtotal: this.props.subTotal, 
        taxAmmount: this.props.taxAmmount, 
        discountAmmount: this.props.discountAmmount,
        updateModal: this.props.updateModal,
      })
      this.setState({loader: true})

      setTimeout(() => {
        this.props.onComplete(null)
      }, 1000)
      // html2canvas(document.querySelector("#invoiceCapture")).then((canvas) => {
      //   const imgData = canvas.toDataURL('image/png', 1.0);
      //   const pdf = new jsPDF({
      //     orientation: 'portrait',
      //     unit: 'pt',
      //     format: [612, 792]
      //   });
      //   pdf.internal.scaleFactor = 1;
      //   const imgProps= pdf.getImageProperties(imgData);
      //   const pdfWidth = pdf.internal.pageSize.getWidth();
      //   const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      //   pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      //   pdf.save('invoice-001.pdf');
      // });
    } else {
      this.setState({
        toast: {
          show: true,
          variant: 'danger',
          text: 'Some error occured, possibly redundant invoice number or no invoice',
        }
      })
    }
  }

  render() {
    return(
      <div>
        
        <Modal show={this.props.showModal} onHide={this.props.closeModal} size="lg" centered>
          <Toast 
            bg={this.state.toast.variant.toLowerCase()}
            onClose={() => this.setState({toast:{...this.state.toast, show:false}})}
            show={this.state.toast.show}
            delay={3000}
            autohide
          >
            <Toast.Body>{this.state.toast.text}</Toast.Body>
          </Toast>
          {this.state.loader && <div className="spinner-wrapper"><Spinner  animation="border" /></div>}
          { !this.state.loader && 
            <>
            <div id="invoiceCapture">
              <div className="d-flex flex-row justify-content-between align-items-start bg-light w-100 p-4">
                <div className="w-100">
                  <h4 className="fw-bold my-2">{this.props.info.billFrom||'John Uberbacher'}</h4>
                  <h6 className="fw-bold text-secondary mb-1">
                    Invoice #: {this.props.info.invoiceNumber||''}
                  </h6>
                </div>
                <div className="text-end ms-4">
                  <h6 className="fw-bold mt-1 mb-2">Amount&nbsp;Due:</h6>
                  <h5 className="fw-bold text-secondary"> {this.props.currency} {this.props.total}</h5>
                </div>
              </div>
              <div className="p-4">
                <Row className="mb-4">
                  <Col md={4}>
                    <div className="fw-bold">Billed to:</div>
                    <div>{this.props.info.billTo||''}</div>
                    <div>{this.props.info.billToAddress||''}</div>
                    <div>{this.props.info.billToEmail||''}</div>
                  </Col>
                  <Col md={4}>
                    <div className="fw-bold">Billed From:</div>
                    <div>{this.props.info.billFrom||''}</div>
                    <div>{this.props.info.billFromAddress||''}</div>
                    <div>{this.props.info.billFromEmail||''}</div>
                  </Col>
                  <Col md={4}>
                    <div className="fw-bold mt-2">Date Of Issue:</div>
                    <div>{this.props.info.dateOfIssue||''}</div>
                  </Col>
                </Row>
                <Table className="mb-0">
                  <thead>
                    <tr>
                      <th>QTY</th>
                      <th>DESCRIPTION</th>
                      <th className="text-end">PRICE</th>
                      <th className="text-end">AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.props.items.map((item, i) => {
                      return (
                        <tr id={i} key={i}>
                          <td style={{width: '70px'}}>
                            {item.quantity}
                          </td>
                          <td>
                            {item.name} - {item.description}
                          </td>
                          <td className="text-end" style={{width: '100px'}}>{this.props.currency} {item.price}</td>
                          <td className="text-end" style={{width: '100px'}}>{this.props.currency} {item.price * item.quantity}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
                <Table>
                  <tbody>
                    <tr>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                    </tr>
                    <tr className="text-end">
                      <td></td>
                      <td className="fw-bold" style={{width: '100px'}}>SUBTOTAL</td>
                      <td className="text-end" style={{width: '100px'}}>{this.props.currency} {this.props.subTotal}</td>
                    </tr>
                    {this.props.taxAmmount != 0.00 &&
                      <tr className="text-end">
                        <td></td>
                        <td className="fw-bold" style={{width: '100px'}}>TAX</td>
                        <td className="text-end" style={{width: '100px'}}>{this.props.currency} {this.props.taxAmmount}</td>
                      </tr>
                    }
                    {this.props.discountAmmount != 0.00 &&
                      <tr className="text-end">
                        <td></td>
                        <td className="fw-bold" style={{width: '100px'}}>DISCOUNT</td>
                        <td className="text-end" style={{width: '100px'}}>{this.props.currency} {this.props.discountAmmount}</td>
                      </tr>
                    }
                    <tr className="text-end">
                      <td></td>
                      <td className="fw-bold" style={{width: '100px'}}>TOTAL</td>
                      <td className="text-end" style={{width: '100px'}}>{this.props.currency} {this.props.total}</td>
                    </tr>
                  </tbody>
                </Table>
                {this.props.info.notes &&
                  <div className="bg-light py-3 px-4 rounded">
                    {this.props.info.notes}
                  </div>}
              </div>
            </div>
            <div className="pb-4 px-4">
                <Row>
                  <Col md={6}>
                    {
                      this.props.updateModal && 
                      <Button variant="primary" className="d-block w-100" onClick={this.UpdateInvoice}>
                        <BiPaperPlane style={{width: '15px', height: '15px', marginTop: '-3px'}} className="me-2"/>Update the Invoice
                      </Button>
                    }
                    {
                      !this.props.updateModal && 
                      <Button variant="primary" className="d-block w-100" onClick={this.GenerateInvoice}>
                        <BiPaperPlane style={{width: '15px', height: '15px', marginTop: '-3px'}} className="me-2"/>Send Invoice
                      </Button>
                    }
                  </Col>
                  <Col md={6}>
                    <Button variant="outline-primary" className="d-block w-100 mt-3 mt-md-0" onClick={this.GenerateInvoice}>
                      <BiCloudDownload style={{width: '16px', height: '16px', marginTop: '-3px'}} className="me-2"/>
                      Download Copy
                    </Button>
                  </Col>
                </Row>
            </div>
            </>
        }
        </Modal>
        <hr className="mt-4 mb-3"/>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  invoiceList: state.invoice.invoiceList,
})
const mapDispatchToProps = { addInvoice, updateInvoice }

export default connect(mapStateToProps, mapDispatchToProps)(InvoiceModal);
