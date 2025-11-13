import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Save, ClipboardList, DollarSign, FileText, Target } from 'lucide-react';

type FormData = {
  title: string;
  proponent: string;
  budget: string;
  submissionDate: string;
  expiryDate: string;
  description: string;
  objectives: string;
};

const CriarTermoDeReferenciaPage: React.FC = () => {
  const navigate = useNavigate();
  const { tdrId } = useParams<{ tdrId: string }>();
  const location = useLocation();
  const titleInputRef = useRef<HTMLInputElement>(null);

  const isEditMode = !!tdrId;
  const existingTdr = location.state?.tdr;

  const [formData, setFormData] = useState<FormData>({
    title: '',
    proponent: 'Departamento de IT',
    budget: '',
    submissionDate: '',
    expiryDate: '',
    description: '',
    objectives: '',
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  useEffect(() => {
    if (isEditMode && existingTdr) {
      setFormData({
        title: existingTdr.title || '',
        proponent: existingTdr.proponent || 'Departamento de IT',
        budget: existingTdr.budget || '',
        submissionDate: existingTdr.createdAt || '',
        expiryDate: existingTdr.expiryDate || '',
        description: existingTdr.description || `Descrição para ${existingTdr.title}.`,
        objectives: existingTdr.objectives || `Objetivos para ${existingTdr.title}.`
      });
    }
  }, [isEditMode, existingTdr]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { id, value } = e.target;
      setFormData(prev => ({ ...prev, [id]: value }));
      // Clear error when user starts typing
      if (errors[id as keyof FormData]) {
          setErrors(prev => ({ ...prev, [id]: undefined }));
      }
  };

  const validateField = (id: keyof FormData, value: string) => {
    if (!value.trim()) {
      setErrors(prev => ({ ...prev, [id]: 'Este campo é obrigatório.' }));
      return false;
    }
    setErrors(prev => ({ ...prev, [id]: undefined }));
    return true;
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!formData.title.trim()) newErrors.title = "Por favor, preencha o título antes de continuar.";
    if (!formData.submissionDate.trim()) newErrors.submissionDate = "Por favor, selecione a data de submissão.";
    if (!formData.expiryDate.trim()) newErrors.expiryDate = "Por favor, selecione a data de expiração.";
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      // Focus on the first field with an error
      if (newErrors.title) {
        titleInputRef.current?.focus();
      }
      return false;
    }
    return true;
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
        return;
    }

    if (isEditMode) {
      alert(`Termo de Referência ${tdrId} atualizado com sucesso! (Simulação)`);
    } else {
      alert('Termo de Referência salvo com sucesso! (Simulação)');
    }
    navigate('/termos-de-referencia');
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{isEditMode ? 'Editar Termo de Referência' : 'Novo Termo de Referência'}</h1>
          <p className="text-gray-600">{isEditMode ? `A editar o TdR: ${existingTdr?.title}` : 'Preencha os campos para criar um novo TdR.'}</p>
        </div>
        <button
          onClick={() => navigate('/termos-de-referencia')}
          className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg flex items-center transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para TdRs
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8" noValidate>
        {/* Detalhes Iniciais */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <ClipboardList className="h-5 w-5 mr-3 text-gray-500" />
            Detalhes do TdR
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-base font-medium text-gray-700">Título</label>
              <input 
                ref={titleInputRef}
                type="text" 
                id="title" 
                value={formData.title} 
                onChange={handleInputChange} 
                onBlur={(e) => validateField('title', e.target.value)}
                placeholder="Ex: Contratação de Serviços..." 
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 sm:text-base ${errors.title ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:border-blue-500'}`} 
                required 
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>
            <div>
              <label htmlFor="proponent" className="block text-base font-medium text-gray-700">Departamento Proponente</label>
              <select id="proponent" value={formData.proponent} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base">
                <option>Departamento de IT</option>
                <option>Departamento de Operações</option>
                <option>Direção Geral</option>
                <option>Recursos Humanos</option>
                <option>Financeiro</option>
              </select>
            </div>
            <div>
              <label htmlFor="budget" className="block text-base font-medium text-gray-700">Orçamento Previsto (AOA)</label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input type="number" id="budget" value={formData.budget} onChange={handleInputChange} placeholder="1.000.000,00" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base pl-10" />
              </div>
            </div>
             <div>
              <label htmlFor="submissionDate" className="block text-base font-medium text-gray-700">Data de Submissão</label>
              <input 
                type="date" 
                id="submissionDate" 
                value={formData.submissionDate} 
                onChange={handleInputChange} 
                onBlur={(e) => validateField('submissionDate', e.target.value)}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 sm:text-base ${errors.submissionDate ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:border-blue-500'}`} 
                required 
              />
              {errors.submissionDate && <p className="mt-1 text-sm text-red-600">{errors.submissionDate}</p>}
            </div>
            <div>
              <label htmlFor="expiryDate" className="block text-base font-medium text-gray-700">Data de Expiração</label>
              <input 
                type="date" 
                id="expiryDate" 
                value={formData.expiryDate} 
                onChange={handleInputChange} 
                onBlur={(e) => validateField('expiryDate', e.target.value)}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 sm:text-base ${errors.expiryDate ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:border-blue-500'}`} 
                required 
              />
              {errors.expiryDate && <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>}
            </div>
          </div>
        </div>

        {/* Descrição Detalhada */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-3 text-gray-500" />
            Descrição Detalhada
          </h3>
          <textarea
            id="description"
            rows={5}
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Descreva o contexto, a justificação e o escopo do que é pretendido..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base"
          />
        </div>

        {/* Objetivos */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <Target className="h-5 w-5 mr-3 text-gray-500" />
            Objetivos Esperados
          </h3>
          <textarea
            id="objectives"
            rows={4}
            value={formData.objectives}
            onChange={handleInputChange}
            placeholder="Liste os objetivos específicos, mensuráveis, alcançáveis, relevantes e temporais (SMART)..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base"
          />
        </div>

        {/* Ações */}
        <div className="flex justify-end space-x-3 pt-4 border-t mt-8">
          <button
            type="button"
            onClick={() => navigate('/termos-de-referencia')}
            className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center"
          >
            <Save className="h-5 w-5 mr-2" />
            {isEditMode ? 'Salvar Alterações' : 'Salvar TdR'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CriarTermoDeReferenciaPage;
