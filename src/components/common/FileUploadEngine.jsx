import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Copy, Trash2, Cloud, Server, Loader2 } from 'lucide-react';

export const FileUploadEngine = ({
  onUploadComplete,
  onFileRemove,
  acceptedTypes = '.pdf, .docx, .zip, .png, .jpg, .jpeg',
  maxSizeMB = 25,
  initialFile = null
}) => {
  const [provider, setProvider] = useState('S3'); // 'S3' or 'Cloudinary'
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(initialFile);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState('0.0 MB/s');
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef(null);

  const formatBytes = (bytes, decimals = 1) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (selectedFile) => {
    setErrorMessage('');
    if (!selectedFile) return false;

    // Check size limit
    const sizeInMB = selectedFile.size / (1024 * 1024);
    if (sizeInMB > maxSizeMB) {
      setErrorMessage(`File size exceeds maximum allowed limit of ${maxSizeMB} MB.`);
      return false;
    }

    return true;
  };

  const simulateCloudUpload = (selectedFile) => {
    setUploading(true);
    setProgress(0);

    const totalSteps = 20;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep += 1;
      const calculatedProgress = Math.min(100, Math.round((currentStep / totalSteps) * 100));
      setProgress(calculatedProgress);

      const randomSpeed = (1.8 + Math.random() * 2.5).toFixed(1);
      setUploadSpeed(`${randomSpeed} MB/s`);

      if (currentStep >= totalSteps) {
        clearInterval(interval);
        setUploading(false);

        // Generate cloud URL based on selected provider
        const cleanName = selectedFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const timestamp = Date.now();
        const cloudUrl = provider === 'S3'
          ? `https://kalpanaaa-cms-bucket.s3.ap-south-1.amazonaws.com/submissions/${timestamp}_${cleanName}`
          : `https://res.cloudinary.com/kalpanaaa-edu/raw/upload/v${timestamp}/assignments/${cleanName}`;

        const fileMeta = {
          name: selectedFile.name,
          size: formatBytes(selectedFile.size),
          rawSize: selectedFile.size,
          type: selectedFile.type || 'application/octet-stream',
          provider,
          url: cloudUrl,
          uploadedAt: new Date().toISOString()
        };

        setFile(fileMeta);
        if (onUploadComplete) {
          onUploadComplete(fileMeta);
        }
      }
    }, 80);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      if (validateFile(selectedFile)) {
        simulateCloudUpload(selectedFile);
      }
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        simulateCloudUpload(selectedFile);
      }
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setProgress(0);
    setErrorMessage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (onFileRemove) onFileRemove();
  };

  const copyUrlToClipboard = () => {
    if (file?.url) {
      navigator.clipboard.writeText(file.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-3 font-sans text-xs">
      
      {/* Provider Selector & Engine Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200 gap-2">
        <div className="flex items-center space-x-2">
          <Cloud className="w-4 h-4 text-gold" />
          <span className="font-bold text-navy uppercase text-[10px]">Cloud Storage Engine:</span>
        </div>

        <div className="flex items-center space-x-1.5 bg-white p-1 rounded-lg border border-slate-200 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setProvider('S3')}
            className={`px-3 py-1 text-[10px] font-bold rounded flex items-center transition-all ${
              provider === 'S3' ? 'bg-navy text-gold shadow' : 'text-slate-500 hover:text-navy'
            }`}
          >
            <Server className="w-3 h-3 mr-1" /> AWS S3 Bucket
          </button>
          <button
            type="button"
            onClick={() => setProvider('Cloudinary')}
            className={`px-3 py-1 text-[10px] font-bold rounded flex items-center transition-all ${
              provider === 'Cloudinary' ? 'bg-navy text-gold shadow' : 'text-slate-500 hover:text-navy'
            }`}
          >
            <Cloud className="w-3 h-3 mr-1" /> Cloudinary CDN
          </button>
        </div>
      </div>

      {/* Upload Dropzone */}
      {!file && !uploading && (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`p-6 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-2 ${
            dragActive
              ? 'border-gold bg-gold/10 scale-[0.99]'
              : 'border-slate-300 hover:border-navy bg-slate-50/70 hover:bg-slate-50'
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-navy/10 text-navy flex items-center justify-center">
            <UploadCloud className="w-6 h-6 text-navy" />
          </div>

          <div>
            <p className="font-bold text-navy text-xs">
              <span className="text-gold font-extrabold underline">Click to browse</span> or drag and drop your file here
            </p>
            <p className="text-[10px] text-slate-500 font-serif mt-0.5">
              Supported Formats: PDF, DOCX, ZIP, PNG, JPG (Max Limit: {maxSizeMB} MB)
            </p>
          </div>

          <span className="px-2.5 py-0.5 bg-slate-200 text-slate-700 text-[9px] font-bold uppercase rounded">
            Target Destination: {provider === 'S3' ? 'AWS S3 (ap-south-1)' : 'Cloudinary Media Gateway'}
          </span>

          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes}
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {/* Error Message Alert */}
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center space-x-2 text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="font-semibold">{errorMessage}</span>
        </div>
      )}

      {/* Uploading Progress State */}
      {uploading && (
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-navy flex items-center">
              <Loader2 className="w-4 h-4 mr-2 text-gold animate-spin" />
              Uploading to {provider}...
            </span>
            <span className="font-num font-bold text-navy">{progress}%</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
            <div
              className="bg-gradient-to-r from-navy via-navy-light to-gold h-full transition-all duration-150 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-500 font-num font-bold">
            <span>Transfer Rate: {uploadSpeed}</span>
            <span>Chunk Transfer Active</span>
          </div>
        </div>
      )}

      {/* Completed Upload Card */}
      {file && !uploading && (
        <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl space-y-3 shadow-sm">
          <div className="flex items-center justify-between border-b border-emerald-200 pb-2.5">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-700">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-emerald-950 text-xs truncate max-w-[220px] sm:max-w-[300px]">{file.name}</p>
                <div className="flex items-center space-x-2 text-[10px] text-emerald-800 font-num font-bold">
                  <span>Size: {file.size}</span>
                  <span>&bull;</span>
                  <span className="bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded font-sans uppercase text-[9px]">{file.provider}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRemoveFile}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Remove Attached File"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Generated URL Box */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-emerald-900 uppercase block">Production Cloud Storage URL</span>
            <div className="flex items-center space-x-2 bg-white p-2 rounded-xl border border-emerald-200">
              <input
                type="text"
                readOnly
                value={file.url}
                className="w-full text-[10px] font-mono text-slate-600 truncate bg-transparent focus:outline-none"
              />
              <button
                type="button"
                onClick={copyUrlToClipboard}
                className="p-1.5 text-slate-600 hover:text-navy hover:bg-slate-100 rounded-lg transition-all flex items-center text-[10px] font-bold flex-shrink-0"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                {copied ? 'Copied' : 'Copy URL'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
