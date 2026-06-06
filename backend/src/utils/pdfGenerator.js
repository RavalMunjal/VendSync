import PDFDocument from 'pdfkit';

export const generateInvoicePDF = (invoice) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      let buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Header
      doc.fillColor('#444444')
        .fontSize(20)
        .text('INVOICE', 50, 57)
        .fontSize(10)
        .text(`Invoice Number: ${invoice.invoiceNumber}`, 200, 50, { align: 'right' })
        .text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`, 200, 65, { align: 'right' })
        .text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, 200, 80, { align: 'right' })
        .moveDown();

      // Bill To
      doc.fillColor('#000000')
        .fontSize(12)
        .text('Bill To:', 50, 130)
        .fontSize(10)
        .text(invoice.vendor.name, 50, 145)
        .text(invoice.vendor.address?.street || '', 50, 160)
        .text(`${invoice.vendor.address?.city || ''}, ${invoice.vendor.address?.state || ''} ${invoice.vendor.address?.pincode || ''}`, 50, 175)
        .text(invoice.vendor.email, 50, 190)
        .moveDown();

      // Items Table Header
      const tableTop = 250;
      doc.font('Helvetica-Bold');
      generateTableRow(doc, tableTop, 'Item', 'Qty', 'Unit Price', 'Total');
      generateHr(doc, tableTop + 20);
      doc.font('Helvetica');

      // Items
      let i = 0;
      invoice.items.forEach(item => {
        const position = tableTop + 30 + (i * 30);
        generateTableRow(
          doc,
          position,
          item.product,
          item.qty,
          `$${item.unitPrice.toFixed(2)}`,
          `$${item.total.toFixed(2)}`
        );
        generateHr(doc, position + 20);
        i++;
      });

      // Totals
      const subtotalPosition = tableTop + 30 + (invoice.items.length * 30) + 20;
      generateTableRow(doc, subtotalPosition, '', '', 'Subtotal', `$${invoice.subtotal.toFixed(2)}`);
      generateTableRow(doc, subtotalPosition + 20, '', '', `GST (${invoice.gstPercent}%)`, `$${invoice.gstAmount.toFixed(2)}`);
      
      doc.font('Helvetica-Bold');
      generateTableRow(doc, subtotalPosition + 40, '', '', 'Grand Total', `$${invoice.grandTotal.toFixed(2)}`);
      doc.font('Helvetica');

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

function generateTableRow(doc, y, item, qty, unitPrice, lineTotal) {
  doc.fontSize(10)
    .text(item, 50, y)
    .text(qty, 280, y, { width: 90, align: 'right' })
    .text(unitPrice, 370, y, { width: 90, align: 'right' })
    .text(lineTotal, 0, y, { align: 'right' });
}

function generateHr(doc, y) {
  doc.strokeColor('#aaaaaa')
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
}
