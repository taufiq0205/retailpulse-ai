import React, { useState, useRef } from "react";
import { UploadCloud, AlertCircle, CheckCircle, FileText, AlertTriangle } from "lucide-react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { formatDateTime } from "../../lib/utils";
import { UploadHistory, UploadResponse } from "../../lib/api";

interface UploadDropzoneProps {
  onUpload: (file: File) => Promise<UploadResponse>;
  uploadHistory: UploadHistory[];
  isUploading: boolean;
}

export const UploadDropzone: React.FC<UploadDropzoneProps> = ({
  onUpload,
  uploadHistory,
  isUploading,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<UploadResponse | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        setSelectedFile(file);
        setErrorText(null);
        setResult(null);
      } else {
        setErrorText("Only CSV files are supported for sales uploads.");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        setSelectedFile(file);
        setErrorText(null);
        setResult(null);
      } else {
        setErrorText("Only CSV files are supported for sales uploads.");
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    try {
      const res = await onUpload(selectedFile);
      setResult(res);
      if (res.success) {
        setSelectedFile(null);
      }
    } catch (err: any) {
      setErrorText(err.message || "An error occurred during file upload.");
    }
  };

  return (
    <div className="space-y-8">
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all ${
            dragActive
              ? "border-emerald-500 bg-emerald-50/40"
              : "border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-400"
          }`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".csv"
            onChange={handleFileChange}
          />

          <UploadCloud className={`h-12 w-12 mb-3 ${dragActive ? "text-emerald-500" : "text-slate-400"}`} />

          {selectedFile ? (
            <div className="text-center">
              <p className="text-sm font-bold text-slate-700 flex items-center justify-center gap-1.5">
                <FileText className="h-4 w-4 text-emerald-600" /> {selectedFile.name}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {(selectedFile.size / 1024).toFixed(1)} KB • Click Submit to validate
              </p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-sm font-bold text-slate-700">
                Drag and drop your sales history CSV here
              </p>
              <p className="text-xs text-slate-400 mt-1">
                or <button type="button" onClick={triggerFileInput} className="text-emerald-600 font-bold hover:underline">browse your files</button>
              </p>
              <p className="text-[10px] text-slate-400 mt-3 max-w-xs leading-relaxed">
                Required columns: <strong>date, sku, sales_amount, units_sold</strong>
              </p>
            </div>
          )}
        </div>

        {errorText && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
            <span>{errorText}</span>
          </div>
        )}

        <div className="flex justify-end gap-3">
          {selectedFile && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setSelectedFile(null)}
              disabled={isUploading}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={!selectedFile || isUploading}
            isLoading={isUploading}
            className="w-full sm:w-auto"
          >
            Upload and Validate Sales
          </Button>
        </div>
      </form>

      {/* Upload response summary & row validation errors */}
      {result && (
        <div className="animate-fadeIn">
          {result.success ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">Upload Successful</h4>
                  <p className="text-xs text-emerald-700 mt-1">
                    Successfully validated and processed <strong>{result.processed_rows}</strong> records of sales history. Forecast model and order recommendations will be updated on the next automated cycle.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-5 border border-red-200 rounded-xl bg-red-50/30 space-y-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-sm text-red-900">Upload Validation Failed</h4>
                  <p className="text-xs text-red-700 mt-1">
                    The sales history CSV contains invalid rows. Please review and fix the following errors before re-submitting.
                  </p>
                </div>
              </div>

              {result.errors && result.errors.length > 0 && (
                <div className="border border-red-100 rounded-lg overflow-hidden bg-white max-h-60 overflow-y-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-red-50 border-b border-red-100 text-red-800 font-bold">
                        <th className="px-4 py-2">Row</th>
                        <th className="px-4 py-2">Column</th>
                        <th className="px-4 py-2">Error Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-red-50 text-red-950">
                      {result.errors.map((err, idx) => (
                        <tr key={idx} className="hover:bg-red-50/30">
                          <td className="px-4 py-2.5 font-bold">Row {err.row}</td>
                          <td className="px-4 py-2.5"><Badge variant="danger">{err.column}</Badge></td>
                          <td className="px-4 py-2.5 font-medium">{err.message}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* CSV Upload History List */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          Recent Upload History
        </h3>
        {uploadHistory.length === 0 ? (
          <div className="p-6 text-center border border-slate-200 rounded-xl text-slate-400 text-sm">
            No file upload history found.
          </div>
        ) : (
          <div className="overflow-hidden border border-slate-200/80 rounded-xl bg-white shadow-xs">
            <div className="divide-y divide-slate-100">
              {uploadHistory.map((history) => (
                <div key={history.id} className="p-4 sm:flex items-center justify-between gap-4 hover:bg-slate-50/40 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 border border-slate-200 text-slate-600 mt-0.5">
                      <FileText className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700">{history.filename}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {formatDateTime(history.uploaded_at)} • {history.row_count} rows processed
                      </p>
                    </div>
                  </div>
                  <div className="mt-2.5 sm:mt-0 flex items-center gap-2">
                    {history.status === "success" ? (
                      <Badge variant="success">Processed</Badge>
                    ) : (
                      <Badge variant="danger">{history.error_count} Errors</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
