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
  language: string;
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
  const isFrench = reportData.language === 'fr';

  const translations = {
    title: isFrench ? 'Rapport de Performance des Revenus Google Ads' : 'Google Ads Revenue Performance Report',
    subtitle: isFrench ? 'Comment votre investissement publicitaire a performé' : 'How your ad investment performed',
    preparedBy: isFrench ? 'Préparé par Digital Growth Agency' : 'Prepared by Digital Growth Agency',
    quote: isFrench ? 'Examinons ce que vos dépenses publicitaires ont rapporté ce mois-ci.' : 'Let\'s take a look at what your ad spend delivered this month.',
    executiveSummary: isFrench ? 'Résumé Exécutif' : 'Executive Summary',
    metrics: {
      totalInvestment: isFrench ? 'INVESTISSEMENT TOTAL CE MOIS' : 'TOTAL INVESTMENT THIS MONTH',
      revenueGenerated: isFrench ? 'REVENU GÉNÉRÉ PAR LES PUBLICITÉS' : 'REVENUE GENERATED FROM ADS',
      returnOnAdSpend: isFrench ? 'RETOUR SUR INVESTISSEMENT PUBLICITAIRE' : 'RETURN ON AD SPEND',
      averageEngagement: isFrench ? 'TAUX D\'ENGAGEMENT MOYEN' : 'AVERAGE ENGAGEMENT RATE',
      averageCostPerClick: isFrench ? 'COÛT MOYEN PAR CLIC' : 'AVERAGE COST PER CLICK'
    },
    visualDashboard: isFrench ? 'Tableau de Bord Visuel de Performance' : 'Visual Performance Dashboard',
    charts: {
      revenueVsSpend: {
        title: isFrench ? 'Revenu vs Dépenses par Jour' : 'Revenue vs Spend by Day',
        description: isFrench ? 'Montre votre retour quotidien—vue claire de la chronologie de génération de profit.' : 'Shows your daily return—clear view of profit generation timeline.'
      },
      adReturn: {
        title: isFrench ? 'Retour Publicitaire au Fil du Temps (ROAS)' : 'Ad Return Over Time (ROAS)',
        description: isFrench ? 'Combien d\'euros ont été gagnés par €1 dépensé chaque jour.' : 'How many euros were earned per €1 spent each day.'
      },
      clickPerformance: {
        title: isFrench ? 'Tendance de Performance des Clics' : 'Click Performance Trend',
        description: isFrench ? 'Visualisation de l\'engagement (clics + taux) au fil du temps.' : 'Visualizing engagement (clicks + rate) over time.'
      },
      revenueDistribution: {
        title: isFrench ? 'Distribution des Revenus' : 'Revenue Distribution',
        description: isFrench ? 'Quelle part des revenus provient de chaque campagne.' : 'What share of revenue came from each campaign.'
      }
    },
    campaignPerformance: isFrench ? 'Performance des Campagnes' : 'Campaign Performance',
    visibilityOpportunities: isFrench ? 'Visibilité & Opportunités Manquées' : 'Visibility & Missed Opportunities',
    totalPotentialReach: isFrench ? 'Portée Potentielle Totale' : 'Total Potential Reach',
    visibility: {
      captured: isFrench ? 'Capturé' : 'Captured',
      budgetLimited: isFrench ? 'Limité par Budget' : 'Budget Limited',
      rankingLimited: isFrench ? 'Limité par Classement' : 'Ranking Limited'
    },
    performanceSummary: isFrench ? 'Résumé de Performance' : 'Performance Summary',
    noPerformanceSummary: isFrench ? 'Aucun résumé de performance disponible' : 'No performance summary available',
    strategicActionPlan: isFrench ? 'Plan d\'Action Stratégique' : 'Strategic Action Plan',
    actionItems: {
      whatsWorking: isFrench ? 'Ce qui Fonctionne' : 'What\'s Working',
      needsReview: isFrench ? 'Ce qui Nécessite un Examen' : 'What Needs Review',
      nextSteps: isFrench ? 'Prochaines Étapes' : 'Next Steps'
    },
    increaseRevenue: isFrench ? 'Voulez-vous augmenter les revenus le mois prochain ?' : 'Want to increase revenue next month?',
    buttons: {
      bookStrategy: isFrench ? 'Réserver une Session Stratégique' : 'Book Strategy Session',
      downloadPDF: isFrench ? 'Télécharger en PDF' : 'Download as PDF',
      generateAnother: isFrench ? 'Générer un Autre Rapport' : 'Generate Another Report'
    }
  };

  const generatePDF = async () => {
    const element = document.getElementById('report-content');
    if (!element) return;

    try {
      // Hide the buttons before generating PDF
      const buttonsContainer = document.querySelector('.pdf-exclude') as HTMLDivElement;
      if (buttonsContainer) {
        buttonsContainer.style.display = 'none';
      }

      // @ts-ignore
      const html2pdf = (await import('html2pdf.js')).default;
      const opt = {
        margin: 0,
        filename: 'google-ads-report.pdf',
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
      const buttonsContainer = document.querySelector('.pdf-exclude') as HTMLDivElement;
      if (buttonsContainer) {
        buttonsContainer.style.display = 'flex';
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{translations.title}</h1>
          <p className="text-gray-600 mb-1">{translations.subtitle} - {reportData.dateRange}</p>
          <p className="text-gray-400 text-sm mb-2">{translations.preparedBy}</p>
          <p className="text-gray-500 italic">{translations.quote}</p>
        </div>

        {/* Executive Summary */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{translations.executiveSummary}</h2>
          
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-start gap-2 mb-6">
              <div className="mt-1">
                <RefreshCw className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-sm text-gray-600">
                {reportData.businessSummary}
              </p>
            </div>

            <div className="grid grid-cols-5 gap-4">
              <div className="text-center">
                <div className="mb-2">
                  <DollarSign className="w-5 h-5 text-gray-400 mx-auto" />
                </div>
                <p className="text-2xl font-semibold text-gray-900">€{reportData.keyMetrics?.totalAdSpend?.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">{translations.metrics.totalInvestment}</p>
              </div>

              <div className="text-center">
                <div className="mb-2">
                  <DollarSign className="w-5 h-5 text-gray-400 mx-auto" />
                </div>
                <p className="text-2xl font-semibold text-gray-900">€{reportData.keyMetrics?.revenueFromAds?.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">{translations.metrics.revenueGenerated}</p>
              </div>

              <div className="text-center">
                <div className="mb-2">
                  <TrendingUp className="w-5 h-5 text-gray-400 mx-auto" />
                </div>
                <p className="text-2xl font-semibold text-gray-900">{reportData.keyMetrics?.roas?.toFixed(2)}x</p>
                <p className="text-xs text-gray-500 mt-1">{translations.metrics.returnOnAdSpend}</p>
              </div>

              <div className="text-center">
                <div className="mb-2">
                  <Percent className="w-5 h-5 text-gray-400 mx-auto" />
                </div>
                <p className="text-2xl font-semibold text-gray-900">{(reportData.keyMetrics?.adEngagementRate * 100)?.toFixed(2)}%</p>
                <p className="text-xs text-gray-500 mt-1">{translations.metrics.averageEngagement}</p>
              </div>

              <div className="text-center">
                <div className="mb-2">
                  <MousePointerClick className="w-5 h-5 text-gray-400 mx-auto" />
                </div>
                <p className="text-2xl font-semibold text-gray-900">€{reportData.keyMetrics?.costPerVisitor?.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">{translations.metrics.averageCostPerClick}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Performance Dashboard */}
        <div className="pdf-page-break mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">{translations.visualDashboard}</h2>
          <div className="grid grid-cols-2 gap-8">
            {/* Revenue vs Spend Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{translations.charts.revenueVsSpend.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{translations.charts.revenueVsSpend.description}</p>
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
                      name={isFrench ? "Revenu" : "Revenue"}
                    />
                    <Bar
                      dataKey="spend"
                      fill="#60A5FA"
                      name={isFrench ? "Dépenses" : "Spend"}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ROAS Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{translations.charts.adReturn.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{translations.charts.adReturn.description}</p>
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
                      name={isFrench ? "ROAS" : "ROAS"}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Click Performance Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{translations.charts.clickPerformance.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{translations.charts.clickPerformance.description}</p>
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
                      name={isFrench ? "Clics" : "Clicks"}
                    />
                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey="engagementRate"
                      stroke="#60A5FA"
                      fill="#60A5FA"
                      fillOpacity={0.1}
                      name={isFrench ? "Taux d'Engagement %" : "Engagement Rate %"}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Revenue Distribution Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{translations.charts.revenueDistribution.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{translations.charts.revenueDistribution.description}</p>
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
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">{translations.campaignPerformance}</h2>
          <div className="space-y-6">
            {(reportData.campaigns || []).map((campaign) => (
              <div key={campaign.name} className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{campaign.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{campaign.insight}</p>
                <div className="grid grid-cols-6 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">{isFrench ? "Dépenses" : "Spend"}</p>
                    <p className="text-sm font-medium">€{campaign.spend.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{isFrench ? "Revenu" : "Revenue"}</p>
                    <p className="text-sm font-medium">€{campaign.revenue.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{isFrench ? "€ par €" : "€ per €"}</p>
                    <p className="text-sm font-medium">{campaign.roas.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{isFrench ? "Clics" : "Clicks"}</p>
                    <p className="text-sm font-medium">{campaign.clicks.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{isFrench ? "Coût/Visiteur" : "Cost/Visitor"}</p>
                    <p className="text-sm font-medium">€{campaign.costPerVisitor.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{isFrench ? "Engagement" : "Engagement"}</p>
                    <p className="text-sm font-medium">{campaign.engagementRate.toFixed(2)}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visibility & Missed Opportunities */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">{translations.visibilityOpportunities}</h2>
          <p className="text-gray-600 mb-6"> 
            {reportData.visibility_campaign[0].insight}
          </p>
          <div className="space-y-6">
            {(reportData.visibility_campaign || []).map((campaign) => (
              <div key={campaign.name} className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                  <span className="text-sm text-gray-500">{translations.totalPotentialReach}</span>
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
                  <span className="text-blue-600">{translations.visibility.captured} ({campaign.reachCaptured}%)</span>
                  <span className="text-yellow-600">{translations.visibility.budgetLimited} ({campaign.reachMissedDueToBudget}%)</span>
                  <span className="text-red-600">{translations.visibility.rankingLimited} ({campaign.reachMissedDueToLowRanking}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Summary */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">{translations.performanceSummary}</h2>
          <div className="bg-gray-50 p-6 rounded-xl">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                </div>
              </div>
              <p className="text-gray-700">{reportData.performanceSummary?.allsummary ?? translations.noPerformanceSummary}</p>
            </div>
          </div>
        </div>

        {/* Strategic Action Plan */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">{translations.strategicActionPlan}</h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-green-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-green-700 mb-3">{translations.actionItems.whatsWorking}</h3>
              <ul className="space-y-2 text-green-600">
                {(reportData.actionPlan?.whatsWorking || []).map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
            <div className="bg-yellow-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-yellow-700 mb-3">{translations.actionItems.needsReview}</h3>
              <ul className="space-y-2 text-yellow-600">
                {(reportData.actionPlan?.needsReview || []).map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-blue-700 mb-3">{translations.actionItems.nextSteps}</h3>
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
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{translations.increaseRevenue}</h2>
          <div className="flex justify-center space-x-4">
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
              {translations.buttons.bookStrategy}
            </button>
            <button 
              onClick={generatePDF}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              {translations.buttons.downloadPDF}
            </button>
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              {translations.buttons.generateAnother}
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
} 