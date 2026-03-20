import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { Professional } from '../data/mockData';

interface MockMapProps {
  professionals: Professional[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function MockMap({ professionals, selectedId, onSelect }: MockMapProps) {
  return (
    <div
      className="relative w-full h-full overflow-hidden rounded-xl"
      style={{ background: '#f0ece3' }}
    >
      {/* Map SVG background */}
      <svg
        viewBox="0 0 800 600"
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Background */}
        <rect width="800" height="600" fill="#f0ece3" />

        {/* City blocks */}
        {[
          [0, 0, 160, 190], [170, 0, 150, 190], [330, 0, 150, 190], [490, 0, 150, 190], [650, 0, 150, 190],
          [0, 200, 160, 90], [170, 200, 150, 90], [330, 200, 150, 90], [490, 200, 150, 90], [650, 200, 150, 90],
          [0, 300, 160, 90], [170, 300, 150, 90], [490, 300, 150, 90], [650, 300, 150, 90],
          [0, 400, 160, 90], [170, 400, 150, 90], [330, 400, 150, 90], [490, 400, 150, 90], [650, 400, 150, 90],
          [0, 500, 160, 100], [170, 500, 150, 100], [330, 500, 150, 100], [490, 500, 150, 100], [650, 500, 150, 100],
        ].map(([x, y, w, h], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} fill="#e8e2d6" rx="2" />
        ))}

        {/* Major horizontal roads */}
        <rect x="0" y="190" width="800" height="10" fill="white" opacity="0.95" />
        <rect x="0" y="290" width="800" height="12" fill="white" opacity="0.95" />
        <rect x="0" y="390" width="800" height="10" fill="white" opacity="0.95" />
        <rect x="0" y="490" width="800" height="10" fill="white" opacity="0.95" />

        {/* Major vertical roads */}
        <rect x="160" y="0" width="10" height="600" fill="white" opacity="0.95" />
        <rect x="320" y="0" width="10" height="600" fill="white" opacity="0.95" />
        <rect x="480" y="0" width="12" height="600" fill="white" opacity="0.95" />
        <rect x="640" y="0" width="10" height="600" fill="white" opacity="0.95" />

        {/* Minor roads */}
        <rect x="0" y="95" width="800" height="5" fill="white" opacity="0.6" />
        <rect x="0" y="345" width="800" height="5" fill="white" opacity="0.6" />
        <rect x="0" y="440" width="800" height="5" fill="white" opacity="0.6" />
        <rect x="240" y="0" width="5" height="600" fill="white" opacity="0.6" />
        <rect x="400" y="0" width="5" height="600" fill="white" opacity="0.6" />
        <rect x="560" y="0" width="5" height="600" fill="white" opacity="0.6" />
        <rect x="720" y="0" width="5" height="600" fill="white" opacity="0.6" />

        {/* Parks - green areas */}
        <rect x="330" y="300" width="150" height="90" fill="#c8dfa8" rx="4" opacity="0.8" />
        <text x="405" y="350" textAnchor="middle" fontSize="9" fill="#5a7a3a" fontFamily="Inter, sans-serif">Parque Caldas</text>

        <rect x="0" y="200" width="80" height="90" fill="#c8dfa8" rx="4" opacity="0.6" />
        <text x="40" y="248" textAnchor="middle" fontSize="7" fill="#5a7a3a" fontFamily="Inter, sans-serif">Parque</text>

        <rect x="650" y="400" width="150" height="90" fill="#c8dfa8" rx="4" opacity="0.6" />

        {/* River */}
        <path
          d="M 0,530 Q 100,520 200,535 Q 350,555 500,540 Q 650,525 800,545"
          stroke="#a8c9e0"
          strokeWidth="14"
          fill="none"
          opacity="0.7"
        />

        {/* Road labels */}
        <text x="405" y="285" textAnchor="middle" fontSize="8" fill="#9CA3AF" fontFamily="Inter, sans-serif" fontWeight="500">Calle 5 (Carrera Principal)</text>
        <text x="476" y="180" textAnchor="middle" fontSize="7" fill="#9CA3AF" fontFamily="Inter, sans-serif" transform="rotate(-90, 476, 150)">Carrera 6</text>
        <text x="636" y="180" textAnchor="middle" fontSize="7" fill="#9CA3AF" fontFamily="Inter, sans-serif" transform="rotate(-90, 636, 150)">Carrera 8</text>

        {/* Small building details */}
        {[
          [20, 20], [50, 20], [80, 20], [20, 50], [50, 50],
          [185, 20], [210, 20], [185, 50],
          [670, 20], [700, 20], [670, 50],
          [20, 420], [50, 420], [20, 450],
        ].map(([x, y], i) => (
          <rect key={`b${i}`} x={x} y={y} width="22" height="16" fill="#d9d3c8" rx="2" opacity="0.7" />
        ))}
      </svg>

      {/* Professional Markers */}
      {professionals.map((prof, index) => {
        const isSelected = selectedId === prof.id;
        const x = prof.mapX;
        const y = prof.mapY;
        return (
          <button
            key={prof.id}
            onClick={() => onSelect(prof.id)}
            className="absolute transform -translate-x-1/2 -translate-y-full z-10 group"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            {/* Popup on selected */}
            {isSelected && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-40 bg-white rounded-lg shadow-xl border border-[#E5E7EB] p-2.5 text-left pointer-events-none">
                <div className="flex items-center gap-2">
                  <img src={prof.photo} alt={prof.name} className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <p className="text-xs font-semibold text-[#111827] leading-tight">{prof.name}</p>
                    <p className="text-xs text-[#6B7280]">{prof.specialty}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F3F4F6]">
                  <span className="text-xs text-yellow-500">★ {prof.rating}</span>
                  <span className="text-xs text-[#10B981] font-medium">{prof.distance}</span>
                </div>
                {/* Arrow */}
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-[#E5E7EB] rotate-45" />
              </div>
            )}

            {/* Pin */}
            <div className={`relative flex flex-col items-center transition-all duration-200 ${isSelected ? 'scale-125' : 'hover:scale-110'}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-lg text-white text-xs font-bold transition-all ${
                  isSelected ? 'bg-[#1E40AF] shadow-[#1E40AF]/40 shadow-xl' : 'bg-[#1E40AF]/85 hover:bg-[#1E40AF]'
                }`}
              >
                {index + 1}
              </div>
              <div className={`w-0 h-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent mt-[-1px] ${
                isSelected ? 'border-t-[#1E40AF]' : 'border-t-[#1E40AF]/85'
              }`}
                style={{ borderTopWidth: '6px' }}
              />
            </div>
          </button>
        );
      })}

      {/* Controls */}
      <div className="absolute top-3 right-3 flex flex-col gap-1">
        <button className="w-8 h-8 bg-white rounded-lg shadow-md flex items-center justify-center text-[#374151] hover:bg-[#F9FAFB] border border-[#E5E7EB] text-sm font-bold">+</button>
        <button className="w-8 h-8 bg-white rounded-lg shadow-md flex items-center justify-center text-[#374151] hover:bg-[#F9FAFB] border border-[#E5E7EB] text-sm font-bold">−</button>
      </div>

      {/* My location button */}
      <button className="absolute bottom-3 right-3 w-8 h-8 bg-white rounded-lg shadow-md flex items-center justify-center text-[#1E40AF] hover:bg-[#F9FAFB] border border-[#E5E7EB]">
        <Navigation className="w-4 h-4" />
      </button>

      {/* Location label */}
      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg shadow-sm border border-[#E5E7EB] flex items-center gap-1.5">
        <MapPin className="w-3 h-3 text-[#1E40AF]" />
        <span className="text-xs text-[#374151] font-medium">Popayán, Colombia</span>
      </div>
    </div>
  );
}
