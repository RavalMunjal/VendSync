import nodemailer from 'nodemailer';
import 'dotenv/config';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendInvoiceEmail = async ({ to, vendorName, invoiceNumber, grandTotal, invoiceHtml }) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: `Invoice Generated: ${invoiceNumber}`,
      html: `
        <h3>Hello ${vendorName},</h3>
        <p>A new invoice <strong>${invoiceNumber}</strong> for the amount of <strong>$${grandTotal}</strong> has been generated.</p>
        <p>Please find the details below:</p>
        ${invoiceHtml || ''}
        <br/>
        <p>Regards,<br/>BidFlow Team</p>
      `
    });
  } catch (error) {
    console.error(`Email Error [sendInvoiceEmail]:`, error.message);
  }
};

export const sendRFQNotification = async ({ to, rfqTitle, deadline, vendorName }) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: `New RFQ Assigned: ${rfqTitle}`,
      html: `
        <h3>Hello ${vendorName},</h3>
        <p>You have been invited to submit a quotation for a new RFQ: <strong>${rfqTitle}</strong>.</p>
        <p>The deadline for submission is <strong>${new Date(deadline).toDateString()}</strong>.</p>
        <p>Please login to your BidFlow dashboard to review and submit your quote.</p>
        <br/>
        <p>Regards,<br/>BidFlow Team</p>
      `
    });
  } catch (error) {
    console.error(`Email Error [sendRFQNotification]:`, error.message);
  }
};

export const sendApprovalNotification = async ({ to, status, rfqTitle, remarks }) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: `Approval Status Update: ${status}`,
      html: `
        <h3>Quotation Approval Update</h3>
        <p>Your requested approval for RFQ <strong>${rfqTitle}</strong> has been <strong>${status}</strong>.</p>
        ${remarks ? `<p>Remarks: ${remarks}</p>` : ''}
        <br/>
        <p>Regards,<br/>BidFlow Team</p>
      `
    });
  } catch (error) {
    console.error(`Email Error [sendApprovalNotification]:`, error.message);
  }
};
