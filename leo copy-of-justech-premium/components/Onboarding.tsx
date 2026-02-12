import React from 'react';
import { ShieldCheck, Zap, Calculator, ArrowRight, Scale } from 'lucide-react';

interface OnboardingProps {
  onNext: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onNext }) => {
  return (
    <div className="h-screen w-full bg-legal-900 text-white flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-legal-gold/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="max-w-md w-full flex flex-col items-center z-10">
        <div className="w-16 h-16 bg-legal-800 rounded-2xl flex items-center justify-center mb-6 border border-legal-gold/20 shadow-2xl shadow-legal-gold/10">
            <Scale className="w-8 h-8 text-legal-gold" />
        </div>

        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">JusTech Premium</h1>
        <p className="text-lg text-gray-400 mb-10">A revolução tecnológica no seu escritório.</p>
        
        <div className="w-full space-y-4 text-left mb-12">
          <div className="flex items-center space-x-4 bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:border-legal-gold/30 transition-colors">
            <div className="p-3 bg-blue-500/20 rounded-lg"><ShieldCheck className="w-6 h-6 text-blue-400" /></div>
            <div>
                <h3 className="font-bold text-white text-sm">Inteligência de Dados</h3>
                <p className="text-xs text-gray-400">Identifique RAT e CNAE instantaneamente.</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:border-legal-gold/30 transition-colors">
             <div className="p-3 bg-green-500/20 rounded-lg"><Calculator className="w-6 h-6 text-green-400" /></div>
            <div>
                <h3 className="font-bold text-white text-sm">Cálculos Reais</h3>
                <p className="text-xs text-gray-400">Liquidação de sentenças sem erros.</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:border-legal-gold/30 transition-colors">
             <div className="p-3 bg-purple-500/20 rounded-lg"><Zap className="w-6 h-6 text-purple-400" /></div>
            <div>
                <h3 className="font-bold text-white text-sm">Petições em Segundos</h3>
                <p className="text-xs text-gray-400">Redação jurídica via Gemini 3 Pro.</p>
            </div>
          </div>
        </div>

        <button 
          onClick={onNext} 
          className="w-full py-4 bg-legal-gold hover:bg-yellow-500 text-legal-900 font-bold rounded-full text-lg shadow-lg shadow-yellow-900/20 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center"
        >
          Começar Agora <ArrowRight className="ml-2 w-5 h-5" />
        </button>
      </div>
      
      <div className="absolute bottom-6 text-xs text-gray-600">
        Versão 2.5.0 (Beta) • JusTech AI
      </div>
    </div>
  );
};

export default Onboarding;