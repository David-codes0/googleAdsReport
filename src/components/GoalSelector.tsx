import React from 'react';
import { Target, DollarSign, Settings2 } from 'lucide-react';

type GoalType = 'roas' | 'cpa' | 'custom';

interface GoalSelectorProps {
  selectedGoal: GoalType;
  onSelectGoal: (goal: GoalType) => void;
}

const goals = [
  {
    id: 'roas',
    icon: DollarSign,
    title: 'ROAS / Revenue Focused',
    description: 'Focus the report on return on ad spend, conversion value, and revenue',
  },
  {
    id: 'cpa',
    icon: Target,
    title: 'Leads / CPA Focused',
    description: 'Highlight cost-per-acquisition, lead volume, and funnel efficiency',
  },
  {
    id: 'custom',
    icon: Settings2,
    title: 'Custom Metrics',
    description: 'Choose your own focus metrics manually',
    comingSoon: true,
  },
] as const;

export function GoalSelector({ selectedGoal, onSelectGoal }: GoalSelectorProps) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Select Your Report Focus</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {goals.map(({ id, icon: Icon, title, description, comingSoon }) => (
          <button
            key={id}
            onClick={() => !comingSoon && onSelectGoal(id)}
            disabled={comingSoon}
            className={`
              relative p-6 rounded-xl text-left transition-all
              ${selectedGoal === id
                ? 'bg-indigo-600 text-white shadow-lg scale-[1.02]'
                : comingSoon
                  ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
              }
            `}
          >
            {comingSoon && (
              <span className="absolute top-3 right-3 text-xs font-semibold px-2 py-1 bg-gray-200 text-gray-600 rounded-full">
                Coming Soon
              </span>
            )}
            <Icon className={`w-8 h-8 mb-4 ${
              selectedGoal === id 
                ? 'text-white' 
                : comingSoon 
                  ? 'text-gray-400'
                  : 'text-indigo-600'
            }`} />
            <h3 className="font-semibold mb-2">{title}</h3>
            <p className={`text-sm ${
              selectedGoal === id 
                ? 'text-indigo-100' 
                : comingSoon
                  ? 'text-gray-400'
                  : 'text-gray-600'
            }`}>
              {description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}