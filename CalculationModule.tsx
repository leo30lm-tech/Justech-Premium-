import React, { useState } from 'react';
import { RefreshCcw, Printer } from 'lucide-react';
import { ViewState } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface CalculationModuleProps {
  onNavigate?: (view: ViewState) => void;
  onSaveContext?: (data: any) => void;
  officeProfile: any;
}

const CalculationModule: React.FC<CalculationModuleProps> = ({ onNavigate, onSaveContext, officeProfile }) => {
  const { t } = useLanguage();
  const [dados, setDados] = useState({
    salario: 5450,
    he50: 0,
    he100: 0,
    meses: 12,
    tipo: 'Sem Justa Causa',
    adm: '',
    dem: ''
  });
  
  const [resultado, setResultado] = useState<any>(null);

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const calculate = () => {
    const s = Number(dados.salario);
    const m = Number(dados.meses);
    const h50Input = Number(dados.he50);
    const h100Input = Number(dados.he100);

    const vh = s / 220;
    
    // HE Logic
    const h50 = (vh * 1.5) * h50Input;
    const h100 = (vh * 2) * h100Input;
    
    // 13th
    const dt = (s / 12) * m;
    
    // Vacation + 1/3 (Using factor 1.3333 as per technical spec)
    const fer = ((s / 12) * m) * 1.33333333;

    // FGTS (8% * months * (1.4 if Sem Justa Causa else 1))
    const fgts = (s * 0.08 * m) * (dados.tipo === 'Sem Justa Causa' ? 1.4 : 1);

    const total = h50 + h100 + dt + fer + fgts;

    setResultado({
      he: h50 + h100,
      dt: dt,
      fer: fer,
      fgts: fgts,
      total: total,
      dadosOriginais: { ...dados }
    });

    if (onSaveContext) {
      onSaveContext({
        totalGeral: total,
        dadosOriginais: dados
      });
    }
  };

  const exportPDF = () => {
    if (!resultado) return;
    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>${officeProfile.nome} - ${t('calc.title')}</title>
          <style>
            body { font-family: 'Helvetica', sans-serif; padding: 40px; color: #333; }
            .header { border-bottom: 2px solid #ccac00; padding-bottom: 10px; margin-bottom: 30px; }
            .header h1 { margin: 0; color: #141b2d; font-size: 24px; }
            .header p { color: #666; margin: 5px 0 0 0; font-size: 14px; }
            .section { margin-bottom: 20px; }
            .row { display: flex; justify-content: space-between; margin-bottom: 8px; border-bottom: 1px dashed #eee; padding-bottom: 4px; font-size: 14px; }
            .total { font-size: 24px; font-weight: bold; color: #15803d; margin-top: 30px; text-align: right; border-top: 2px solid #15803d; padding-top: 10px; }
            .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${t('calc.title')}</h1>
            <p>${officeProfile.nome} | OAB: ${officeProfile.oab}</p>
          </div>
          
          <div class="section">
            <h3 style="color: #ccac00; font-size: 16px; text-transform: uppercase;">Parâmetros</h3>
            <div class="row"><span>${t('calc.salary')}:</span> <strong>${formatCurrency(Number(dados.salario))}</strong></div>
            <div class="row"><span>${t('calc.type')}:</span> <strong>${dados.tipo}</strong></div>
            <div class="row"><span>${t('calc.months')}:</span> <strong>${dados.meses}</strong></div>
          </div>

          <div class="section">
            <h3 style="color: #141b2d; font-size: 16px; text-transform: uppercase;">Memória de Cálculo</h3>
            <div class="row"><span>${t('calc.res.he')}</span> <span>${formatCurrency(resultado.he)}</span></div>
            <div class="row"><span>${t('calc.res.13')}</span> <span>${formatCurrency(resultado.dt)}</span></div>
            <div class="row"><span>${t('calc.res.vac')}</span> <span>${formatCurrency(resultado.fer)}</span></div>
            <div class="row"><span>${t('calc.res.fgts')}</span> <span>${formatCurrency(resultado.fgts)}</span></div>
          </div>

          <div class="total">
            ${t('calc.total')} ${formatCurrency(resultado.total)}
          </div>
          
          <div class="footer">
            <p>${t('calc.footer')}</p>
            <p>${officeProfile.endereco} | ${officeProfile.email}</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] ml-64 bg-[#f4f7fa] dark:bg-slate-900 p-8 overflow-y-auto transition-colors duration-300">
      <div className="max-w-4xl mx-auto w-full">
         
         <div className="bg-white dark:bg-legal-800 rounded-xl shadow-sm border border-gray-200 dark:border-legal-700 p-8">
            <div className="border-b-2 border-legal-gold pb-4 mb-8">
               <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t('calc.title')}</h2>
               <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{t('calc.subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Left Column */}
               <div className="space-y-4">
                  <div>
                     <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{t('calc.salary')}</label>
                     <input 
                        type="number" 
                        value={dados.salario}
                        onChange={e => setDados({...dados, salario: Number(e.target.value)})}
                        className="w-full p-3 border border-gray-300 dark:border-legal-600 rounded-lg focus:ring-2 focus:ring-legal-gold outline-none transition-all font-mono dark:bg-legal-900 dark:text-white"
                     />
                  </div>

                  <div>
                     <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{t('calc.type')}</label>
                     <select 
                        value={dados.tipo}
                        onChange={e => setDados({...dados, tipo: e.target.value})}
                        className="w-full p-3 border border-gray-300 dark:border-legal-600 rounded-lg focus:ring-2 focus:ring-legal-gold outline-none bg-white dark:bg-legal-900 dark:text-white"
                     >
                        <option>Sem Justa Causa</option>
                        <option>Pedido de Demissão</option>
                        <option>Com Justa Causa</option>
                     </select>
                  </div>

                  <div>
                     <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{t('calc.adm')}</label>
                     <div className="grid grid-cols-2 gap-2">
                        <input type="date" value={dados.adm} onChange={e => setDados({...dados, adm: e.target.value})} className="w-full p-2 border border-gray-300 dark:border-legal-600 rounded-lg text-sm dark:bg-legal-900 dark:text-white" />
                        <input type="date" value={dados.dem} onChange={e => setDados({...dados, dem: e.target.value})} className="w-full p-2 border border-gray-300 dark:border-legal-600 rounded-lg text-sm dark:bg-legal-900 dark:text-white" />
                     </div>
                  </div>
               </div>

               {/* Right Column */}
               <div className="space-y-4">
                   <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{t('calc.he50')}</label>
                            <input 
                                type="number" 
                                value={dados.he50}
                                onChange={e => setDados({...dados, he50: Number(e.target.value)})}
                                className="w-full p-3 border border-gray-300 dark:border-legal-600 rounded-lg focus:ring-2 focus:ring-legal-gold dark:bg-legal-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{t('calc.he100')}</label>
                            <input 
                                type="number" 
                                value={dados.he100}
                                onChange={e => setDados({...dados, he100: Number(e.target.value)})}
                                className="w-full p-3 border border-gray-300 dark:border-legal-600 rounded-lg focus:ring-2 focus:ring-legal-gold dark:bg-legal-900 dark:text-white"
                            />
                        </div>
                   </div>

                  <div>
                     <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{t('calc.months')}</label>
                     <input 
                        type="number" 
                        value={dados.meses}
                        onChange={e => setDados({...dados, meses: Number(e.target.value)})}
                        className="w-full p-3 border border-gray-300 dark:border-legal-600 rounded-lg focus:ring-2 focus:ring-legal-gold dark:bg-legal-900 dark:text-white"
                     />
                  </div>

                  <button 
                     onClick={calculate}
                     className="w-full mt-6 bg-legal-gold hover:bg-yellow-500 text-legal-900 font-bold py-3 px-4 rounded-lg shadow-md transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center"
                  >
                     <RefreshCcw className="w-5 h-5 mr-2" />
                     {t('calc.generate')}
                  </button>
               </div>
            </div>

            {/* Results Section */}
            {resultado && (
               <div className="mt-8 border border-gray-200 dark:border-legal-700 rounded-xl p-6 bg-white dark:bg-legal-900/50 animate-in fade-in duration-500">
                  <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                     <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                        <span>{t('calc.res.he')}</span> <strong className="font-mono text-gray-900 dark:text-white">{formatCurrency(resultado.he)}</strong>
                     </div>
                     <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                        <span>{t('calc.res.13')}</span> <strong className="font-mono text-gray-900 dark:text-white">{formatCurrency(resultado.dt)}</strong>
                     </div>
                     <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                        <span>{t('calc.res.vac')}</span> <strong className="font-mono text-gray-900 dark:text-white">{formatCurrency(resultado.fer)}</strong>
                     </div>
                     <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                        <span>{t('calc.res.fgts')}</span> <strong className="font-mono text-gray-900 dark:text-white">{formatCurrency(resultado.fgts)}</strong>
                     </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                     <span className="text-xl font-bold text-green-700 dark:text-green-500">{t('calc.total')}</span>
                     <span className="text-2xl font-bold text-green-700 dark:text-green-500 font-mono">{formatCurrency(resultado.total)}</span>
                  </div>

                  <button 
                     onClick={exportPDF}
                     className="w-full mt-6 bg-legal-900 dark:bg-black hover:bg-legal-800 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                  >
                     <Printer className="w-5 h-5 mr-2" />
                     {t('calc.export')}
                  </button>
               </div>
            )}

         </div>
      </div>
    </div>
  );
};

export default CalculationModule;