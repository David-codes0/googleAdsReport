import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

export function DateRangeSelector() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Date Range</h2>
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-2">
            Start Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="date"
              id="start-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="pl-10 w-full rounded-lg border-gray-300 shadow-sm
                focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Autodetect from file"
            />
          </div>
        </div>
        <div>
          <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-2">
            End Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="date"
              id="end-date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="pl-10 w-full rounded-lg border-gray-300 shadow-sm
                focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Autodetect from file"
            />
          </div>
        </div>
      </div>
    </div>
  );
}