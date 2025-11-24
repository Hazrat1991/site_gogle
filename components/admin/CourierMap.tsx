
import React from 'react';
import { Icon } from "@iconify/react";
import { CourierLocation } from '../../types';
import { MOCK_COURIER_LOCATIONS } from '../../constants';

export const CourierMap: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden h-[600px] relative">
       {/* Map Placeholder Background */}
       <div className="absolute inset-0 bg-slate-100 flex items-center justify-center opacity-50" 
            style={{
               backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/e/ec/Map_of_Dushanbe%2C_Tajikistan.png")', 
               backgroundSize: 'cover',
               backgroundPosition: 'center'
            }}>
       </div>

       {/* Overlay UI */}
       <div className="absolute top-4 left-4 z-10 bg-white p-4 rounded-xl shadow-lg border border-slate-100 max-w-xs">
          <h3 className="font-bold text-lg mb-2">Курьеры на линии</h3>
          <div className="space-y-2">
             {MOCK_COURIER_LOCATIONS.map(loc => (
                <div key={loc.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer">
                   <div className={`size-3 rounded-full ${loc.status === 'delivering' ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`} />
                   <div>
                      <div className="font-bold text-sm">{loc.courierName}</div>
                      <div className="text-xs text-slate-500">
                         {loc.status === 'delivering' ? `Везет заказ ${loc.currentOrderId}` : 'Свободен'}
                      </div>
                   </div>
                </div>
             ))}
          </div>
       </div>

       {/* Mock Pins */}
       {MOCK_COURIER_LOCATIONS.map((loc, i) => (
          <div 
            key={loc.id} 
            className="absolute flex flex-col items-center gap-1 transform -translate-x-1/2 -translate-y-1/2"
            style={{ top: `${40 + (i * 15)}%`, left: `${40 + (i * 20)}%` }} // Random positioning for demo
          >
             <div className="bg-white px-2 py-1 rounded-md text-xs font-bold shadow-md whitespace-nowrap">
                {loc.courierName}
             </div>
             <div className="text-primary drop-shadow-lg">
                <Icon icon="solar:map-point-bold" className="size-10" />
             </div>
          </div>
       ))}
    </div>
  );
};
