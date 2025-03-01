import React, { useState } from 'react';
import { DataProvider, useData } from '../contexts/DataContext';
import TopologyMap from '../components/TopologyMap';
import AILogPanel from '../../extra/AILogPanel';
import SystemSummary from '../components/SystemSummary';
import SimulationControls from '../components/SimulationControls';
// Import the original MetricsPanel instead of redefining it
import MetricsPanel from '../components/MetricsPanel';
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  X,
  BarChart2,
  Activity,
  Clock,
  AlertTriangle,
  Users,
  Zap,
  Wifi,
} from 'lucide-react';

// Create a reusable graph component for the metrics modal
const MetricGraph = ({ metricName, color, title, icon }) => {
  const { metrics } = useData();
  const data = metrics[metricName] || [];

  // Skip rendering if no data
  if (data.length === 0)
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-slate-500">No data available</span>
      </div>
    );

  const values = data.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  return (
    <div className="h-full relative">
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
          {data.length > 0 && (
            <>
              <span>
                {new Date(data[0].timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              <span>
                {new Date(
                  data[Math.floor(data.length / 2)].timestamp
                ).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              <span>
                {new Date(data[data.length - 1].timestamp).toLocaleTimeString(
                  [],
                  { hour: '2-digit', minute: '2-digit' }
                )}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Create a modified MetricsPanel for the sidebar (no graphs, no dropdowns)
const SimpleMetricsPanel = () => {
  const { metrics } = useData();

  // Extract latest values
  const getLatestValue = (metricName) => {
    const data = metrics[metricName] || [];
    return data.length > 0 ? data[data.length - 1].value : 0;
  };

  const throughput = getLatestValue('throughput');
  const latency = getLatestValue('latency');
  const packetLoss = getLatestValue('packetLoss');
  const userConnectivity = getLatestValue('userConnectivity');

  return (
    <div className="space-y-6">
      {/* Throughput */}
      <div className="bg-slate-900 p-4 rounded-lg">
        <div className="flex items-center mb-1">
          <Zap className="h-5 w-5 text-emerald-400 mr-2" />
          <h3 className="text-lg font-medium">Throughput</h3>
        </div>
        <div className="text-2xl font-bold text-emerald-400">
          {throughput.toFixed(1)} Mbps
        </div>
        {/* No graph displayed here */}
      </div>

      {/* Latency */}
      <div className="bg-slate-900 p-4 rounded-lg">
        <div className="flex items-center mb-1">
          <Activity className="h-5 w-5 text-blue-400 mr-2" />
          <h3 className="text-lg font-medium">Latency</h3>
        </div>
        <div className="text-2xl font-bold text-blue-400">
          {latency.toFixed(1)} ms
        </div>
        {/* No graph displayed here */}
      </div>

      {/* Packet Loss */}
      <div className="bg-slate-900 p-4 rounded-lg">
        <div className="flex items-center mb-1">
          <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
          <h3 className="text-lg font-medium">Packet Loss</h3>
        </div>
        <div className="text-2xl font-bold text-yellow-400">
          {packetLoss.toFixed(2)}%
        </div>
        {/* No graph displayed here */}
      </div>

      {/* User Connectivity */}
      <div className="bg-slate-900 p-4 rounded-lg">
        <div className="flex items-center mb-1">
          <Wifi className="h-5 w-5 text-purple-400 mr-2" />
          <h3 className="text-lg font-medium">User Connectivity</h3>
        </div>
        <div className="text-2xl font-bold text-purple-400">
          {userConnectivity.toFixed(1)}%
        </div>
        {/* No graph displayed here */}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [simulationPanelOpen, setSimulationPanelOpen] = useState(false);
  const [metricsModalOpen, setMetricsModalOpen] = useState(false);

  return (
    <DataProvider>
      <div className="h-screen w-screen overflow-hidden bg-slate-900 text-white flex flex-col">
        {/* Top Navbar/Header - Fixed at top */}
        <header className="bg-slate-800 border-b border-slate-700 py-2 px-4 shadow-md z-10">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              EdgeConnect RuralNet
            </h1>
            <SystemSummary />
          </div>
        </header>

        {/* Main Content Area - Takes remaining height */}
        <div className="flex flex-1 relative overflow-hidden">
          {/* Left Sidebar - Network Performance Metrics */}
          <div
            className={`absolute top-0 left-0 h-full bg-slate-800 border-r border-slate-700 transition-all duration-300 ease-in-out z-20 ${
              leftSidebarOpen ? 'w-80' : 'w-0'
            }`}
          >
            {leftSidebarOpen && (
              <div className="h-full flex flex-col">
                <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Performance Metrics</h2>
                  <button
                    onClick={() => setMetricsModalOpen(true)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium flex items-center gap-1 transition-colors"
                  >
                    <BarChart2 size={16} />
                    <span>Show Details</span>
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  {/* Use the SimpleMetricsPanel instead of MetricsPanel */}
                  <SimpleMetricsPanel />
                </div>
              </div>
            )}
            <button
              className="absolute top-4 -right-10 bg-slate-700 hover:bg-slate-600 p-2 rounded-r-md shadow-md"
              onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
            >
              {leftSidebarOpen ? (
                <ChevronLeft size={18} />
              ) : (
                <ChevronRight size={18} />
              )}
            </button>
          </div>

          {/* Main Content - Interactive Map (Full Screen Background) */}
          <div className="absolute inset-0">
            <TopologyMap />
          </div>

          {/* Right Sidebar - AI Realtime Logs */}
          <div
            className={`absolute top-0 right-0 h-full bg-slate-800 border-l border-slate-700 transition-all duration-300 ease-in-out z-20 ${
              rightSidebarOpen ? 'w-80' : 'w-0'
            }`}
          >
            {rightSidebarOpen && (
              <div className="h-full flex flex-col">
                {/* Fixed Heading */}
                <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-slate-800 sticky top-0 z-10">
                  <h2 className="text-xl font-semibold">AI Realtime Logs</h2>
                  <button
                    className="text-slate-400 hover:text-white"
                    onClick={() => setRightSidebarOpen(false)}
                  >
                    <X size={18} />
                  </button>
                </div>
                {/* Fixed Height for Logs with Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4 max-h-[calc(100%-50px)]">
                  <AILogPanel />
                </div>
              </div>
            )}
            {!rightSidebarOpen && (
              <button
                className="absolute top-4 -left-10 bg-slate-700 hover:bg-slate-600 p-2 rounded-l-md shadow-md"
                onClick={() => setRightSidebarOpen(true)}
              >
                <ChevronLeft size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Bottom Panel - Simulation Controls */}
        <div
          className={`bg-slate-800 border-t border-slate-700 transition-all duration-300 ease-in-out ${
            simulationPanelOpen ? 'h-32' : 'h-12'
          }`}
        >
          <div
            className="px-4 py-2 flex items-center justify-between cursor-pointer"
            onClick={() => setSimulationPanelOpen(!simulationPanelOpen)}
          >
            <h2 className="text-xl font-semibold">Simulation Controls</h2>
            <button className="text-slate-400 hover:text-white">
              {simulationPanelOpen ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronUp size={18} />
              )}
            </button>
          </div>

          {simulationPanelOpen && (
            <div className="px-4 pb-2">
              <SimulationControls />
            </div>
          )}
        </div>

        {/* Performance Metrics Modal - Appears when Show Details is clicked */}
        {metricsModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-slate-800 rounded-lg shadow-xl w-4/5 max-w-5xl max-h-[90vh] flex flex-col border border-slate-700 animate-scaleIn">
              <div className="flex items-center justify-between border-b border-slate-700 p-4">
                <h2 className="text-xl font-bold text-white">
                  Network Performance Metrics
                </h2>
                <button
                  onClick={() => setMetricsModalOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-700 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-900 p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <Zap className="h-5 w-5 text-emerald-400 mr-2" />
                      <span className="text-emerald-400">Throughput</span>
                    </h3>
                    <div className="h-64 bg-slate-800 rounded border border-slate-700 p-4">
                      <MetricGraph
                        metricName="throughput"
                        color="rgb(52, 211, 153)"
                        title="Throughput"
                        icon={<Zap />}
                      />
                    </div>
                  </div>

                  <div className="bg-slate-900 p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <Activity className="h-5 w-5 text-blue-400 mr-2" />
                      <span className="text-blue-400">Latency</span>
                    </h3>
                    <div className="h-64 bg-slate-800 rounded border border-slate-700 p-4">
                      <MetricGraph
                        metricName="latency"
                        color="rgb(96, 165, 250)"
                        title="Latency"
                        icon={<Activity />}
                      />
                    </div>
                  </div>

                  <div className="bg-slate-900 p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <BarChart2 className="h-5 w-5 text-yellow-400 mr-2" />
                      <span className="text-yellow-400">Packet Loss</span>
                    </h3>
                    <div className="h-64 bg-slate-800 rounded border border-slate-700 p-4">
                      <MetricGraph
                        metricName="packetLoss"
                        color="rgb(250, 204, 21)"
                        title="Packet Loss"
                        icon={<BarChart2 />}
                      />
                    </div>
                  </div>

                  <div className="bg-slate-900 p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <Wifi className="h-5 w-5 text-purple-400 mr-2" />
                      <span className="text-purple-400">User Connectivity</span>
                    </h3>
                    <div className="h-64 bg-slate-800 rounded border border-slate-700 p-4">
                      <MetricGraph
                        metricName="userConnectivity"
                        color="rgb(192, 132, 252)"
                        title="User Connectivity"
                        icon={<Wifi />}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-700 p-4 flex justify-end">
                <button
                  onClick={() => setMetricsModalOpen(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-md font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DataProvider>
  );
};

export default Dashboard;
