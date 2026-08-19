import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PortalHeader } from '../../components/portal/PortalHeader';
import { Sidebar } from '../../components/portal/Sidebar';
import { FloatingHelpdesk } from '../../components/portal/FloatingHelpdesk';
import { CreditCard, Download, Printer, CheckCircle2, AlertCircle, ShieldCheck, Send, Upload } from 'lucide-react';

export const StudentFees = () => {
  const { currentUser, updateProfile } = useAuth();
  const { fees, recordFeePayment, submitHelpdeskTicket } = useData();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Pay Now Modal State
  const [showPayModal, setShowPayModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI' | 'CARD' | 'NETBANKING'
  const [selectedFeeCategory, setSelectedFeeCategory] = useState('Tuition Fee - Semester 6');
  const [paymentAmount, setPaymentAmount] = useState(15000);
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [bankName, setBankName] = useState('HDFC Bank');

  // Receipt Modal State
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Payment Issue Modal State
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [issueSubmitted, setIssueSubmitted] = useState(false);
  const [issueForm, setIssueForm] = useState({
    transactionId: '',
    date: '',
    amount: '',
    issueType: 'Money Deducted but Status Pending',
    description: ''
  });

  const studentPendingBalance = currentUser?.pendingFees !== undefined ? Number(currentUser.pendingFees) : 0;
  const semName = currentUser?.semester || 'Semester 1';
  const isNewStudent = currentUser?.isNewUser || (currentUser?.studentId?.startsWith('STU-') && !['STU-2024-001', 'STU-CSE-101'].includes(currentUser?.studentId));

  // Fee Breakdown List State
  const [feeBreakdown, setFeeBreakdown] = useState(() => {
    if (isNewStudent) {
      return [
        { category: `Tuition Fee - ${semName}`, total: 85000, paid: 0, pending: 85000, dueDate: "2026-09-15", status: "Pending" },
        { category: "Examination & Evaluation Fee", total: 10000, paid: 0, pending: 10000, dueDate: "2026-09-15", status: "Pending" },
        { category: "Central Library & IEEE E-Journal Fee", total: 5000, paid: 0, pending: 5000, dueDate: "2026-09-15", status: "Pending" },
        { category: "Computing & Laboratory Fee", total: 10000, paid: 0, pending: 10000, dueDate: "2026-09-15", status: "Pending" },
        { category: "Student Welfare & Sports Complex Fee", total: 5000, paid: 0, pending: 5000, dueDate: "2026-09-15", status: "Pending" }
      ];
    }
    return [
      { category: `Tuition Fee - ${semName}`, total: 100000, paid: 100000 - studentPendingBalance, pending: studentPendingBalance, dueDate: "2026-08-15", status: studentPendingBalance === 0 ? "Paid" : "Partially Paid" },
      { category: "Examination & Evaluation Fee", total: 15000, paid: 15000, pending: 0, dueDate: "2026-07-30", status: "Paid" },
      { category: "Central Library & IEEE E-Journal Fee", total: 10000, paid: 10000, pending: 0, dueDate: "2026-07-30", status: "Paid" },
      { category: "NVIDIA Supercomputing Laboratory Fee", total: 15000, paid: 15000, pending: 0, dueDate: "2026-07-30", status: "Paid" },
      { category: "Student Welfare & Sports Complex Fee", total: 10000, paid: 10000, pending: 0, dueDate: "2026-07-30", status: "Paid" }
    ];
  });

  // Sync feeBreakdown when pendingFees updates
  useEffect(() => {
    setFeeBreakdown(prev => prev.map(f => {
      if (f.category.includes("Tuition")) {
        return {
          ...f,
          paid: Math.max(0, f.total - studentPendingBalance),
          pending: studentPendingBalance,
          status: studentPendingBalance === 0 ? "Paid" : "Partially Paid"
        };
      }
      return f;
    }));
  }, [studentPendingBalance]);

  // Payment History List State
  const studentTxns = (fees || []).filter(f => f.studentId === currentUser?.studentId || f.studentId === currentUser?.username || f.studentId === currentUser?.id);

  const [paymentHistory, setPaymentHistory] = useState(() => {
    if (studentTxns.length > 0) {
      return studentTxns.map(f => ({
        id: f.txnId || f.id,
        date: f.date || '2026-08-15',
        feeType: f.feeCategory || f.feeType || 'Tuition Fee',
        amount: Number(f.amount || 0),
        method: f.method || 'Online Payment',
        status: f.status || 'Success'
      }));
    }
    if (isNewStudent) {
      return [];
    }
    return [
      { id: "TXN-2026-88912", date: "2026-07-28", feeType: `Tuition Fee - ${semName} (Instalment 1)`, amount: 85000, method: "UPI (Google Pay)", status: "Success" },
      { id: "TXN-2026-88904", date: "2026-07-25", feeType: "Examination & Evaluation Fee", amount: 15000, method: "Net Banking (HDFC)", status: "Success" },
      { id: "TXN-2026-88891", date: "2026-07-20", feeType: "NVIDIA Laboratory Fee", amount: 15000, method: "Credit Card (HDFC)", status: "Success" }
    ];
  });

  // Payment Issues List State
  const [reportedIssues, setReportedIssues] = useState(() => {
    if (isNewStudent) return [];
    return [
      { id: "PAY-ISSUE-101", txnId: "TXN-2026-88904", date: "2026-07-25", amount: 15000, issueType: "Duplicate Charge Verification", status: "Resolved" }
    ];
  });

  if (!currentUser) return null;

  const studentName = currentUser.name || 'Student';
  const studentCode = currentUser.studentId || currentUser.username || currentUser.id || 'STU-2026-001';
  const regNumber = currentUser.registerNumber || currentUser.rollNo || `REG-2026-${studentCode.replace('STU-', '')}`;
  const course = currentUser.course || `${currentUser.department || 'Engineering'} Program`;

  // Overall Financial Totals
  const totalFees = feeBreakdown.reduce((sum, item) => sum + item.total, 0);
  const totalPaid = feeBreakdown.reduce((sum, item) => sum + item.paid, 0);
  const totalPending = feeBreakdown.reduce((sum, item) => sum + item.pending, 0);

  const handlePayNowSubmit = (e) => {
    e.preventDefault();
    const newTxnId = `TXN-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const today = new Date().toISOString().split('T')[0];
    const methodStr = paymentMethod === 'UPI' ? `UPI (${upiId || 'gpay@upi'})` : paymentMethod === 'CARD' ? `Credit Card (*${cardNumber.slice(-4) || '8891'})` : `Net Banking (${bankName})`;

    // Record fee in global context & database
    recordFeePayment({
      txnId: newTxnId,
      studentId: studentCode,
      amount: paymentAmount,
      feeCategory: selectedFeeCategory,
      method: methodStr
    }, currentUser);

    if (updateProfile) {
      updateProfile({ pendingFees: Math.max(0, studentPendingBalance - paymentAmount) });
    }

    // Add to Payment History
    const newRecord = {
      id: newTxnId,
      date: today,
      feeType: selectedFeeCategory,
      amount: paymentAmount,
      method: methodStr,
      status: 'Success'
    };

    setPaymentHistory(prev => [newRecord, ...prev]);
    setPaymentSuccess(true);

    setTimeout(() => {
      setPaymentSuccess(false);
      setShowPayModal(false);
    }, 2000);
  };

  const handleIssueSubmit = (e) => {
    e.preventDefault();
    const newIssue = {
      id: `PAY-ISSUE-${Math.floor(100 + Math.random() * 900)}`,
      txnId: issueForm.transactionId,
      date: issueForm.date,
      amount: Number(issueForm.amount),
      issueType: issueForm.issueType,
      status: 'Pending'
    };

    if (submitHelpdeskTicket) {
      submitHelpdeskTicket({
        category: 'Fee & Billing',
        subject: `Payment Issue: ${issueForm.issueType} (Txn: ${issueForm.transactionId})`,
        description: `Txn ID: ${issueForm.transactionId}, Amount: ₹${issueForm.amount}, Date: ${issueForm.date}. Details: ${issueForm.description}`,
        priority: 'High',
        targetRole: 'ADMIN'
      }, currentUser);
    }

    setReportedIssues(prev => [newIssue, ...prev]);
    setShowIssueModal(false);
    setIssueSubmitted(true);
    setTimeout(() => setIssueSubmitted(false), 5000);
    setIssueForm({ transactionId: '', date: '', amount: '', issueType: 'Money Deducted but Status Pending', description: '' });
  };

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans relative">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <PortalHeader setMobileOpen={setMobileOpen} />

        <main className="p-4 sm:p-6 space-y-6 flex-1 overflow-y-auto">
          
          {/* Header Banner */}
          <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-navy text-xs font-sans font-bold uppercase tracking-widest bg-gold/20 px-3 py-1 rounded border border-gold/30">
                  FINANCIAL SERVICES & ACCOUNTS
                </span>
                <h1 className="text-2xl sm:text-3xl font-sans font-bold text-navy mt-2 tracking-tight">
                  Fee Invoices, Receipts & Payment Portal
                </h1>
                <p className="font-serif text-slate-500 text-xs sm:text-sm mt-1">
                  Institutional fee breakdown, instant online payment gateway, and downloadable official receipts.
                </p>
              </div>

              <button
                onClick={() => { setShowPayModal(true); setPaymentSuccess(false); }}
                className="inline-flex items-center justify-center bg-gold hover:bg-gold-hover text-navy-dark font-sans font-bold text-xs px-6 py-3.5 rounded-xl shadow-lg transition-all uppercase tracking-wider flex-shrink-0"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Pay Pending Fees Now
              </button>
            </div>
          </div>

          {issueSubmitted && (
            <div className="p-4 bg-emerald-600 text-white rounded-xl shadow-lg flex items-center space-x-2 font-sans text-xs font-bold">
              <CheckCircle2 className="w-5 h-5" />
              <span>Payment Issue reported to Finance Accounts Office! Ticket tracked below.</span>
            </div>
          )}

          {/* FEE OVERVIEW CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 text-center">
              <span className="text-[10px] font-sans font-bold text-slate-400 uppercase block">TOTAL ANNUAL FEES</span>
              <span className="text-xl sm:text-2xl font-num font-bold text-navy block mt-1">₹ {totalFees.toLocaleString()}</span>
              <span className="text-[10px] font-serif text-slate-500">Academic Year 2026</span>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 text-center">
              <span className="text-[10px] font-sans font-bold text-slate-400 uppercase block">TOTAL PAID</span>
              <span className="text-xl sm:text-2xl font-num font-bold text-emerald-600 block mt-1">₹ {totalPaid.toLocaleString()}</span>
              <span className="text-[10px] font-serif text-emerald-700 font-bold">Received & Stamped</span>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 text-center">
              <span className="text-[10px] font-sans font-bold text-slate-400 uppercase block">PENDING DUES</span>
              <span className="text-xl sm:text-2xl font-num font-bold text-amber-600 block mt-1">₹ {totalPending.toLocaleString()}</span>
              <span className="text-[10px] font-serif text-amber-700 font-semibold">Due by 15 Aug</span>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 text-center">
              <span className="text-[10px] font-sans font-bold text-slate-400 uppercase block">NEXT DUE DATE</span>
              <span className="text-sm font-num font-bold text-navy block mt-2">15 Aug 2026</span>
              <span className="text-[10px] font-serif text-slate-500">Semester 6 Fee</span>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 text-center">
              <span className="text-[10px] font-sans font-bold text-slate-400 uppercase block">SCHOLARSHIP AID</span>
              <span className="text-sm font-num font-bold text-emerald-700 block mt-2">₹ 25,000</span>
              <span className="text-[10px] font-serif text-slate-500">Merit Award Credited</span>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 text-center col-span-2 sm:col-span-1">
              <span className="text-[10px] font-sans font-bold text-slate-400 uppercase block">PAYMENT STATUS</span>
              <span className={`text-xs font-sans font-bold px-2 py-1 rounded inline-block mt-2 ${
                totalPending === 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900 font-bold'
              }`}>
                {totalPending === 0 ? 'Fully Paid' : 'Partially Paid'}
              </span>
              <span className="text-[9px] font-serif text-slate-500 mt-1 block">Institutional Clearance</span>
            </div>

          </div>

          {/* FEE BREAKDOWN TABLE */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-sans font-bold text-navy tracking-tight">Institutional Fee Structure Breakdown</h3>
                <p className="font-serif text-xs text-slate-500">Itemized tuition, laboratory, library, and examination fees.</p>
              </div>
              <span className="text-xs font-serif text-slate-400">Locked Official Rates</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans min-w-[650px]">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                    <th className="p-3.5">Fee Category</th>
                    <th className="p-3.5">Total Fee</th>
                    <th className="p-3.5">Amount Paid</th>
                    <th className="p-3.5">Pending Amount</th>
                    <th className="p-3.5">Due Date</th>
                    <th className="p-3.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {feeBreakdown.map((fee, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5">
                        <strong className="text-navy text-sm font-sans">{fee.category}</strong>
                      </td>
                      <td className="p-3.5 font-num font-bold text-slate-800">₹ {fee.total.toLocaleString()}</td>
                      <td className="p-3.5 font-num font-bold text-emerald-700">₹ {fee.paid.toLocaleString()}</td>
                      <td className="p-3.5 font-num font-bold text-amber-700">
                        {fee.pending > 0 ? `₹ ${fee.pending.toLocaleString()}` : '₹ 0'}
                      </td>
                      <td className="p-3.5 font-num text-slate-600">{fee.dueDate}</td>
                      <td className="p-3.5 text-right">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          fee.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900 font-bold'
                        }`}>
                          {fee.status === 'Paid' ? '✓ Paid' : '⏳ Partially Paid'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* PAYMENT HISTORY TABLE & RECEIPTS */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-sans font-bold text-navy tracking-tight">Payment Transaction History</h3>
                <p className="font-serif text-xs text-slate-500">Download official stamped receipts for all previous payments.</p>
              </div>

              <button
                onClick={() => setShowIssueModal(true)}
                className="inline-flex items-center text-xs font-sans font-bold text-navy hover:text-gold border border-slate-300 px-3 py-1.5 rounded-lg bg-slate-50"
              >
                <AlertCircle className="w-3.5 h-3.5 mr-1 text-gold" />
                Report Payment Issue
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans min-w-[650px]">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                    <th className="p-3">Transaction ID</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Fee Type</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Payment Method</th>
                    <th className="p-3 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {paymentHistory.length > 0 ? (
                    paymentHistory.map((hist, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-3 font-num font-bold text-navy">{hist.id}</td>
                        <td className="p-3 font-num text-slate-600">{hist.date}</td>
                        <td className="p-3 font-bold text-slate-800">{hist.feeType}</td>
                        <td className="p-3 font-num font-bold text-emerald-700">₹ {hist.amount.toLocaleString()}</td>
                        <td className="p-3 text-slate-600">{hist.method}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => setSelectedReceipt(hist)}
                            className="inline-flex items-center bg-gold hover:bg-gold-hover text-navy-dark hover:scale-105 transition-transform text-[11px] font-sans font-bold px-3.5 py-1.5 rounded-lg shadow"
                          >
                            <Download className="w-3.5 h-3.5 mr-1.5" />
                            Download Fee Payment Receipt
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-slate-400 font-serif">
                        No payment transactions recorded yet. When you complete fee payments, official receipts will appear here for instant download.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>

      {/* PAY NOW INTERACTIVE PAYMENT MODAL */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 font-sans text-slate-800">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-sans font-bold text-navy flex items-center">
                <CreditCard className="w-5 h-5 text-gold mr-2" />
                Kalpanaaa Payment Gateway
              </h3>
              <button onClick={() => setShowPayModal(false)} className="text-slate-400 text-xl font-bold">&times;</button>
            </div>

            {paymentSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-sans font-bold text-navy">Payment Successful!</h4>
                <p className="text-xs text-slate-600 font-serif">
                  Amount ₹ {paymentAmount.toLocaleString()} received for {selectedFeeCategory}. Official receipt generated in your transaction history.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePayNowSubmit} className="space-y-4 text-xs font-sans">
                
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Select Fee Item to Pay *</label>
                  <select
                    value={selectedFeeCategory}
                    onChange={(e) => setSelectedFeeCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  >
                    <option value="Tuition Fee - Semester 6">Tuition Fee - Semester 6 (Pending ₹15,000)</option>
                    <option value="Examination & Evaluation Fee">Examination & Evaluation Fee (₹15,000)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Payment Amount (INR) *</label>
                  <input
                    type="number"
                    required
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-num font-bold text-navy"
                  />
                </div>

                {/* PAYMENT METHOD SELECTOR TABS */}
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1.5">Select Payment Method *</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('UPI')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center transition-all ${
                        paymentMethod === 'UPI' ? 'border-gold bg-gold/10 text-navy shadow' : 'border-slate-300 bg-slate-50 text-slate-600'
                      }`}
                    >
                      📱 UPI App
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('CARD')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center transition-all ${
                        paymentMethod === 'CARD' ? 'border-gold bg-gold/10 text-navy shadow' : 'border-slate-300 bg-slate-50 text-slate-600'
                      }`}
                    >
                      💳 Credit / Debit
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('NETBANKING')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center transition-all ${
                        paymentMethod === 'NETBANKING' ? 'border-gold bg-gold/10 text-navy shadow' : 'border-slate-300 bg-slate-50 text-slate-600'
                      }`}
                    >
                      🏦 Net Banking
                    </button>
                  </div>
                </div>

                {/* METHOD SPECIFIC FIELDS */}
                {paymentMethod === 'UPI' && (
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Enter UPI VPA ID (GPay / PhonePe / Paytm) *</label>
                    <input
                      type="text"
                      required
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. username@okaxis or username@ybl"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-sans"
                    />
                  </div>
                )}

                {paymentMethod === 'CARD' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Card Number *</label>
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4532 •••• •••• 8891"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-num"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-bold text-slate-700 uppercase mb-1">Expiry (MM/YY)</label>
                        <input
                          type="text"
                          required
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="08/28"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-num"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 uppercase mb-1">CVV Security</label>
                        <input
                          type="password"
                          required
                          maxLength={3}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="•••"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-num"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'NETBANKING' && (
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Select Bank *</label>
                    <select
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                    >
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="State Bank of India">State Bank of India</option>
                      <option value="Axis Bank">Axis Bank</option>
                    </select>
                  </div>
                )}

                <div className="p-3 bg-slate-100 rounded-xl text-[11px] text-slate-600 font-serif flex justify-between items-center">
                  <span>Order Total:</span>
                  <strong className="font-num text-navy text-sm font-bold">₹ {paymentAmount.toLocaleString()}</strong>
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowPayModal(false)}
                    className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gold hover:bg-gold-hover text-navy-dark rounded-xl font-bold uppercase tracking-wider shadow flex items-center"
                  >
                    <ShieldCheck className="w-4 h-4 mr-1.5" />
                    Pay ₹ {paymentAmount.toLocaleString()} Securely
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* OFFICIAL STAMPED RECEIPT MODAL */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 font-sans text-slate-800">
            
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <span className="text-xs font-bold text-navy uppercase tracking-widest bg-gold/20 px-3 py-1 rounded">
                OFFICIAL PAYMENT RECEIPT
              </span>
              <div className="flex items-center space-x-2">
                <button onClick={() => window.print()} className="bg-navy text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center">
                  <Printer className="w-3.5 h-3.5 mr-1 text-gold" />
                  Print Receipt
                </button>
                <button onClick={() => setSelectedReceipt(null)} className="text-slate-400 text-xl font-bold px-1">&times;</button>
              </div>
            </div>

            <div className="border-4 border-navy p-6 rounded-2xl space-y-4 bg-white relative">
              <div className="flex justify-between items-center border-b border-navy pb-3">
                <div>
                  <h3 className="font-serif font-bold text-navy text-base">KALPANAAA EDUCATION</h3>
                  <p className="text-[10px] font-bold text-gold uppercase">FINANCE & ACCOUNTS DEPARTMENT</p>
                </div>
                <span className="font-num font-bold text-xs text-navy">{selectedReceipt.id}</span>
              </div>

              <div className="space-y-1.5 text-xs font-serif">
                <div>Student Name: <strong className="font-sans text-navy">{studentName}</strong></div>
                <div>Student ID: <strong className="font-num text-navy">{studentCode}</strong></div>
                <div>Course: <strong className="font-sans">{course}</strong></div>
                <div>Fee Category: <strong className="font-sans text-slate-800">{selectedReceipt.feeType}</strong></div>
                <div>Payment Method: <strong>{selectedReceipt.method}</strong></div>
                <div>Payment Date: <strong className="font-num">{selectedReceipt.date}</strong></div>
                <div>Amount Paid: <strong className="font-num text-emerald-800 text-sm font-bold">₹ {selectedReceipt.amount.toLocaleString()}</strong></div>
              </div>

              <div className="pt-4 flex justify-between items-center text-xs font-serif">
                <span className="text-emerald-700 font-bold">Status: TRANSACTION VERIFIED & SUCCESSFUL</span>
                <span className="font-sans font-bold text-navy text-[11px] border border-gold px-2 py-1 rounded bg-gold/10">STAMPED RECEIPT</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* REPORT PAYMENT ISSUE MODAL */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 font-sans">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-sans font-bold text-navy">Report Payment Issue to Accounts</h3>
              <button onClick={() => setShowIssueModal(false)} className="text-slate-400 text-lg">&times;</button>
            </div>

            <form onSubmit={handleIssueSubmit} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Transaction ID (If Available)</label>
                <input
                  type="text"
                  value={issueForm.transactionId}
                  onChange={(e) => setIssueForm({ ...issueForm, transactionId: e.target.value })}
                  placeholder="e.g. TXN-2026-88912"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-num"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Payment Date & Amount *</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    required
                    value={issueForm.date}
                    onChange={(e) => setIssueForm({ ...issueForm, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-num"
                  />
                  <input
                    type="number"
                    required
                    value={issueForm.amount}
                    onChange={(e) => setIssueForm({ ...issueForm, amount: e.target.value })}
                    placeholder="Amount INR"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-num"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Issue Type *</label>
                <select
                  value={issueForm.issueType}
                  onChange={(e) => setIssueForm({ ...issueForm, issueType: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                >
                  <option value="Money Deducted but Status Pending">Money Deducted but Status Pending</option>
                  <option value="Receipt Not Generated">Receipt Not Generated</option>
                  <option value="Duplicate Payment Charged">Duplicate Payment Charged</option>
                  <option value="Incorrect Fee Credit">Incorrect Fee Credit</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={issueForm.description}
                  onChange={(e) => setIssueForm({ ...issueForm, description: e.target.value })}
                  placeholder="Detail your bank payment reference number..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Upload Bank Statement / Screenshot (Optional)</label>
                <div className="p-3 border-2 border-dashed border-slate-300 rounded-xl text-center bg-slate-50 text-slate-500 flex flex-col items-center cursor-pointer">
                  <Upload className="w-4 h-4 text-gold mb-1" />
                  <span className="text-[11px]">Upload payment proof receipt image</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gold hover:bg-gold-hover text-navy-dark rounded-xl font-bold uppercase tracking-wider shadow flex items-center"
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  Submit Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <FloatingHelpdesk />
    </div>
  );
};
