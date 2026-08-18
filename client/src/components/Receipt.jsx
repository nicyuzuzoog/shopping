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
    <div className="p-2 sm:p-4 bg-slate-50 flex justify-center">
      {/* Thermal Printer Print Styles */}
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            #receipt-print, #receipt-print * {
              visibility: visible;
            }
            #receipt-print {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              max-width: 80mm;
              padding: 8px;
              box-shadow: none !important;
              border: none !important;
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
        className="bg-white p-4 w-full max-w-[320px] mx-auto font-mono text-slate-800 text-[11px] leading-tight border border-slate-100 shadow-sm rounded-xl"
      >
        {/* Header Branding */}
        <div className="text-center border-b border-dashed border-slate-300 pb-3 mb-3">
          <img src={logo} alt="KNAX_250" className="w-10 h-10 mx-auto mb-1.5 object-contain" />
          <h2 className="font-extrabold text-xs uppercase tracking-tight">KNAX_250 TECHNOLOGY LTD</h2>
          <p className="text-[9px] text-slate-500 mt-0.5">Athene Building, Kigali</p>
          <p className="text-[9px] text-slate-500">TIN: 122406487 | Tel: +250 782 562 906</p>
          <div className="inline-block bg-indigo-50 border border-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded font-extrabold text-[10px] mt-2 uppercase tracking-wider">
            Warranty Certificate
          </div>
        </div>

        {/* Certificate Metadata */}
        <div className="space-y-1 mb-3 text-[10px] text-slate-600">
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
            <span>Authorized Agent:</span>
            <span className="font-medium text-slate-800">{sale.soldBy?.name || 'N/A'}</span>
          </div>
        </div>

        {/* Covered Items Table */}
        <div className="border-t border-dashed border-slate-300 pt-2 mb-2">
          <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Covered Hardware</p>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[9px] text-slate-400 border-b border-slate-200 uppercase">
                <th className="pb-1 text-left font-bold">Item</th>
                <th className="pb-1 text-center font-bold">Serial No.</th>
                <th className="pb-1 text-center font-bold">Qty</th>
                <th className="pb-1 text-right font-bold">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sale.itemsSold.map((item, i) => (
                <tr key={i} className="text-[10px]">
                  <td className="py-1.5 pr-1 max-w-[110px] break-words font-medium text-slate-800">
                    {item.title}
                  </td>
                  <td className="py-1.5 text-center text-slate-700 font-bold text-[9px]">
                    {item.serialNumber || '-'}
                  </td>
                  <td className="py-1.5 text-center font-bold">{item.qty}</td>
                  <td className="py-1.5 text-right font-semibold">
                    {item.sellingPriceRWF.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total & Payment Method */}
        <div className="border-t border-dashed border-slate-300 pt-2 mb-2 space-y-1">
          <div className="flex justify-between items-center text-xs font-black text-slate-900 pt-1">
            <span>TOTAL VALUE</span>
            <span>{sale.totalAmountRWF.toLocaleString()} RWF</span>
          </div>
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Payment Method:</span>
            <span className="font-bold text-slate-700">{sale.paymentMethod}</span>
          </div>
        </div>

        {/* Warranty Terms & Exclusions Notice */}
        <div className="border-t border-dashed border-slate-300 pt-2 mb-3 bg-slate-50 p-2 rounded-lg text-[8.5px] text-slate-600 space-y-1">
          <p className="font-bold text-slate-800 uppercase">Warranty Terms & Exclusions:</p>
          <p>• <strong>Standard Warranty:</strong> Valid for 1 year (Expires: {expiryDate}).</p>
          <p>• <strong>Battery Warranty:</strong> Covered for <u>1 week only</u> from date of purchase.</p>
          <p className="text-rose-600 font-bold">• NO WARRANTY on Screen, Keyboard, or Motherboard.</p>
          <p className="text-rose-600 font-bold">• REFUNDS ARE NOT APPLICABLE.</p>
          <p>• Valid only with matching serial numbers and intact warranty seals.</p>
        </div>

        {/* QR Code & Verification Footer */}
        <div className="text-center border-t border-dashed border-slate-300 pt-3 space-y-1.5">
          <div className="p-1.5 bg-slate-50 inline-block rounded-lg border border-slate-100">
            <QRCodeSVG value={sale.receiptNumber || 'KNAX-POS'} size={58} className="mx-auto" />
          </div>
          <p className="text-[10px] font-bold text-slate-700">Scan to Verify Authenticity</p>
          <p className="text-[9px] text-slate-400">Murakoze / Thank you for choosing KNAX_250</p>
        </div>
      </div>
    </div>
  );
}