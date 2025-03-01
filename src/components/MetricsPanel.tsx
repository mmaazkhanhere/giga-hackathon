import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import {
  Activity,
  Zap,
  Wifi,
  BarChart2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const MetricsPanel: React.FC = () => {
  const { metrics } = useData();
  const [expandedMetrics, setExpandedMetrics] = useState<string[]>([
    'throughput',
  ]);

  // Get the latest value for each metric
  const latestThroughput =
    metrics.throughput.length > 0
      ? metrics.throughput[metrics.throughput.length - 1].value
      : 0;

  const latestLatency =
    metrics.latency.length > 0
      ? metrics.latency[metrics.latency.length - 1].value
      : 0;

  const latestPacketLoss =
    metrics.packetLoss.length > 0
      ? metrics.packetLoss[metrics.packetLoss.length - 1].value
      : 0;

  const latestUserConnectivity =
    metrics.userConnectivity.length > 0
      ? metrics.userConnectivity[metrics.userConnectivity.length - 1].value
      : 0;

  // Toggle expanded state for a metric
  const toggleExpand = (metricName: string) => {
    if (expandedMetrics.includes(metricName)) {
      setExpandedMetrics(expandedMetrics.filter((m) => m !== metricName));
    } else {
      setExpandedMetrics([...expandedMetrics, metricName]);
    }
  };

  // Helper function to draw a simple sparkline
  const renderSparkline = (
    data: number[],
    color: string,
    height: number = 40
  ) => {
    if (data.length === 0) return null;

    const values = data.map((d) => d);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    const points = values
      .map((value, index) => {
        const x = (index / (values.length - 1)) * 100;
        const y = 100 - ((value - min) / range) * 100;
        return `${x},${y}`;
      })
      .join(' ');

    return (
      <svg width="100%" height={height} className="overflow-visible">
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  // Helper function to render detailed graph
  const renderDetailedGraph = (
    data: { timestamp: string; value: number }[],
    color: string
  ) => {
    if (data.length === 0) return null;

    const values = data.map((d) => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    return (
      <div className="mt-3 bg-slate-800 rounded-lg p-3 h-40 relative">
        <div className="absolute inset-y-0 left-0 flex flex-col justify-between text-xs text-slate-500 px-1">
          <span>{max.toFixed(1)}</span>
          <span>{((max + min) / 2).toFixed(1)}</span>
          <span>{min.toFixed(1)}</span>
        </div>
        <div className="ml-8 h-full relative">
          <svg width="100%" height="100%" className="overflow-visible">
            {/* Horizontal grid lines */}
            <line
              x1="0"
              y1="0%"
              x2="100%"
              y2="0%"
              stroke="rgba(100, 116, 139, 0.2)"
            />
            <line
              x1="0"
              y1="50%"
              x2="100%"
              y2="50%"
              stroke="rgba(100, 116, 139, 0.2)"
            />
            <line
              x1="0"
              y1="100%"
              x2="100%"
              y2="100%"
              stroke="rgba(100, 116, 139, 0.2)"
            />

            {/* Data points */}
            <polyline
              points={values
                .map((value, index) => {
                  const x = (index / (values.length - 1)) * 100;
                  const y = 100 - ((value - min) / range) * 100;
                  return `${x}%,${y}%`;
                })
                .join(' ')}
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data points */}
            {values.map((value, index) => {
              const x = (index / (values.length - 1)) * 100;
              const y = 100 - ((value - min) / range) * 100;
              return (
                <circle
                  key={index}
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r="3"
                  fill={color}
                  className="hover:r-4 transition-all duration-200"
                />
              );
            })}
          </svg>

          {/* Time labels */}
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>
              {new Date(data[0].timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
            <span>
              {new Date(
                data[Math.floor(data.length / 2)].timestamp
              ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span>
              {new Date(data[data.length - 1].timestamp).toLocaleTimeString(
                [],
                { hour: '2-digit', minute: '2-digit' }
              )}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Throughput */}
      <div className="bg-slate-700 rounded-lg p-4 transition-all duration-300">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleExpand('throughput')}
        >
          <div className="flex items-center">
            <Zap className="h-5 w-5 text-emerald-400 mr-2" />
            <h3 className="font-medium">Throughput</h3>
          </div>
          <div className="flex items-center">
            <span className="text-emerald-400 font-bold mr-2">
              {latestThroughput.toFixed(1)} Mbps
            </span>
            {expandedMetrics.includes('throughput') ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </div>
        </div>

        {!expandedMetrics.includes('throughput') &&
          renderSparkline(
            metrics.throughput.map((m) => m.value),
            'rgb(52, 211, 153)'
          )}

        {expandedMetrics.includes('throughput') &&
          renderDetailedGraph(metrics.throughput, 'rgb(52, 211, 153)')}
      </div>

      {/* Latency */}
      <div className="bg-slate-700 rounded-lg p-4 transition-all duration-300">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleExpand('latency')}
        >
          <div className="flex items-center">
            <Activity className="h-5 w-5 text-blue-400 mr-2" />
            <h3 className="font-medium">Latency</h3>
          </div>
          <div className="flex items-center">
            <span className="text-blue-400 font-bold mr-2">
              {latestLatency.toFixed(1)} ms
            </span>
            {expandedMetrics.includes('latency') ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </div>
        </div>

        {!expandedMetrics.includes('latency') &&
          renderSparkline(
            metrics.latency.map((m) => m.value),
            'rgb(96, 165, 250)'
          )}

        {expandedMetrics.includes('latency') &&
          renderDetailedGraph(metrics.latency, 'rgb(96, 165, 250)')}
      </div>

      {/* Packet Loss */}
      <div className="bg-slate-700 rounded-lg p-4 transition-all duration-300">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleExpand('packetLoss')}
        >
          <div className="flex items-center">
            <BarChart2 className="h-5 w-5 text-yellow-400 mr-2" />
            <h3 className="font-medium">Packet Loss</h3>
          </div>
          <div className="flex items-center">
            <span className="text-yellow-400 font-bold mr-2">
              {latestPacketLoss.toFixed(2)}%
            </span>
            {expandedMetrics.includes('packetLoss') ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </div>
        </div>

        {!expandedMetrics.includes('packetLoss') &&
          renderSparkline(
            metrics.packetLoss.map((m) => m.value),
            'rgb(250, 204, 21)'
          )}

        {expandedMetrics.includes('packetLoss') &&
          renderDetailedGraph(metrics.packetLoss, 'rgb(250, 204, 21)')}
      </div>

      {/* User Connectivity */}
      <div className="bg-slate-700 rounded-lg p-4 transition-all duration-300">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleExpand('userConnectivity')}
        >
          <div className="flex items-center">
            <Wifi className="h-5 w-5 text-purple-400 mr-2" />
            <h3 className="font-medium">User Connectivity</h3>
          </div>
          <div className="flex items-center">
            <span className="text-purple-400 font-bold mr-2">
              {latestUserConnectivity.toFixed(1)}%
            </span>
            {expandedMetrics.includes('userConnectivity') ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </div>
        </div>

        {!expandedMetrics.includes('userConnectivity') &&
          renderSparkline(
            metrics.userConnectivity.map((m) => m.value),
            'rgb(192, 132, 252)'
          )}

        {expandedMetrics.includes('userConnectivity') &&
          renderDetailedGraph(metrics.userConnectivity, 'rgb(192, 132, 252)')}
      </div>
    </div>
  );
};

export default MetricsPanel;
