import React, { useState, useEffect } from 'react';
import { Delete, ShieldCheck } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [pin, setPin] = useState('');
  const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'backspace'];

  useEffect(() => {
    // Senha padrão para teste conforme solicitado
    if (pin === '1234') {
      setTimeout(onLogin, 300);
    }
  }, [pin, onLogin]);

  const handleKey = (k: string | number) => {
    if (k === 'backspace') {
      setPin(prev => prev.slice(0, -1));
    } else if (k !== '' && pin.length < 4) {
      setPin(prev => prev + k.toString());
    }
  };

  return (
    <div className="h-screen w-full bg-legal-900 flex flex-col items-center justify-center text-white p-6 animate-in fade-in duration-500">
      <div className="mb-6 p-4 bg-legal-800 rounded-full shadow-2xl border border-legal-gold/20">
        <ShieldCheck className="w-10 h-10 text-legal-gold" />
      </div>

      <h2 className="text-2xl font-bold text-legal-gold mb-2 tracking-wide">Acesso Seguro</h2>
      <p className="text-gray-400 mb-10 text-lg">Digite seu PIN numérico</p>

      {/* PIN Indicators */}
      <div className="flex gap-4 mb-12">
        {[0, 1, 2, 3].map((i) => (
          <div 
            key={i} 
            className={`w-4 h-4 rounded-full border-2 border-legal-gold transition-all duration-300 ${pin.length > i ? 'bg-legal-gold scale-110 shadow-[0_0_10px_#ccac00]' : 'bg-transparent'}`} 
          />
        ))}
      </div>

      {/* Numeric Keypad */}
      <div className="grid grid-cols-3 gap-x-8 gap-y-6">
        {keys.map((k, i) => (
          <button 
            key={i} 
            onClick={() => handleKey(k)}
            disabled={k === ''}
            className={`
              w-20 h-20 rounded-full flex items-center justify-center text-3xl font-light transition-all duration-200 select-none
              ${k === '' ? 'cursor-default pointer-events-none opacity-0' : 'border border-legal-700 bg-legal-800/30 hover:bg-legal-700 hover:border-legal-gold text-white active:scale-95 cursor-pointer shadow-lg'}
              ${k === 'backspace' ? 'text-red-400 border-red-900/30' : ''}
            `}
          >
            {k === 'backspace' ? <Delete className="w-8 h-8" /> : k}
          </button>
        ))}
      </div>
      
      <p className="mt-16 text-xs text-gray-500 uppercase tracking-widest font-semibold opacity-50">JusTech Premium Security</p>
    </div>
  );
};

export default Login;
