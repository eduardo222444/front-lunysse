import React, { useState } from "react";
import { ChevronDown, ChevronUp, Clock, Calendar } from "lucide-react";
 
export const AvailabilityPicker = ({ availableDays = [], selectedSlots = [], onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
 
    const toggleSlot = (day, time) => {
        const slotId = `${day}-${time}`;
        let newSelection;
 
        if (selectedSlots.includes(slotId)) {
            newSelection = selectedSlots.filter((s) => s !== slotId);
        } else {
            newSelection = [...selectedSlots, slotId];
        }
        onChange(newSelection);
    };
 
    const timeSlots = [
        { time: '08:00', period: 'Manhã' },
        { time: '09:00', period: 'Manhã' },
        { time: '10:00', period: 'Manhã' },
        { time: '11:00', period: 'Manhã' },
        { time: '14:00', period: 'Tarde' },
        { time: '15:00', period: 'Tarde' },
        { time: '16:00', period: 'Tarde' },
        { time: '17:00', period: 'Tarde' }
    ];
 
    const selectedCount = selectedSlots.length;
 
    return (
        <div className="bg-white/10 border border-white/20 rounded-lg overflow-hidden">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-4 flex items-center justify-between font-medium text-left text-dark hover:bg-white/5 transition-all duration-300 group"
            >
                <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-medium" />
                    <div>
                        <span className="text-lg font-medium">Selecione seus horários disponíveis *</span>
                        {selectedCount > 0 && (
                            <p className="text-sm text-medium font-medium">
                                {selectedCount} horário{selectedCount > 1 ? 's' : ''} selecionado{selectedCount > 1 ? 's' : ''}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {selectedCount > 0 && (
                        <span className="bg-medium text-white text-xs px-2 py-1 rounded-full font-medium">
                            {selectedCount}
                        </span>
                    )}
                    {isOpen ?
                        <ChevronUp className="w-5 h-5 text-medium group-hover:text-dark transition-colors" /> :
                        <ChevronDown className="w-5 h-5 text-medium group-hover:text-dark transition-colors" />
                    }
                </div>
            </button>
           
            {isOpen && (
                <div className="border-t border-white/20">
                    <div className="p-4 space-y-4">
                        {availableDays.map((day) => {
                            const daySlots = selectedSlots.filter(slot => slot.startsWith(day));
                            return (
                                <div key={day} className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-semibold text-dark flex items-center gap-2">
                                            <div className="w-2 h-2 bg-medium rounded-full"></div>
                                            {day}
                                        </h4>
                                        {daySlots.length > 0 && (
                                            <span className="text-xs text-medium bg-medium/10 px-2 py-1 rounded-full">
                                                {daySlots.length} selecionado{daySlots.length > 1 ? 's' : ''}
                                            </span>
                                        )}
                                    </div>
                                   
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                        {timeSlots.map(({ time, period }) => {
                                            const slotId = `${day}-${time}`;
                                            const isSelected = selectedSlots.includes(slotId);
                                            return (
                                                <button
                                                    key={time}
                                                    type="button"
                                                    className={`p-3 rounded-lg border transition-all duration-200 hover:scale-105 group ${
                                                        isSelected
                                                            ? "bg-gradient-to-r from-medium to-light text-white border-medium shadow-lg"
                                                            : "bg-white/10 text-dark border-white/20 hover:bg-white/20 hover:border-medium/30"
                                                    }`}
                                                    onClick={() => toggleSlot(day, time)}
                                                >
                                                    <div className="flex items-center justify-center gap-1">
                                                        <Clock className={`w-3 h-3 ${
                                                            isSelected ? 'text-white' : 'text-medium'
                                                        }`} />
                                                        <span className="font-medium text-sm">{time}</span>
                                                    </div>
                                                    <div className={`text-xs mt-1 ${
                                                        isSelected ? 'text-white/80' : 'text-dark/60'
                                                    }`}>
                                                        {period}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                       
                        {selectedCount > 0 && (
                            <div className="mt-6 p-4 bg-medium/10 rounded-lg border border-medium/20">
                                <div className="flex items-center gap-2 text-medium">
                                    <Clock className="w-4 h-4" />
                                    <span className="font-medium text-sm">
                                        Total: {selectedCount} horário{selectedCount > 1 ? 's' : ''} selecionado{selectedCount > 1 ? 's' : ''}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
 