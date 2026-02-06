import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  Clock,
  MapPin,
  Calendar,
  Users,
  Ship,
  User,
  Info,
  AlertTriangle,
  FileText,
  Download,
  Camera,
  ClipboardCheck,
  Edit,
} from "lucide-react";

interface DetalheAtividadeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (activity: any) => void;
  activity: any | null;
  planos: { id: string; title: string }[];
}

const statusInfo: {
  [key: string]: { text: string; icon: React.ElementType; color: string };
} = {
  "Em Andamento": {
    text: "Em Andamento",
    icon: Clock,
    color: "bg-sky-100 text-sky-800",
  },
  "Em Curso": {
    text: "Em Curso",
    icon: Clock,
    color: "bg-blue-100 text-blue-800",
  },
  Concluída: {
    text: "Concluída",
    icon: Users,
    color: "bg-green-100 text-green-800",
  },
  Planeada: {
    text: "Planeada",
    icon: Calendar,
    color: "bg-yellow-100 text-yellow-800",
  },
};

const gravidadeColors: { [key: string]: string } = {
  Grave: "bg-gray-800 text-white",
  Média: "bg-gray-200 text-gray-800",
  "Muito Grave": "bg-red-600 text-white",
};

const DetalheAtividadeModal: React.FC<DetalheAtividadeModalProps> = ({
  isOpen,
  onClose,
  onEdit,
  activity,
  planos,
}) => {
  const [activeTab, setActiveTab] = useState("geral");
  const navigate = useNavigate();

  if (!isOpen || !activity) {
    return null;
  }

  const currentStatus = statusInfo[activity.status] || {
    text: activity.status,
    icon: Info,
    color: "bg-gray-100 text-gray-800",
  };
  const StatusIcon = currentStatus.icon;

  const tabs = [
    { id: "geral", label: "Informações Gerais" },
    { id: "equipa", label: "Equipa e Responsáveis" },
    { id: "objetivos", label: "Objetivos" },
  ];

  const handleGenerateReport = () => {
    onClose();
    navigate("/relatorios/novo", { state: { activity } });
  };

  const plano = activity.planoAcaoId
    ? planos.find((p) => p.id === activity.planoAcaoId)
    : null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 grid place-items-center p-4 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="bg-slate-50 rounded-lg shadow-xl w-full max-w-4xl max-h-[95vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-gray-800">
              {activity.title}
            </h2>
            <div
              className={`flex items-center space-x-2 text-base font-semibold px-3 py-1 rounded-full ${currentStatus.color}`}
            >
              <StatusIcon className="h-4 w-4" />
              <span>{currentStatus.text}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 border-b border-gray-200">
          <div className="flex space-x-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-1 text-base font-semibold transition-colors duration-200
                  ${
                    activeTab === tab.id
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-grow">
          {activeTab === "geral" && (
            <div className="bg-white p-5 rounded-lg border">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Detalhes da Missão
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-base">
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-3 mt-0.5 text-gray-500 flex-shrink-0" />
                  <span className="font-semibold text-gray-700 mr-2">
                    Província:
                  </span>{" "}
                  {activity.province}
                </div>
                <div className="flex items-start">
                  <Calendar className="h-4 w-4 mr-3 mt-0.5 text-gray-500 flex-shrink-0" />
                  <span className="font-semibold text-gray-700 mr-2">
                    Período:
                  </span>{" "}
                  {activity.startDate} - {activity.endDate}
                </div>
                <div className="flex items-start">
                  <Info className="h-4 w-4 mr-3 mt-0.5 text-gray-500 flex-shrink-0" />
                  <span className="font-semibold text-gray-700 mr-2">
                    Tipo de Operação:
                  </span>{" "}
                  {activity.type}
                </div>
                <div className="flex items-start">
                  <Ship className="h-4 w-4 mr-3 mt-0.5 text-gray-500 flex-shrink-0" />
                  <span className="font-semibold text-gray-700 mr-2">
                    Tipo de meio:
                  </span>{" "}
                  {activity.vessel}
                </div>
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-3 mt-0.5 text-gray-500 flex-shrink-0" />
                  <span className="font-semibold text-gray-700 mr-2">
                    Coordenadas:
                  </span>{" "}
                  {activity.coordinates}
                </div>
                <div className="flex items-start">
                  <AlertTriangle className="h-4 w-4 mr-3 mt-0.5 text-red-500 flex-shrink-0" />
                  <span className="font-semibold text-gray-700 mr-2">
                    Infrações Registadas:
                  </span>{" "}
                  {activity.infractions}
                </div>
                <div className="flex items-start">
                  <Camera className="h-4 w-4 mr-3 mt-0.5 text-blue-500 flex-shrink-0" />
                  <span className="font-semibold text-gray-700 mr-2">
                    Evidências Coletadas:
                  </span>{" "}
                  {activity.evidencias?.length || 0}
                </div>
                {activity.reportGenerated && (
                  <div className="flex items-start md:col-span-2">
                    <FileText className="h-4 w-4 mr-3 mt-0.5 text-green-600 flex-shrink-0" />
                    <span className="font-semibold text-gray-700 mr-2">
                      Relatório:
                    </span>{" "}
                    {activity.reportId || activity.reportGenerated}
                  </div>
                )}
                {plano && (
                  <div className="flex items-start md:col-span-2">
                    <ClipboardCheck className="h-4 w-4 mr-3 mt-0.5 text-indigo-500 flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-gray-700 mr-2">
                        Plano de Ação:
                      </span>
                      <span className="text-indigo-700 font-semibold">
                        {plano.title}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          {activeTab === "equipa" && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-lg border">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Responsável pela Missão
                </h3>
                <div className="flex items-center bg-gray-50 p-3 rounded-md border">
                  <User className="h-6 w-6 mr-4 text-gray-500 flex-shrink-0" />
                  <div>
                    <p className="text-md font-semibold text-gray-900">
                      {activity.responsible}
                    </p>
                    <p className="text-base text-gray-600">
                      Coordenador da Missão
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-5 rounded-lg border">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Equipa de Fiscalização
                </h3>
                <div className="space-y-3">
                  {activity.equipa && activity.equipa.length > 0 ? (
                    activity.equipa.map((membro: any, index: number) => (
                      <div
                        key={index}
                        className="bg-white p-4 rounded-lg border flex justify-between items-center"
                      >
                        <div>
                          <p className="font-bold text-gray-900">
                            {membro.nome}
                          </p>
                          <p className="text-base text-gray-600">
                            {membro.cargo}
                          </p>
                        </div>
                        <span className="text-base text-gray-500">
                          {membro.anos} anos de experiência
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">
                      Nenhum membro da equipa registado.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          {activeTab === "objetivos" && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-lg border">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Objetivos da Missão
                </h3>
                <ul className="list-disc list-inside space-y-2 text-base text-gray-700">
                  {activity.objectives?.map((obj: string, index: number) => (
                    <li key={index}>{obj}</li>
                  )) || <li>Nenhum objetivo definido.</li>}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex justify-end space-x-3 bg-white/50">
          <button
            type="button"
            onClick={onClose}
            className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm transition-colors"
          >
            Fechar
          </button>

          {onEdit && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(activity);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-colors flex items-center"
            >
              <Edit className="h-5 w-5 mr-2" />
              Editar
            </button>
          )}

          {activity.source === "list" && (
            <button
              type="button"
              onClick={handleGenerateReport}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-colors flex items-center"
            >
              <FileText className="h-5 w-5 mr-2" />
              {activity.reportId ? "Editar Relatório" : "Gerar Relatório"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetalheAtividadeModal;
