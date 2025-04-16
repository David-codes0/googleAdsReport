import React from 'react';
import { HelpCircle } from 'lucide-react';

interface MetricCategory {
  id: string;
  title: string;
  color: string;
  metrics: {
    id: string;
    label: string;
    description: string;
  }[];
}

interface CustomMetricsSelectorProps {
  selectedMetrics: string[];
  onMetricsChange: (metrics: string[]) => void;
}

const metricCategories: MetricCategory[] = [
  {
    id: 'performance',
    title: 'Performance',
    color: 'green',
    metrics: [
      { id: 'impressions', label: 'Impressions', description: 'Number of times your ad was shown' },
      { id: 'clicks', label: 'Clicks', description: 'User engagements' },
      { id: 'ctr', label: 'CTR (%)', description: 'Clicks ÷ Impressions' },
      { id: 'avg_cpc', label: 'Avg. CPC (€)', description: 'Average cost per click' },
      { id: 'avg_cpm', label: 'Avg. CPM (€)', description: 'Cost per 1,000 impressions' },
      { id: 'cost', label: 'Cost (€)', description: 'Total spend' },
    ],
  },
  {
    id: 'conversion',
    title: 'Conversion & Efficiency',
    color: 'emerald',
    metrics: [
      { id: 'conversions', label: 'Conversions', description: 'Total conversions tracked' },
      { id: 'cost_per_conv', label: 'Cost / Conversion (€)', description: 'Total cost ÷ Conversions' },
      { id: 'conv_value', label: 'Conv. Value (€)', description: 'Revenue generated from conversions' },
      { id: 'roas', label: 'Conv. Value / Cost (ROAS)', description: 'Return on ad spend' },
      { id: 'value_per_click', label: 'Conv. Value / Click', description: 'Value per click' },
      { id: 'value_per_conv', label: 'Value / Conversion (€)', description: 'Average value per conversion' },
    ],
  },
  {
    id: 'competitive',
    title: 'Competitive Metrics',
    color: 'orange',
    metrics: [
      { id: 'search_impr_share', label: 'Search Impression Share (%)', description: 'Share of impressions received' },
      { id: 'top_impr_share', label: 'Top Impression Share (%)', description: 'Share of top-position impressions' },
      { id: 'abs_top_share', label: 'Abs. Top Impression Share (%)', description: 'Share of absolute #1 ad position' },
      { id: 'lost_budget', label: 'Search Lost IS (Budget)', description: 'Impressions lost due to low budget' },
      { id: 'lost_rank', label: 'Search Lost IS (Rank)', description: 'Impressions lost due to poor ad rank' },
    ],
  },
  {
    id: 'audience',
    title: 'Audience/Device/Network',
    color: 'purple',
    metrics: [
      { id: 'device', label: 'Device', description: 'Desktop, mobile, tablet' },
      { id: 'network', label: 'Network', description: 'Search, Display, YouTube, Partners' },
      { id: 'campaign_type', label: 'Campaign Type', description: 'Search, PMAX, Display, Video' },
      { id: 'ad_group', label: 'Ad Group Name', description: 'For granular reporting if needed' },
    ],
  },
  {
    id: 'video',
    title: 'Video / Engagement',
    color: 'red',
    metrics: [
      { id: 'interactions', label: 'Interactions', description: 'Used in video/display campaigns' },
      { id: 'interaction_rate', label: 'Interaction Rate (%)', description: 'Engagement ÷ impressions' },
      { id: 'video_views', label: 'Video Views', description: 'YouTube views if applicable' },
      { id: 'view_rate', label: 'View Rate (%)', description: 'Video views ÷ impressions' },
    ],
  },
  {
    id: 'metadata',
    title: 'Campaign Metadata',
    color: 'gray',
    metrics: [
      { id: 'campaign_name', label: 'Campaign Name', description: 'Name of the campaign' },
      { id: 'date', label: 'Date', description: 'Daily tracking over time' },
      { id: 'bid_strategy', label: 'Bid Strategy Type', description: 'e.g., Target CPA, Maximize Conv.' },
      { id: 'budget', label: 'Budget (€)', description: 'Daily budget for the campaign' },
    ],
  },
];

export function CustomMetricsSelector({ selectedMetrics, onMetricsChange }: CustomMetricsSelectorProps) {
  const toggleMetric = (metricId: string) => {
    onMetricsChange(
      selectedMetrics.includes(metricId)
        ? selectedMetrics.filter(id => id !== metricId)
        : [...selectedMetrics, metricId]
    );
  };

  const getCategoryColor = (color: string) => {
    const colors: Record<string, { bg: string, text: string, border: string }> = {
      green: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
      emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
      orange: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
      red: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
      gray: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
    };
    return colors[color];
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <div className="flex items-start justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Select Custom Metrics</h2>
        <div className="group relative">
          <HelpCircle className="w-5 h-5 text-gray-400 cursor-help" />
          <div className="absolute right-0 w-64 p-2 bg-gray-800 text-white text-sm rounded-lg
            opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
            Your selected metrics will be analyzed, charted, and explained in the PDF report.
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {metricCategories.map(category => {
          const colors = getCategoryColor(category.color);
          return (
            <div key={category.id} className={`rounded-xl border p-6 ${colors.border}`}>
              <h3 className={`text-lg font-semibold mb-4 ${colors.text}`}>
                {category.title}
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.metrics.map(metric => (
                  <label
                    key={metric.id}
                    className="relative flex items-start p-4 rounded-lg hover:bg-gray-50 cursor-pointer group"
                  >
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        checked={selectedMetrics.includes(metric.id)}
                        onChange={() => toggleMetric(metric.id)}
                        className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                      />
                    </div>
                    <div className="ml-3">
                      <span className="text-sm font-medium text-gray-900">{metric.label}</span>
                      <span className="absolute invisible group-hover:visible bg-gray-800 text-white text-xs rounded p-2 -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full w-48 text-center">
                        {metric.description}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}