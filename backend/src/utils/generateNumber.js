import PurchaseOrder from '../models/PurchaseOrder.js';
import Invoice from '../models/Invoice.js';
import RFQ from '../models/RFQ.js';

const getFormattedDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}${month}`;
};

export const generatePONumber = async () => {
  const prefix = `PO-${getFormattedDate()}`;
  const lastPO = await PurchaseOrder.findOne({ poNumber: new RegExp(`^${prefix}`) })
    .sort({ poNumber: -1 })
    .select('poNumber');

  if (lastPO) {
    const lastNumber = parseInt(lastPO.poNumber.split('-')[2], 10);
    return `${prefix}-${String(lastNumber + 1).padStart(4, '0')}`;
  }
  return `${prefix}-0001`;
};

export const generateInvoiceNumber = async () => {
  const prefix = `INV-${getFormattedDate()}`;
  const lastInvoice = await Invoice.findOne({ invoiceNumber: new RegExp(`^${prefix}`) })
    .sort({ invoiceNumber: -1 })
    .select('invoiceNumber');

  if (lastInvoice) {
    const lastNumber = parseInt(lastInvoice.invoiceNumber.split('-')[2], 10);
    return `${prefix}-${String(lastNumber + 1).padStart(4, '0')}`;
  }
  return `${prefix}-0001`;
};

export const generateRFQNumber = async () => {
  const prefix = `RFQ-${getFormattedDate()}`;
  const lastRFQ = await RFQ.findOne({ rfqNumber: new RegExp(`^${prefix}`) })
    .sort({ rfqNumber: -1 })
    .select('rfqNumber');

  if (lastRFQ) {
    const lastNumber = parseInt(lastRFQ.rfqNumber.split('-')[2], 10);
    return `${prefix}-${String(lastNumber + 1).padStart(4, '0')}`;
  }
  return `${prefix}-0001`;
};
