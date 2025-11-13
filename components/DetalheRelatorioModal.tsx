import React from 'react';
import { X, FileText, BarChart2, ListChecks, AlertTriangle, Target, Calendar, User, CheckCircle, History } from 'lucide-react';

declare global {
    interface Window { jspdf: any; }
}

interface DetalheRelatorioModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: any | null;
}

const statusColors: { [key: string]: string } = {
  'Validado': 'bg-green-100 text-green-800',
  'Em Edição': 'bg-yellow-100 text-yellow-800',
  'Submetido': 'bg-blue-100 text-blue-800',
};


const Section: React.FC<{ icon: React.ElementType, title: string, children: React.ReactNode }> = ({ icon: Icon, title, children }) => (
    <div className="bg-white p-5 rounded-lg border">
        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
            <Icon className="h-5 w-5 mr-3 text-gray-500 flex-shrink-0" />
            {title}
        </h3>
        <div className="text-base text-gray-700 whitespace-pre-wrap">
            {children || <span className="text-gray-400">Não preenchido.</span>}
        </div>
    </div>
);


const DetalheRelatorioModal: React.FC<DetalheRelatorioModalProps> = ({ isOpen, onClose, report }) => {
  if (!isOpen || !report) {
    return null;
  }

  const handleExportPDF = () => {
    if (!window.jspdf || !(window.jspdf as any).jsPDF) return;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    if (typeof (doc as any).autoTable !== 'function') return;

    const logoSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARgAAABDCAYAAAC2+lYkAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAd8SURBVHhe7Z1/bBxlHMc/s8zKsh/BhmEDExiMMWEi16W5NEmTNC0tDVLbFGqjth80bf2x/bFJk6Zp2rRNWv2xTVWb6oc2DZImaVq6lK7JTSmJuW5iAgMMGOwgK8uyLPv8I3e5d3Zmdnd2d9d9fz8vB3be2Z3f/X7e5/l5dhcQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCATrgmEYx+vr678MDAx8tbS09PHAwMC35+fn/6FQKPzMzMy3UqlUHxsb+0ZFRfWv0tLS7x4eHj6VSqU+Pj4+vrCw8J+Tk5NPzs7OfqRSqV+o1f9/hUIhMpnMPzo6+tX4+Pgvj46O/k6lUj+YnZ39ZHt7+60xMTGfjI2Nfb5arT4xOTn5xezs7C/FYvEbvb29b6VS6Z+1tbX/0Nra+kQ8Hv98PB7/x/F4/N3xePyT8Xj89+Px+Cfj8fiPx+Px347H4x+Nx+N/HI/H/zgej/+beDz+R/F4/I/i8fgfx+PxP4rH438aj8f/MB6P/2E8Hv+DeDz+X4jH498lHo/fJR6P3ycej98lHo/fJh6P3yIej18jHo9fJR6PXyMej18lHo9fIh6PXyAej18gHo9fIB6PXyAej18gHo9fJB6PXyQej18kHo9fJB6PXyQej18kHo9fJB6PXyQej18kHo9fIB6PXyAej18gHo9fIB6PXyIej18hHo9fIR6PXyEej18hHo9fIR6PXyEej18hHo9fIR6PXyMeb7+vX78KHo9fIR6PXykejy8SjycSjycSj6cRj6cSj6cRjyYQj0YSj6cRj5cQj5cQj6cSj1cRj1cRj1cQj1cQjxcRj5eIxyuIx2uIxmuIxyuIxyuIx4uIx+OIxyOIxyOIx1OIxxOIxxOIx4OIx4OIxwOIxwOIx4OIx9OIx9OIxxOIxyOJxxKJxyKJxxKJxyOJxxKIx5KIRxKIxxKIR1KIhxKIRyKIRyKIR4SIR1KIRySIRzKIR3KIRzKIRyKIRwKIR4KEIxHEIyHEIx6EIx6EIRwKIhwSIRwSIRwKIhwKEQ4FIRwKEQ4FEA96EI92kI92kI92kI9kEA8kEA8kEI9kEA8kEI8EkA8lkI/EkA/FkA/HkA/GEI/GEY/FEY/FEY/EEA/HEI/HEI/FEo/FEY/FEQ/Hkg/Hkg/FkA/FkA/Hkg/HkQ/HkQ/FkQ/GkY/GEY/GkY/GEY9GkI/GkY9GEI+GEA/6EI/4EY/2EA/3EI93kI92kI/0kI8EEg/2kI9kEI+mkA8nkI9nkI9nkI8mkA8nkI8kkI/FEI+FEI9FEo9EEo9GEo9GEg+6EY+6EQ+7EI+7EI+5kI84kI84kI84kI84kI84EI8YkI8IkA8IEA8IkA8IkI+okA+okI+skA9kkI9EkA9mkA/mkA+WkA9UkA9UkA8kkI+mkI+kkI/nkI+nkI/nkI+GkA8lkA8mEI8mEI9GEg+mEA9GkI+GEA8GEQ8GEg+GEg8EkI8AkA8CEg4GEA8GEA4GkA4EkA8CkAwHkAyHkA4GkA4EkAoGEAwGEAwEkAkFkAyEEAkFkAyEkAmEkAmEkAmGkAmEkAmEEAmEkAmEEAmEkAmEkAmEkAmEkAmEkAmEEAmEkAmGEAmGEAmEkAmEkAmEkAl6kAl6kAkGkAkEEAmEEAmGEAmGEAmEkAmEkAmEkAmEkAmEkAmGEAmEEAmEEAmEEAmEkAmEkAmEkAmEkAmEkAmEkAmEkAmEkAmGEAkGEAkGEAkEkAkEEAmEEAmEEAmGEAkGEAmEEAl1kAqFQKBSCQiFQKAKFQKBSCQSCQCAQCIRCIRAIBAKBYD3gfwD88c+E9jG3SwAAAABJRU5kJggg==';
    let y = 15;
    const addSection = (title: string, text: string) => {
        if (y > 250) { doc.addPage(); y = 20; }
        doc.setFontSize(14); doc.setFont(undefined, 'bold'); doc.text(title, 15, y); y += 8;
        doc.setFontSize(11); doc.setFont(undefined, 'normal'); doc.setTextColor(50);
        const splitText = doc.splitTextToSize(text || 'Não preenchido.', 180);
        doc.text(splitText, 15, y); doc.setTextColor(0);
        y += (splitText.length * 5) + 10;
    };
    doc.addImage(logoSrc, 'PNG', 15, 10, 90, 10);
    y = 35;
    doc.setFontSize(18); doc.setFont(undefined, 'bold'); doc.text("Relatório Mensal de Atividades", 15, y); y += 8;
    doc.setFontSize(12); doc.setFont(undefined, 'normal'); doc.setTextColor(100);
    doc.text(`ID: ${report.id} | Mês/Ano: ${report.month}`, 15, y); y += 6;
    doc.text(`Criado por: ${report.createdBy} | Data: ${report.createdAt} | Estado: ${report.status}`, 15, y); y += 15;
    addSection("Resumo Executivo", report.summary);
    if (y > 250) { doc.addPage(); y = 20; }
    doc.setFontSize(14); doc.setFont(undefined, 'bold'); doc.text("Indicadores Chave (KPIs)", 15, y); y += 8;
    (doc as any).autoTable({
        startY: y,
        head: [['Indicador', 'Valor']],
        body: [['Nº de Missões', report.kpiMissions], ['Nº de Infrações', report.kpiInfractions], ['Nº de Projetos', report.kpiProjects]],
        theme: 'grid', headStyles: { fillColor: [243, 244, 246] },
    });
    y = (doc as any).lastAutoTable.finalY + 10;
    addSection("Resumo das Atividades", report.activitiesSummary);
    addSection("Desafios e Impedimentos", report.challenges);
    addSection("Plano para o Próximo Mês", report.nextMonthPlan);
    const pageCount = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8); doc.setTextColor(150);
        doc.text(`Página ${i} de ${pageCount}`, 15, doc.internal.pageSize.getHeight() - 10);
        doc.text("SGO - Sistema de Gestão de Operações", doc.internal.pageSize.getWidth() - 15, doc.internal.pageSize.getHeight() - 10, { align: 'right' });
    }
    doc.save(`relatorio_${report.id}.pdf`);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 grid place-items-center p-4 transition-opacity duration-300" onClick={onClose}>
      <div 
        className="bg-slate-50 rounded-lg shadow-xl w-full max-w-4xl max-h-[95vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b flex justify-between items-center bg-white sticky top-0 z-30">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Detalhes do Relatório: {report.id}</h2>
            <p className="text-sm text-gray-500">{report.month}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-grow space-y-6">
            <div className="bg-white p-5 rounded-lg border grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-gray-500" />
                    <div>
                        <p className="text-sm font-medium text-gray-500">Estado</p>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[report.status]}`}>{report.status}</span>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-gray-500" />
                    <div>
                        <p className="text-sm font-medium text-gray-500">Criado por</p>
                        <p className="text-base font-semibold text-gray-800">{report.createdBy}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <div>
                        <p className="text-sm font-medium text-gray-500">Data de Criação</p>
                        <p className="text-base font-semibold text-gray-800">{report.createdAt}</p>
                    </div>
                </div>
            </div>

            <Section icon={FileText} title="Resumo Executivo">
                {report.summary}
            </Section>

            <div className="bg-white p-5 rounded-lg border">
                 <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                    <BarChart2 className="h-5 w-5 mr-3 text-gray-500 flex-shrink-0" />
                    Indicadores Chave (KPIs)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div className="bg-blue-50 p-4 rounded-md">
                        <p className="text-2xl font-bold text-blue-700">{report.kpiMissions}</p>
                        <p className="text-sm font-medium text-blue-600">Missões Realizadas</p>
                    </div>
                     <div className="bg-red-50 p-4 rounded-md">
                        <p className="text-2xl font-bold text-red-700">{report.kpiInfractions}</p>
                        <p className="text-sm font-medium text-red-600">Infrações Registadas</p>
                    </div>
                     <div className="bg-green-50 p-4 rounded-md">
                        <p className="text-2xl font-bold text-green-700">{report.kpiProjects}</p>
                        <p className="text-sm font-medium text-green-600">Projetos Concluídos</p>
                    </div>
                </div>
            </div>
            
            <Section icon={ListChecks} title="Resumo das Atividades">
                {report.activitiesSummary}
            </Section>

            <Section icon={AlertTriangle} title="Desafios e Impedimentos">
                {report.challenges}
            </Section>

            <Section icon={Target} title="Plano para o Próximo Mês">
                {report.nextMonthPlan}
            </Section>

            {report.history && report.history.length > 0 && (
                 <Section icon={History} title="Histórico de Versões">
                    <div className="relative pl-4 pt-2">
                        <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-gray-200" style={{ transform: 'translateX(3.5px)' }}></div>
                        
                        <div className="relative mb-6">
                            <div className="absolute left-0 top-1 w-2 h-2 bg-blue-500 rounded-full ring-4 ring-white z-10"></div>
                            <div className="pl-6">
                                <p className="font-bold text-gray-800">Versão {report.version} (Atual)</p>
                                <p className="text-xs text-gray-500">{report.updatedAt} por {report.updatedBy}</p>
                                <p className="text-sm text-gray-600 mt-1 italic">"{report.summary}"</p>
                            </div>
                        </div>

                        {report.history?.sort((a:any, b:any) => b.version - a.version).map((v: any) => (
                        <div key={v.version} className="relative mb-6">
                            <div className="absolute left-0 top-1 w-2 h-2 bg-gray-400 rounded-full ring-4 ring-white z-10"></div>
                            <div className="pl-6">
                                <p className="font-bold text-gray-700">Versão {v.version}</p>
                                <p className="text-xs text-gray-500">{v.updatedAt} por {v.updatedBy}</p>
                                <p className="text-sm text-gray-600 mt-1 italic">"{v.summary}"</p>
                            </div>
                        </div>
                        ))}
                    </div>
                </Section>
            )}
        </div>

        <div className="px-6 py-4 border-t flex justify-end space-x-3 bg-gray-50 sticky bottom-0 z-30">
          <button type="button" onClick={onClose} className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm transition-colors">
            Fechar
          </button>
          <button type="button" onClick={handleExportPDF} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-colors flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Exportar PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetalheRelatorioModal;