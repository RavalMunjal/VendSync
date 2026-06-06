import Invoice from '../models/Invoice.js';
import PurchaseOrder from '../models/PurchaseOrder.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';
import { generateInvoiceNumber } from '../utils/generateNumber.js';
import { logActivity } from '../utils/activityLogger.js';
import { generateInvoicePDF } from '../utils/pdfGenerator.js';
import { sendInvoiceEmail } from '../utils/emailService.js';

export const getInvoices = async (req, res) => {
  const { status, vendor, page = 1, limit = 10 } = req.query;
  const query = {};

  if (status) query.status = status;
  if (vendor) query.vendor = vendor;

  // Vendors can only see their own invoices
  if (req.user.role === 'vendor') {
    query.vendor = req.user._id;
  }

  const invoices = await Invoice.find(query)
    .populate('vendor', 'name email')
    .populate('purchaseOrder', 'poNumber')
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const total = await Invoice.countDocuments(query);

  sendSuccess(res, { invoices, total, page: parseInt(page), pages: Math.ceil(total / limit) }, 'Invoices fetched');
};

export const createInvoice = async (req, res) => {
  const { purchaseOrderId } = req.body;

  const po = await PurchaseOrder.findById(purchaseOrderId).populate('vendor');
  if (!po) return sendError(res, 'Purchase Order not found', 404);

  if (po.status !== 'completed' && po.status !== 'acknowledged') {
    return sendError(res, 'Purchase order must be acknowledged or completed to generate invoice', 400);
  }

  const existingInvoice = await Invoice.findOne({ purchaseOrder: purchaseOrderId });
  if (existingInvoice) {
    return sendError(res, 'Invoice already exists for this PO', 400);
  }

  const invoiceNumber = await generateInvoiceNumber();

  // Due date is 30 days from creation by default
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 30);

  const invoice = await Invoice.create({
    invoiceNumber,
    purchaseOrder: po._id,
    vendor: po.vendor._id,
    items: po.items,
    subtotal: po.subtotal,
    gstPercent: po.gstPercent,
    gstAmount: po.gstAmount,
    grandTotal: po.grandTotal,
    dueDate,
    createdBy: req.user._id
  });

  await logActivity({
    action: 'CREATE_INVOICE',
    performedBy: req.user._id,
    performedByName: req.user.name,
    targetModel: 'Invoice',
    targetId: invoice._id,
    targetLabel: invoice.invoiceNumber,
    req
  });

  sendSuccess(res, invoice, 'Invoice generated successfully', 201);
};

export const getInvoiceById = async (req, res) => {
  const invoice = await Invoice.findById(req.params.id)
    .populate('vendor', 'name email phone address')
    .populate('purchaseOrder', 'poNumber')
    .populate('createdBy', 'name');

  if (!invoice) return sendError(res, 'Invoice not found', 404);

  if (req.user.role === 'vendor' && invoice.vendor._id.toString() !== req.user._id.toString()) {
    return sendError(res, 'Not authorized', 403);
  }

  sendSuccess(res, invoice, 'Invoice fetched');
};

export const sendInvoice = async (req, res) => {
  const invoice = await Invoice.findById(req.params.id)
    .populate('vendor', 'name email address phone')
    .populate('purchaseOrder', 'poNumber');

  if (!invoice) return sendError(res, 'Invoice not found', 404);

  if (invoice.status === 'sent' || invoice.status === 'paid') {
    return sendError(res, 'Invoice has already been sent or paid', 400);
  }

  // Generate PDF (we just use the generator for future attachments, or just send a summary email)
  let invoiceHtml = `
    <table border="1" cellpadding="5" cellspacing="0">
      <tr>
        <th>Item</th>
        <th>Qty</th>
        <th>Price</th>
        <th>Total</th>
      </tr>
      ${invoice.items.map(item => `
        <tr>
          <td>${item.product}</td>
          <td>${item.qty}</td>
          <td>$${item.unitPrice}</td>
          <td>$${item.total}</td>
        </tr>
      `).join('')}
    </table>
    <br/>
    <p>Subtotal: $${invoice.subtotal}</p>
    <p>GST: $${invoice.gstAmount}</p>
    <h4>Grand Total: $${invoice.grandTotal}</h4>
  `;

  await sendInvoiceEmail({
    to: invoice.vendor.email,
    vendorName: invoice.vendor.name,
    invoiceNumber: invoice.invoiceNumber,
    grandTotal: invoice.grandTotal,
    invoiceHtml
  });

  invoice.status = 'sent';
  invoice.sentAt = new Date();
  await invoice.save();

  await logActivity({
    action: 'SEND_INVOICE',
    performedBy: req.user._id,
    performedByName: req.user.name,
    targetModel: 'Invoice',
    targetId: invoice._id,
    targetLabel: invoice.invoiceNumber,
    req
  });

  sendSuccess(res, invoice, 'Invoice sent to vendor successfully');
};

export const markInvoicePaid = async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) return sendError(res, 'Invoice not found', 404);

  invoice.status = 'paid';
  invoice.paidAt = new Date();
  await invoice.save();

  await logActivity({
    action: 'MARK_INVOICE_PAID',
    performedBy: req.user._id,
    performedByName: req.user.name,
    targetModel: 'Invoice',
    targetId: invoice._id,
    targetLabel: invoice.invoiceNumber,
    req
  });

  sendSuccess(res, invoice, 'Invoice marked as paid');
};

export const downloadInvoicePDF = async (req, res) => {
  const invoice = await Invoice.findById(req.params.id)
    .populate('vendor', 'name email phone address')
    .populate('purchaseOrder', 'poNumber');

  if (!invoice) return sendError(res, 'Invoice not found', 404);

  if (req.user.role === 'vendor' && invoice.vendor._id.toString() !== req.user._id.toString()) {
    return sendError(res, 'Not authorized', 403);
  }

  try {
    const pdfBuffer = await generateInvoicePDF(invoice);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=${invoice.invoiceNumber}.pdf`,
      'Content-Length': pdfBuffer.length
    });
    res.send(pdfBuffer);
  } catch (error) {
    sendError(res, 'Error generating PDF', 500);
  }
};
