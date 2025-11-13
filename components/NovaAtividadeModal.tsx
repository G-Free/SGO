import React, { useState, useMemo } from 'react';
import { X, MapPin, ChevronLeft, ChevronRight, DollarSign, ClipboardCheck } from 'lucide-react';

interface NovaAtividadeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  planosDeAcao: { id: string; title: string; }[];
}

const mockEmployeesForSelect = [
  { id: 1, name: 'Administrador GMA' },
  { id: 2, name: 'Manuel Santos' },
  { id: 3, name: 'Sofia Lima' },
  { id: 4, name: 'António Freire' },
  { id: 5, name: 'Carlos Mendes' },
  { id: 6, name: 'Gestor 1' },
  { id: 7, name: 'Técnico A' },
];

const Calendar: React.FC<{
  displayDate: Date;
  onDisplayDateChange: (date: Date) => void;
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}> = ({ displayDate, onDisplayDateChange, selectedDate, onDateSelect }) => {
  
  const handlePrevMonth = () => {
    onDisplayDateChange(new Date(displayDate.getFullYear(), displayDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    onDisplayDateChange(new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 1));
  };

  const daysInMonth = useMemo(() => {
    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }, [displayDate]);

  const firstDayOfMonth = useMemo(() => new Date(displayDate.getFullYear(), displayDate.getMonth(), 1).getDay(), [displayDate]);
  const today = new Date();

  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex justify-between items-center mb-3">
        <button type="button" onClick={handlePrevMonth} className="p-1 rounded-full hover:bg-gray-100">
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
        <span className="font-semibold text-base">
          {displayDate.toLocaleString('default', { month: 'long' })} {displayDate.getFullYear()}
        </span>
        <button type="button" onClick={handleNextMonth} className="p-1 rounded-full hover:bg-gray-100">
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-500">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => <div key={day}>{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1 mt-2">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} />)}
        {daysInMonth.map(day => {
          const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString();
          const isToday = day.toDateString() === today.toDateString();
          return (
            <button
              key={day.toString()}
              type="button"
              onClick={() => onDateSelect(day)}
              className={`w-8 h-8 rounded-full text-base flex items-center justify-center transition-colors
                ${isSelected ? 'bg-blue-600 text-white' : ''}
                ${!isSelected && isToday ? 'bg-gray-200' : ''}
                ${!isSelected ? 'hover:bg-gray-100' : ''}
              `}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const NovaAtividadeModal: React.FC<NovaAtividadeModalProps> = ({ isOpen, onClose, onSave, planosDeAcao }) => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date(new Date().setDate(new Date().getDate() + 1)));
  const [startDisplayDate, setStartDisplayDate] = useState(new Date());
  const [endDisplayDate, setEndDisplayDate] = useState(new Date());
  const [province, setProvince] = useState('');
  const [gma, setGma] = useState('');

  const gmaMap: { [key: string]: string } = {
    'Cabinda': 'GMA CABINDA',
    'Luanda': 'GMA LUANDA',
    'Namibe': 'GMA NAMIBE',
    'Cunene': 'GMA CUNENE',
    'Benguela': 'GMA BENGUELA',
    'Cubango': 'GMA CUBANGO',
    'Moxico': 'GMA MOXICO',
    'Moxico Leste': 'GMA MOXICO LESTE',
    'Uíge': 'GMA UÍGE',
    'Lunda Norte': 'GMA LUNDA NORTE',
    'Lunda Sul': 'GMA LUNDA SUL',
    'Zaíre': 'GMA ZAÍRE',
  };
  const provinces = Object.keys(gmaMap);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProvince = e.target.value;
    setProvince(selectedProvince);
    setGma(gmaMap[selectedProvince] || '');
  };

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const selectedTeamMembers = formData.getAll('team-members') as string[];
    const newActivity = {
        title: formData.get('mission-title'),
        type: formData.get('mission-type'),
        province: province,
        gma: gma,
        vessel: formData.get('vessel'),
        responsible: formData.get('responsible'),
        cost: formData.get('mission-cost'),
        coordinates: formData.get('coordinates'),
        equipa: selectedTeamMembers.map(name => ({ nome: name.trim(), cargo: 'Membro' })),
        objectives: (formData.get('mission-objective') as string).split('\n'),
        startDate: startDate ? startDate.toLocaleDateString('pt-AO') : '',
        endDate: endDate ? endDate.toLocaleDateString('pt-AO') : '',
        planoAcaoId: formData.get('planoAcaoId')
    };
    onSave(newActivity);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 grid place-items-center p-4 transition-opacity duration-300">
      <div 
        className="bg-slate-50 rounded-lg shadow-xl w-full max-w-4xl max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white px-6 py-4 border-b flex justify-between items-center z-30">
          <h2 className="text-xl font-bold text-gray-800">Nova Missão de Fiscalização</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Título da Missão */}
            <div>
              <label htmlFor="mission-title" className="block text-base font-medium text-gray-700">Título da Missão</label>
              <input type="text" id="mission-title" name="mission-title" placeholder="Ex: Fiscalização Costa Norte" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base" />
            </div>

            {/* Tipo de Missão */}
            <div>
              <label htmlFor="mission-type" className="block text-base font-medium text-gray-700">Tipo de Missão</label>
              <select id="mission-type" name="mission-type" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base">
                <option>Selecione o tipo</option>
                <option>Marítima</option>
                <option>Terrestre</option>
                <option>Aérea</option>
              </select>
            </div>

            {/* Província */}
            <div>
              <label htmlFor="province" className="block text-base font-medium text-gray-700">Província</label>
              <select id="province" name="province" value={province} onChange={handleProvinceChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base">
                <option value="">Selecione a província</option>
                {provinces.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            {/* GMA */}
            <div>
              <label htmlFor="gma" className="block text-base font-medium text-gray-700">GMA</label>
              <input type="text" id="gma" name="gma" value={gma} readOnly className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-base bg-gray-100" />
            </div>

            {/* Tipo de meio */}
            <div>
              <label htmlFor="vessel" className="block text-base font-medium text-gray-700">Tipo de meio</label>
              <input type="text" id="vessel" name="vessel" placeholder="Ex: Patrulha Angola I" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base" />
            </div>

            {/* Responsável */}
            <div>
                <label htmlFor="responsible" className="block text-base font-medium text-gray-700">Responsável</label>
                <select id="responsible" name="responsible" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base">
                    <option>Selecione o responsável</option>
                    <option>Cmdt. Manuel Santos</option>
                    <option>Técnico A</option>
                    <option>Gestor 1</option>
                </select>
            </div>
            
            {/* Plano de Ação */}
            <div>
                <label htmlFor="planoAcaoId" className="block text-base font-medium text-gray-700">Plano de Ação (Opcional)</label>
                <select id="planoAcaoId" name="planoAcaoId" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base">
                    <option value="">Nenhum</option>
                    {planosDeAcao.map(plano => (
                        <option key={plano.id} value={plano.id}>{plano.title}</option>
                    ))}
                </select>
            </div>
            
            {/* Custo Previsto */}
            <div>
              <label htmlFor="mission-cost" className="block text-base font-medium text-gray-700">Custo Previsto (AOA)</label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                    type="text" 
                    id="mission-cost"
                    name="mission-cost"
                    placeholder="Ex: 150.000,00" 
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base pl-10" 
                />
              </div>
            </div>

             {/* Coordenadas */}
             <div className="md:col-span-2">
              <label htmlFor="coordinates" className="block text-base font-medium text-gray-700">Coordenadas</label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input type="text" id="coordinates" name="coordinates" placeholder="Ex: -8.8° S, 13.2° E" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base pl-10" />
              </div>
            </div>
            
            {/* Membros da Equipa */}
            <div className="md:col-span-2">
              <label htmlFor="team-members" className="block text-base font-medium text-gray-700">Membros da Equipa</label>
               <select 
                  id="team-members" 
                  name="team-members" 
                  multiple 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base h-32"
              >
                  {mockEmployeesForSelect.map(emp => (
                      <option key={emp.id} value={emp.name}>{emp.name}</option>
                  ))}
              </select>
            </div>

            {/* Objetivo da Missão */}
            <div className="md:col-span-2">
              <label htmlFor="mission-objective" className="block text-base font-medium text-gray-700">Objetivo da Missão</label>
              <textarea id="mission-objective" name="mission-objective" rows={4} placeholder="Descreva o objetivo e escopo da missão..." className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base"></textarea>
            </div>

            {/* Calendários */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">Data de Início</label>
                <Calendar 
                  displayDate={startDisplayDate}
                  onDisplayDateChange={setStartDisplayDate}
                  selectedDate={startDate}
                  onDateSelect={setStartDate}
                />
              </div>
              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">Data de Fim</label>
                <Calendar 
                  displayDate={endDisplayDate}
                  onDisplayDateChange={setEndDisplayDate}
                  selectedDate={endDate}
                  onDateSelect={setEndDate}
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3 border-t pt-5">
            <button type="button" onClick={onClose} className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm transition-colors">
              Cancelar
            </button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-colors">
              Criar Missão
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NovaAtividadeModal;