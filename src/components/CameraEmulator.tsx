import React, { useState } from 'react';
import { Camera, RefreshCcw, CheckCircle, AlertCircle, ScanText, Fingerprint } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CameraOverlayProps {
  onCapture: (base64: string) => void;
  label: string;
  sublabel?: string;
}

export const CameraOverlay: React.FC<CameraOverlayProps> = ({ onCapture, label, sublabel }) => {
  const [isCapturing, setIsCapturing] = useState(false);

  const simulateCapture = () => {
    // In a real app, this would use the browser's camera API.
    // We'll simulate with a placeholder and a fade.
    setIsCapturing(true);
    setTimeout(() => {
      // Mock base64 for a check
      onCapture("data:image/jpeg;base64,..."); 
      setIsCapturing(false);
    }, 800);
  };

  return (
    <div className="relative w-full h-[500px] bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-gray-800">
      {/* Viewfinder Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
        <div className="w-full h-48 border-2 border-dashed border-white/40 rounded-xl relative flex items-center justify-center">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg"></div>
            
            <div className="text-white/60 font-mono text-[10px] tracking-widest uppercase">
                Align Check Edges
            </div>

            {isCapturing && (
                <motion.div 
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    className="absolute inset-0 bg-white"
                />
            )}
        </div>
        
        <div className="mt-8 text-center text-white">
          <h3 className="text-lg font-medium tracking-tight">{label}</h3>
          <p className="text-sm text-gray-400 mt-1">{sublabel}</p>
        </div>
      </div>

      {/* Capture Button */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <button 
          onClick={simulateCapture}
          className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center group active:scale-95 transition-transform"
        >
          <div className="w-12 h-12 rounded-full bg-white group-hover:scale-110 transition-transform"></div>
        </button>
      </div>

      {/* Technical Metadata Overlays */}
      <div className="absolute top-4 left-4 font-mono text-[8px] text-green-500 uppercase flex flex-col gap-1">
        <span>ISO: 200</span>
        <span>EXP: 1/120</span>
        <span>DEV: CHK-09-A</span>
      </div>
      
      <div className="absolute top-4 right-4 flex gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
        <span className="font-mono text-[8px] text-white">LIVE FEED</span>
      </div>
    </div>
  );
};
