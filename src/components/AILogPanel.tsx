import React from 'react';
import { useData } from '../src/contexts/DataContext';
import { Bot, Clock, Zap } from 'lucide-react';

const AILogPanel: React.FC = () => {
  const { aiDecisions } = useData();
  const logEndRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when new decisions are added
  React.useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiDecisions]);

  // Format timestamp to readable time
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto pr-2">
        {aiDecisions.length === 0 ? (
          <div className="text-center text-slate-500 py-8">
            No AI decisions recorded yet
          </div>
        ) : (
          <div className="space-y-3">
            {aiDecisions.map((decision) => (
              <div 
                key={decision.id} 
                className="bg-slate-700 rounded-lg p-3 border-l-4 border-blue-500 animate-fadeIn"
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="font-semibold text-blue-400">{decision.action}</div>
                  <div className="flex items-center text-xs text-slate-400">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatTime(decision.timestamp)}
                  </div>
                </div>
                <p className="text-sm text-slate-300 mb-2">{decision.description}</p>
                <div className="flex items-center text-xs text-emerald-400">
                  <Zap className="h-3 w-3 mr-1" />
                  {decision.impact}
                </div>
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-slate-600">
        <div className="flex items-center text-xs text-slate-400">
          <Bot className="h-4 w-4 mr-1 text-blue-400" />
          <span>AI is actively monitoring the network</span>
        </div>
      </div>
    </div>
  );
};

export default AILogPanel;