import React, { useCallback } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { 
  DollarSign, 
  TrendingUp, 
  Percent, 
  Users,
  MousePointerClick,
  CheckCircle,
  AlertTriangle,
  ArrowUpRight,
  Download
} from 'lucide-react';

interface WebhookResponse {
  output: {
    businessSummary: {
      dateRange: string;
      summary: string;
      businessImplications: string[];
    };
    reportMetrics: {
      totalAdSpend: number;
      leadsGenerated: number;
      costPerLead: number;
      websiteVisitors: number;
      costPerVisitor: number;
      siteLeadRate: number;
    };
    visualizations: {
      dailyData: Array<{
        date: string;
        leads: number;
        spend: number;
      }>;
      costPerLeadData: Array<{
        date: string;
        cpl: number;
      }>;
      clickData: Array<{
        date: string;
        clicks: number;
        rate: number;
      }>;
    };
    topCampaigns: Array<{
      campaignName: string;
      spend: number;
      leads: number;
      costPerLead: number;
      clicks: number;
      siteLeadRate: number;
      performance: string;
      insight: string;
    }>;
    visibility: {
      campaigns: Array<{
        name: string;
        reachCaptured: number;
        reachMissedBudget: number;
        reachMissedRanking: number;
      }>;
      insights: string[];
    };
    strategicRecommendations: {
      keepDoing: string[];
      fixOrReview: string[];
      testOrExplore: string[];
    };
  };
}

export function LeadGenerationReport() {
  // Add the styles to the head of the document
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @media print {
        .pdf-exclude {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const reportData = JSON.parse(localStorage.getItem('reportData') || '{}') as WebhookResponse;
  const data = reportData.output;

  const handleDownloadPDF = useCallback(async () => {
    const element = document.getElementById('report-content');
    if (!element) return;

    try {
      // Hide the buttons before generating PDF
      const buttonsContainer = document.querySelector('.buttons-container') as HTMLDivElement;
      if (buttonsContainer) {
        buttonsContainer.style.display = 'none';
      }

      const html2pdf = (await import('html2pdf.js')).default;
      const opt = {
        margin: 0,
        filename: 'lead-generation-report.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          logging: false,
          windowWidth: 1200,
          windowHeight: element.scrollHeight,
          backgroundColor: '#ffffff'
        },
        jsPDF: { 
          unit: 'px', 
          format: [1200, element.scrollHeight],
          orientation: 'portrait',
          compress: true,
          hotfixes: ['px_scaling']
        }
      };

      await html2pdf().set(opt).from(element).save();

      // Show the buttons again after PDF generation
      if (buttonsContainer) {
        buttonsContainer.style.display = 'flex';
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
      // Ensure buttons are visible even if PDF generation fails
      const buttonsContainer = document.querySelector('.buttons-container') as HTMLDivElement;
      if (buttonsContainer) {
        buttonsContainer.style.display = 'flex';
      }
    }
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading report data...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4">
        <div id="report-content">
          {/* Title Section */}
          <div className="bg-[#2563EB] pt-16 pb-32 px-4 rounded-t-lg">
            <div className="max-w-7xl mx-auto text-center text-white">
              <h1 className="text-4xl font-bold mb-2">Google Ads Lead Generation Report</h1>
              <p className="text-xl mb-2">{data.businessSummary.dateRange}</p>
              <p className="text-lg">How your ad budget turned into real business inquiries</p>
            </div>
          </div>

          {/* Content Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 -mt-24">
            {/* Executive Summary */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Executive Summary</h2>
              <p className="text-gray-700 mb-8">{data.businessSummary.summary}</p>

              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-3">What This Means for Your Business:</h3>
                <ul className="space-y-3">
                  {data.businessSummary.businessImplications.map((implication, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      {index === 0 && <CheckCircle className="w-5 h-5 mr-2 text-green-600" />}
                      {index === 1 && <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" />}
                      {index === 2 && <ArrowUpRight className="w-5 h-5 mr-2 text-blue-600" />}
                      {implication}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Ad Spend */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center mb-2">
                    <DollarSign className="w-5 h-5 text-gray-600 mr-2" />
                    <p className="text-sm text-gray-600">Total Ad Spend</p>
                  </div>
                  <p className="text-2xl font-semibold text-gray-900">€{data.reportMetrics.totalAdSpend.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                  <p className="text-xs text-gray-500">Total budget used this month</p>
                </div>

                {/* Leads Generated */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Users className="w-5 h-5 text-gray-600 mr-2" />
                    <p className="text-sm text-gray-600">Leads Generated</p>
                  </div>
                  <p className="text-2xl font-semibold text-gray-900">{Math.round(data.reportMetrics.leadsGenerated).toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Contact forms, calls, or signups</p>
                </div>

                {/* Cost per Lead */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center mb-2">
                    <TrendingUp className="w-5 h-5 text-gray-600 mr-2" />
                    <p className="text-sm text-gray-600">Cost per Lead</p>
                  </div>
                  <p className="text-2xl font-semibold text-gray-900">€{data.reportMetrics.costPerLead.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">How much each lead cost you</p>
                </div>

                {/* Website Visitors */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center mb-2">
                    <MousePointerClick className="w-5 h-5 text-gray-600 mr-2" />
                    <p className="text-sm text-gray-600">Website Visitors</p>
                  </div>
                  <p className="text-2xl font-semibold text-gray-900">{data.reportMetrics.websiteVisitors.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Total clicks from your ads</p>
                </div>

                {/* Cost per Visitor */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center mb-2">
                    <DollarSign className="w-5 h-5 text-gray-600 mr-2" />
                    <p className="text-sm text-gray-600">Cost per Visitor</p>
                  </div>
                  <p className="text-2xl font-semibold text-gray-900">€{data.reportMetrics.costPerVisitor.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">Avg. cost per site visitor</p>
                </div>

                {/* Site Lead Rate */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Percent className="w-5 h-5 text-gray-600 mr-2" />
                    <p className="text-sm text-gray-600">Site Lead Rate</p>
                  </div>
                  <p className="text-2xl font-semibold text-gray-900">{data.reportMetrics.siteLeadRate.toFixed(2)}%</p>
                  <p className="text-xs text-gray-500">% of visitors who became leads</p>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="mb-12">
              <div className="grid grid-cols-1 gap-8">
                {/* Leads vs Spend Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Leads vs Spend Over Time</h3>
                  <p className="text-sm text-gray-600 mb-4">Shows how your daily ad budget turned into leads</p>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.visualizations.dailyData} barGap={0}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis 
                          dataKey="date" 
                          axisLine={false}
                          tickLine={false}
                          stroke="#6B7280"
                        />
                        <YAxis 
                          yAxisId="left" 
                          orientation="left"
                          axisLine={false}
                          tickLine={false}
                          stroke="#6B7280"
                          domain={[0, 'auto']}
                        />
                        <YAxis 
                          yAxisId="right" 
                          orientation="right"
                          axisLine={false}
                          tickLine={false}
                          stroke="#6B7280"
                          domain={[0, 'auto']}
                        />
                        <Bar 
                          yAxisId="left" 
                          dataKey="leads" 
                          fill="#4F46E5" 
                          radius={[4, 4, 0, 0]}
                          maxBarSize={40}
                        />
                        <Bar 
                          yAxisId="right" 
                          dataKey="spend" 
                          fill="#93C5FD" 
                          radius={[4, 4, 0, 0]}
                          maxBarSize={40}
                        />
                        <Legend />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Cost per Lead Trend */}
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Cost per Lead Trend</h3>
                  <p className="text-sm text-gray-600 mb-4">Shows how lead efficiency changed this month</p>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data.visualizations.costPerLeadData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis 
                          dataKey="date" 
                          axisLine={false}
                          tickLine={false}
                          stroke="#6B7280"
                        />
                        <YAxis 
                          axisLine={false}
                          tickLine={false}
                          stroke="#6B7280"
                          domain={[0, 'auto']}
                        />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length && typeof payload[0].value === 'number') {
                              return (
                                <div className="bg-white p-2 border rounded shadow-sm">
                                  <p className="text-sm">{payload[0].payload.date}</p>
                                  <p className="text-sm text-blue-600">
                                    Cost per Lead (€): {payload[0].value.toFixed(2)}
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="cpl"
                          stroke="#4F46E5"
                          strokeWidth={2}
                          fill="none"
                          dot={{ fill: '#4F46E5', r: 4 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Click Performance */}
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Click Performance</h3>
                  <p className="text-sm text-gray-600 mb-4">Shows daily clicks and engagement rate</p>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data.visualizations.clickData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis 
                          dataKey="date" 
                          axisLine={false}
                          tickLine={false}
                          stroke="#6B7280"
                        />
                        <YAxis 
                          axisLine={false}
                          tickLine={false}
                          stroke="#6B7280"
                          domain={[0, 'auto']}
                        />
                        <Area
                          type="monotone"
                          dataKey="clicks"
                          stroke="#4F46E5"
                          fill="#93C5FD"
                          fillOpacity={0.3}
                        />
                        <Legend />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* Campaign Performance */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Campaign Performance</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left text-sm text-gray-500 font-normal pb-4">CAMPAIGN</th>
                      <th className="text-left text-sm text-gray-500 font-normal pb-4">SPEND</th>
                      <th className="text-left text-sm text-gray-500 font-normal pb-4">LEADS</th>
                      <th className="text-left text-sm text-gray-500 font-normal pb-4">COST PER LEAD</th>
                      <th className="text-left text-sm text-gray-500 font-normal pb-4">CLICKS</th>
                      <th className="text-left text-sm text-gray-500 font-normal pb-4">SITE LEAD RATE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.topCampaigns?.map((campaign, index) => (
                      <tr key={index} className="group hover:bg-gray-50">
                        <td className="py-4">
                          <div className="flex items-center">
                            <span className="text-gray-900 font-medium">{campaign?.campaignName || 'Unnamed Campaign'}</span>
                            <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              campaign?.performance === 'Green' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {campaign?.performance === 'Green' ? 'Excellent' : 'Warning'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{campaign?.insight || 'No insight available'}</p>
                        </td>
                        <td className="py-4 text-gray-900">€{(campaign?.spend || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                        <td className="py-4 text-gray-900">{Math.round(campaign?.leads || 0).toLocaleString()}</td>
                        <td className="py-4 text-gray-900">€{(campaign?.costPerLead || 0).toFixed(2)}</td>
                        <td className="py-4 text-gray-900">{(campaign?.clicks || 0).toLocaleString()}</td>
                        <td className="py-4 text-gray-900">{((campaign?.siteLeadRate || 0) * 100).toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Visibility Breakdown */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Visibility Breakdown</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {data.visibility.campaigns.map((campaign, index) => (
                  <div key={index} className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">{campaign.name}</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Reach Captured</span>
                          <span className="text-gray-900">{campaign.reachCaptured.toFixed(1)}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div 
                            className="h-2 bg-green-500 rounded-full" 
                            style={{ width: `${Math.min(100, campaign.reachCaptured)}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Missed (Budget)</span>
                          <span className="text-gray-900">{campaign.reachMissedBudget.toFixed(1)}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div 
                            className="h-2 bg-yellow-500 rounded-full" 
                            style={{ width: `${campaign.reachMissedBudget}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Missed (Ranking)</span>
                          <span className="text-gray-900">{campaign.reachMissedRanking.toFixed(1)}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div 
                            className="h-2 bg-red-500 rounded-full" 
                            style={{ width: `${campaign.reachMissedRanking}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Items */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                {/* Keep Doing */}
                <div className="bg-white p-6 rounded-lg border border-green-200">
                  <div className="flex items-center mb-4">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <h3 className="text-lg font-medium text-gray-900">Keep Doing</h3>
                  </div>
                  <ul className="space-y-2">
                    {data.strategicRecommendations.keepDoing.map((item, index) => (
                      <li key={index} className="text-gray-600">{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Fix or Pause */}
                <div className="bg-white p-6 rounded-lg border border-yellow-200">
                  <div className="flex items-center mb-4">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                    <h3 className="text-lg font-medium text-gray-900">Fix or Review</h3>
                  </div>
                  <ul className="space-y-2">
                    {data.strategicRecommendations.fixOrReview.map((item, index) => (
                      <li key={index} className="text-gray-600">{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Test or Scale */}
                <div className="bg-white p-6 rounded-lg border border-blue-200">
                  <div className="flex items-center mb-4">
                    <ArrowUpRight className="w-5 h-5 text-blue-600 mr-2" />
                    <h3 className="text-lg font-medium text-gray-900">Test or Explore</h3>
                  </div>
                  <ul className="space-y-2">
                    {data.strategicRecommendations.testOrExplore.map((item, index) => (
                      <li key={index} className="text-gray-600">{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons outside of report content */}
        <div className="buttons-container text-center flex justify-center space-x-4 mt-8">
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Generate Another Report
          </button>
          <button 
            onClick={handleDownloadPDF}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
          >
            <Download className="w-5 h-5 mr-2" />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
} 