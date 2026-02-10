import React, { useState } from 'react';
import { MessageCircle, X, Headphones, ExternalLink } from 'lucide-react';

interface SupportChatProps {
  officeProfile: {
    nome: string;
    email: string;
    whatsapp: string;
  };
}

const SupportChat: React.FC<SupportChatProps> = ({ officeProfile }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 bg-white rounded-2xl shadow-2xl border border-legal-gold/30 overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-300">
          
          {/* Header */}
          <div className="bg-legal-900 p-4 flex justify-between items-center border-b border-legal-gold">
            <div className="flex items-center text-white">
              <Headphones className="w-5 h-5 mr-2 text-legal-gold" />
              <span className="font-bold text-sm">Suporte JusTech Premium</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 bg-slate-50 min-h-[200px] flex flex-col justify-between">
            <div className="bg-white p-3 rounded-lg rounded-tl-none border border-gray-200 shadow-sm mb-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                Olá! Como podemos ajudar o escritório <strong>{officeProfile.nome || 'Parceiro'}</strong> hoje?
                <br/><br/>
                Nossa equipe de especialistas em Direito e Tecnologia está pronta para auxiliar.
              </p>
              <span className="text-[10px] text-gray-400 mt-2 block text-right">Agora</span>
            </div>

             {/* Action Button */}
            <div className="mt-2 pt-4 border-t border-gray-200">
                <button 
                onClick={() => window.open(`https://wa.me/5511999999999?text=Olá,%20sou%20do%20escritório%20${encodeURIComponent(officeProfile.nome)}%20e%20preciso%20de%20ajuda%20no%20JusTech.`, '_blank')}
                className="w-full py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center group"
                >
                <MessageCircle className="w-4 h-4 mr-2" />
                Falar com Consultor Humano
                <ExternalLink className="w-3 h-3 ml-2 opacity-50 group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="text-center text-[10px] text-gray-400 mt-2">
                    Atendimento de Seg. a Sex. das 09h às 18h
                </p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110
          ${isOpen ? 'bg-legal-900 text-legal-gold rotate-90' : 'bg-legal-gold text-legal-900 hover:bg-yellow-500'}
        `}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-7 h-7" />}
      </button>
    </div>
  );
};

export default SupportChat;
