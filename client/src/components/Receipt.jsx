import { QRCodeSVG } from 'qrcode.react';
import logo from '../assets/logo.png';

export default function Receipt({ sale }) {
  if (!sale) return null;

  const issueDateObj = sale.createdAt ? new Date(sale.createdAt) : new Date();

  // Format issue date
  const issueDate = issueDateObj.toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Calculate Expiration Date (1 Year from Printed / Issue Date)
  const expiryDateObj = new Date(issueDateObj);
  expiryDateObj.setFullYear(expiryDateObj.getFullYear() + 1);

  const expiryDate = expiryDateObj.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <div className="p-2 sm:p-4 bg-slate-100 flex justify-center">
      {/* CSS Rules to Guarantee Single-Page Thermal Printing */}
      <style>
        {`
          @media print {
            html, body {
              height: 100% !important;
              overflow: hidden !important;
              margin: 0 !important;
              padding: 0 !important;
            }

            body * {
              visibility: hidden !important;
            }
            
            #receipt-print, #receipt-print * {
              visibility: visible !important;
            }

            #receipt-print {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              max-width: 80mm !important;
              margin: 0 !important;
              padding: 4px !important;
              box-shadow: none !important;
              border: none !important;
              background: #fff !important;
              color: #000 !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }

            #receipt-print * {
              color: #000 !important;
              background-color: transparent !important;
              border-color: #000 !important;
            }

            @page {
              size: 80mm auto;
              margin: 0;
            }
          }
        `}
      </style>

      <div
        id="receipt-print"
        className="bg-white p-3 w-full max-w-[320px] mx-auto font-mono text-slate-800 text-[10px] leading-tight border border-slate-200 shadow-sm rounded-xl"
      >
        {/* Header Branding */}
        <div className="text-center border-b border-dashed border-slate-300 pb-2 mb-2">
          <img src={logo} alt="KNAX_250" className="w-8 h-8 mx-auto mb-1 object-contain" />
          <h2 className="font-extrabold text-[11px] uppercase tracking-tight">KNAX_250 TECHNOLOGY LTD</h2>
          <p className="text-[8.5px] text-slate-500 mt-0.5">Athene Building, Kigali</p>
          <p className="text-[8.5px] text-slate-500">TIN: 122406487 | Tel: +250 782 562 906</p>
          <div className="inline-block bg-indigo-50 border border-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-extrabold text-[9px] mt-1.5 uppercase tracking-wider">
            Warranty Certificate
          </div>
        </div>

        {/* Certificate Metadata */}
        <div className="space-y-0.5 mb-2 text-[9px] text-slate-600">
          <div className="flex justify-between">
            <span>Cert / Ref No:</span>
            <span className="font-bold text-slate-800">{sale.receiptNumber}</span>
          </div>
          <div className="flex justify-between">
            <span>Date Issued:</span>
            <span>{issueDate}</span>
          </div>
          <div className="flex justify-between text-indigo-700 font-bold">
            <span>Valid Until:</span>
            <span>{expiryDate}</span>
          </div>
          <div className="flex justify-between">
            <span>Printed & Verified By:</span>
            <span className="font-medium text-slate-800">{sale.soldBy?.name || 'N/A'}</span>
          </div>
        </div>

        {/* Client Credentials */}
        <div className="border-t border-dashed border-slate-300 pt-1.5 mb-2 bg-indigo-50/50 p-1.5 rounded-lg">
          <p className="text-[8.5px] font-bold text-indigo-700 uppercase mb-0.5">Client Credentials</p>
          <div className="space-y-0.5 text-[9px] text-slate-600">
            <div className="flex justify-between">
              <span>Name:</span>
              <span className="font-bold text-slate-800">{sale.clientName || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span>Phone:</span>
              <span className="font-bold text-slate-800">{sale.clientPhone || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span>Location:</span>
              <span className="font-bold text-slate-800">{sale.clientLocation || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Covered Items Table */}
        <div className="border-t border-dashed border-slate-300 pt-1.5 mb-1.5">
          <p className="text-[8.5px] font-bold text-slate-400 uppercase mb-0.5">Covered Hardware</p>
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="text-[8.5px] text-slate-400 border-b border-slate-200 uppercase">
                <th className="pb-0.5 text-left font-bold w-[38%]">Item</th>
                <th className="pb-0.5 text-center font-bold w-[30%]">Serial No.</th>
                <th className="pb-0.5 text-center font-bold w-[12%]">Qty</th>
                <th className="pb-0.5 text-right font-bold w-[20%]">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sale.itemsSold.map((item, i) => (
                <tr key={i} className="text-[9px]">
                  <td className="py-1 pr-1 break-words font-medium text-slate-800">
                    {item.title}
                  </td>
                  <td className="py-1 text-center text-slate-700 font-bold text-[8.5px] break-all">
                    {item.serialNumber || '-'}
                  </td>
                  <td className="py-1 text-center font-bold">{item.qty}</td>
                  <td className="py-1 text-right font-semibold">
                    {item.sellingPriceRWF.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total & Payment Method */}
        <div className="border-t border-dashed border-slate-300 pt-1.5 mb-1.5 space-y-0.5">
          <div className="flex justify-between items-center text-[11px] font-black text-slate-900">
            <span>TOTAL VALUE</span>
            <span>{sale.totalAmountRWF.toLocaleString()} RWF</span>
          </div>
          <div className="flex justify-between text-[9px] text-slate-500">
            <span>Payment Method:</span>
            <span className="font-bold text-slate-700">{sale.paymentMethod}</span>
          </div>
        </div>

        {/* Warranty Terms & Exclusions Notice */}
        <div className="border-t border-dashed border-slate-300 pt-1.5 mb-2 bg-slate-50 p-1.5 rounded-lg text-[8px] text-slate-600 space-y-0.5">
          <p className="font-bold text-slate-800 uppercase text-[8.5px]">Warranty Terms & Exclusions:</p>
          <p>• <strong>Standard Warranty:</strong> Valid for 1 year (Expires: {expiryDate}).</p>
          <p>• <strong>Battery Warranty:</strong> Covered for <u>1 week only</u> from date of purchase.</p>
          <p className="text-rose-600 font-bold">• NO WARRANTY on Screen, Keyboard, or Motherboard.</p>
          <p className="text-rose-600 font-bold">• REFUNDS ARE NOT APPLICABLE.</p>
          <p>• Valid only with matching serial numbers and intact seals.</p>
        </div>

        {/* Signature & Stamp Section */}
        <div className="border-t border-dashed border-slate-300 pt-2 mb-2 grid grid-cols-2 gap-2 text-[8px] text-slate-500">
         
          <div className="text-center pt-5 border-t border-slate-300">
            <p className="font-bold text-slate-700">Stamp / Signature</p>
          </div>
        </div>

        {/* QR Code & Verification Footer */}
        <div className="text-center border-t border-dashed border-slate-300 pt-2 space-y-1">
          <div className="p-1 bg-slate-50 inline-block rounded-lg border border-slate-100">
            <QRCodeSVG value={sale.receiptNumber || 'KNAX-POS'} size={44} className="mx-auto" />
          </div>
          <p className="text-[8.5px] font-bold text-slate-700">Scan to Verify Authenticity</p>
          <p className="text-[8px] text-slate-400">Murakoze / Thank you for choosing KNAX_250</p>
        </div>
      </div>
    </div>
  );
}