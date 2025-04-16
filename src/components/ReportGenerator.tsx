import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { 
  BarChart3, 
  DollarSign, 
  TrendingUp, 
  Percent, 
  Users,
  MousePointerClick,
  RefreshCw
} from 'lucide-react';

interface ReportData {
  dateRange: string;
  keyMetrics: {
    totalAdSpend: number;
    revenueFromAds: number;
    roas: number;
    adEngagementRate: number;
    costPerVisitor: number;
    returnOnAdSpend?: number;
    websiteVisitors?: number;
  };
  businessSummary: string;
  campaigns: {
    name: string;
    spend: number;
    revenue: number;
    roas: number;
    clicks: number;
    costPerVisitor: number;
    engagementRate: number;
    insight: string;
  }[];
  visibility_campaign: {
    name: string;
    reachCaptured: number;
    reachMissedDueToBudget: number;
    reachMissedDueToLowRanking: number;
    insight: string;
  }[];
  performanceSummary: {
    allsummary: string;
  };
  actionPlan: {
    whatsWorking: string[];
    needsReview: string[];
    nextSteps: string[];
  };
  dailyTrends: {
    date: string;
    roas: number;
    revenue: number;
    spend: number;
    engagementRate: number;
    clicks: number;
  }[];
}

interface ReportGeneratorProps {
  data: {
    output: ReportData;
  };
}

const COLORS = ['#4F46E5', '#3B82F6', '#60A5FA'];

export function ReportGenerator({ data }: ReportGeneratorProps) {
  if (!data || !data.output) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading report data...</p>
        </div>
      </div>
    );
  }

  const reportData = data.output;

  const generatePDF = async () => {
    const element = document.getElementById('report-content');
    if (!element) return;

    // Temporarily hide the buttons section
    const buttonsSection = document.querySelector('.pdf-exclude');
    if (buttonsSection) {
      buttonsSection.classList.add('hidden');
    }

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const totalHeight = element.offsetHeight;
    const totalWidth = element.offsetWidth;
    const scale = pageWidth / totalWidth;
    const pageCount = Math.ceil(totalHeight * scale / pageHeight);

    try {
      for (let i = 0; i < pageCount; i++) {
        const canvas = await html2canvas(element, {
          scale: 2,
          logging: false,
          useCORS: true,
          windowHeight: totalHeight,
          y: i * (pageHeight / scale),
          height: pageHeight / scale
        });

        const imgData = canvas.toDataURL('image/png');
        if (i > 0) {
          pdf.addPage();
        }
        pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);
      }

      pdf.save('google-ads-report.pdf');
    } finally {
      // Restore the visibility of the buttons section
      if (buttonsSection) {
        buttonsSection.classList.remove('hidden');
      }
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8" id="report-content">
        {/* Report Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <BarChart3 className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Google Ads Revenue Performance Report</h1>
          <p className="text-gray-600 mb-1">How your ad investment performed - {reportData.dateRange}</p>
          <p className="text-gray-400 text-sm mb-2">Prepared by Digital Growth Agency</p>
          <p className="text-gray-500 italic">"Let's take a look at what your ad spend delivered this month."</p>
        </div>

        {/* Executive Summary */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Executive Summary</h2>
          
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-start gap-2 mb-6">
              <div className="mt-1">
                <RefreshCw className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-sm text-gray-600">
                This month, your campaigns generated <span className="font-semibold">€{reportData.keyMetrics?.revenueFromAds?.toLocaleString()}</span> in tracked revenue from <span className="font-semibold">€{reportData.keyMetrics?.totalAdSpend?.toLocaleString()}</span> in ad spend. This means you earned <span className="font-semibold">€{reportData.keyMetrics?.roas?.toFixed(2)}</span> for every €1 invested. "Performance Max" and "Brand Search" were your top performing campaigns, delivering the majority of the revenue with strong return efficiency. There's room to grow by increasing investment in these campaigns and optimizing visibility.
              </p>
            </div>

            <div className="grid grid-cols-5 gap-4">
              <div className="text-center">
                <div className="mb-2">
                  <DollarSign className="w-5 h-5 text-gray-400 mx-auto" />
                </div>
                <p className="text-2xl font-semibold text-gray-900">€{reportData.keyMetrics?.totalAdSpend?.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">TOTAL INVESTMENT THIS MONTH</p>
              </div>

              <div className="text-center">
                <div className="mb-2">
                  <DollarSign className="w-5 h-5 text-gray-400 mx-auto" />
                </div>
                <p className="text-2xl font-semibold text-gray-900">€{reportData.keyMetrics?.revenueFromAds?.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">REVENUE GENERATED FROM ADS</p>
              </div>

              <div className="text-center">
                <div className="mb-2">
                  <TrendingUp className="w-5 h-5 text-gray-400 mx-auto" />
                </div>
                <p className="text-2xl font-semibold text-gray-900">{reportData.keyMetrics?.roas?.toFixed(2)}x</p>
                <p className="text-xs text-gray-500 mt-1">RETURN ON AD SPEND</p>
              </div>

              <div className="text-center">
                <div className="mb-2">
                  <Percent className="w-5 h-5 text-gray-400 mx-auto" />
                </div>
                <p className="text-2xl font-semibold text-gray-900">{(reportData.keyMetrics?.adEngagementRate * 100)?.toFixed(2)}%</p>
                <p className="text-xs text-gray-500 mt-1">AVERAGE ENGAGEMENT RATE</p>
              </div>

              <div className="text-center">
                <div className="mb-2">
                  <MousePointerClick className="w-5 h-5 text-gray-400 mx-auto" />
                </div>
                <p className="text-2xl font-semibold text-gray-900">€{reportData.keyMetrics?.costPerVisitor?.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">AVERAGE COST PER CLICK</p>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Performance Dashboard */}
        <div className="pdf-page-break mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Visual Performance Dashboard</h2>
          <div className="grid grid-cols-2 gap-8">
            {/* Revenue vs Spend Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Revenue vs Spend by Day</h3>
              <p className="text-sm text-gray-600 mb-4">Shows your daily return—clear view of profit generation timeline.</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData.dailyTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="date" stroke="#6B7280" fontSize={12} tickLine={false} />
                    <YAxis stroke="#6B7280" fontSize={12} tickLine={false} />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="revenue"
                      fill="#4F46E5"
                      name="Revenue"
                    />
                    <Bar
                      dataKey="spend"
                      fill="#60A5FA"
                      name="Spend"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ROAS Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ad Return Over Time (ROAS)</h3>
              <p className="text-sm text-gray-600 mb-4">How many euros were earned per €1 spent each day.</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={reportData.dailyTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="date" stroke="#6B7280" fontSize={12} tickLine={false} />
                    <YAxis stroke="#6B7280" fontSize={12} tickLine={false} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="roas"
                      stroke="#4F46E5"
                      fill="#4F46E5"
                      fillOpacity={0.1}
                      name="ROAS"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Click Performance Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Click Performance Trend</h3>
              <p className="text-sm text-gray-600 mb-4">Visualizing engagement (clicks + rate) over time.</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={reportData.dailyTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="date" stroke="#6B7280" fontSize={12} tickLine={false} />
                    <YAxis yAxisId="left" stroke="#6B7280" fontSize={12} tickLine={false} />
                    <YAxis yAxisId="right" orientation="right" stroke="#6B7280" fontSize={12} tickLine={false} />
                    <Tooltip />
                    <Legend />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="clicks"
                      stroke="#4F46E5"
                      fill="#4F46E5"
                      fillOpacity={0.1}
                      name="Clicks"
                    />
                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey="engagementRate"
                      stroke="#60A5FA"
                      fill="#60A5FA"
                      fillOpacity={0.1}
                      name="Engagement Rate %"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Revenue Distribution Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Revenue Distribution</h3>
              <p className="text-sm text-gray-600 mb-4">What share of revenue came from each campaign.</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={reportData.campaigns?.map(campaign => ({
                        name: campaign.name,
                        value: campaign.revenue
                      })) || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${(percent * 100).toFixed(0)}%`}
                    >
                      {(reportData.campaigns || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `€${value.toLocaleString()}`} />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <style>
          {`
            @media print {
              .pdf-page-break {
                page-break-before: always;
              }
            }
          `}
        </style>

        {/* Campaign Performance */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Campaign Performance</h2>
          <div className="space-y-6">
            {(reportData.campaigns || []).map((campaign) => (
              <div key={campaign.name} className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{campaign.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{campaign.insight}</p>
                <div className="grid grid-cols-6 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Spend</p>
                    <p className="text-sm font-medium">€{campaign.spend.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Revenue</p>
                    <p className="text-sm font-medium">€{campaign.revenue.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">€ per €</p>
                    <p className="text-sm font-medium">{campaign.roas.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Clicks</p>
                    <p className="text-sm font-medium">{campaign.clicks.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Cost/Visitor</p>
                    <p className="text-sm font-medium">€{campaign.costPerVisitor.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Engagement</p>
                    <p className="text-sm font-medium">{campaign.engagementRate.toFixed(2)}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visibility & Missed Opportunities */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Visibility & Missed Opportunities</h2>
          <p className="text-gray-600 mb-6">Generic Search missed 36% of available visibility. Some of this is due to limited budget, but ad quality and ranking are also impacting exposure.</p>
          <div className="space-y-6">
            {(reportData.visibility_campaign || []).map((campaign) => (
              <div key={campaign.name} className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                  <span className="text-sm text-gray-500">Total Potential Reach</span>
                </div>
                <div className="h-8 bg-gray-100 rounded-full overflow-hidden">
                  <div className="flex h-full">
                    <div 
                      className="bg-blue-500" 
                      style={{ width: `${campaign.reachCaptured}%` }}
                    />
                    <div 
                      className="bg-yellow-400" 
                      style={{ width: `${campaign.reachMissedDueToBudget}%` }}
                    />
                    <div 
                      className="bg-red-400" 
                      style={{ width: `${campaign.reachMissedDueToLowRanking}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between mt-2 text-sm">
                  <span className="text-blue-600">Captured ({campaign.reachCaptured}%)</span>
                  <span className="text-yellow-600">Budget Limited ({campaign.reachMissedDueToBudget}%)</span>
                  <span className="text-red-600">Ranking Limited ({campaign.reachMissedDueToLowRanking}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Summary */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Performance Summary</h2>
          <div className="bg-gray-50 p-6 rounded-xl">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                </div>
              </div>
              <p className="text-gray-700">{reportData.performanceSummary?.allsummary ?? 'No performance summary available'}</p>
            </div>
          </div>
        </div>

        {/* Strategic Action Plan */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Strategic Action Plan</h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-green-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-green-700 mb-3">What's Working</h3>
              <ul className="space-y-2 text-green-600">
                {(reportData.actionPlan?.whatsWorking || []).map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
            <div className="bg-yellow-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-yellow-700 mb-3">What Needs Review</h3>
              <ul className="space-y-2 text-yellow-600">
                {(reportData.actionPlan?.needsReview || []).map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-blue-700 mb-3">Next Steps</h3>
              <ul className="space-y-2 text-blue-600">
                {(reportData.actionPlan?.nextSteps || []).map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Want to increase revenue? */}
        <div className="text-center pdf-exclude">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Want to increase revenue next month?</h2>
          <div className="flex justify-center space-x-4">
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
              Book Strategy Session
            </button>
            <button 
              onClick={generatePDF}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              Download as PDF
            </button>
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Generate Another Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 