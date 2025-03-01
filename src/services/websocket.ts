// In a real application, this would connect to a real WebSocket server
// For this demo, we'll simulate WebSocket messages

export function setupWebSocket(onMessage: (message: any) => void) {
  console.log('Setting up WebSocket connection...');
  
  // In a real app, this would be a real WebSocket connection
  // const socket = new WebSocket('wss://your-api.com/ws');
  // 
  // socket.onmessage = (event) => {
  //   const message = JSON.parse(event.data);
  //   onMessage(message);
  // };
  // 
  // socket.onclose = () => {
  //   console.log('WebSocket connection closed');
  // };
  // 
  // return () => {
  //   socket.close();
  // };
  
  // For demo purposes, we'll simulate WebSocket messages with a timer
  const interval = setInterval(() => {
    // Simulate different types of messages
    const messageTypes = ['NODE_UPDATE', 'METRIC_UPDATE', 'AI_DECISION', 'SYSTEM_STATUS'];
    const randomType = messageTypes[Math.floor(Math.random() * messageTypes.length)];
    
    let message;
    
    switch (randomType) {
      case 'NODE_UPDATE':
        message = {
          type: 'NODE_UPDATE',
          data: {
            id: String(Math.floor(Math.random() * 6) + 1),
            status: Math.random() > 0.7 ? 'warning' : 'optimal',
            metrics: {
              throughput: Math.random() * 50 + 50,
              latency: Math.random() * 40 + 10,
              users: Math.floor(Math.random() * 100) + 20
            }
          }
        };
        break;
        
      case 'METRIC_UPDATE':
        const metricTypes = ['throughput', 'latency', 'packetLoss', 'userConnectivity'];
        const randomMetric = metricTypes[Math.floor(Math.random() * metricTypes.length)];
        
        let value;
        if (randomMetric === 'throughput') {
          value = Math.random() * 50 + 50; // 50-100 Mbps
        } else if (randomMetric === 'latency') {
          value = Math.random() * 40 + 10; // 10-50 ms
        } else if (randomMetric === 'packetLoss') {
          value = Math.random() * 5; // 0-5%
        } else {
          value = Math.random() * 30 + 70; // 70-100%
        }
        
        message = {
          type: 'METRIC_UPDATE',
          data: {
            type: randomMetric,
            value: {
              timestamp: new Date().toISOString(),
              value
            }
          }
        };
        break;
        
      case 'AI_DECISION':
        const actions = [
          'Bandwidth reallocation',
          'Route optimization',
          'Backup link activation',
          'Traffic prioritization',
          'Power saving mode'
        ];
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        
        message = {
          type: 'AI_DECISION',
          data: {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            action: randomAction,
            description: `AI automatically ${randomAction.toLowerCase()} to optimize network performance`,
            impact: `${['Latency', 'Throughput', 'Packet loss'][Math.floor(Math.random() * 3)]} improved by ${Math.floor(Math.random() * 30) + 10}%`
          }
        };
        break;
        
      case 'SYSTEM_STATUS':
        message = {
          type: 'SYSTEM_STATUS',
          data: {
            overall: Math.random() > 0.8 ? 'warning' : 'optimal',
            uptime: `${(99 + Math.random()).toFixed(1)}%`,
            performanceScore: Math.floor(Math.random() * 20) + 80,
            predictedImprovements: `${Math.floor(Math.random() * 20) + 5}% ${['latency reduction', 'throughput increase', 'reliability improvement'][Math.floor(Math.random() * 3)]}`
          }
        };
        break;
    }
    
    onMessage(message);
  }, 5000); // Simulate a message every 5 seconds
  
  return () => {
    clearInterval(interval);
  };
}