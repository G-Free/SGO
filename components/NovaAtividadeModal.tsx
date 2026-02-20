import React, { useState, useMemo, useEffect } from "react";
import {
  X,
  MapPin,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  ClipboardCheck,
  Plus,
  Trash2,
  UserPlus,
} from "lucide-react";

interface TeamMember {
  nome: string;
  orgao: string;
  contacto: string;
}

interface NovaAtividadeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  planosDeAcao: { id: string; title: string }[];
  activityToEdit?: any | null;
}

const Calendar: React.FC<{
  displayDate: Date;
  onDisplayDateChange: (date: Date) => void;
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}> = ({ displayDate, onDisplayDateChange, selectedDate, onDateSelect }) => {
  const handlePrevMonth = () => {
    onDisplayDateChange(
      new Date(displayDate.getFullYear(), displayDate.getMonth() - 1, 1),
    );
  };

  const handleNextMonth = () => {
    onDisplayDateChange(
      new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 1),
    );
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

  const firstDayOfMonth = useMemo(
    () =>
      new Date(displayDate.getFullYear(), displayDate.getMonth(), 1).getDay(),
    [displayDate],
  );
  const today = new Date();

  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex justify-between items-center mb-3">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
        <span className="font-semibold text-base">
          {displayDate.toLocaleString("default", { month: "long" })}{" "}
          {displayDate.getFullYear()}
        </span>
        <button
          type="button"
          onClick={handleNextMonth}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-500">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 mt-2">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {daysInMonth.map((day) => {
          const isSelected =
            selectedDate && day.toDateString() === selectedDate.toDateString();
          const isToday = day.toDateString() === today.toDateString();
          return (
            <button
              key={day.toString()}
              type="button"
              onClick={() => onDateSelect(day)}
              className={`w-8 h-8 rounded-full text-base flex items-center justify-center transition-colors
                ${isSelected ? "bg-blue-600 text-white" : ""}
                ${!isSelected && isToday ? "bg-gray-200" : ""}
                ${!isSelected ? "hover:bg-gray-100" : ""}
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

const NovaAtividadeModal: React.FC<NovaAtividadeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  planosDeAcao,
  activityToEdit,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(
    new Date(new Date().setDate(new Date().getDate() + 1)),
  );
  const [startDisplayDate, setStartDisplayDate] = useState(new Date());
  const [endDisplayDate, setEndDisplayDate] = useState(new Date());
  const [province, setProvince] = useState("");
  const [gma, setGma] = useState("");

  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [vessel, setVessel] = useState("");
  const [responsible, setResponsible] = useState("");
  const [planoAcaoId, setPlanoAcaoId] = useState("");
  const [cost, setCost] = useState("");
  const [coordinates, setCoordinates] = useState("");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [objectives, setObjectives] = useState("");

  const isEditMode = !!activityToEdit;

  const gmaMap: { [key: string]: string } = {
    Cabinda: "GMA CABINDA",
    Luanda: "GMA LUANDA",
    Namibe: "GMA NAMIBE",
    Cunene: "GMA CUNENE",
    Benguela: "GMA BENGUELA",
    Cubango: "GMA CUBANGO",
    Moxico: "GMA MOXICO",
    "Moxico Leste": "GMA MOXICO LESTE",
    Uíge: "GMA UÍGE",
    "Lunda Norte": "GMA LUNDA NORTE",
    "Lunda Sul": "GMA LUNDA SUL",
    Zaíre: "GMA ZAÍRE",
  };
  const provinces = Object.keys(gmaMap);

  const parseDateString = (dateStr: string) => {
    if (!dateStr) return new Date();
    const parts = dateStr.split("/");
    if (parts.length === 3) {
      return new Date(
        parseInt(parts[2], 10),
        parseInt(parts[1], 10) - 1,
        parseInt(parts[0], 10),
      );
    }
    return new Date();
  };

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && activityToEdit) {
        setTitle(activityToEdit.title || "");
        setType(activityToEdit.type || "");
        setVessel(activityToEdit.vessel || "");
        setResponsible(activityToEdit.responsible || "");
        setPlanoAcaoId(activityToEdit.planoAcaoId || "");
        setCost(activityToEdit.cost || "");
        setCoordinates(activityToEdit.coordinates || "");
        setProvince(activityToEdit.province || "");
        setGma(gmaMap[activityToEdit.province] || "");

        const start = parseDateString(activityToEdit.startDate);
        setStartDate(start);
        setStartDisplayDate(start);

        const end = parseDateString(activityToEdit.endDate);
        setEndDate(end);
        setEndDisplayDate(end);

        setTeamMembers(activityToEdit.equipa || []);
        setObjectives(
          Array.isArray(activityToEdit.objectives)
            ? activityToEdit.objectives.join("\n")
            : "",
        );
      } else {
        setTitle("");
        setType("");
        setVessel("");
        setResponsible("");
        setPlanoAcaoId("");
        setCost("");
        setCoordinates("");
        setProvince("");
        setGma("");
        setStartDate(new Date());
        setEndDate(new Date(new Date().setDate(new Date().getDate() + 1)));
        setTeamMembers([]);
        setObjectives("");
      }
    }
  }, [isOpen, isEditMode, activityToEdit]);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProvince = e.target.value;
    setProvince(selectedProvince);
    setGma(gmaMap[selectedProvince] || "");
  };

  const handleAddMember = () => {
    setTeamMembers([...teamMembers, { nome: "", orgao: "", contacto: "" }]);
  };

  const handleMemberChange = (
    index: number,
    field: keyof TeamMember,
    value: string,
  ) => {
    const updated = [...teamMembers];
    updated[index][field] = value;
    setTeamMembers(updated);
  };

  const handleRemoveMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newActivity = {
      id: activityToEdit?.id,
      title,
      type,
      province,
      gma,
      vessel,
      responsible,
      cost,
      coordinates,
      equipa: teamMembers,
      objectives: objectives.split("\n").filter((o) => o.trim() !== ""),
      startDate: startDate ? startDate.toLocaleDateString("pt-AO") : "",
      endDate: endDate ? endDate.toLocaleDateString("pt-AO") : "",
      planoAcaoId,
      status: activityToEdit ? activityToEdit.status : "Planeada",
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
          <h2 className="text-xl font-bold text-gray-800">
            {isEditMode ? "Editar Missão" : "Nova Missão de Fiscalização"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Título da Missão */}
            <div>
              <label
                htmlFor="mission-title"
                className="block text-base font-medium text-gray-700"
              >
                Título da Missão
              </label>
              <input
                type="text"
                id="mission-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Fiscalização Costa Norte"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base"
                required
              />
            </div>

            {/* Tipo de Missão */}
            <div>
              <label
                htmlFor="mission-type"
                className="block text-base font-medium text-gray-700"
              >
                Tipo de Missão
              </label>
              <select
                id="mission-type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base"
              >
                <option value="">Selecione o tipo</option>
                <option>Marítima</option>
                <option>Terrestre</option>
                <option>Aérea</option>
                <option>Técnica/IT</option>
                <option>Administrativa</option>
                <option>Formação</option>
                <option>Científica</option>
              </select>
            </div>

            {/* Província */}
            <div>
              <label
                htmlFor="province"
                className="block text-base font-medium text-gray-700"
              >
                Província
              </label>
              <select
                id="province"
                value={province}
                onChange={handleProvinceChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base"
              >
                <option value="">Selecione a província</option>
                {provinces.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* GMA */}
            <div>
              <label
                htmlFor="gma"
                className="block text-base font-medium text-gray-700"
              >
                GMA
              </label>
              <input
                type="text"
                id="gma"
                value={gma}
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-base bg-gray-100"
              />
            </div>

            {/* Tipo de meio */}
            <div>
              <label
                htmlFor="vessel"
                className="block text-base font-medium text-gray-700"
              >
                Tipo de meio
              </label>
              <input
                type="text"
                id="vessel"
                value={vessel}
                onChange={(e) => setVessel(e.target.value)}
                placeholder="Ex: Patrulha Angola I"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base"
              />
            </div>

            {/* Responsável */}
            <div>
              <label
                htmlFor="responsible"
                className="block text-base font-medium text-gray-700"
              >
                Responsável
              </label>
              <select
                id="responsible"
                value={responsible}
                onChange={(e) => setResponsible(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base"
              >
                <option value="">Selecione o responsável</option>
                <option>Cmdt. Manuel Santos</option>
                <option>Técnico A</option>
                <option>Técnico B</option>
                <option>Gestor 1</option>
                <option>Gestor 2</option>
                <option>Dra. Sofia Lima</option>
                <option>Biólogo Chefe</option>
                <option>Direção Geral</option>
                <option>Recursos Humanos</option>
                <option>Chefe de Equipa Bravo</option>
              </select>
            </div>

            {/* Plano de Ação */}
            <div>
              <label
                htmlFor="planoAcaoId"
                className="block text-base font-medium text-gray-700"
              >
                Plano de Ação (Opcional)
              </label>
              <select
                id="planoAcaoId"
                value={planoAcaoId}
                onChange={(e) => setPlanoAcaoId(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base"
              >
                <option value="">Nenhum</option>
                {planosDeAcao.map((plano) => (
                  <option key={plano.id} value={plano.id}>
                    {plano.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Custo Previsto */}
            <div>
              <label
                htmlFor="mission-cost"
                className="block text-base font-medium text-gray-700"
              >
                Custo Previsto (AOA)
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="mission-cost"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  placeholder="Ex: 150.000,00"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base pl-10"
                />
              </div>
            </div>

            {/* Coordenadas */}
            <div className="md:col-span-2">
              <label
                htmlFor="coordinates"
                className="block text-base font-medium text-gray-700"
              >
                Coordenadas
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="coordinates"
                  value={coordinates}
                  onChange={(e) => setCoordinates(e.target.value)}
                  placeholder="Ex: -8.8° S, 13.2° E"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base pl-10"
                />
              </div>
            </div>

            {/* Membros da Equipa */}
            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-base font-bold text-gray-700">
                  Membros da Equipa Operacional
                </label>
                <button
                  type="button"
                  onClick={handleAddMember}
                  className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest flex items-center hover:bg-blue-100 transition-colors border border-blue-100 shadow-sm"
                >
                  <UserPlus size={14} className="mr-2" /> Adicionar Elemento
                </button>
              </div>
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <th className="px-4 py-3">Nome Completo</th>
                      <th className="px-4 py-3">Órgão</th>
                      <th className="px-4 py-3">Contacto</th>
                      <th className="px-4 py-3 text-center w-16">...</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {teamMembers.length > 0 ? (
                      teamMembers.map((member, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="p-2">
                            <input
                              type="text"
                              value={member.nome}
                              onChange={(e) =>
                                handleMemberChange(idx, "nome", e.target.value)
                              }
                              className="w-full border-none bg-transparent text-sm font-bold text-slate-700 focus:ring-0"
                              placeholder="Nome completo"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={member.orgao}
                              onChange={(e) =>
                                handleMemberChange(idx, "orgao", e.target.value)
                              }
                              className="w-full border-none bg-transparent text-sm font-bold text-slate-700 focus:ring-0"
                              placeholder="Sigla do Órgão"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={member.contacto}
                              onChange={(e) =>
                                handleMemberChange(
                                  idx,
                                  "contacto",
                                  e.target.value,
                                )
                              }
                              className="w-full border-none bg-transparent text-sm font-bold text-slate-700 focus:ring-0"
                              placeholder="Telefone ou Email"
                            />
                          </td>
                          <td className="p-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveMember(idx)}
                              className="p-1.5 text-red-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-8 text-center text-slate-400 text-xs italic"
                        >
                          Nenhum membro adicionado à equipa operacional.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Objetivo da Missão */}
            <div className="md:col-span-2">
              <label
                htmlFor="mission-objective"
                className="block text-base font-medium text-gray-700"
              >
                Objetivos da Missão (Um por linha)
              </label>
              <textarea
                id="mission-objective"
                value={objectives}
                onChange={(e) => setObjectives(e.target.value)}
                rows={4}
                placeholder="Descreva os objetivos..."
                className="toolbar mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base"
              ></textarea>
            </div>

            {/* Calendários */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">
                  Data de Início
                </label>
                <Calendar
                  displayDate={startDisplayDate}
                  onDisplayDateChange={setStartDisplayDate}
                  selectedDate={startDate}
                  onDateSelect={setStartDate}
                />
              </div>
              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">
                  Data de Fim
                </label>
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
            <button
              type="button"
              onClick={onClose}
              className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-colors"
            >
              {isEditMode ? "Salvar Alterações" : "Criar Missão"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NovaAtividadeModal;
