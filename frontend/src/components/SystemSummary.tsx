import React from 'react';
import { useData } from '../contexts/DataContext';
import { CheckCircle, AlertTriangle, AlertCircle, Clock, BarChart, TrendingUp } from 'lucide-react';

const SystemSummary: React.FC = () => {
  const { systemStatus } = useData();

  // Get status icon based on overall status
  const getStatusIcon = () => {
    switch (systemStatus.overall) {
      case 'optimal':
        return <CheckCircle className="h-5 w-5 text-emerald-400" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case 'critical':
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      default:
        return null;
    }
  };

  // Get status text and color based on overall status
  const getStatusText = () => {
    switch (systemStatus.overall) {
      case 'optimal':
        return { text: 'All Systems Operational', color: 'text-emerald-400' };
      case 'warning':
        return { text: 'Performance Degradation', color: 'text-yellow-400' };
      case 'critical':
        return { text: 'Critical Issues Detected', color: 'text-red-400' };
      default:
        return { text: 'Status Unknown', color: 'text-slate-400' };
    }
  };

  const statusText = getStatusText();

  return (
    <div className="flex space-x-4">
      {/* System Status */}
      <div className="bg-slate-700 rounded-lg px-3 py-2 flex items-center">
        {getStatusIcon()}
        <div className="ml-2">
          <div className="text-xs text-slate-400">System Status</div>
          <div className={`text-sm font-bold ${statusText.color}`}>{statusText.text}</div>
        </div>
      </div>
      
      {/* Uptime */}
      <div className="bg-slate-700 rounded-lg px-3 py-2 flex items-center">
        <Clock className="h-5 w-5 text-blue-400" />
        <div className="ml-2">
          <div className="text-xs text-slate-400">Uptime</div>
          <div className="text-sm font-bold text-blue-400">{systemStatus.uptime}</div>
        </div>
      </div>
      
      {/* Performance Score */}
      <div className="bg-slate-700 rounded-lg px-3 py-2 flex items-center">
        <BarChart className="h-5 w-5 text-purple-400" />
        <div className="ml-2">
          <div className="text-xs text-slate-400">Performance</div>
          <div className="text-sm font-bold text-purple-400">{systemStatus.performanceScore}/100</div>
        </div>
      </div>
      
      {/* Predicted Improvements */}
      <div className="bg-slate-700 rounded-lg px-3 py-2 flex items-center">
        <TrendingUp className="h-5 w-5 text-emerald-400" />
        <div className="ml-2">
          <div className="text-xs text-slate-400">AI Optimization</div>
          <div className="text-sm font-bold text-emerald-400">{systemStatus.predictedImprovements}</div>
        </div>
      </div>
    </div>
  );
};

export default SystemSummary;