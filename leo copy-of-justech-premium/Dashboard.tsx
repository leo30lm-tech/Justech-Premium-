import React, { useState } from 'react';
import { CardItem, ViewState } from './types';
import { ArrowRight, Search, Building2, Activity, Lightbulb, Loader2, Play, Briefcase, Calculator, FileText, Gavel } from 'lucide-react';
import { useLanguage } from './contexts/LanguageContext';

interface DashboardProps {
  onChangeView: (view: ViewState) => void;
  onSaveCompanyContext?: (data: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onChangeView, onSaveCompanyContext }) => {
  const { t } = useLanguage();
  const [cnpjBusca, setCnpjBusca] = useState('');
  const [empresaAtiva, setEmpresaAtiva] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Define cards inside component to access translation function
  const dashboardCards: CardItem[] = [
    {
      id: 'labor',
      title: t('card.labor.title'),
      description: t('card.labor.desc'),
      icon: Briefcase,
      viewTarget: 'LABOR_MODULE',
      isActive: true,
      color: '#3f51b5' // Indigo
    },
    {
      id: 'calc',
      title: t('card.calc.title'),
      description: t('card.calc.desc'),
      icon: Calculator,
      viewTarget: 'CALCULATION_MODULE',
      isActive: true,
      color: '#4caf50' // Green
    },
    {
      id: 'contract',
      title: t('card.contract.title'),
      description: t('card.contract.desc'),
      icon: FileText,
      viewTarget: 'CONTRACT_MODULE',
      isActive: true,
      color: '#7b61ff' // Purple
    },
    {
      id: 'penal',
      title: t('card.penal.title'),
      description: t('card.penal.desc'),
      icon: Gavel,
      viewTarget: 'PENAL_MODULE',
      isActive: true,
      color: '#f44336' // Red
    }
  ];

  const consultarCnae = () => {
    if (!cnpjBusca) return;
    setIsSearching(true);
    // Simulação de consulta à base da Receita/CNAE com Delay realista
    setTimeout(() => {
      const dadosEmpresa = {
        nome: "FRIGORÍFICO SÃO JOSÉ S.A.",
        cnae: "1012-1/01 (Abate de Aves)",
        rat: 3, // Risco Máximo (High Risk)
        risco: "CRÍTICO (Insalubridade Grau Máximo)",
        tese: "Súmula 438 TST (Intervalo Térmico) e NR-36."
      };
      setEmpresaAtiva(dadosEmpresa);
      if (onSaveCompanyContext) {
        onSaveCompanyContext(dadosEmpresa);
      }
      setIsSearching(false);
    }, 1500);
  };

  const handleCardClick = (card: CardItem) => {
    if (!card.isActive) return;
    
    if (card.viewTarget) {
      onChangeView(card.viewTarget);
    }
  };

  const handleQuickAction = () => {
     if (empresaAtiva) {
         onChangeView('LABOR_MODULE');
     }
  };

  return (
    <div className="p-4 md:p-8 md:ml-64 min-h-screen bg-slate-50 dark:bg-slate-900 animate-in fade-in duration-500 transition-colors duration-300">
      <div className="mb-8 flex justify-between items-end">
        <div>
            <h2 className="text-2xl font-bold text-legal-900 dark:text-white">{t('dash.title')}</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{t('dash.welcome')}</p>
        </div>
        <div className="text-sm text-gray-400 hidden md:block">
            {t('dash.version')}
        </div>
      </div>

      {/* 🟢 SEÇÃO DE DIAGNÓSTICO ESTRATÉGICO */}
      <div className={`bg-white dark:bg-legal-800 rounded-xl p-6 md:p-8 mb-10 transition-all border shadow-sm ${empresaAtiva ? 'border-legal-gold ring-2 ring-legal-gold/20' : 'border-gray-200 dark:border-legal-700'}`}>
        <h4 className="flex items-center text-lg font-bold text-legal-gold mb-6">
          <Search className="w-5 h-5 mr-3" />
          {t('dash.diagnosis')}
        </h4>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
             <input 
                value={cnpjBusca}
                onChange={(e) => setCnpjBusca(e.target.value)}
                placeholder={t('dash.placeholder')} 
                className="w-full p-4 pl-5 rounded-lg border border-gray-300 dark:border-legal-600 focus:ring-2 focus:ring-legal-gold focus:border-transparent transition-all text-gray-800 dark:text-white dark:bg-legal-900 placeholder-gray-400"
             />
          </div>
          <button 
            onClick={consultarCnae}
            disabled={isSearching || !cnpjBusca}
            className={`
                px-8 py-3 rounded-lg font-bold shadow-md transition-all flex items-center justify-center text-white
                ${isSearching || !cnpjBusca 
                    ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed' 
                    : 'bg-legal-900 dark:bg-black hover:bg-legal-800 text-legal-gold hover:text-white'}
            `}
          >
            {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : t('dash.analyze')}
          </button>
        </div>

        {empresaAtiva && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-in slide-in-from-bottom-2 duration-500">
            <div className="p-4 bg-gray-50 dark:bg-legal-900/50 rounded-lg border border-gray-100 dark:border-legal-700 col-span-1 md:col-span-2">
              <div className="flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                 <Building2 className="w-3 h-3 mr-1" /> {t('dash.company')}
              </div>
              <strong className="text-gray-900 dark:text-white text-lg block truncate" title={empresaAtiva.nome}>{empresaAtiva.nome}</strong>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-legal-900/50 rounded-lg border border-gray-100 dark:border-legal-700">
              <div className="flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                 <Activity className="w-3 h-3 mr-1" /> {t('dash.classification')}
              </div>
              <div className="flex flex-col">
                 <span className="text-gray-800 dark:text-gray-200 font-medium">{empresaAtiva.cnae}</span>
                 <span className="text-red-600 dark:text-red-400 text-xs font-bold mt-1">RAT {empresaAtiva.rat} - {empresaAtiva.risco}</span>
              </div>
            </div>
            
            <div className="p-4 bg-yellow-50/50 dark:bg-yellow-900/20 rounded-lg border border-legal-gold/30 flex flex-col justify-between cursor-pointer hover:bg-yellow-50 dark:hover:bg-yellow-900/30 transition-colors" onClick={handleQuickAction}>
              <div>
                  <div className="flex items-center text-[10px] font-bold text-legal-gold uppercase tracking-wider mb-2">
                     <Lightbulb className="w-3 h-3 mr-1" /> {t('dash.insight')}
                  </div>
                  <strong className="text-legal-900 dark:text-gray-200 text-xs block line-clamp-2">{empresaAtiva.tese}</strong>
              </div>
              <div className="flex justify-end mt-2">
                  <span className="flex items-center text-[10px] font-bold text-legal-900 dark:text-legal-gold">
                      {t('dash.generate')} <Play className="w-3 h-3 ml-1" />
                  </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 pb-20 md:pb-0">
        {dashboardCards.map((card: CardItem) => (
          <div 
            key={card.id}
            onClick={() => handleCardClick(card)}
            className={`
              group relative bg-white dark:bg-legal-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-legal-700
              hover:shadow-2xl hover:border-transparent transition-all duration-300 cursor-pointer
              flex flex-col transform hover:-translate-y-1
              ${!card.isActive ? 'opacity-70 grayscale-[0.5] cursor-not-allowed' : ''}
            `}
          >
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all group-hover:scale-110 shadow-sm"
              style={{ 
                backgroundColor: card.isActive && card.color ? `${card.color}15` : '#f3f4f6',
                color: card.isActive && card.color ? card.color : '#9ca3af'
              }}
            >
              <card.icon className="w-7 h-7" />
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-legal-900 dark:group-hover:text-legal-gold">
              {card.title}
            </h3>
            
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 flex-1 leading-relaxed">
              {card.description}
            </p>

            {card.isActive ? (
              <div 
                className="flex items-center text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                style={{ color: card.color }}
              >
                {t('dash.access')} <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            ) : (
              <div className="absolute top-4 right-4 bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-300 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                {t('dash.soon')}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;