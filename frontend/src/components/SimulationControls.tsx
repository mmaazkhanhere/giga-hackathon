import React from 'react';
import { useData } from '../contexts/DataContext';
import { Play, AlertTriangle, CloudLightning, Users, Zap } from 'lucide-react';
import { SimulationScenario } from '../types';

const SimulationControls: React.FC = () => {
  const { activeScenario, triggerScenario } = useData();
  const [isRunning, setIsRunning] = React.useState(false);

  // Predefined simulation scenarios
  const scenarios: SimulationScenario[] = [
    {
      id: 'peak_traffic',
      name: 'Peak Traffic',
      description: 'Simulate high user demand during peak hours',
      effects: {
        nodeChanges: [
          { nodeId: '2', newStatus: 'warning' },
          { nodeId: '4', newStatus: 'warning' }
        ],
        metricChanges: {
          throughput: -20,
          latency: 30
        }
      }
    },
    {
      id: 'link_failure',
      name: 'Link Failure',
      description: 'Simulate a critical link failure between nodes',
      effects: {
        linkChanges: [
          { linkId: '4', newStatus: 'critical' }
        ],
        nodeChanges: [
          { nodeId: '5', newStatus: 'critical' }
        ]
      }
    },
    {
      id: 'weather_event',
      name: 'Weather Event',
      description: 'Simulate impact of severe weather on network',
      effects: {
        nodeChanges: [
          { nodeId: '6', newStatus: 'warning' }
        ],
        linkChanges: [
          { linkId: '5', newStatus: 'warning' },
          { linkId: '6', newStatus: 'warning' }
        ],
        metricChanges: {
          packetLoss: 3
        }
      }
    },
    {
      id: 'user_surge',
      name: 'User Surge',
      description: 'Simulate sudden influx of new users',
      effects: {
        metricChanges: {
          throughput: -15,
          latency: 25
        }
      }
    }
  ];

  // Handle scenario selection
  const handleScenarioSelect = (scenario: SimulationScenario) => {
    setIsRunning(true);
    triggerScenario(scenario);
    
    // Simulate scenario completion after a delay
    setTimeout(() => {
      setIsRunning(false);
    }, 5000);
  };

  // Get icon for scenario
  const getScenarioIcon = (scenarioId: string) => {
    switch (scenarioId) {
      case 'peak_traffic':
        return <Zap className="h-5 w-5" />;
      case 'link_failure':
        return <AlertTriangle className="h-5 w-5" />;
      case 'weather_event':
        return <CloudLightning className="h-5 w-5" />;
      case 'user_surge':
        return <Users className="h-5 w-5" />;
      default:
        return <Play className="h-5 w-5" />;
    }
  };

  return (
    <div className="h-full">
      {isRunning ? (
        <div className="flex items-center justify-center">
          <div className="animate-pulse text-yellow-400 mr-4">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <div>
            <div className="font-semibold">Scenario Running</div>
            <p className="text-sm text-slate-400">
              AI is responding to the simulated conditions...
            </p>
          </div>
          <div className="ml-8 w-64 bg-slate-700 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full animate-progressBar"></div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {scenarios.map((scenario) => (
            <button
              key={scenario.id}
              className="bg-slate-700 hover:bg-slate-600 rounded-lg p-3 text-left transition-colors"
              onClick={() => handleScenarioSelect(scenario)}
            >
              <div className="flex items-center mb-1">
                <span className="bg-blue-500 p-1.5 rounded-md text-white mr-2">
                  {getScenarioIcon(scenario.id)}
                </span>
                <span className="font-medium">{scenario.name}</span>
              </div>
              <p className="text-xs text-slate-400">{scenario.description}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SimulationControls;