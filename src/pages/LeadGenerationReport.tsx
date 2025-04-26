import React, { useCallback } from 'react';
import { useParams } from 'react-router-dom';
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
    language: string;
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
  const { reportId } = useParams<{ reportId: string }>();

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

  // Get report data using the reportId
  const reportData = React.useMemo(() => {
    try {
      const data = localStorage.getItem(`report_${reportId}`);
      return data ? JSON.parse(data) as WebhookResponse : null;
    } catch (error) {
      console.error('Error retrieving report data:', error);
      return null;
    }
  }, [reportId]);

  if (!reportData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Report not found or data is invalid.</p>
      </div>
    );
  }

  const data = reportData.output;
  console.log(data.language);
  const isFrench = data.language === 'fr';

  const translations = {
    title: isFrench ? 'Rapport de Génération de Leads Google Ads' : 'Google Ads Lead Generation Report',
    dateRange: isFrench ? 'Période du rapport' : 'Report Date Range',
    subtitle: isFrench ? 'Comment votre budget publicitaire a généré des demandes commerciales réelles' : 'How your ad budget turned into real business inquiries',
    executiveSummary: isFrench ? 'Résumé Exécutif' : 'Executive Summary',
    businessImplications: isFrench ? 'Ce que cela signifie pour votre entreprise :' : 'What This Means for Your Business:',
    metrics: {
      totalAdSpend: isFrench ? 'Dépenses publicitaires totales' : 'Total Ad Spend',
      totalBudgetUsed: isFrench ? 'Budget total utilisé ce mois-ci' : 'Total budget used this month',
      leadsGenerated: isFrench ? 'Leads générés' : 'Leads Generated',
      contactForms: isFrench ? 'Formulaires de contact, appels ou inscriptions' : 'Contact forms, calls, or signups',
      costPerLead: isFrench ? 'Coût par lead' : 'Cost per Lead',
      costPerLeadDesc: isFrench ? 'Coût de chaque lead' : 'How much each lead cost you',
      websiteVisitors: isFrench ? 'Visiteurs du site' : 'Website Visitors',
      totalClicks: isFrench ? 'Total des clics depuis vos annonces' : 'Total clicks from your ads',
      costPerVisitor: isFrench ? 'Coût par visiteur' : 'Cost per Visitor',
      avgCostPerVisitor: isFrench ? 'Coût moyen par visiteur du site' : 'Avg. cost per site visitor',
      siteLeadRate: isFrench ? 'Taux de conversion en leads' : 'Site Lead Rate',
      conversionRate: isFrench ? '% de visiteurs devenus leads' : '% of visitors who became leads'
    },
    charts: {
      leadsVsSpend: isFrench ? 'Leads vs Dépenses dans le temps' : 'Leads vs Spend Over Time',
      leadsVsSpendDesc: isFrench ? 'Montre comment votre budget publicitaire quotidien a généré des leads' : 'Shows how your daily ad budget turned into leads',
      costPerLeadTrend: isFrench ? 'Tendance du coût par lead' : 'Cost per Lead Trend',
      costPerLeadTrendDesc: isFrench ? 'Montre comment l\'efficacité des leads a évolué ce mois-ci' : 'Shows how lead efficiency changed this month',
      clickPerformance: isFrench ? 'Performance des clics' : 'Click Performance',
      clickPerformanceDesc: isFrench ? 'Montre les clics quotidiens et le taux d\'engagement' : 'Shows daily clicks and engagement rate'
    },
    campaignPerformance: isFrench ? 'Performance des campagnes' : 'Notable Campaign Performance',
    visibilityBreakdown: isFrench ? 'Répartition de la visibilité' : 'Visibility Breakdown',
    actionItems: {
      keepDoing: isFrench ? 'Continuer à faire' : 'Keep Doing',
      fixOrReview: isFrench ? 'Corriger ou examiner' : 'Fix or Review',
      testOrExplore: isFrench ? 'Tester ou explorer' : 'Test or Explore'
    },
    buttons: {
      generateAnother: isFrench ? 'Générer un autre rapport' : 'Generate Another Report',
      downloadPDF: isFrench ? 'Télécharger PDF' : 'Download PDF'
    }
  };

  const handleDownloadPDF = useCallback(async () => {
    const element = document.getElementById('report-content');
    if (!element) return;

    try {
      // Hide the buttons before generating PDF
      const buttonsContainer = document.querySelector('.buttons-container') as HTMLDivElement;
      if (buttonsContainer) {
        buttonsContainer.style.display = 'none';
      }

      // @ts-ignore
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

  const getPerformanceClass = (performance: string) => {
    switch (performance) {
      case 'Green':
        return 'bg-green-100 text-green-800';
      case 'Yellow':
        return 'bg-yellow-100 text-yellow-800';
      case 'Blue':
        return 'bg-blue-100 text-blue-800';
      case 'Red':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPerformanceLabel = (performance: string, isFrench: boolean) => {
    switch (performance) {
      case 'Green':
        return isFrench ? 'Excellent' : 'Excellent';
      case 'Yellow':
        return isFrench ? 'Attention' : 'Warning';
      case 'Blue':
        return isFrench ? 'Test' : 'Test';
      case 'Red':
        return isFrench ? 'Faible' : 'Poor';
      default:
        return isFrench ? 'Non évalué' : 'Not rated';
    }
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4">
        <div id="report-content">
          {/* Title Section */}
          <div className="bg-[#2563EB] pt-16 pb-32 px-4 rounded-t-lg">
            <div className="max-w-7xl mx-auto text-center text-white">
              <h1 className="text-4xl font-bold mb-2">{translations.title}</h1>
              <p className="text-xl mb-2">{data.businessSummary.dateRange}</p>
              <p className="text-lg">{translations.subtitle}</p>
            </div>
          </div>

          {/* Content Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 -mt-24">
            {/* Executive Summary */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{translations.executiveSummary}</h2>
              <p className="text-gray-700 mb-8">{data.businessSummary.summary}</p>

              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-3">{translations.businessImplications}</h3>
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
                    <p className="text-sm text-gray-600">{translations.metrics.totalAdSpend}</p>
                  </div>
                  <p className="text-2xl font-semibold text-gray-900">€{data.reportMetrics.totalAdSpend.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                  <p className="text-xs text-gray-500">{translations.metrics.totalBudgetUsed}</p>
                </div>

                {/* Leads Generated */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Users className="w-5 h-5 text-gray-600 mr-2" />
                    <p className="text-sm text-gray-600">{translations.metrics.leadsGenerated}</p>
                  </div>
                  <p className="text-2xl font-semibold text-gray-900">{Math.round(data.reportMetrics.leadsGenerated).toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{translations.metrics.contactForms}</p>
                </div>

                {/* Cost per Lead */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center mb-2">
                    <TrendingUp className="w-5 h-5 text-gray-600 mr-2" />
                    <p className="text-sm text-gray-600">{translations.metrics.costPerLead}</p>
                  </div>
                  <p className="text-2xl font-semibold text-gray-900">€{data.reportMetrics.costPerLead.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">{translations.metrics.costPerLeadDesc}</p>
                </div>

                {/* Website Visitors */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center mb-2">
                    <MousePointerClick className="w-5 h-5 text-gray-600 mr-2" />
                    <p className="text-sm text-gray-600">{translations.metrics.websiteVisitors}</p>
                  </div>
                  <p className="text-2xl font-semibold text-gray-900">{data.reportMetrics.websiteVisitors.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{translations.metrics.totalClicks}</p>
                </div>

                {/* Cost per Visitor */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center mb-2">
                    <DollarSign className="w-5 h-5 text-gray-600 mr-2" />
                    <p className="text-sm text-gray-600">{translations.metrics.costPerVisitor}</p>
                  </div>
                  <p className="text-2xl font-semibold text-gray-900">€{data.reportMetrics.costPerVisitor.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">{translations.metrics.avgCostPerVisitor}</p>
                </div>

                {/* Site Lead Rate */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Percent className="w-5 h-5 text-gray-600 mr-2" />
                    <p className="text-sm text-gray-600">{translations.metrics.siteLeadRate}</p>
                  </div>
                  <p className="text-2xl font-semibold text-gray-900">{data.reportMetrics.siteLeadRate.toFixed(2)}%</p>
                  <p className="text-xs text-gray-500">{translations.metrics.conversionRate}</p>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="mb-12">
              <div className="grid grid-cols-1 gap-8">
                {/* Leads vs Spend Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{translations.charts.leadsVsSpend}</h3>
                  <p className="text-sm text-gray-600 mb-4">{translations.charts.leadsVsSpendDesc}</p>
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
                          name={isFrench ? "Leads" : "Leads"}
                        />
                        <Bar 
                          yAxisId="right" 
                          dataKey="spend" 
                          fill="#93C5FD" 
                          radius={[4, 4, 0, 0]}
                          maxBarSize={40}
                          name={isFrench ? "Dépenses" : "Spend"}
                        />
                        <Legend />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Cost per Lead Trend */}
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{translations.charts.costPerLeadTrend}</h3>
                  <p className="text-sm text-gray-600 mb-4">{translations.charts.costPerLeadTrendDesc}</p>
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
                                    {isFrench ? "Coût par Lead (€)" : "Cost per Lead (€)"}: {payload[0].value.toFixed(2)}
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
                          name={isFrench ? "Coût par Lead" : "Cost per Lead"}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Click Performance */}
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{translations.charts.clickPerformance}</h3>
                  <p className="text-sm text-gray-600 mb-4">{translations.charts.clickPerformanceDesc}</p>
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
                          yAxisId="left"
                          orientation="left"
                          axisLine={false}
                          tickLine={false}
                          stroke="#6B7280"
                          domain={[0, 8000]}
                        />
                        <YAxis 
                          yAxisId="right"
                          orientation="right"
                          axisLine={false}
                          tickLine={false}
                          stroke="#6B7280"
                          domain={[0, 8]}
                        />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const engagementRate = typeof payload[1]?.value === 'number' ? payload[1].value.toFixed(2) : '0.00';
                              return (
                                <div className="bg-white p-2 border rounded shadow-sm">
                                  <p className="text-sm">{payload[0].payload.date}</p>
                                  <p className="text-sm text-indigo-600">
                                    {isFrench ? "Clics" : "Clicks"}: {payload[0].value}
                                  </p>
                                  <p className="text-sm text-blue-400">
                                    {isFrench ? "Taux d'engagement" : "Engagement Rate"}: {engagementRate}%
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Area
                          yAxisId="left"
                          type="monotone"
                          dataKey="clicks"
                          stroke="#4F46E5"
                          fill="#4F46E5"
                          fillOpacity={0.1}
                          name={isFrench ? "Clics" : "Clicks"}
                        />
                        <Area
                          yAxisId="right"
                          type="monotone"
                          dataKey="rate"
                          stroke="#60A5FA"
                          fill="#60A5FA"
                          fillOpacity={0.1}
                          name={isFrench ? "Taux d'engagement %" : "Engagement Rate %"}
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
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">{translations.campaignPerformance}</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left text-sm text-gray-500 font-normal pb-4">{isFrench ? "CAMPAGNE" : "CAMPAIGN"}</th>
                      <th className="text-left text-sm text-gray-500 font-normal pb-4">{isFrench ? "DÉPENSES" : "SPEND"}</th>
                      <th className="text-left text-sm text-gray-500 font-normal pb-4">{isFrench ? "LEADS" : "LEADS"}</th>
                      <th className="text-left text-sm text-gray-500 font-normal pb-4">{isFrench ? "COÛT PAR LEAD" : "COST PER LEAD"}</th>
                      <th className="text-left text-sm text-gray-500 font-normal pb-4">{isFrench ? "CLICS" : "CLICKS"}</th>
                      <th className="text-left text-sm text-gray-500 font-normal pb-4">{isFrench ? "TAUX DE CONVERSION" : "SITE LEAD RATE"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.topCampaigns?.map((campaign, index) => (
                      <tr key={index} className="group hover:bg-gray-50">
                        <td className="py-4">
                          <div className="flex items-center">
                            <span className="text-gray-900 font-medium">{campaign?.campaignName || (isFrench ? 'Campagne sans nom' : 'Unnamed Campaign')}</span>
                            <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPerformanceClass(campaign?.performance)}`}>
                              {getPerformanceLabel(campaign?.performance, isFrench)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{campaign?.insight || (isFrench ? 'Aucune analyse disponible' : 'No insight available')}</p>
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
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">{translations.visibilityBreakdown}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {data.visibility.campaigns
                  .filter(campaign => {
                    // Filter out campaigns with reachCaptured <= 11%
                    if (campaign.reachCaptured <= 11) return false;
                    
                    // Filter out campaigns where all metrics are zero
                    const allMetricsZero = 
                      campaign.reachCaptured === 0 && 
                      campaign.reachMissedBudget === 0 && 
                      campaign.reachMissedRanking === 0;
                    
                    return !allMetricsZero;
                  })
                  .map((campaign, index) => (
                    <div key={index} className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">{campaign.name}</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">{isFrench ? "Portée capturée" : "Reach Captured"}</span>
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
                            <span className="text-gray-600">{isFrench ? "Manqué (Budget)" : "Missed (Budget)"}</span>
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
                            <span className="text-gray-600">{isFrench ? "Manqué (Classement)" : "Missed (Ranking)"}</span>
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
                    <h3 className="text-lg font-medium text-gray-900">{translations.actionItems.keepDoing}</h3>
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
                    <h3 className="text-lg font-medium text-gray-900">{translations.actionItems.fixOrReview}</h3>
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
                    <h3 className="text-lg font-medium text-gray-900">{translations.actionItems.testOrExplore}</h3>
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
            {translations.buttons.generateAnother}
          </button>
          <button 
            onClick={handleDownloadPDF}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
          >
            <Download className="w-5 h-5 mr-2" />
            {translations.buttons.downloadPDF}
          </button>
        </div>
      </div>
    </div>
  );
} 