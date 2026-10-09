import React, { useState, useRef } from 'react';
import { Upload, Download, FileSpreadsheet, CheckCircle2, AlertTriangle, ArrowRight, Table } from 'lucide-react';

export const BulkScoreImporter = ({
  isOpen,
  onClose,
  assignedStudents = [],
  maxMarks = 100,
  examName = 'Semester Exam',
  onApplyScores
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [parsedData, setParsedData] = useState([]);
  const [validationSummary, setValidationSummary] = useState(null);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  // Generate and Download Sample CSV Template
  const handleDownloadSampleCSV = () => {
    const csvHeader = 'Student_ID,Student_Name,Marks_Obtained,Remarks\n';
    const sampleRows = assignedStudents.slice(0, 5).map(stu => 
      `${stu.studentId || stu.username || stu.id},"${stu.name}",${Math.floor(75 + Math.random() * 20)},"Good academic performance"`
    ).join('\n');

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvHeader + sampleRows);
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `Sample_Marks_${examName.replace(/[^a-zA-Z0-9]/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Parse CSV File Content
  const processCSVContent = (text) => {
    const lines = text.split(/\r\n|\n/).filter(line => line.trim().length > 0);
    if (lines.length <= 1) {
      alert('CSV file appears to be empty or missing data rows.');
      return;
    }

    const rows = lines.slice(1);
    let validCount = 0;
    let errorCount = 0;

    const parsedList = rows.map((rowStr, index) => {
      // Basic CSV splitter handling quotes
      const cols = rowStr.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || rowStr.split(',');
      const cleanCols = cols.map(c => c.replace(/^"|"$/g, '').trim());

      const rawStudentId = cleanCols[0] || '';
      const rawStudentName = cleanCols[1] || '';
      const rawMarks = cleanCols[2] || '';
      const rawRemarks = cleanCols[3] || 'Satisfactory';

      const marksNum = Number(rawMarks);
      let isValid = true;
      let errorMsg = '';

      // Check if student exists in assigned cohort
      const matchedStudent = assignedStudents.find(
        s => (s.studentId && s.studentId.toLowerCase() === rawStudentId.toLowerCase()) ||
             (s.username && s.username.toLowerCase() === rawStudentId.toLowerCase()) ||
             (s.id && s.id.toLowerCase() === rawStudentId.toLowerCase())
      );

      if (!rawStudentId) {
        isValid = false;
        errorMsg = 'Missing Student ID';
      } else if (isNaN(marksNum) || marksNum < 0 || marksNum > maxMarks) {
        isValid = false;
        errorMsg = `Invalid Marks (Must be 0 - ${maxMarks})`;
      }

      if (isValid) validCount++;
      else errorCount++;

      return {
        rowNum: index + 2,
        studentId: rawStudentId,
        studentName: matchedStudent ? matchedStudent.name : rawStudentName || 'Unknown Student',
        matchedStudentId: matchedStudent ? (matchedStudent.id || matchedStudent.studentId) : null,
        marksObtained: isNaN(marksNum) ? 0 : marksNum,
        remarks: rawRemarks,
        isValid,
        errorMsg
      };
    });

    setParsedData(parsedList);
    setValidationSummary({
      totalRows: parsedList.length,
      validCount,
      errorCount
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (evt) => {
        processCSVContent(evt.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (evt) => {
        processCSVContent(evt.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleApply = () => {
    const validScores = parsedData.filter(item => item.isValid);
    if (validScores.length === 0) {
      alert('No valid score rows found to apply.');
      return;
    }

    onApplyScores(validScores);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-100 pb-3">
          <div>
            <span className="text-xs font-bold text-gold uppercase tracking-wider bg-navy px-2.5 py-0.5 rounded">
              TEACHER ENGINE &bull; BATCH IMPORT
            </span>
            <h3 className="text-xl font-serif font-bold text-navy mt-1">Bulk CSV Marks Importer</h3>
            <p className="text-xs text-slate-500 font-serif">Upload an Excel/CSV spreadsheet to populate semester exam scores for all students at once.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 text-xl font-bold hover:text-navy">&times;</button>
        </div>

        {/* Action Controls: Download Sample Template */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50 p-3 rounded-xl border border-slate-200 gap-2 text-xs">
          <div className="flex items-center space-x-2 text-slate-700">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Need a formatted Excel / CSV template?</span>
          </div>

          <button
            type="button"
            onClick={handleDownloadSampleCSV}
            className="px-3 py-1.5 bg-white text-navy hover:bg-gold hover:text-navy-dark border border-slate-300 font-bold rounded-lg transition-all flex items-center text-xs"
          >
            <Download className="w-3.5 h-3.5 mr-1 text-gold hover:text-navy" /> Download Sample CSV
          </button>
        </div>

        {/* Dropzone */}
        {parsedData.length === 0 && (
          <div
            onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`p-8 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-2 ${
              dragActive ? 'border-gold bg-gold/10' : 'border-slate-300 bg-slate-50/60 hover:bg-slate-50'
            }`}
          >
            <Upload className="w-8 h-8 text-navy" />
            <p className="font-bold text-navy text-xs">
              Click to select CSV File or drag and drop here
            </p>
            <span className="text-[10px] text-slate-500 font-serif">Supports .csv files formatted with Student_ID, Student_Name, Marks_Obtained, Remarks</span>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv, application/vnd.ms-excel"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        )}

        {/* Validation Summary & Preview Table */}
        {parsedData.length > 0 && (
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-navy text-white p-3 rounded-xl gap-2 text-xs">
              <div className="flex items-center space-x-3 font-bold">
                <Table className="w-4 h-4 text-gold" />
                <span>Parsed Spreadsheet: <strong className="text-gold">{fileName}</strong></span>
              </div>

              {validationSummary && (
                <div className="flex items-center space-x-2 text-[11px] font-bold">
                  <span className="bg-emerald-500 text-white px-2 py-0.5 rounded">{validationSummary.validCount} Valid</span>
                  {validationSummary.errorCount > 0 && (
                    <span className="bg-red-500 text-white px-2 py-0.5 rounded">{validationSummary.errorCount} Errors</span>
                  )}
                  <button
                    onClick={() => { setParsedData([]); setValidationSummary(null); }}
                    className="ml-2 text-slate-300 hover:text-white underline text-[10px]"
                  >
                    Re-upload
                  </button>
                </div>
              )}
            </div>

            {/* Parsed Rows Table */}
            <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase sticky top-0 border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Row</th>
                    <th className="p-2.5">Student ID</th>
                    <th className="p-2.5">Student Name</th>
                    <th className="p-2.5">Marks (Out of {maxMarks})</th>
                    <th className="p-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {parsedData.map((item, idx) => (
                    <tr key={idx} className={item.isValid ? 'hover:bg-slate-50' : 'bg-red-50/60'}>
                      <td className="p-2.5 font-bold text-slate-500">{item.rowNum}</td>
                      <td className="p-2.5 font-bold text-navy">{item.studentId}</td>
                      <td className="p-2.5 font-bold text-slate-800">{item.studentName}</td>
                      <td className="p-2.5 font-num font-bold text-emerald-700">{item.marksObtained}</td>
                      <td className="p-2.5">
                        {item.isValid ? (
                          <span className="text-emerald-700 font-bold flex items-center text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Valid
                          </span>
                        ) : (
                          <span className="text-red-700 font-bold flex items-center text-[11px]" title={item.errorMsg}>
                            <AlertTriangle className="w-3.5 h-3.5 mr-1" /> {item.errorMsg}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-2 flex justify-end space-x-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"
          >
            Cancel
          </button>
          
          {parsedData.length > 0 && (
            <button
              type="button"
              onClick={handleApply}
              className="px-5 py-2 bg-gold hover:bg-gold-hover text-navy-dark rounded-xl font-bold text-xs uppercase tracking-wider shadow flex items-center"
            >
              <ArrowRight className="w-4 h-4 mr-1.5" /> Apply Valid Scores to Roster
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
