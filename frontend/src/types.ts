// Network topology types
export interface NetworkNode {
  id: string;
  name: string;
  type: 'village' | 'tower' | 'satellite';
  status: 'optimal' | 'warning' | 'critical';
  coordinates: {
    x: number;
    y: number;
  };
  metrics: {
    throughput: number; // Mbps
    latency: number; // ms
    users: number; // connected users
  };
}

export interface NetworkLink {
  id: string;
  source: string; // node id
  target: string; // node id
  status: 'optimal' | 'warning' | 'critical';
  bandwidth: number; // Mbps
}

// Metrics types
export interface MetricData {
  timestamp: string;
  value: number;
}

// AI decision types
export interface AIDecision {
  id: string;
  timestamp: string;
  action: string;
  description: string;
  impact: string;
}

// System status types
export interface SystemStatus {
  overall: 'optimal' | 'warning' | 'critical';
  uptime: string;
  performanceScore: number;
  predictedImprovements: string;
}

// Simulation scenario types
export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  effects: {
    nodeChanges?: Array<{
      nodeId: string;
      newStatus: 'optimal' | 'warning' | 'critical';
    }>;
    linkChanges?: Array<{
      linkId: string;
      newStatus: 'optimal' | 'warning' | 'critical';
    }>;
    metricChanges?: {
      throughput?: number;
      latency?: number;
      packetLoss?: number;
    };
  };
}