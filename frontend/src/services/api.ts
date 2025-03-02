import { 
  NetworkNode, 
  NetworkLink, 
  MetricData, 
  AIDecision, 
  SystemStatus 
} from '../types';

// In a real application, these functions would make actual API calls
// For this demo, we'll simulate API responses

export async function fetchInitialData() {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // This would normally be a fetch call to your backend API
  // return await fetch('/api/dashboard/initial').then(res => res.json());
  
  // For demo purposes, we'll return mock data
  return {
    nodes: [], // This will be populated from the DataContext mock data
    links: [], // This will be populated from the DataContext mock data
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
}

export async function fetchNodeDetails(nodeId: string) {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // This would normally be a fetch call to your backend API
  // return await fetch(`/api/nodes/${nodeId}`).then(res => res.json());
  
  // For demo purposes, we'll return mock data
  return {
    id: nodeId,
    name: `Node ${nodeId}`,
    type: Math.random() > 0.7 ? 'tower' : 'village',
    status: Math.random() > 0.8 ? 'warning' : 'optimal',
    detailedMetrics: {
      cpuUsage: Math.floor(Math.random() * 100),
      memoryUsage: Math.floor(Math.random() * 100),
      diskSpace: Math.floor(Math.random() * 100),
      temperature: Math.floor(Math.random() * 50) + 20,
      batteryLevel: Math.floor(Math.random() * 100),
      signalStrength: Math.floor(Math.random() * 100)
    },
    historyData: Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() - i * 3600000).toISOString(),
      throughput: Math.random() * 50 + 50,
      latency: Math.random() * 40 + 10,
      packetLoss: Math.random() * 5
    }))
  };
}

export async function triggerScenario(scenarioId: string) {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // This would normally be a POST request to your backend API
  // return await fetch('/api/simulation/trigger', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ scenarioId })
  // }).then(res => res.json());
  
  // For demo purposes, we'll return a success response
  return {
    success: true,
    message: `Scenario ${scenarioId} triggered successfully`,
    estimatedDuration: Math.floor(Math.random() * 30) + 30 // seconds
  };
}