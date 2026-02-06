
import React from 'react';
import { X, FileText, AlertCircle } from 'lucide-react';

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  title: string;
}

const PdfViewerModal: React.FC<PdfViewerModalProps> = ({ isOpen, onClose, pdfUrl, title }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[150] grid place-items-center p-4 md:p-8"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl h-full flex flex-col overflow-hidden border border-white/20 animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-5 border-b bg-slate-50">
          <div className="flex items-center gap-4">
             <div className="p-2 bg-red-100 rounded-lg">
                <FileText className="text-red-600" size={20} />
             </div>
             <div>
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em]">{title}</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Visualizador de Documentos Oficiais SGO</p>
             </div>
          </div>
          <button title="Fechar"
            onClick={onClose} 
            className="p-2.5 rounded-full hover:bg-slate-200 transition-all text-slate-500 hover:text-slate-800 shadow-sm bg-white border border-slate-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* PDF Container */}
        <div className="flex-grow bg-slate-200 relative overflow-hidden">
          <object
            data={`${pdfUrl}#toolbar=1&navpanes=0&view=FitH`}
            type="application/pdf"
            className="w-full h-full border-none shadow-inner"
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white p-10 text-center">
              <AlertCircle size={48} className="text-amber-500 mb-4" />
              <h3 className="text-xl font-black text-slate-800 uppercase mb-2">Não foi possível exibir o PDF diretamente</h3>
              <p className="text-slate-500 max-w-md mb-6">O seu navegador não suporta a visualização direta de PDFs ou bloqueou o carregamento por segurança.</p>
              <a 
                href={pdfUrl} 
                download={`${title.replace(/\s+/g, '_')}.pdf`}
                className="bg-blue-900 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-black transition-all"
              >
                Descarregar Documento para Visualizar
              </a>
            </div>
          </object>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t bg-slate-50 flex justify-between items-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">CGCF - COMITÉ DE GESTÃO COORDENADA DE FRONTEIRAS</p>
            <div className="flex gap-2">
                <button 
                    onClick={onClose}
                    className="px-6 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all"
                >
                    Fechar
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PdfViewerModal;
