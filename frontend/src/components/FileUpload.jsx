import React, { useState, useRef } from 'react';
import { Upload, FileText, X, AlertCircle, CheckCircle2 } from 'lucide-react';

const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

const FileUpload = ({ label = "Upload Document", onFilesChange, maxFiles = 3 }) => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const validateAndAddFiles = (newFileList) => {
    setError('');
    const validFiles = [];

    for (let i = 0; i < newFileList.length; i++) {
      const file = newFileList[i];

      // File type check
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError(`Invalid file type "${file.name}". Only PDF, JPG, JPEG, and PNG files are allowed.`);
        return;
      }

      // File size check
      if (file.size > MAX_SIZE_BYTES) {
        setError(`File "${file.name}" exceeds maximum allowed size of ${MAX_SIZE_MB} MB.`);
        return;
      }

      validFiles.push(file);
    }

    if (files.length + validFiles.length > maxFiles) {
      setError(`Maximum limit of ${maxFiles} documents reached.`);
      return;
    }

    const updatedFiles = [...files, ...validFiles];
    setFiles(updatedFiles);
    if (onFilesChange) onFilesChange(updatedFiles);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndAddFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndAddFiles(Array.from(e.target.files));
    }
  };

  const handleRemoveFile = (index) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    if (onFilesChange) onFilesChange(updated);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-3">
      <label className="form-label">{label}</label>

      {/* Drag & Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-colors duration-200 ${
          isDragging
            ? 'border-indigo-600 bg-indigo-50/50'
            : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50 hover:bg-slate-100/50'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          aria-label={label}
        />
        <div className="space-y-2">
          <Upload className="w-8 h-8 text-indigo-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-800">
            Drag & drop files here, or <span className="text-indigo-600 underline">browse</span>
          </p>
          <p className="text-xs text-slate-500">
            Accepted: PDF, JPG, JPEG, PNG (Max size: {MAX_SIZE_MB} MB per file)
          </p>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Selected Files List */}
      {files.length > 0 && (
        <div className="space-y-2 pt-1">
          <p className="text-xs font-semibold text-slate-700">Selected Files ({files.length}):</p>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs shadow-xs"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span className="font-medium text-slate-800 truncate max-w-[200px] sm:max-w-xs">
                    {file.name}
                  </span>
                  <span className="text-slate-400 text-[11px] shrink-0">
                    ({formatFileSize(file.size)})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile(index);
                  }}
                  className="p-1 text-slate-400 hover:text-red-600 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                  aria-label={`Remove file ${file.name}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
