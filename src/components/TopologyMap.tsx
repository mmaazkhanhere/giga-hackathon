import React, { useRef, useEffect, useState } from 'react';
import { useData } from '../contexts/DataContext';
import { NetworkNode, NetworkLink } from '../types';
import { Wifi, Radio, Satellite, ZoomIn, ZoomOut, Move } from 'lucide-react';

const TopologyMap: React.FC = () => {
  const { nodes, links } = useData();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<NetworkNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [mapMode, setMapMode] = useState<'pan' | 'select'>('select');

  // Draw the network topology on canvas
  useEffect(() => {
    if (!canvasRef.current || nodes.length === 0 || links.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match container
    if (containerRef.current) {
      canvas.width = containerRef.current.clientWidth;
      canvas.height = containerRef.current.clientHeight;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Apply transformations
    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(zoom, zoom);

    // Draw links
    links.forEach(link => {
      const source = nodes.find(node => node.id === link.source);
      const target = nodes.find(node => node.id === link.target);
      
      if (source && target) {
        // Scale coordinates to fit canvas
        const sourceX = (source.coordinates.x / 400) * canvas.width / zoom;
        const sourceY = (source.coordinates.y / 300) * canvas.height / zoom;
        const targetX = (target.coordinates.x / 400) * canvas.width / zoom;
        const targetY = (target.coordinates.y / 300) * canvas.height / zoom;
        
        ctx.beginPath();
        ctx.moveTo(sourceX, sourceY);
        ctx.lineTo(targetX, targetY);
        
        // Set link color based on status
        if (link.status === 'optimal') {
          ctx.strokeStyle = 'rgba(74, 222, 128, 0.6)'; // green
        } else if (link.status === 'warning') {
          ctx.strokeStyle = 'rgba(250, 204, 21, 0.6)'; // yellow
        } else {
          ctx.strokeStyle = 'rgba(248, 113, 113, 0.6)'; // red
        }
        
        // Set line width based on bandwidth
        ctx.lineWidth = Math.max(1, Math.min(8, link.bandwidth / 20)) / zoom;
        
        ctx.stroke();
        
        // Draw bandwidth indicator
        const midX = (sourceX + targetX) / 2;
        const midY = (sourceY + targetY) / 2;
        
        ctx.fillStyle = 'white';
        ctx.font = `${12 / zoom}px Arial`;
        ctx.fillText(`${link.bandwidth} Mbps`, midX, midY);
      }
    });

    // Draw nodes
    nodes.forEach(node => {
      const x = (node.coordinates.x / 400) * canvas.width / zoom;
      const y = (node.coordinates.y / 300) * canvas.height / zoom;
      
      ctx.beginPath();
      ctx.arc(x, y, 10 / zoom, 0, 2 * Math.PI);
      
      // Set node color based on status
      if (node.status === 'optimal') {
        ctx.fillStyle = '#4ade80'; // green
      } else if (node.status === 'warning') {
        ctx.fillStyle = '#facc15'; // yellow
      } else {
        ctx.fillStyle = '#f87171'; // red
      }
      
      ctx.fill();
      
      // Draw node name
      ctx.fillStyle = 'white';
      ctx.font = `${12 / zoom}px Arial`;
      ctx.fillText(node.name, x - 20 / zoom, y - 15 / zoom);
    });
    
    ctx.restore();
  }, [nodes, links, offset, zoom]);

  // Convert screen coordinates to canvas coordinates
  const screenToCanvas = (screenX: number, screenY: number) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (screenX - rect.left - offset.x) / zoom;
    const y = (screenY - rect.top - offset.y) / zoom;
    
    return { x, y };
  };

  // Handle mouse move to detect hover over nodes
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || nodes.length === 0) return;
    
    if (isDragging && mapMode === 'pan') {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      setOffset({ x: offset.x + dx, y: offset.y + dy });
      setDragStart({ x: e.clientX, y: e.clientY });
      return;
    }
    
    const { x, y } = screenToCanvas(e.clientX, e.clientY);
    
    // Check if mouse is over any node
    const hoveredNode = nodes.find(node => {
      const nodeX = (node.coordinates.x / 400) * canvasRef.current!.width / zoom;
      const nodeY = (node.coordinates.y / 300) * canvasRef.current!.height / zoom;
      const distance = Math.sqrt(Math.pow(x - nodeX, 2) + Math.pow(y - nodeY, 2));
      return distance <= 15 / zoom; // Node radius + some margin
    });
    
    setHoveredNode(hoveredNode || null);
  };

  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mapMode === 'pan') {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  // Handle mouse up to end dragging
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle click to select a node
  const handleClick = () => {
    if (mapMode === 'select' && hoveredNode) {
      setSelectedNode(hoveredNode);
    }
  };

  // Handle zoom in
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 3));
  };

  // Handle zoom out
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.5));
  };

  // Toggle map mode between pan and select
  const toggleMapMode = () => {
    setMapMode(prev => prev === 'pan' ? 'select' : 'pan');
  };

  // Get icon based on node type
  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'village':
        return <Wifi className="h-4 w-4 mr-1" />;
      case 'tower':
        return <Radio className="h-4 w-4 mr-1" />;
      case 'satellite':
        return <Satellite className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <canvas 
        ref={canvasRef} 
        className={`w-full h-full ${mapMode === 'pan' ? 'cursor-move' : 'cursor-pointer'}`}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleClick}
      />
      
      {/* Map controls */}
      <div className="absolute top-2 right-2 bg-slate-800 bg-opacity-80 rounded-lg shadow-lg p-1">
        <button 
          className={`p-2 rounded-md ${mapMode === 'pan' ? 'bg-blue-600' : 'hover:bg-slate-700'}`}
          onClick={toggleMapMode}
          title={mapMode === 'pan' ? 'Pan Mode (Active)' : 'Pan Mode'}
        >
          <Move size={18} />
        </button>
        <button 
          className="p-2 rounded-md hover:bg-slate-700"
          onClick={handleZoomIn}
          title="Zoom In"
        >
          <ZoomIn size={18} />
        </button>
        <button 
          className="p-2 rounded-md hover:bg-slate-700"
          onClick={handleZoomOut}
          title="Zoom Out"
        >
          <ZoomOut size={18} />
        </button>
      </div>
      
      {/* Node tooltip on hover */}
      {hoveredNode && mapMode === 'select' && (
        <div 
          className="absolute bg-slate-700 p-2 rounded shadow-lg text-sm z-10"
          style={{ 
            left: (hoveredNode.coordinates.x / 400) * (containerRef.current?.clientWidth || 0) * zoom + offset.x + 15,
            top: (hoveredNode.coordinates.y / 300) * (containerRef.current?.clientHeight || 0) * zoom + offset.y - 15
          }}
        >
          <div className="flex items-center font-semibold">
            {getNodeIcon(hoveredNode.type)}
            {hoveredNode.name}
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-1">
            <span>Throughput:</span>
            <span className="text-emerald-400">{hoveredNode.metrics.throughput} Mbps</span>
            <span>Latency:</span>
            <span className="text-emerald-400">{hoveredNode.metrics.latency} ms</span>
            <span>Users:</span>
            <span className="text-emerald-400">{hoveredNode.metrics.users}</span>
          </div>
        </div>
      )}
      
      {/* Node details modal when selected */}
      {selectedNode && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-slate-800 p-4 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold flex items-center">
                {getNodeIcon(selectedNode.type)}
                {selectedNode.name}
              </h3>
              <button 
                className="text-slate-400 hover:text-white"
                onClick={() => setSelectedNode(null)}
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-slate-700 p-3 rounded">
                <div className="text-slate-400 text-sm">Status</div>
                <div className={`font-semibold ${
                  selectedNode.status === 'optimal' ? 'text-emerald-400' : 
                  selectedNode.status === 'warning' ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {selectedNode.status.charAt(0).toUpperCase() + selectedNode.status.slice(1)}
                </div>
              </div>
              
              <div className="bg-slate-700 p-3 rounded">
                <div className="text-slate-400 text-sm">Type</div>
                <div className="font-semibold">
                  {selectedNode.type.charAt(0).toUpperCase() + selectedNode.type.slice(1)}
                </div>
              </div>
              
              <div className="bg-slate-700 p-3 rounded">
                <div className="text-slate-400 text-sm">Throughput</div>
                <div className="font-semibold text-emerald-400">
                  {selectedNode.metrics.throughput} Mbps
                </div>
              </div>
              
              <div className="bg-slate-700 p-3 rounded">
                <div className="text-slate-400 text-sm">Latency</div>
                <div className="font-semibold text-emerald-400">
                  {selectedNode.metrics.latency} ms
                </div>
              </div>
              
              <div className="bg-slate-700 p-3 rounded">
                <div className="text-slate-400 text-sm">Connected Users</div>
                <div className="font-semibold text-emerald-400">
                  {selectedNode.metrics.users}
                </div>
              </div>
              
              <div className="bg-slate-700 p-3 rounded">
                <div className="text-slate-400 text-sm">Uptime</div>
                <div className="font-semibold text-emerald-400">
                  99.7%
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <button 
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                onClick={() => setSelectedNode(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Legend */}
      <div className="absolute bottom-2 left-2 bg-slate-800 bg-opacity-80 p-2 rounded text-xs">
        <div className="flex items-center mb-1">
          <span className="inline-block w-3 h-3 rounded-full bg-emerald-500 mr-2"></span>
          <span>Optimal</span>
        </div>
        <div className="flex items-center mb-1">
          <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
          <span>Warning</span>
        </div>
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-2"></span>
          <span>Critical</span>
        </div>
      </div>
    </div>
  );
};

export default TopologyMap;