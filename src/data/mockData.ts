export const mockData = {
  dailyData: [
    { date: '03/01', revenue: 2800, spend: 500, roas: 5.6, clicks: 450, engagementRate: 2.1 },
    { date: '03/05', revenue: 3200, spend: 550, roas: 5.8, clicks: 480, engagementRate: 2.3 },
    { date: '03/10', revenue: 3500, spend: 600, roas: 5.8, clicks: 520, engagementRate: 2.4 },
    { date: '03/15', revenue: 3300, spend: 580, roas: 5.7, clicks: 490, engagementRate: 2.2 },
    { date: '03/20', revenue: 3100, spend: 540, roas: 5.7, clicks: 470, engagementRate: 2.3 },
    { date: '03/25', revenue: 3400, spend: 570, roas: 6.0, clicks: 510, engagementRate: 2.5 },
    { date: '03/31', revenue: 3200, spend: 550, roas: 5.8, clicks: 485, engagementRate: 2.4 }
  ],
  campaignData: [
    {
      name: 'Brand Search',
      spend: 2130,
      revenue: 18760,
      clicks: 4211,
      costPerClick: 8.81,
      convValue: 0.51,
      engagement: 4.21,
      visibility: {
        captured: 85,
        budgetLimited: 8,
        rankingLimited: 7
      }
    },
    {
      name: 'Performance Max',
      spend: 4560,
      revenue: 44050,
      clicks: 9380,
      costPerClick: 6.72,
      convValue: 0.70,
      engagement: 3.34,
      visibility: {
        captured: 75,
        budgetLimited: 15,
        rankingLimited: 10
      }
    },
    {
      name: 'Generic Search',
      spend: 3410,
      revenue: 9230,
      clicks: 6102,
      costPerClick: 2.71,
      convValue: 0.56,
      engagement: 2.15,
      visibility: {
        captured: 64,
        budgetLimited: 12,
        rankingLimited: 24
      }
    }
  ],
  revenueDistribution: [
    { name: 'Brand Search', value: 26 },
    { name: 'Performance Max', value: 61 },
    { name: 'Generic Search', value: 13 }
  ]
}; 