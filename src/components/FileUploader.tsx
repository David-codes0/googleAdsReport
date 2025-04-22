import React, { useState } from 'react';
import { FileUp, HelpCircle } from 'lucide-react';

interface FileUploaderProps {
  selectedGoal: 'roas' | 'cpa' | 'custom';
  customMetrics?: string[];
  onFileChange: (file: File | null) => void;
}

const requiredColumns = {
  roas: [
    'Date',
    'Campaign Name',
    'Cost (€)',
    'Conversions',
    'Conv. Value (€)',
    'Conv. Value / Cost',
    'Clicks',
    'Avg. CPC (€)',
    'CTR (%)',
    'Search Impression Share (%)',
    'Search Lost IS (Budget)',
    'Search Lost IS (Rank)',
  ],
  cpa: [
    'Date',
    'Campaign Name',
    'Cost (€)',
    'Conversions',
    'Cost / Conversion (€)',
    'Clicks',
    'Impressions',
    'CTR (%)',
    'Avg. CPC (€)',
    'Search Impression Share (%)',
    'Search Lost IS (Budget)',
    'Search Lost IS (Rank)',
    'Top Impression Share (%)',
  ],
};

const metricIdToLabel: Record<string, string> = {
  impressions: 'Impressions',
  clicks: 'Clicks',
  ctr: 'CTR (%)',
  avg_cpc: 'Avg. CPC (€)',
  avg_cpm: 'Avg. CPM (€)',
  cost: 'Cost (€)',
  conversions: 'Conversions',
  cost_per_conv: 'Cost / Conversion (€)',
  conv_value: 'Conv. Value (€)',
  roas: 'Conv. Value / Cost (ROAS)',
  value_per_click: 'Conv. Value / Click',
  value_per_conv: 'Value / Conversion (€)',
  search_impr_share: 'Search Impression Share (%)',
  top_impr_share: 'Top Impression Share (%)',
  abs_top_share: 'Abs. Top Impression Share (%)',
  lost_budget: 'Search Lost IS (Budget)',
  lost_rank: 'Search Lost IS (Rank)',
  device: 'Device',
  network: 'Network',
  campaign_type: 'Campaign Type',
  ad_group: 'Ad Group Name',
  interactions: 'Interactions',
  interaction_rate: 'Interaction Rate (%)',
  video_views: 'Video Views',
  view_rate: 'View Rate (%)',
  campaign_name: 'Campaign Name',
  date: 'Date',
  bid_strategy: 'Bid Strategy Type',
  budget: 'Budget (€)',
};

export function FileUploader({ selectedGoal, customMetrics = [], onFileChange }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.name.endsWith('.xlsx')) {
      setFile(droppedFile);
      onFileChange(droppedFile);
    }
  };

  const handleFileRemove = () => {
    setFile(null);
    onFileChange(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile?.name.endsWith('.xlsx')) {
      setFile(selectedFile);
      onFileChange(selectedFile);
    }
  };

  const getRequiredColumns = () => {
    if (selectedGoal === 'custom') {
      return ['Date', 'Campaign Name', ...customMetrics.map(id => metricIdToLabel[id] || id)];
    }
    return requiredColumns[selectedGoal];
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Upload Google Ads Export</h2>
          <p className="text-sm text-gray-600 mt-2">
            Please ensure your export includes these columns:
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {getRequiredColumns().map((column) => (
              <span
                key={column}
                className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-sm"
              >
                {column}
              </span>
            ))}
          </div>
        </div>
        <div className="group relative">
          <HelpCircle className="w-5 h-5 text-gray-400 cursor-help" />
          <div className="absolute right-0 w-64 p-2 bg-gray-800 text-white text-sm rounded-lg
            opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
            Make sure your file is segmented by day and includes campaign-level metrics
          </div>
        </div>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center transition-colors
          ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'}
        `}
      >
        {file ? (
          <div className="flex items-center justify-center space-x-3">
            <FileUp className="w-6 h-6 text-indigo-600" />
            <span className="text-gray-900 font-medium">{file.name}</span>
            <button
              onClick={handleFileRemove}
              className="text-gray-500 hover:text-gray-700"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <FileUp className="w-12 h-12 text-gray-400 mx-auto" />
            <div>
              <p className="text-gray-600">
                Drag and drop your Excel file here, or{' '}
                <label className="text-indigo-600 font-medium hover:text-indigo-700 cursor-pointer">
                  browse
                  <input
                    type="file"
                    accept=".xlsx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Accepts .xlsx files only
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}