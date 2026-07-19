import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { UploadDropzone } from "../components/features/UploadDropzone";
import { Skeleton } from "../components/ui/Skeleton";
import { Info, RefreshCw } from "lucide-react";

export const Upload: React.FC = () => {
  const queryClient = useQueryClient();

  const {
    data: uploadHistory = [],
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["uploadHistory"],
    queryFn: () => api.getUploadHistory(),
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => api.uploadSalesCSV(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["uploadHistory"] });
      queryClient.invalidateQueries({ queryKey: ["salesSummary"] });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["recommendations"] });
      queryClient.invalidateQueries({ queryKey: ["alertsCount"] });
    },
  });

  const handleUploadFile = async (file: File) => {
    return await uploadMutation.mutateAsync(file);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Upload Sales Data</h1>
          <p className="text-xs text-slate-400 mt-1">
            Feed daily sales records into the forecast model via CSV spreadsheets
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => refetch()}
          disabled={isLoading || isFetching}
          className="self-start sm:self-center flex items-center gap-1.5"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          {isFetching ? "Refreshing Logs..." : "Refresh Uploads"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Upload Dropzone Column */}
        <div className="lg:col-span-2 space-y-6">
          <UploadDropzone
            onUpload={handleUploadFile}
            uploadHistory={uploadHistory}
            isUploading={uploadMutation.isPending}
          />
        </div>

        {/* Info Column */}
        <div className="space-y-6">
          <div className="p-5 bg-white border border-slate-200/80 rounded-xl space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Info className="h-4.5 w-4.5 text-emerald-600" />
              CSV Format Guideline
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your CSV file must be formatted using specific columns. The machine learning model uses this data to map seasonal demand patterns, weekend spikes, and holiday surges in Malaysia.
            </p>

            <div className="border border-slate-100 rounded-lg bg-slate-50 p-3.5 space-y-2.5">
              <p className="text-xs font-bold text-slate-700">Required CSV Columns:</p>
              <ul className="list-disc pl-4 text-slate-600 text-xs space-y-1.5 leading-relaxed">
                <li>
                  <strong className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200 text-slate-800">date</strong> — formatted as <code className="text-[10px] text-emerald-700 font-bold">YYYY-MM-DD</code>
                </li>
                <li>
                  <strong className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200 text-slate-800">sku</strong> — matches your product catalog SKU
                </li>
                <li>
                  <strong className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200 text-slate-800">sales_amount</strong> — total decimal Ringgit sales revenue
                </li>
                <li>
                  <strong className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200 text-slate-800">units_sold</strong> — total integer quantity sold
                </li>
              </ul>
            </div>

            <div className="p-3.5 bg-amber-50 text-amber-800 border border-amber-200/60 rounded-xl text-xs space-y-1 leading-relaxed">
              <p className="font-bold text-amber-900">Testing Errors?</p>
              <p>
                To test the CSV upload error and row-level validation table, upload any CSV file containing the word <code className="font-bold text-[11px] text-red-700">"error"</code> or <code className="font-bold text-[11px] text-red-700">"invalid"</code> in its filename.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
import { Button } from "../components/ui/Button";
export default Upload;
