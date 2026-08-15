import React, { useState, useEffect } from 'react';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { getAdminReportData, exportReportCsvUrl } from '../services/api';
import { FileSpreadsheet, Download, FileText, CreditCard, Users } from 'lucide-react';

const Reports = () => {
  useEffect(() => {
    document.title = 'CSC Admin | Exportable Business Reports';
  }, []);

  const [activeTab, setActiveTab] = useState('applications');
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReport = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await getAdminReportData(activeTab);
      if (res && res.success) {
        setReportData(res.data || []);
      } else {
        setError(res.message || 'Failed to generate report.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error generating report data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [activeTab]);

  const handleExportCsv = () => {
    const token = localStorage.getItem('csc_token');
    const url = `${exportReportCsvUrl(activeTab)}?token=${token}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Exportable Business Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Generate server-side CSV audit reports for Applications, Payments, and Registered Customers.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="btn-primary text-xs py-2.5 px-5 inline-flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV Report</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab('applications')}
          className={`py-2.5 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${activeTab === 'applications' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Applications Report
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`py-2.5 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${activeTab === 'payments' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Payment Transactions Report
        </button>

        <button
          onClick={() => setActiveTab('customers')}
          className={`py-2.5 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${activeTab === 'customers' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Customer Roster Report
        </button>
      </div>

      {error && <Alert type="error" title="Error">{error}</Alert>}

      {loading ? (
        <Loading message="Compiling report data..." />
      ) : reportData.length === 0 ? (
        <EmptyState icon={FileSpreadsheet} title="No Report Data" description="No database records found for this report category." />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-4 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                {activeTab === 'applications' && (
                  <tr>
                    <th className="p-3">Ref ID</th>
                    <th className="p-3">Applicant Name</th>
                    <th className="p-3">Mobile</th>
                    <th className="p-3">Service Title</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Payment</th>
                    <th className="p-3">Date</th>
                  </tr>
                )}
                {activeTab === 'payments' && (
                  <tr>
                    <th className="p-3">Transaction ID</th>
                    <th className="p-3">App Ref ID</th>
                    <th className="p-3">Applicant</th>
                    <th className="p-3">Service</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Paid Date</th>
                  </tr>
                )}
                {activeTab === 'customers' && (
                  <tr>
                    <th className="p-3">Customer Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Mobile</th>
                    <th className="p-3">Total Apps</th>
                    <th className="p-3">Registered Date</th>
                  </tr>
                )}
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {reportData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    {activeTab === 'applications' && (
                      <>
                        <td className="p-3 font-mono font-bold text-slate-900">{row.applicationId}</td>
                        <td className="p-3 font-bold text-slate-800">{row.applicantName}</td>
                        <td className="p-3 font-mono">{row.mobile}</td>
                        <td className="p-3">{row.serviceTitle}</td>
                        <td className="p-3"><span className="px-2 py-0.5 rounded bg-slate-100 font-bold text-[10px] uppercase">{row.status}</span></td>
                        <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px] uppercase">{row.paymentStatus}</span></td>
                        <td className="p-3 text-slate-500">{row.createdAt}</td>
                      </>
                    )}
                    {activeTab === 'payments' && (
                      <>
                        <td className="p-3 font-mono font-bold text-slate-900">{row.transactionId}</td>
                        <td className="p-3 font-mono text-indigo-600">{row.applicationId}</td>
                        <td className="p-3 font-bold text-slate-800">{row.applicantName}</td>
                        <td className="p-3">{row.serviceTitle}</td>
                        <td className="p-3 font-mono font-bold text-slate-900">₹{row.amount}</td>
                        <td className="p-3 text-slate-500">{row.paidAt}</td>
                      </>
                    )}
                    {activeTab === 'customers' && (
                      <>
                        <td className="p-3 font-bold text-slate-900">{row.customerName}</td>
                        <td className="p-3 text-slate-600">{row.email}</td>
                        <td className="p-3 font-mono">{row.mobile}</td>
                        <td className="p-3 font-mono font-bold text-indigo-600">{row.totalApplications}</td>
                        <td className="p-3 text-slate-500">{row.registeredAt}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default Reports;
