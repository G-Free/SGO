import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, UserCircle } from 'lucide-react';

interface ProjectDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: any) => void;
  project: any | null;
}

const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({ isOpen, onClose, onSave, project: initialProject }) => {
  const [project, setProject] = useState(initialProject);

  useEffect(() => {
    setProject(initialProject);
  }, [initialProject]);

  if (!isOpen || !project) {
    return null;
  }

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setProject({ ...project, notes: e.target.value });
  };
  
  const handleSave = () => {
    onSave(project);
    onClose();
  };

  const statusColors: { [key: string]: string } = {
    'Concluído': 'bg-green-100 text-green-800',
    'Em Execução': 'bg-blue-100 text-blue-800',
    'Planeado': 'bg-yellow-100 text-yellow-800',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div 
        className="bg-slate-50 rounded-lg shadow-xl w-full max-w-2xl max-h-[95vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center bg-white rounded-t-lg">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{project.title}</h2>
            <p className="text-sm text-gray-500">ID do Projeto: {project.id}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-grow space-y-6">
          <div className="bg-white p-6 rounded-lg border space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                    <UserCircle size={18} className="mr-3 text-gray-500 flex-shrink-0" />
                    <div>
                        <p className="text-sm text-gray-500">Gestor</p>
                        <p className="font-semibold text-gray-800 text-base">{project.manager}</p>
                    </div>
                </div>
                <div>
                    <p className="text-sm text-gray-500 mb-1">Estado</p>
                    <span className={`px-3 py-1.5 inline-flex text-sm leading-5 font-semibold rounded-full ${statusColors[project.status]}`}>
                        {project.status}
                    </span>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <div className="flex items-center">
                    <Calendar size={18} className="mr-3 text-gray-500 flex-shrink-0" />
                    <div>
                        <p className="text-sm text-gray-500">Data de Início</p>
                        <p className="font-semibold text-gray-800 text-base">{project.startDate}</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <Calendar size={18} className="mr-3 text-gray-500 flex-shrink-0" />
                    <div>
                        <p className="text-sm text-gray-500">Data de Fim (Prev.)</p>
                        <p className="font-semibold text-gray-800 text-base">{project.endDate}</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <Calendar size={18} className="mr-3 text-red-500 flex-shrink-0" />
                    <div>
                        <p className="text-sm text-gray-500">Prazo Final</p>
                        <p className="font-semibold text-gray-800 text-base">{project.dueDate}</p>
                    </div>
                </div>
            </div>
            <div className="pt-4 border-t">
                <p className="text-sm text-gray-500 mb-1">Progresso ({project.progress}%)</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${project.progress}%` }}></div>
                </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <label htmlFor="additional-notes" className="block text-base font-semibold text-gray-700 mb-2">
              Notas Adicionais
            </label>
            <textarea
              id="additional-notes"
              rows={6}
              value={project.notes || ''}
              onChange={handleNotesChange}
              placeholder="Adicione observações, links ou outras informações relevantes sobre o projeto aqui..."
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex justify-end space-x-3 bg-gray-50 rounded-b-lg">
          <button type="button" onClick={onClose} className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm">
            Fechar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm flex items-center"
          >
            <Save className="h-4 w-4 mr-2" />
            Salvar Notas
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsModal;