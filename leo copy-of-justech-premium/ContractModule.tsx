import React, { useState } from 'react';
import { Search, ShieldCheck, AlertTriangle, FileText, ArrowLeft, Loader2, CheckCircle, Upload } from 'lucide-react';

const ContractModule: React.FC = () => {
  const [analisando, setAnalisando] = useState(false);
  const [relatorio, setRelatorio] = useState<any>(null);
  const [inputText, setInputText] = useState('');

  const iniciarAnalise = () => {
    if (!inputText.trim()) return;
    setAnalisando(true);
    
    // Simulação da Inteligência de Varredura Contratual conforme solicitado
    setTimeout(() => {
      setRelatorio({
        clausulasCriticas: [
          { t: "Multa Rescisória", d: "Identificada multa de 50%, valor acima do limite legal (Art. 412 CC).", r: "ALTO" },
          { t: "Foro de Eleição", d: "Foro em comarca distinta do domicílio do consumidor.", r: "MÉDIO" },
          { t: "Renovação Automática", d: "Cláusula 7.2 não prevê aviso prévio de 30 dias.", r: "CRÍTICO" }
        ],
        scoreSeguranca: 62
      });
      setAnalisando(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] ml-64 bg-slate-50 p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
             <div className="p-3 bg-purple-100 rounded-xl">
                <Search className="w-8 h-8 text-purple-600" />
             </div>
             <div>
                <h2 className="text-2xl font-bold text-legal-900">Auditoria de Contratos</h2>
                <p className="text-gray-500 text-sm mt-1">Análise de riscos e cláusulas abusivas com IA.</p>
             </div>
          </div>
          
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-1">IA Score</span>
            <div className={`
              px-4 py-2 rounded-lg font-bold text-xl border flex items-center shadow-sm transition-all
              ${!relatorio ? 'bg-gray-50 text-gray-300 border-gray-100' : 
                relatorio.scoreSeguranca < 70 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}
            `}>
              {relatorio ? (
                  <>
                    <ShieldCheck className="w-5 h-5 mr-2" />
                    {relatorio.scoreSeguranca}%
                  </>
              ) : (
                  <>--%</>
              )}
            </div>
          </div>
        </div>

        {!relatorio ? (
          <div className="animate-in fade-in duration-500">
             <div className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center bg-gray-50 transition-colors hover:bg-gray-100/50 group">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                    <FileText className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-800">Upload de Documento</h3>
                <p className="text-sm text-gray-500 mb-6">Arraste seu PDF/DOCX aqui ou cole o texto abaixo</p>
                
                <textarea 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Cole as cláusulas ou o conteúdo do contrato aqui para análise imediata..." 
                    className="w-full h-40 p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm text-gray-700 mb-4 bg-white"
                />

                <button 
                    onClick={iniciarAnalise}
                    disabled={analisando || !inputText.trim()}
                    className={`
                        px-8 py-3 rounded-lg font-bold shadow-md transition-all flex items-center justify-center mx-auto
                        ${analisando || !inputText.trim()
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-purple-600 hover:bg-purple-700 text-white transform hover:scale-[1.02]'}
                    `}
                >
                    {analisando ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Processando Redes Neurais...
                        </>
                    ) : (
                        <>
                           <ShieldCheck className="w-5 h-5 mr-2" />
                           Iniciar Análise de Riscos
                        </>
                    )}
                </button>
             </div>
          </div>
        ) : (
           <div className="animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center mb-6 pb-2 border-b border-gray-100">
                 <AlertTriangle className="w-5 h-5 text-amber-500 mr-2" />
                 <h4 className="font-bold text-gray-800">Relatório de Vulnerabilidades</h4>
              </div>

              <div className="space-y-4 mb-8">
                 {relatorio.clausulasCriticas.map((c: any, i: number) => {
                     const isHigh = c.r === 'ALTO' || c.r === 'CRÍTICO';
                     return (
                         <div key={i} className={`
                             p-5 rounded-lg border-l-[6px] bg-white shadow-sm border-t border-r border-b border-gray-100 transition-all hover:shadow-md
                             ${isHigh ? 'border-l-red-500' : 'border-l-amber-400'}
                         `}>
                             <div className="flex justify-between items-start mb-2">
                                 <h5 className="font-bold text-gray-900 text-base">{c.t}</h5>
                                 <span className={`
                                     text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider
                                     ${isHigh ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}
                                 `}>
                                     {c.r}
                                 </span>
                             </div>
                             <p className="text-sm text-gray-600 leading-relaxed">{c.d}</p>
                         </div>
                     )
                 })}
              </div>

              <div className="flex justify-start pt-4 border-t border-gray-100">
                 <button 
                    onClick={() => { setRelatorio(null); setInputText(''); }}
                    className="flex items-center text-purple-600 hover:text-purple-800 font-medium transition-colors hover:bg-purple-50 px-4 py-2 rounded-lg"
                 >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Analisar novo contrato
                 </button>
              </div>
           </div>
        )}

      </div>
    </div>
  );
};

export default ContractModule;