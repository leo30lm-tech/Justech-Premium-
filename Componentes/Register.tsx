import React, { useState } from 'react';
import { UserPlus, Mail, Lock } from 'lucide-react';

interface RegisterProps {
  onRegister: (data: { email: string; pass: string }) => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  return (
    <div className="h-screen w-full bg-legal-900 flex flex-col items-center justify-center p-6 animate-in fade-in duration-500 relative overflow-hidden">
      {/* Background decoration matching Login/Onboarding */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-legal-gold/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-sm relative z-10 border border-legal-gold/20">
        <div className="flex flex-col items-center mb-8">
            <div className="p-4 bg-legal-900 rounded-full mb-4 shadow-lg border border-legal-gold">
                <UserPlus className="w-8 h-8 text-legal-gold" />
            </div>
            <h2 className="text-2xl font-bold text-legal-900">Criar Conta</h2>
            <p className="text-gray-500 text-sm mt-2 text-center">JusTech Premium: Edição para Sócios</p>
        </div>

        <div className="space-y-5">
          <div className="relative group">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-legal-gold transition-colors" />
             </div>
             <input 
                type="email"
                placeholder="E-mail Profissional" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-legal-gold focus:border-transparent outline-none transition-all text-gray-800 bg-gray-50 focus:bg-white"
             />
          </div>
          
          <div className="relative group">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-legal-gold transition-colors" />
             </div>
             <input 
                type="password" 
                placeholder="Senha de Acesso" 
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-legal-gold focus:border-transparent outline-none transition-all text-gray-800 bg-gray-50 focus:bg-white"
             />
          </div>

          <button 
            onClick={() => onRegister({ email, pass: senha })}
            disabled={!email || !senha}
            className={`
              w-full py-4 font-bold rounded-xl shadow-lg transition-all transform flex items-center justify-center
              ${!email || !senha 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-legal-gold hover:bg-yellow-500 text-legal-900 hover:scale-[1.02] active:scale-95 shadow-yellow-500/20'}
            `}
          >
            Cadastrar Escritório
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-8 leading-relaxed">
            Acesso exclusivo para advogados.<br/>
            Seus dados estão protegidos por criptografia ponta-a-ponta.
        </p>
      </div>
    </div>
  );
};

export default Register;
