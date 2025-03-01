import React, { createContext, useContext, useState, useEffect } from 'react';
import { setupWebSocket } from '../services/websocket';
import { fetchInitialData } from '../services/api';
import { 
  NetworkNode, 
  NetworkLink, 
  MetricData, 
  AIDecision, 
  SystemStatus,
  SimulationScenario
} from '../types';

// Mock initial data
const initialState = {
  nodes: [],
  links: [],
  metrics: {
    throughput: [],
    latency: [],
    packetLoss: [],
    userConnectivity: []
  },
  aiDecisions: [],
  systemStatus: {
    overall: 'optimal',
    uptime: '99.8%',
    performanceScore: 92,
    predictedImprovements: '15% latency reduction'
  },
  activeScenario: null
};

interface DataContextType {
  nodes: NetworkNode[];
  links: NetworkLink[];
  metrics: {
    throughput: MetricData[];
    latency: MetricData[];
    packetLoss: MetricData[];
    userConnectivity: MetricData[];
  };
  aiDecisions: AIDecision[];
  systemStatus: SystemStatus;
  activeScenario: SimulationScenario | null;
  triggerScenario: (scenario: SimulationScenario) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState(initialState);

  const triggerScenario = (scenario: SimulationScenario) => {
    // In a real app, this would send a request to the backend
    console.log(`Triggering scenario: ${scenario.name}`);
    setData(prev => ({
      ...prev,
      activeScenario: scenario
    }));
    
    // Simulate AI response after a delay
    setTimeout(() => {
      const newDecision: AIDecision = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        action: `Responding to ${scenario.name}`,
        description: `Optimizing network for ${scenario.description}`,
        impact: 'Latency reduced by 18%'
      };
      
      setData(prev => ({
        ...prev,
        aiDecisions: [newDecision, ...prev.aiDecisions].slice(0, 50)
      }));
    }, 2000);
  };

  useEffect(() => {
    // In a real app, this would fetch actual data from the backend
    const loadInitialData = async () => {
      try {
        const initialData = await fetchInitialData();
        setData(initialData);
      } catch (error) {
        console.error('Failed to load initial data:', error);
        // Use mock data as fallback
        setData({
          ...initialState,
          nodes: mockNodes,
          links: mockLinks,
          aiDecisions: mockAIDecisions,
          metrics: {
            throughput: generateMetricData(24, 50, 100),
            latency: generateMetricData(24, 10, 50),
            packetLoss: generateMetricData(24, 0, 5),
            userConnectivity: generateMetricData(24, 70, 100)
          }
        });
      }
    };

    loadInitialData();

    // Set up WebSocket connection for real-time updates
    const cleanupWebSocket = setupWebSocket((message) => {
      // Handle different types of real-time updates
      if (message.type === 'NODE_UPDATE') {
        setData(prev => ({
          ...prev,
          nodes: prev.nodes.map(node => 
            node.id === message.data.id ? { ...node, ...message.data } : node
          )
        }));
      } else if (message.type === 'METRIC_UPDATE') {
        setData(prev => ({
          ...prev,
          metrics: {
            ...prev.metrics,
            [message.data.type]: [
              ...prev.metrics[message.data.type],
              message.data.value
            ].slice(-50) // Keep last 50 data points
          }
        }));
      } else if (message.type === 'AI_DECISION') {
        setData(prev => ({
          ...prev,
          aiDecisions: [message.data, ...prev.aiDecisions].slice(0, 50)
        }));
      } else if (message.type === 'SYSTEM_STATUS') {
        setData(prev => ({
          ...prev,
          systemStatus: message.data
        }));
      }
    });

    // Simulate real-time updates for the demo
    const simulateUpdates = setInterval(() => {
      // Simulate metric updates
      const metricTypes = ['throughput', 'latency', 'packetLoss', 'userConnectivity'];
      const randomMetric = metricTypes[Math.floor(Math.random() * metricTypes.length)];
      
      setData(prev => {
        let newValue;
        if (randomMetric === 'throughput') {
          newValue = Math.random() * 50 + 50; // 50-100 Mbps
        } else if (randomMetric === 'latency') {
          newValue = Math.random() * 40 + 10; // 10-50 ms
        } else if (randomMetric === 'packetLoss') {
          newValue = Math.random() * 5; // 0-5%
        } else {
          newValue = Math.random() * 30 + 70; // 70-100%
        }
        
        return {
          ...prev,
          metrics: {
            ...prev.metrics,
            [randomMetric]: [
              ...prev.metrics[randomMetric],
              {
                timestamp: new Date().toISOString(),
                value: newValue
              }
            ].slice(-50)
          }
        };
      });
      
      // Occasionally simulate node status changes
      if (Math.random() < 0.2) {
        const statuses = ['optimal', 'warning', 'critical'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        const randomNodeIndex = Math.floor(Math.random() * mockNodes.length);
        
        setData(prev => ({
          ...prev,
          nodes: prev.nodes.map((node, index) => 
            index === randomNodeIndex ? { ...node, status: randomStatus } : node
          )
        }));
        
        // If status changed to warning or critical, simulate AI response
        if (randomStatus !== 'optimal') {
          setTimeout(() => {
            const newDecision: AIDecision = {
              id: Date.now().toString(),
              timestamp: new Date().toISOString(),
              action: `Optimizing Node ${randomNodeIndex + 1}`,
              description: `Responding to ${randomStatus} status`,
              impact: 'Performance improved by 25%'
            };
            
            setData(prev => ({
              ...prev,
              aiDecisions: [newDecision, ...prev.aiDecisions].slice(0, 50),
              nodes: prev.nodes.map((node, index) => 
                index === randomNodeIndex ? { ...node, status: 'optimal' } : node
              )
            }));
          }, 3000);
        }
      }
    }, 3000);

    return () => {
      cleanupWebSocket();
      clearInterval(simulateUpdates);
    };
  }, []);

  return (
    <DataContext.Provider value={{ ...data, triggerScenario }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Mock data for development
const mockNodes: NetworkNode[] = [
  { id: '1', name: 'Village A', type: 'village', status: 'optimal', coordinates: { x: 100, y: 100 }, metrics: { throughput: 25, latency: 15, users: 45 } },
  { id: '2', name: 'Village B', type: 'village', status: 'warning', coordinates: { x: 250, y: 150 }, metrics: { throughput: 18, latency: 25, users: 32 } },
  { id: '3', name: 'Village C', type: 'village', status: 'optimal', coordinates: { x: 150, y: 250 }, metrics: { throughput: 22, latency: 18, users: 38 } },
  { id: '4', name: 'Tower 1', type: 'tower', status: 'optimal', coordinates: { x: 180, y: 180 }, metrics: { throughput: 85, latency: 8, users: 115 } },
  { id: '5', name: 'Tower 2', type: 'tower', status: 'critical', coordinates: { x: 300, y: 220 }, metrics: { throughput: 45, latency: 35, users: 78 } },
  { id: '6', name: 'Satellite Link', type: 'satellite', status: 'optimal', coordinates: { x: 220, y: 80 }, metrics: { throughput: 120, latency: 250, users: 200 } }
];

const mockLinks: NetworkLink[] = [
  { id: '1', source: '1', target: '4', status: 'optimal', bandwidth: 30 },
  { id: '2', source: '2', target: '4', status: 'warning', bandwidth: 25 },
  { id: '3', source: '3', target: '4', status: 'optimal', bandwidth: 28 },
  { id: '4', source: '4', target: '5', status: 'optimal', bandwidth: 80 },
  { id: '5', source: '5', target: '6', status: 'critical', bandwidth: 40 },
  { id: '6', source: '4', target: '6', status: 'optimal', bandwidth: 100 }
];

const mockAIDecisions: AIDecision[] = [
  { 
    id: '1', 
    timestamp: new Date(Date.now() - 60000).toISOString(), 
    action: 'Activated backup link', 
    description: 'Detected high latency on Tower 2, activated backup satellite link', 
    impact: 'Latency reduced by 45%' 
  },
  { 
    id: '2', 
    timestamp: new Date(Date.now() - 180000).toISOString(), 
    action: 'Bandwidth reallocation', 
    description: 'Optimized bandwidth allocation for Village B during peak hours', 
    impact: 'Throughput increased by 22%' 
  },
  { 
    id: '3', 
    timestamp: new Date(Date.now() - 360000).toISOString(), 
    action: 'Packet routing optimization', 
    description: 'Modified routing algorithm to reduce congestion at Tower 1', 
    impact: 'Packet loss reduced from 3.2% to 0.8%' 
  }
];

// Helper function to generate mock metric data
function generateMetricData(count: number, min: number, max: number): MetricData[] {
  const now = Date.now();
  return Array.from({ length: count }, (_, i) => ({
    timestamp: new Date(now - (count - i) * 60000).toISOString(),
    value: Math.random() * (max - min) + min
  }));
}