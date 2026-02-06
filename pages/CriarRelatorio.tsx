import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Save, FileText, Calendar, RefreshCw, Paperclip, Upload, Trash2, Eye, Link as LinkIcon, Users, AlertOctagon, DollarSign, MapPin, ShieldAlert, Briefcase, TrendingUp, Edit, Image, FileVideo, X, List, Target, Gavel, Package, Truck, Receipt, Plus, Send, CornerUpLeft, CheckCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../components/Notification';

// --- DADOS MOCKADOS PARA SIMULAÇÃO DE INTEGRAÇÃO ---
const mockActivitiesSource = [
  { id: 'ATV-001', title: 'Fiscalização Costa Norte', province: 'Cabinda', startDate: '01/07/2024', endDate: '05/07/2024', status: 'Concluída', type: 'Marítima', objectives: ['Verificar cumprimento das normas', 'Inspecionar embarcações'], infracoes: [{ descricao: 'Pesca sem licença', multa: '150.000 Kz', status: 'Processando' }] },
  { id: 'ATV-002', title: 'Atualização do Sistema Integrado', province: 'Luanda', startDate: '12/07/2024', endDate: '12/07/2024', status: 'Em Curso', type: 'Técnica', objectives: ['Atualizar servidores de base de dados', 'Validar integridade dos backups'], infracoes: [] },
  { id: 'ATV-005', title: 'Verificação de backups', province: 'Luanda', startDate: '08/07/2024', endDate: '08/07/2024', status: 'Concluída', type: 'Técnica/IT', objectives: ['Garantir integridade dos dados'], infracoes: [] },
  { id: 'ATV-006', title: 'Patrulha de rotina na Baía', province: 'Luanda', startDate: '10/05/2024', endDate: '10/05/2024', status: 'Concluída', type: 'Marítima', objectives: ['Monitorizar pesca artesanal', 'Verificar licenças de navegação'], infracoes: [{ descricao: 'Falta de coletes', multa: '25.000 Kz', status: 'Resolvida' }] },
  { id: 'ATV-008', title: 'Monitorização Ambiental', province: 'Namibe', startDate: '29/01/2024', endDate: '02/02/2024', status: 'Concluída', type: 'Científica', objectives: ['Coleta de amostras de água', 'Medição de pH e salinidade'], infracoes: [] },
  { id: 'ATV-009', title: 'Fiscalização Fronteira Santa Clara', province: 'Cunene', startDate: '15/07/2024', endDate: '18/07/2024', status: 'Concluída', type: 'Terrestre', objectives: ['Controlo migratório', 'Fiscalização de mercadorias'], infracoes: [{ descricao: 'Mercadoria não declarada', multa: '500.000 Kz', status: 'Paga' }] },
];

const mockPlanosSource = [
  { id: 'PA-01', title: 'Modernização Tecnológica das Fronteiras', startDate: '2024-01-15', endDate: '2024-12-20', status: 'Em Execução' },
  { id: 'PA-02', title: 'Estratégia de Combate à Imigração Ilegal 2024', startDate: '2024-02-01', endDate: '2024-11-30', status: 'Em Execução' },
];

// Logo oficial - PNG Format
const cgcfLogoImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARgAAABDCAYAAAC2+lYkAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAd8SURBVHhe7Z1/bBxlHMc/s8zKsh/BhmEDExiMMWEi16W5NEmTNC0tDVLbFGqjth80bf2x/bFJk6Zp2rRNWv2xTVWb6oc2DZImaVq6lK7JTSmJuW5iAgMMGOwgK8uyLPv8I3e5d3Zmdnd2d9d9fz8vB3be2Z3f/X7e5/l5dhcQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCATrgmEYx+vr678MDAx8tbS09PHAwMC35+fn/6FQKPzMzMy3UqlUHxsb+0ZFRfWv0tLS7x4eHj6VSqU+Pj4+vrCw8J+Tk5NPzs7OfqRSqV+o1f9/hUIhMpnMPzo6+tX4+Pgvj46O/k6lUj+YnZ39ZHt7+60xMTGfjI2Nfb5arT4xOTn5xezs7C/FYvEbvb29b6VS6Z+1tbX/0Nra+kQ8Hv98PB7/x/F4/N3xePyT8Xj89+Px+Cfj8fiPx+Px347H4x+Nx+N/HI/H/zgej/+beDz+R/F4/I/i8fgfx+PxP4rH438aj8f/MB6P/2E8Hv+DeDz+X4jH498lHo/fJR6P3ycej98lHo/fJh6P3yIej18jHo9fJR6PXyMej18lHo9fIh6PXyAej18gHo9fIB6PXyAej18gHo9fJB6PXyQej18kHo9fJB6PXyQej18kHo9fJB6PXyQej18kHo9fIB6PXyAej18gHo9fIB6PXyIej18hHo9fIR6PXyEej18hHo9fIR6PXyEej18hHo9fIR6PXyMeb7+vX78KHo9fIR6PXykejy8SjycSjycSj6cRj6cSj6cRjyYQj0YSj6cRj5cQj5cQj6cSj1cRj1cRj1cRj1cRjxcRj5eIxyuIx2uIxmuIxyuIxyuIx4uIx+OIxyOIxyOIx1OIxxOIxxOIx4OIx4OIxwOIxwOIx4OIx9OIx9OIxxOIxyOJxxKJxyKJxxKJxyOJxxKIx5KIRxKIxxKIR1KIhxKIRyKIRyKIR4SIR1KIRySIRzKIR3KIRzKIRyKIRwKIR4KEIxHEIyHEIx6EIx6EIRwKIhwSIRwSIRwKIhwKEQ4FIRwKEQ4FEA96EI92kI92kI92kI92kI9kEA8kEA8kEI9kEA8kEI8EkA8lkI/EkA/FkA/HkA/GEI/GEY/FEY/FEY/EEA/HEI/HEI/FEo/FEY/FEQ/Hkg/Hkg/FkA/FkA/Hkg/HkQ/HkQ/FkQ/GkY/GEY/GkY/GEY9GkI/GkY9GEI+GEA/6EY/4EY/2EA/3EI93kI92kI/0kI8EEg/2kI9kEI+mkA8nkI9nkI9nkI8mkA8nkI9kkI/FEI+FEI9FEo9EEo9GEo9GEg+6EY+6EQ+7EI+7EI+5kI84kI84kI84kI84kI84EI8YkI8IkA8IEA8IkA8IkI+okA+okI+skA9kkI9EkA9mkA/mkA+WkA9UkA9UkA9kkI+mkI+kkI/nkI+nkI/nkI+GkA8lkA8mEI8mEI9GEg+mEA9GkI+GEA8GEQ8GEg+GEg8EkI8AkA8CEg4GEA8GEA4GkA4EkA8CkAwHkAyHkA4GkA4EkAoGEAwGEAwEkAkFkAyEEAkFkAyEkAmEkAmEkAmGkAmEkAmEEAmEkAmEEAmEkAmEkAmEkAmEkAmEkAmEEAmEkAmGEAmGEAmEkAmEkAmEkAl6kAl6kAkGkAkEEAmEEAmGEAmGEAmEkAmEkAmEkAmEkAmEkAmGEAmEEAmEEAmEEAmEkAmEkAmEkAmEkAmEkAmEkAmEkAmEkAmGEAkGEAkGEAkEkAkEEAmEEAmEEAmGEAkGEAmEEAl1kAqFQKBSCQiFQKAKFQKBSCQSCQCAQCIRCIRAIBAKBYD3gfwD88c+E9jG3SwAAAABJRU5kJggg==";

// Helper to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// Componente para Listas Dinâmicas Simples
const DynamicTableInput: React.FC<{
    columns: { key: string; label: string; width?: string; type?: 'text' | 'date' | 'select' | 'number'; options?: string[] }[];
    data: any[];
    onChange: (newData: any[]) => void;
    emptyMessage?: string;
    readOnly?: boolean;
}> = ({ columns, data, onChange, emptyMessage = "Nenhum registo adicionado.", readOnly = false }) => {
    const [newItem, setNewItem] = useState<any>({});

    const handleNewItemChange = (key: string, value: string) => {
        setNewItem({ ...newItem, [key]: value });
    };

    const handleAddItem = () => {
        const isValid = columns.every(col => newItem[col.key] && newItem[col.key].toString().trim() !== '');
        if (!isValid) return; 
        onChange([...data, { ...newItem, id: Date.now() }]);
        setNewItem({});
    };

    const handleRemoveItem = (index: number) => {
        const newData = data.filter((_, i) => i !== index);
        onChange(newData);
    };

    return (
        <div className="space-y-3">
            <div className="overflow-x-auto border rounded-lg">
                <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map(col => (
                                <th key={col.key} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: col.width }}>
                                    {col.label}
                                </th>
                            ))}
                            {!readOnly && <th className="px-4 py-2 w-16"></th>}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.map((item, index) => (
                            <tr key={item.id || index}>
                                {columns.map(col => (
                                    <td key={col.key} className="px-4 py-2 text-sm text-gray-700">
                                        {item[col.key]}
                                    </td>
                                ))}
                                {!readOnly && (
                                    <td className="px-4 py-2 text-center">
                                        <button 
                                            type="button" 
                                            onClick={() => handleRemoveItem(index)}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-full transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan={columns.length + (readOnly ? 0 : 1)} className="px-4 py-3 text-sm text-gray-500 text-center italic">
                                    {emptyMessage}
                                </td>
                            </tr>
                        )}
                        {!readOnly && (
                            <tr className="bg-blue-50/50">
                                {columns.map(col => (
                                    <td key={col.key} className="px-4 py-2">
                                        {col.type === 'select' ? (
                                            <select title={col.label}
                                                value={newItem[col.key] || ''}
                                                onChange={(e) => handleNewItemChange(col.key, e.target.value)}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-xs py-1.5"
                                            >
                                                <option value="">Selecione...</option>
                                                {col.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                            </select>
                                        ) : (
                                            <input
                                                type={col.type || 'text'}
                                                placeholder={`...`}
                                                value={newItem[col.key] || ''}
                                                onChange={(e) => handleNewItemChange(col.key, e.target.value)}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-xs py-1.5"
                                            />
                                        )}
                                    </td>
                                ))}
                                <td className="px-4 py-2 text-center">
                                    <button 
                                        type="button" 
                                        onClick={handleAddItem}
                                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 p-1.5 rounded-full transition-colors"
                                        title="Adicionar Linha"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- COMPONENTE: Tabela de Resultados com Evidências ---
const ResultsWithEvidenceInput: React.FC<{
    columns: { key: string; label: string; width?: string; type?: 'text' | 'number' }[];
    data: any[];
    onChange: (newData: any[]) => void;
    emptyMessage?: string;
    readOnly?: boolean;
}> = ({ columns, data, onChange, emptyMessage = "Sem registos.", readOnly = false }) => {
    const [newItem, setNewItem] = useState<any>({});
    const [newFile, setNewFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleNewItemChange = (key: string, value: string) => {
        setNewItem({ ...newItem, [key]: value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setNewFile(e.target.files[0]);
        }
    };

    const handleAddItem = () => {
        const isValid = columns.every(col => newItem[col.key] && newItem[col.key].toString().trim() !== '');
        if (!isValid) return; 
        
        onChange([...data, { 
            ...newItem, 
            id: Date.now(),
            evidence: newFile, // Store the file object
            evidenceName: newFile ? newFile.name : null
        }]);
        setNewItem({});
        setNewFile(null);
        if(fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleRemoveItem = (index: number) => {
        const newData = data.filter((_, i) => i !== index);
        onChange(newData);
    };

    const getFileIcon = (fileName: string) => {
        if (!fileName) return null;
        const ext = fileName.split('.').pop()?.toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext || '')) return <Image size={14} className="text-blue-500" />;
        if (['mp4', 'mov', 'avi'].includes(ext || '')) return <FileVideo size={14} className="text-purple-500" />;
        return <FileText size={14} className="text-gray-500" />;
    };

    return (
        <div className="space-y-3">
            <div className="overflow-x-auto border rounded-lg">
                <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map(col => (
                                <th key={col.key} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: col.width }}>
                                    {col.label}
                                </th>
                            ))}
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                                Prova / Anexo
                            </th>
                            {!readOnly && <th className="px-4 py-2 w-16"></th>}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.map((item, index) => (
                            <tr key={item.id || index}>
                                {columns.map(col => (
                                    <td key={col.key} className="px-4 py-2 text-sm text-gray-700">
                                        {item[col.key]}
                                    </td>
                                ))}
                                <td className="px-4 py-2 text-sm text-gray-600">
                                    {item.evidenceName ? (
                                        <div className="flex items-center space-x-2 bg-gray-100 px-2 py-1 rounded-md max-w-[150px]">
                                            {getFileIcon(item.evidenceName)}
                                            <span className="truncate text-xs" title={item.evidenceName}>{item.evidenceName}</span>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-gray-400 italic">Sem anexo</span>
                                    )}
                                </td>
                                {!readOnly && (
                                    <td className="px-4 py-2 text-center">
                                        <button 
                                            type="button" 
                                            onClick={() => handleRemoveItem(index)}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-full transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan={columns.length + (readOnly ? 1 : 2)} className="px-4 py-3 text-sm text-gray-500 text-center italic">
                                    {emptyMessage}
                                </td>
                            </tr>
                        )}
                        {/* Linha de Adição */}
                        {!readOnly && (
                            <tr className="bg-blue-50/50">
                                {columns.map(col => (
                                    <td key={col.key} className="px-4 py-2">
                                        <input
                                            type={col.type || 'text'}
                                            placeholder={`...`}
                                            value={newItem[col.key] || ''}
                                            onChange={(e) => handleNewItemChange(col.key, e.target.value)}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-xs py-1.5"
                                        />
                                    </td>
                                ))}
                                <td className="px-4 py-2">
                                    <div className="flex items-center">
                                        <input title= "Anexar Prova"
                                            type="file" 
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            className="hidden" 
                                            accept="image/*,video/*,application/pdf"
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className={`flex items-center justify-center w-full px-2 py-1.5 text-xs font-medium border rounded-md transition-colors ${newFile ? 'bg-green-100 text-green-700 border-green-300' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}
                                        >
                                            {newFile ? (
                                                <>
                                                    {getFileIcon(newFile.name)}
                                                    <span className="ml-1 truncate max-w-[80px]">{newFile.name}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Paperclip size={14} className="mr-1"/> Anexar
                                                </>
                                            )}
                                        </button>
                                        {newFile && (
                                            <button 
                                                type="button"
                                                onClick={() => { setNewFile(null); if(fileInputRef.current) fileInputRef.current.value=''; }}
                                                className="ml-1 text-red-500 hover:bg-red-50 rounded-full p-1"
                                            >
                                                <X size={14} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-2 text-center">
                                    <button 
                                        type="button" 
                                        onClick={handleAddItem}
                                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 p-1.5 rounded-full transition-colors"
                                        title="Adicionar Linha"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Componente Específico para Infrações (Baseado no layout solicitado - Secção 5)
const InfraçõesInput: React.FC<{
    infracoes: any[];
    onChange: (newData: any[]) => void;
    readOnly?: boolean;
}> = ({ infracoes, onChange, readOnly = false }) => {
    const [newItem, setNewItem] = useState({ descricao: '', valor: '', status: 'Pendente' });

    const handleAddItem = () => {
        if (!newItem.descricao.trim()) return;
        onChange([...infracoes, { ...newItem, id: Date.now() }]);
        setNewItem({ descricao: '', valor: '', status: 'Pendente' });
    };

    const handleRemoveItem = (index: number) => {
        const newData = infracoes.filter((_, i) => i !== index);
        onChange(newData);
    };

    return (
        <div className="space-y-3">
            {/* Lista Existente */}
            {infracoes.length > 0 && (
                <div className="space-y-2">
                    {infracoes.map((inf, index) => (
                        <div key={inf.id || index} className="flex flex-col md:flex-row gap-3 items-center p-3 border border-gray-200 rounded-lg bg-gray-50/50">
                            <div className="flex-grow w-full md:w-auto text-sm text-gray-700 font-medium">
                                {inf.descricao}
                            </div>
                            <div className="w-full md:w-48 text-sm text-gray-600">
                                {inf.valor ? `${inf.valor} Kz` : 'Sem valor'}
                            </div>
                            <div className="w-full md:w-32">
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${inf.status === 'Paga' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {inf.status}
                                </span>
                            </div>
                            {!readOnly && (
                                <button onClick={() => handleRemoveItem(index)} className="text-red-500 hover:bg-red-50 p-2 rounded-full">
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Input Row */}
            {!readOnly && (
                <div className="flex flex-col md:flex-row gap-3 items-center p-1">
                    <div className="flex-grow w-full md:w-auto">
                        <input 
                            type="text" 
                            placeholder="Descrição da infração" 
                            value={newItem.descricao}
                            onChange={(e) => setNewItem({...newItem, descricao: e.target.value})}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base py-2 px-3" 
                        />
                    </div>
                    <div className="w-full md:w-48">
                        <input 
                            type="text" 
                            placeholder="Valor da coima (Kz)" 
                            value={newItem.valor}
                            onChange={(e) => setNewItem({...newItem, valor: e.target.value})}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base py-2 px-3" 
                        />
                    </div>
                    <div className="w-full md:w-40">
                        <select title="Status da infração"
                            value={newItem.status}
                            onChange={(e) => setNewItem({...newItem, status: e.target.value})}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base py-2 px-3"
                        >
                            <option>Pendente</option>
                            <option>Paga</option>
                            <option>Em disputa</option>
                        </select>
                    </div>
                    <button 
                        type="button" 
                        onClick={handleAddItem}
                        className="flex-shrink-0 bg-blue-100 text-blue-700 hover:bg-blue-200 font-semibold py-2 px-4 rounded-lg flex items-center transition-colors"
                    >
                        <Plus size={18} className="mr-1"/> Adicionar
                    </button>
                </div>
            )}
        </div>
    );
};

const CriarRelatorioPage: React.FC = () => {
  const navigate = useNavigate();
  const { reportId } = useParams<{ reportId: string }>();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, hasRole } = useAuth();
  const { addNotification } = useNotification();

  const isEditMode = !!reportId;
  const existingReport = location.state?.report;
  const sourceActivity = location.state?.activity;

  // WORKFLOW & STATES
  const [reportStatus, setReportStatus] = useState<string>(existingReport?.status || 'Rascunho');
  const [workflowHistory, setWorkflowHistory] = useState<any[]>(existingReport?.history || []);

  const currentYear = new Date().getFullYear();

  // Identificação
  const [reportType, setReportType] = useState<'Mensal' | 'Anual'>('Mensal');
  const [province, setProvince] = useState('Todas');
  const [activityName, setActivityName] = useState('Fiscalização Integrada');
  
  // MODIFICAÇÃO: Substituindo Mês/Ano por Filtros de Período e Província
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Data Lists State (Contexto)
  const [activitiesList, setActivitiesList] = useState<any[]>([]);
  const [plansList, setPlansList] = useState<any[]>([]);
  
  // Estrutura do Relatório (Campos de Texto)
  const [preambulo, setPreambulo] = useState('');
  const [constatacoesGerais, setConstatacoesGerais] = useState(''); 
  
  // Estrutura do Relatório (Listas Dinâmicas)
  const [encontrosList, setEncontrosList] = useState<any[]>([]);
  const [alvosList, setAlvosList] = useState<any[]>([]);
  const [accoesList, setAccoesList] = useState<any[]>([]);
  const [infracoesList, setInfracoesList] = useState<any[]>([]); 
  const [municipiosList, setMunicipiosList] = useState<any[]>([]);
  
  // Secção 7: Objetivos (Dinâmico)
  const [objectivosList, setObjectivosList] = useState<any[]>([]);

  // Secção 8: Resultados Gerais (Listas Específicas) - Agora suportam anexos
  const [detencoesList, setDetencoesList] = useState<any[]>([]);
  const [apreensoesList, setApreensoesList] = useState<any[]>([]);
  const [transpList, setTranspList] = useState<any[]>([]);
  const [tributarioList, setTributarioList] = useState<any[]>([]);
  
  const [valoresApurados, setValoresApurados] = useState('');
  const [estadoMoral, setEstadoMoral] = useState('Alto - Disciplina mantida.');
  const [forcasMeios, setForcasMeios] = useState('');
  const [consideracoes, setConsideracoes] = useState('');
  const [propostas, setPropostas] = useState('');

  const [attachments, setAttachments] = useState<File[]>([]);
  const [isAutoGenerating, setIsAutoGenerating] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // LOGIC TO DETERMINE READ-ONLY STATE
  const isReadOnly = React.useMemo(() => {
      const role = user?.profile.role;
      
      // PERMISSÃO FULL PARA ADMINISTRADOR
      if (role === 'administrador') return false;

      // TÉCNICO OPERAÇÃO CENTRAL PODE AGORA EDITAR E REGISTAR RESULTADOS
      if (role === 'tecnico_operacional_central') {
          // Bloqueia apenas se o relatório já tiver sido validado ou estiver num estado final de aprovação
          return reportStatus === 'Validado' || reportStatus === 'Encaminhado';
      }
      
      return true; 
  }, [user, reportStatus]);

  // --- LÓGICA DE PREENCHIMENTO AUTOMÁTICO ATUALIZADA ---
  const autoFillReportData = () => {
    setIsAutoGenerating(true);
    
    // Filtrar Atividades por Período e Província
    const filteredActivities = mockActivitiesSource.filter(act => {
        // Converter mock date "DD/MM/YYYY" para objeto Date para comparação
        const [day, actMonth, actYear] = act.startDate.split('/').map(Number);
        const actDate = new Date(actYear, actMonth - 1, day);
        
        let dateMatch = true;
        if (startDate) {
            const startLimit = new Date(startDate);
            dateMatch = dateMatch && actDate >= startLimit;
        }
        if (endDate) {
            const endLimit = new Date(endDate);
            dateMatch = dateMatch && actDate <= endLimit;
        }

        let provinceMatch = true;
        if (province !== 'Todas') {
            provinceMatch = act.province === province;
        }

        return dateMatch && provinceMatch;
    });

    setActivitiesList(filteredActivities);

    // Gerar Textos e Listas
    if (filteredActivities.length > 0) {
        
        // Preâmbulo
        const periodText = startDate && endDate ? `período de ${new Date(startDate).toLocaleDateString()} a ${new Date(endDate).toLocaleDateString()}` : "período selecionado";
        const locationText = province === 'Todas' ? 'território nacional' : `província de ${province}`;
        setPreambulo(`O presente relatório consubstancia as atividades desenvolvidas pelo Grupo Operacional Multissectorial durante o ${periodText}, abrangendo as operações realizadas no ${locationText}, com foco na fiscalização e controlo das fronteiras e rotas comerciais.`);

        // Ações Desenvolvidas
        const newAccoes = filteredActivities.map((act, index) => ({
            id: index,
            data: act.startDate,
            descricao: `Atividade: ${act.title} (${act.type})`,
            status: act.status
        }));
        setAccoesList(newAccoes);

        // Preencher Objetivos (Baseado nas atividades)
        const newObjectivos: any[] = [];
        filteredActivities.forEach(act => {
            if (act.objectives) {
                act.objectives.forEach(obj => {
                    newObjectivos.push({
                        id: Date.now() + Math.random(),
                        objetivo: obj,
                        atividade: act.title,
                        resultado: act.status === 'Concluída' ? 'Alcançado' : 'Em Curso'
                    });
                });
            }
        });
        setObjectivosList(newObjectivos);

        // Constatações e Infrações
        let totalMultas = 0;
        const newInfracoes: any[] = [];
        
        filteredActivities.forEach(act => {
            if (act.infracoes && act.infracoes.length > 0) {
                act.infracoes.forEach(inf => {
                    newInfracoes.push({
                        id: Date.now() + Math.random(),
                        descricao: `${inf.descricao} (Ref: ${act.title})`,
                        valor: inf.multa,
                        status: inf.status === 'Paga' ? 'Paga' : 'Pendente'
                    });
                    const valorLimpo = parseFloat(inf.multa.replace(/[^0-9,]/g, '').replace(',', '.'));
                    if (!isNaN(valorLimpo)) totalMultas += valorLimpo;
                });
            }
        });
        setInfracoesList(newInfracoes);

        // Valores
        setValoresApurados(totalMultas > 0 ? `${totalMultas.toLocaleString('pt-AO')} Kz` : '0 Kz');
        
        // Forças e Meios
        setForcasMeios(`Para a execução das ${filteredActivities.length} atividades listadas, foram mobilizados meios técnicos e humanos conforme as escalas de serviço aprovadas.`);

    } else {
        setPreambulo(`Relatório referente ao período selecionado. Sem dados automáticos encontrados para os filtros selecionados.`);
        setAccoesList([]);
        setInfracoesList([]);
        setObjectivosList([]);
        setValoresApurados("0 Kz");
        setActivitiesList([]);
    }

    setTimeout(() => setIsAutoGenerating(false), 500);
  };

  // Effect para disparar a automação quando os filtros mudam
  useEffect(() => {
    if (!isEditMode && !sourceActivity && !isReadOnly) {
        autoFillReportData();
    }
  }, [reportType, startDate, endDate, province]);


  // Effect to populate form data (Edit Mode or Source Activity)
  useEffect(() => {
    if (isEditMode && existingReport) {
      setActivityName(existingReport.title || 'Relatório Mensal');
      setProvince(existingReport.province || 'Todas');
      setPreambulo(existingReport.summary || '');
      setConsideracoes(existingReport.challenges || '');
      setPropostas(existingReport.nextMonthPlan || '');
      
      if (existingReport.valoresApurados) setValoresApurados(existingReport.valoresApurados);
      if (existingReport.forcasMeios) setForcasMeios(existingReport.forcasMeios);
      
    } else if (sourceActivity) {
      setActivityName(sourceActivity.title);
      if(sourceActivity.province) setProvince(sourceActivity.province);
      
      setActivitiesList([sourceActivity]);
      
      const missionDetails = [
          `Tipo de Operação: ${sourceActivity.type || 'Não especificado'}`,
          `Responsável Operacional: ${sourceActivity.responsible}`,
          `Período: ${sourceActivity.startDate} a ${sourceActivity.endDate}`
      ].join('\n');

      setPreambulo(`Relatório referente à atividade operacional "${sourceActivity.title}".\n\nDETALHES DA MISSÃO:\n${missionDetails}`);
      
      // Auto-populate Accoes List
      setAccoesList([{
          id: 1,
          data: sourceActivity.startDate,
          descricao: sourceActivity.title,
          status: sourceActivity.status
      }]);

      const infractionsData = sourceActivity.infracoes || sourceActivity.infractions;
      
      if (Array.isArray(infractionsData) && infractionsData.length > 0) {
         // Populate structured list
         const newInfracoes = infractionsData.map((inf: any) => ({
             id: Date.now() + Math.random(),
             descricao: inf.descricao,
             valor: inf.multa || '',
             status: inf.status === 'Paga' ? 'Paga' : 'Pendente'
         }));
         setInfracoesList(newInfracoes);
         
         const totalValue = infractionsData.reduce((acc: number, curr: any) => {
             const valStr = curr.multa ? String(curr.multa).replace(/[^0-9,.]/g, '').replace(',', '.') : '0';
             const val = parseFloat(valStr);
             return acc + (isNaN(val) ? 0 : val);
         }, 0);
         
         setValoresApurados(totalValue > 0 ? `${totalValue.toLocaleString('pt-AO')} Kz` : '0 Kz');
      } else {
         setInfracoesList([]);
         setValoresApurados('0 Kz');
      }
      
      setForcasMeios(`EQUIPA DE FISCALIZAÇÃO:\n${sourceActivity.equipa?.map((m:any) => m.nome).join(', ') || 'N/A'}\n\nMEIOS TÉCNICOS:\n• ${sourceActivity.vessel || 'Viatura Padrão'}`);
    }
  }, [isEditMode, existingReport, sourceActivity]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const handleRemoveAttachment = (indexToRemove: number) => {
    setAttachments(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const validateForm = () => {
    const missingFields = [];
    if (!activityName.trim()) missingFields.push("Nome da Atividade / Plano");
    if (!preambulo.trim()) missingFields.push("Preâmbulo");
    
    // Check minimal content requirement
    const hasContent = accoesList.length > 0 || constatacoesGerais.trim() || infracoesList.length > 0 || detencoesList.length > 0;
    if (!hasContent) missingFields.push("Conteúdo do Relatório (Ações, Constatações ou Resultados)");

    if (missingFields.length > 0) {
        alert(`Por favor, preencha os seguintes campos obrigatórios antes de continuar:\n\n- ${missingFields.join('\n- ')}`);
        return false;
    }
    return true;
  };

  // --- ACTIONS HANDLERS (SUBMISSION FLOW) ---

  const handleSaveDraft = () => {
      setReportStatus('Rascunho');
      addNotification("Relatório salvo como rascunho.", 'info', 'Rascunho');
      navigate('/relatorios');
  };

  const handleSubmitFlow = () => {
      if (!validateForm()) return;
      
      if (confirm("Tem certeza que deseja submeter este relatório? Após submissão, a edição será bloqueada.")) {
          setReportStatus('Submetido');
          addNotification("Relatório submetido para validação.", 'success', 'Submissão');
          navigate('/relatorios');
      }
  };

  const handleReturnFlow = () => {
      const reason = prompt("Indique o motivo da devolução:");
      if (reason) {
          setReportStatus('Em Edição'); // Back to draft/edit for tech
          addNotification("Relatório devolvido para correção.", 'error', 'Devolução');
          navigate('/relatorios');
      }
  };

  const handleForwardFlow = () => {
      if (confirm("Encaminhar este relatório para a GMO Central?")) {
          setReportStatus('Encaminhado');
          addNotification("Relatório encaminhado para validação final.", 'success', 'Encaminhamento');
          navigate('/relatorios');
      }
  };

  const handleApproveFlow = () => {
      if (confirm("Confirmar validação final deste relatório? Esta ação fecha o histórico.")) {
          setReportStatus('Validado');
          addNotification("Relatório validado e arquivado com sucesso.", 'success', 'Validação');
          navigate('/relatorios');
      }
  };

  const generateOfficialPDF = async () => {
    if (!validateForm()) return;
    
    if (!window.jspdf || !(window.jspdf as any).jsPDF) return;
    
    setIsGeneratingPDF(true);
    
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // Determinar textos baseados no tipo de relatório
        const periodText = startDate && endDate ? `${startDate} a ${endDate}` : `Relatório Operacional`;
        const titleText = reportType === 'Mensal' 
            ? `RELATÓRIO ${activityName.toUpperCase()} - MENSAL` 
            : `RELATÓRIO ANUAL ${activityName.toUpperCase()}`;
        const scopeText = province === 'Todas' ? 'NACIONAL (TODAS AS PROVÍNCIAS)' : `PROVÍNCIA: ${province.toUpperCase()}`;

        // --- CAPA ---
        doc.setFillColor(65, 105, 225); 
        doc.rect(15, 20, 5, 250, 'F');

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(0);
        doc.text("CONFIDENCIAL", pageWidth - 40, 15, { align: 'right' });

        // Logo
        const logoWidth = 80;
        const logoHeight = 25;
        const logoX = (pageWidth - logoWidth) / 2;
        try {
            doc.addImage(cgcfLogoImg, 'PNG', logoX, 30, logoWidth, logoHeight);
        } catch (e) {
            doc.setTextColor(255, 0, 0); 
            doc.setFontSize(30);
            doc.text("CGCF", 105, 40, { align: 'center' });
        }
        
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(40, 40, 40);
        doc.text("GRUPO OPERACIONAL MULTISSECTORIAL", 105, 65, { align: 'center' });

        doc.setDrawColor(50, 80, 180);
        doc.setLineWidth(1);
        doc.rect(40, 80, 130, 40); 

        doc.setFontSize(16);
        doc.setTextColor(0);
        doc.text("RELATÓRIO DA OPERAÇÃO NO ÂMBITO DO", 105, 95, { align: 'center' });
        
        doc.setFontSize(14);
        const splitTitle = doc.splitTextToSize(titleText, 120);
        doc.text(splitTitle, 105, 105, { align: 'center' });

        doc.setFontSize(12);
        doc.setTextColor(60, 60, 60);
        doc.text(scopeText, 105, 135, { align: 'center' });

        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text(`*${periodText}*`, 105, 200, { align: 'center' });

        // --- ÍNDICE ---
        doc.addPage();
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("ÍNDICE", 105, 30, { align: 'center' });
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        let indexY = 50;
        const sections = [
            "1. Preâmbulo",
            "2. Encontros de Trabalhos com as Autoridades Locais",
            "3. Alvos da Operação",
            "4. Acções Desenvolvidas",
            "5. Constatações Gerais (Inclui Infrações)",
            "6. Constatações Específicas por Municípios",
            "7. Actividades desenvolvidas (Objectivos)",
            "8. Resultados Gerais",
            "9. Valores dos incumprimentos apurados",
            "10. Estado Moral e Disciplinar do Pessoal",
            "11. Forças e Meios",
            "12. Considerações Gerais",
            "a) Propostas de Medidas",
            "Anexos Visuais"
        ];
        sections.forEach(sec => {
            doc.text(sec, 25, indexY);
            indexY += 10;
        });

        // --- CONTEÚDO ---
        doc.addPage();
        let y = 30;
        const leftMargin = 20;
        const contentWidth = 170;

        const checkPageBreak = (needed = 20) => {
            if (y + needed > 270) { doc.addPage(); y = 30; }
        }

        const addTextSection = (number: string, title: string, content: string) => {
            checkPageBreak();
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.text(`${number}. ${title}`, leftMargin, y);
            y += 6;
            if (content) {
                doc.setFont("helvetica", "normal");
                doc.setFontSize(10);
                const splitText = doc.splitTextToSize(content, contentWidth);
                doc.text(splitText, leftMargin + 5, y);
                y += (splitText.length * 5) + 4;
            }
            y += 4;
        };

        const addListSection = (number: string, title: string, list: any[], formatter: (item: any) => string) => {
            checkPageBreak();
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.text(`${number}. ${title}`, leftMargin, y);
            y += 6;
            
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            if (list.length > 0) {
                list.forEach(item => {
                    let text = formatter(item);
                    // Check if evidence exists and append it
                    if(item.evidenceName) {
                        text += ` [Anexo: ${item.evidenceName}]`;
                    }
                    const splitText = doc.splitTextToSize(`• ${text}`, contentWidth);
                    checkPageBreak(splitText.length * 5);
                    doc.text(splitText, leftMargin + 5, y);
                    y += (splitText.length * 5) + 2;
                });
            } else {
                doc.text("Sem registo.", leftMargin + 5, y);
                y += 9;
            }
            y += 4;
        };

        addTextSection("1", "Preâmbulo", preambulo);
        
        addListSection("2", "Encontros de Trabalhos com as Autoridades Locais", encontrosList, 
            (i) => `${i.data} - ${i.entidade}: ${i.assunto}`);
        
        addListSection("3", "Alvos da Operação", alvosList, 
            (i) => `${i.alvo} (${i.localizacao}) - ${i.resultado}`);
            
        addListSection("4", "Acções Desenvolvidas", accoesList, 
            (i) => `${i.data} - ${i.descricao} [${i.status}]`);

        // Constatações Gerais (Inclui Infrações)
        checkPageBreak();
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text("5. Constatações Gerais (Inclui Infrações)", leftMargin, y);
        y += 6;
        
        // Lista de Infrações
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        if (infracoesList.length > 0) {
            doc.text("Infrações Registadas:", leftMargin + 5, y);
            y += 5;
            infracoesList.forEach(inf => {
                const text = `${inf.descricao} | Valor: ${inf.valor} | Status: ${inf.status}`;
                const splitText = doc.splitTextToSize(`- ${text}`, contentWidth - 5);
                checkPageBreak(splitText.length * 5);
                doc.text(splitText, leftMargin + 10, y);
                y += (splitText.length * 5) + 2;
            });
        } else {
            doc.text("Nenhuma infração registada.", leftMargin + 5, y);
            y += 5;
        }
        // Texto adicional se houver
        if (constatacoesGerais) {
            const splitText = doc.splitTextToSize(constatacoesGerais, contentWidth);
            doc.text(splitText, leftMargin + 5, y + 2);
            y += (splitText.length * 5) + 6;
        } else {
            y += 6;
        }
        
        addListSection("6", "Constatações Específicas por Municípios", municipiosList, 
            (i) => `${i.municipio}: ${i.constatacao}`);

        addListSection("7", "Actividades desenvolvidas (Objectivos)", objectivosList,
            (i) => `${i.objetivo} [${i.atividade}] - ${i.resultado}`);
        
        // Resultados Gerais
        checkPageBreak();
        doc.setFont("helvetica", "bold");
        doc.text("8. Resultados Gerais", leftMargin, y);
        y += 6;
        
        // Sub-seções de Resultados com suporte a anexo
        addListSection("1.1", "Detenções", detencoesList, (i) => `${i.nome} - ${i.motivo} (${i.local})`);
        addListSection("1.2", "Apreensões", apreensoesList, (i) => `${i.bem} - Qtd: ${i.quantidade} - Valor: ${i.valor}`);
        addListSection("1.3", "Principais Incumprimentos (Transportadores)", transpList, (i) => `${i.descricao} - ${i.transportador}`);
        addListSection("1.4", "Principais Incumprimentos Tributários", tributarioList, (i) => `${i.descricao} - Valor: ${i.valor}`);

        addTextSection("9", "Valores dos incumprimentos apurados", valoresApurados);
        addTextSection("10", "Estado Moral e Disciplinar do Pessoal", estadoMoral);
        addTextSection("11", "Forças e Meios", forcasMeios);
        addTextSection("12", "Considerações Gerais", consideracoes);
        addTextSection("a)", "Propostas de Medidas", propostas);

        // --- ANEXOS VISUAIS (IMAGES) ---
        
        // 1. Process General Attachments
        if (attachments.length > 0) {
            doc.addPage();
            y = 20;
            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            doc.text("ANEXOS GERAIS", 105, y, { align: 'center' });
            y += 15;

            for (const file of attachments) {
                if (file.type.startsWith('image/')) {
                    try {
                        const base64 = await fileToBase64(file);
                        doc.setFontSize(11);
                        doc.text(`Imagem: ${file.name}`, leftMargin, y);
                        y += 5;
                        
                        const imgProps = doc.getImageProperties(base64);
                        const maxWidth = 170;
                        const maxHeight = 200;
                        let imgW = maxWidth;
                        let imgH = (imgProps.height * maxWidth) / imgProps.width;
                        
                        if (imgH > maxHeight) {
                            imgH = maxHeight;
                            imgW = (imgProps.width * maxHeight) / imgProps.height;
                        }

                        if (y + imgH > 270) {
                            doc.addPage();
                            y = 30;
                        }

                        doc.addImage(base64, 'JPEG', leftMargin, y, imgW, imgH);
                        y += imgH + 15;
                        
                        if (y > 250) { doc.addPage(); y = 30; }
                    } catch (err) {
                        console.error("Error processing image attachment", err);
                    }
                } else {
                    doc.setFontSize(10);
                    doc.setTextColor(100);
                    doc.text(`Anexo não visualizável: ${file.name} (Formato: ${file.type})`, leftMargin, y);
                    y += 10;
                    doc.setTextColor(0);
                }
            }
        }

        // 2. Process Evidence from Lists (Detenções, Apreensões, etc.)
        const listsWithEvidence = [
            { name: "Detenções", list: detencoesList },
            { name: "Apreensões", list: apreensoesList },
            { name: "Transportadores", list: transpList },
            { name: "Tributários", list: tributarioList },
        ];

        let hasEvidencePages = false;

        for (const section of listsWithEvidence) {
            for (const item of section.list) {
                if (item.evidence) {
                    if (!hasEvidencePages) {
                        doc.addPage();
                        y = 20;
                        doc.setFont("helvetica", "bold");
                        doc.setFontSize(14);
                        doc.text("EVIDÊNCIAS FOTOGRÁFICAS", 105, y, { align: 'center' });
                        y += 15;
                        hasEvidencePages = true;
                    }

                    if (item.evidence.type.startsWith('image/')) {
                        try {
                            const base64 = await fileToBase64(item.evidence);
                            
                            if (y > 200) { doc.addPage(); y = 30; }

                            doc.setFontSize(11);
                            doc.setFont("helvetica", "bold");
                            doc.text(`Ref: ${section.name} - ${item.evidenceName}`, leftMargin, y);
                            y += 6;
                            
                            doc.setFont("helvetica", "normal");
                            doc.setFontSize(10);
                            const desc = item.descricao || item.nome || item.bem || "Sem descrição";
                            doc.text(`Descrição: ${desc}`, leftMargin, y);
                            y += 8;

                            const imgProps = doc.getImageProperties(base64);
                            const maxWidth = 160;
                            const maxHeight = 120; 
                            let imgW = maxWidth;
                            let imgH = (imgProps.height * maxWidth) / imgProps.width;
                            
                            if (imgH > maxHeight) {
                                imgH = maxHeight;
                                imgW = (imgProps.width * maxHeight) / imgProps.height;
                            }
                            
                            if (y + imgH > 270) {
                                doc.addPage();
                                y = 30;
                            }

                            doc.addImage(base64, 'JPEG', leftMargin, y, imgW, imgH);
                            y += imgH + 15;

                        } catch (err) {
                            console.error("Error processing list evidence", err);
                        }
                    }
                }
            }
        }

        doc.save(`Relatorio_${reportType}_${activityName.replace(/\s+/g, '_')}.pdf`);
    } catch(e) {
        console.error("Erro ao gerar PDF", e);
        alert("Ocorreu um erro ao gerar o PDF. Verifique se os ficheiros de imagem são válidos.");
    } finally {
        setIsGeneratingPDF(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
  };

  return (
    <div className="w-full pb-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold text-gray-800">{isEditMode ? 'Editar Relatório' : 'Novo Relatório'}</h1>
            <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full bg-blue-100 text-blue-800`}>
                {reportStatus}
            </span>
          </div>
          <p className="text-gray-600">
            {sourceActivity ? `Gerando relatório para a atividade: ${sourceActivity.id}` : 'Preencha os dados conforme o modelo oficial do CGCF.'}
          </p>
        </div>
        <div className="flex space-x-3">
            <button onClick={() => navigate('/relatorios')} className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg flex items-center transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
            </button>
            <button onClick={generateOfficialPDF} disabled={isGeneratingPDF} className="bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 px-4 rounded-lg flex items-center transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
                {isGeneratingPDF ? <RefreshCw className="h-4 w-4 mr-2 animate-spin"/> : <Eye className="h-4 w-4 mr-2" />}
                {isGeneratingPDF ? "A Gerar PDF..." : "Pré-visualizar PDF"}
            </button>
        </div>
      </div>

      {/* Auto-fill feedback */}
      {!sourceActivity && !isEditMode && !isReadOnly && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-r-lg flex items-center justify-between">
              <div className="flex items-center">
                  <RefreshCw className={`h-5 w-5 text-green-600 mr-3 ${isAutoGenerating ? 'animate-spin' : ''}`} />
                  <div>
                      <h4 className="text-green-800 font-bold text-sm">Preenchimento Automático Ativo</h4>
                      <p className="text-green-700 text-xs">Os campos estão sendo preenchidos automaticamente com base no período e província selecionados.</p>
                  </div>
              </div>
          </div>
      )}

      {/* BANNER DE MODO DE LEITURA */}
      {isReadOnly && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg">
              <div className="flex">
                  <ShieldAlert className="h-5 w-5 text-blue-500 mr-3" />
                  <div>
                      <p className="text-sm text-blue-700 font-bold">Modo de Leitura</p>
                      <p className="text-xs text-blue-600">
                        Este relatório está no estado "${reportStatus}". A edição está bloqueada para o seu perfil neste momento.
                      </p>
                  </div>
              </div>
          </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* CABEÇALHO DO RELATÓRIO */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Dados da Capa (Identificação)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4">
                    <label className="block text-sm font-medium text-gray-700">Nome da Atividade / Plano</label>
                    <input title="Nome da Atividade ou Plano de Trabalho" type="text" value={activityName} onChange={e => setActivityName(e.target.value)} disabled={isReadOnly} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm disabled:bg-gray-100 focus:border-blue-500 focus:ring-blue-500" required />
                </div>
                
                {/* CAMPO: Província */}
                <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Província</label>
                    <select title="Província de Aplicação do Relatório" value={province} onChange={e => setProvince(e.target.value)} disabled={isReadOnly} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm disabled:bg-gray-100 focus:border-blue-500 focus:ring-blue-500">
                        <option value="Todas">Território Nacional</option>
                        <option value="Luanda">Luanda</option>
                        <option value="Cabinda">Cabinda</option>
                        <option value="Zaire">Zaire</option>
                        <option value="Cunene">Cunene</option>
                        <option value="Benguela">Benguela</option>
                        <option value="Namibe">Namibe</option>
                    </select>
                </div>

                {/* CAMPO: Tipo de Relatório */}
                <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Tipo de Relatório</label>
                    <select title="Tipo de Relatório" value={reportType} onChange={e => setReportType(e.target.value as 'Mensal' | 'Anual')} disabled={isReadOnly} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm disabled:bg-gray-100 focus:border-blue-500 focus:ring-blue-500">
                        <option value="Mensal">Mensal</option>
                        <option value="Anual">Anual</option>
                    </select>
                </div>

                {/* MODIFICAÇÃO: Seletor de Período (Data Início e Data Fim) */}
                <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Data Início</label>
                    <input title="Data de Início do Período de Aplicação do Relatório" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} disabled={isReadOnly} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm disabled:bg-gray-100 focus:border-blue-500 focus:ring-blue-500" />
                </div>
                
                <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Data Fim</label>
                    <input title="Data de Fim do Período de Aplicação do Relatório" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} disabled={isReadOnly} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm disabled:bg-gray-100 focus:border-blue-500 focus:ring-blue-500" />
                </div>
            </div>
        </div>

        {/* ESTRUTURA DO CORPO - LISTAS DINÂMICAS */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-8">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Corpo do Relatório</h3>
            
            <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">1. Preâmbulo <span className="text-red-500">*</span></label>
                <textarea rows={4} value={preambulo} onChange={e => setPreambulo(e.target.value)} disabled={isReadOnly} className="w-full rounded-md border-gray-300 shadow-sm text-sm disabled:bg-gray-100" placeholder="Introdução..." required />
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center"><Users size={16} className="mr-2"/> 2. Encontros de Trabalhos com as Autoridades Locais</label>
                <DynamicTableInput 
                    columns={[
                        { key: 'data', label: 'Data', type: 'date', width: '15%' },
                        { key: 'entidade', label: 'Entidade / Autoridade', width: '30%' },
                        { key: 'assunto', label: 'Assunto / Resumo', width: '50%' }
                    ]}
                    data={encontrosList}
                    onChange={setEncontrosList}
                    emptyMessage="Nenhum encontro registado."
                    readOnly={isReadOnly}
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center"><Target size={16} className="mr-2"/> 3. Alvos da Operação</label>
                <DynamicTableInput 
                    columns={[
                        { key: 'alvo', label: 'Alvo', width: '30%' },
                        { key: 'localizacao', label: 'Localização', width: '30%' },
                        { key: 'resultado', label: 'Resultado Obtido', width: '35%' }
                    ]}
                    data={alvosList}
                    onChange={setAlvosList}
                    emptyMessage="Nenhum alvo registado."
                    readOnly={isReadOnly}
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center"><Briefcase size={16} className="mr-2"/> 4. Acções Desenvolvidas (Sincronização Automática)</label>
                <DynamicTableInput 
                    columns={[
                        { key: 'data', label: 'Data', type: 'text', width: '15%' },
                        { key: 'descricao', label: 'Descrição da Ação', width: '60%' },
                        { key: 'status', label: 'Estado', type: 'select', options: ['Concluída', 'Em Curso', 'Pendente'], width: '20%' }
                    ]}
                    data={accoesList}
                    onChange={setAccoesList}
                    emptyMessage="Nenhuma ação registada para os filtros selecionados."
                    readOnly={isReadOnly}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center"><AlertOctagon size={16} className="mr-2"/> 5. Constatações Gerais (Inclui Infrações)</label>
                    <InfraçõesInput infracoes={infracoesList} onChange={setInfracoesList} readOnly={isReadOnly} />
                    <textarea 
                        rows={2} 
                        value={constatacoesGerais} 
                        onChange={e => setConstatacoesGerais(e.target.value)} 
                        disabled={isReadOnly}
                        className="w-full rounded-md border-gray-300 shadow-sm text-sm mt-3 disabled:bg-gray-100" 
                        placeholder="Observações adicionais ou gerais sobre as constatações..."
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center"><MapPin size={16} className="mr-2"/> 6. Constatações Específicas por Municípios</label>
                    <div className="border rounded-md p-2 h-[250px] overflow-y-auto bg-gray-50">
                         <DynamicTableInput 
                            columns={[
                                { key: 'municipio', label: 'Município', width: '30%' },
                                { key: 'constatacao', label: 'Constatação', width: '60%' }
                            ]}
                            data={municipiosList}
                            onChange={setMunicipiosList}
                            emptyMessage="Sem registos municipais."
                            readOnly={isReadOnly}
                        />
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center"><List size={16} className="mr-2"/> 7. Actividades desenvolvidas (Objectivos)</label>
                <DynamicTableInput 
                    columns={[
                        { key: 'objetivo', label: 'Objetivo Definido', width: '40%' },
                        { key: 'atividade', label: 'Atividade Referente', type: 'select', options: accoesList.map(a => a.descricao), width: '40%' },
                        { key: 'resultado', label: 'Resultado/Status', width: '20%' }
                    ]}
                    data={objectivosList}
                    onChange={setObjectivosList}
                    emptyMessage="Nenhum objetivo específico registado."
                    readOnly={isReadOnly}
                />
            </div>
        </div>

        {/* RESULTADOS GERAIS */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">8. Resultados Gerais</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center"><Gavel size={16} className="mr-2 text-orange-600"/> 1.1. Detenções</label>
                    <ResultsWithEvidenceInput 
                        columns={[
                            { key: 'nome', label: 'Nome/Nacionalidade', width: '40%' },
                            { key: 'motivo', label: 'Motivo', width: '30%' },
                            { key: 'local', label: 'Local', width: '20%' }
                        ]}
                        data={detencoesList}
                        onChange={setDetencoesList}
                        emptyMessage="Sem detenções registadas."
                        readOnly={isReadOnly}
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center"><Package size={16} className="mr-2 text-blue-600"/> 1.2. Apreensões</label>
                    <ResultsWithEvidenceInput 
                        columns={[
                            { key: 'bem', label: 'Item/Bem', width: '35%' },
                            { key: 'quantidade', label: 'Qtd.', width: '15%' },
                            { key: 'valor', label: 'Valor Est.', width: '35%' }
                        ]}
                        data={apreensoesList}
                        onChange={setApreensoesList}
                        emptyMessage="Sem apreensões registadas."
                        readOnly={isReadOnly}
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center"><Truck size={16} className="mr-2 text-gray-600"/> 1.3. Incumprimentos (Transportadores)</label>
                    <ResultsWithEvidenceInput 
                        columns={[
                            { key: 'transportador', label: 'Transportador', width: '40%' },
                            { key: 'descricao', label: 'Irregularidade', width: '45%' }
                        ]}
                        data={transpList}
                        onChange={setTranspList}
                        emptyMessage="Sem registos."
                        readOnly={isReadOnly}
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center"><Receipt size={16} className="mr-2 text-green-600"/> 1.4. Incumprimentos Tributários</label>
                    <ResultsWithEvidenceInput 
                        columns={[
                            { key: 'descricao', label: 'Descrição', width: '60%' },
                            { key: 'valor', label: 'Valor em Falta', width: '25%' }
                        ]}
                        data={tributarioList}
                        onChange={setTributarioList}
                        emptyMessage="Sem registos."
                        readOnly={isReadOnly}
                    />
                </div>
            </div>
        </div>

        {/* OUTRAS INFORMAÇÕES */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Outras Informações</h3>

            <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">9. Valores dos incumprimentos apurados</label>
                <input type="text" value={valoresApurados} onChange={e => setValoresApurados(e.target.value)} disabled={isReadOnly} className="w-full rounded-md border-gray-300 shadow-sm disabled:bg-gray-100" placeholder="Ex: 15.000.000 Kz" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-gray-800 mb-1">10. Estado Moral e Disciplinar</label>
                    <textarea title="Estado Moral e Disciplinar" rows={3} value={estadoMoral} onChange={e => setEstadoMoral(e.target.value)} disabled={isReadOnly} className="w-full rounded-md border-gray-300 shadow-sm disabled:bg-gray-100" />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-800 mb-1">11. Forças e Meios</label>
                    <textarea title="Forças e Meios" rows={3} value={forcasMeios} onChange={e => setForcasMeios(e.target.value)} disabled={isReadOnly} className="w-full rounded-md border-gray-300 shadow-sm disabled:bg-gray-100" />
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">12. Considerações Gerais</label>
                <textarea title="Considerações Gerais" rows={3} value={consideracoes} onChange={e => setConsideracoes(e.target.value)} disabled={isReadOnly} className="w-full rounded-md border-gray-300 shadow-sm disabled:bg-gray-100" />
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">a) Propostas de Medidas</label>
                <textarea title="Propostas de Medidas" rows={3} value={propostas} onChange={e => setPropostas(e.target.value)} disabled={isReadOnly} className="w-full rounded-md border-gray-300 shadow-sm disabled:bg-gray-100" />
            </div>
        </div>
        
        {/* Anexos */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <Paperclip className="h-5 w-5 mr-3 text-gray-500" />
            Anexos Gerais
          </h3>
          <div className="space-y-4">
            {attachments.length > 0 && (
              <ul className="space-y-3">
                {attachments.map((file, index) => (
                  <li key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md border">
                    <span className="text-sm font-medium text-gray-700 truncate">{file.name}</span>
                    {!isReadOnly && (
                        <button
                        type="button"
                        onClick={() => handleRemoveAttachment(index)}
                        className="p-1.5 rounded-full text-red-500 hover:bg-red-100"
                        >
                        <Trash2 className="h-4 w-4" />
                        </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
            {!isReadOnly && (
                <div>
                <input title="Anexar Ficheiros (Imagens, Vídeos, PDFs)"
                    type="file"
                    multiple
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    accept="image/*,video/*,application/pdf"
                />
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-lg flex items-center transition-colors text-sm"
                >
                    <Upload className="h-4 w-4 mr-2" />
                    Anexar Ficheiro(s)
                </button>
                </div>
            )}
          </div>
        </div>

        {/* DYNAMIC ACTION FOOTER */}
        <div className="flex justify-between items-center pt-4 border-t mt-8 bg-gray-50 p-4 rounded-lg sticky bottom-0 z-20 shadow-md">
          <button
            type="button"
            onClick={() => navigate('/relatorios')}
            className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg"
          >
            Cancelar / Sair
          </button>
          
          <div className="flex space-x-3">
              {(!isReadOnly || hasRole('administrador')) && (
                  <>
                    <button type="button" onClick={handleSaveDraft} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg flex items-center">
                        <Save className="h-5 w-5 mr-2" /> {reportStatus === 'Validado' ? 'Salvar Ajustes' : 'Rascunho'}
                    </button>
                    {(reportStatus === 'Rascunho' || reportStatus === 'Em Edição' || hasRole('administrador') || hasRole('tecnico_operacional_central')) && (
                        <button type="button" onClick={handleSubmitFlow} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                            <Send className="h-5 w-5 mr-2" /> Submeter
                        </button>
                    )}
                  </>
              )}

              {hasRole('coordenador_operacional_central') && reportStatus === 'Submetido' && (
                  <>
                    <button type="button" onClick={handleReturnFlow} className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                        <CornerUpLeft className="h-5 w-5 mr-2" /> Devolver
                    </button>
                    <button type="button" onClick={handleForwardFlow} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                        <Send className="h-5 w-5 mr-2" /> Encaminhar
                    </button>
                  </>
              )}

              {hasRole('coordenador_central') && reportStatus === 'Encaminhado' && (
                  <button type="button" onClick={handleApproveFlow} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                      <CheckCircle2 className="h-5 w-5 mr-2" /> Validar Final
                  </button>
              )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CriarRelatorioPage;