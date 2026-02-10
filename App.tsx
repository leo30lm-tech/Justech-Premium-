import React, { useState, useEffect } from 'react';
import { Gavel } from 'lucide-react';
// Ajustado para bater com as pastas "Componentes", "Contextos" e "Serviços" do seu GitHub
import Sidebar from './Componentes/Sidebar';
import Header from './Componentes/Header';
import Dashboard from './Componentes/Dashboard';
import LaborModule from './Componentes/LaborModule';
import CalculationModule from './Componentes/CalculationModule';
import ContractModule from './Componentes/ContractModule';
import SimpleChatModule from './Componentes/SimpleChatModule';
import SettingsModule from './Componentes/SettingsModule';
import Onboarding from './Componentes/Onboarding';
import Register from './Componentes/Register';
import Login from './Componentes/Login';
import SupportChat from './Componentes/SupportChat';
import { ViewState } from './tipos'; // Ajustado se o arquivo for tipos.ts
import { LanguageProvider } from './Contextos/LanguageContext';

const AppContent: React.FC = () => {
  const [appStage, setAppStage] = useState<'onboarding' | 'register' | 'login' | 'app'>('onboarding');
  const [currentView, setCurrentView] = useState<ViewState>('DASHBOARD');
  const [calculationData, setCalculationData] = useState<any>(null);
  const [companyData, setCompanyData] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const [officeProfile, setOfficeProfile] = useState({
    nome: 'Dr. Advogado Responsável',
    oab: 'OAB/SP 000.000',
    email: 'contato@advocacia.com.br',
    whatsapp: '(11) 99999-9999',
    endereco: 'Av. Paulista, 1000 - CJ 12 - São Paulo/SP',
    logo: '' 
  });

  if (appStage === 'onboarding') return <Onboarding onNext={() => setAppStage('register')} />;
  if (appStage === 'register') return <Register onRegister={() => setAppStage('login')} />;
  if (appStage === 'login') return <Login onLogin={() => setAppStage('app')} />;

  const renderContent = () => {
    switch (currentView) {
      case 'DASHBOARD':
        return <Dashboard onChangeView={(view) => { setCurrentView(view); setMobileMenuOpen(false); }} onSaveCompanyContext={setCompanyData} />;
      case 'LABOR_MODULE':
        return <LaborModule initialContext={calculationData} companyContext={companyData} officeProfile={officeProfile} />;
      case 'CALCULATION_MODULE':
        return <CalculationModule onNavigate={(view) => { setCurrentView(view); setMobileMenuOpen(false); }} onSaveContext={setCalculationData} officeProfile={officeProfile} />;
      case 'CONTRACT_MODULE':
        return <ContractModule />;
      case 'PENAL_MODULE':
        return (
          <SimpleChatModule 
            title="Direito Penal" 
            subtitle="Habeas Corpus, Defesas e Execução Penal" 
            initialMessage="Olá, Doutor(a). Sou sua especialista em Direito Penal. Como posso ajudar?"
            icon={Gavel}
            colorClass="text-red-600"
            iconBgClass="bg-red-600"
            officeProfile={officeProfile}
          />
        );
      case 'SETTINGS':
        return <SettingsModule currentProfile={officeProfile} onSaveProfile={setOfficeProfile} theme={theme} setTheme={setTheme} />;
      default:
        return <Dashboard onChangeView={(view) => { setCurrentView(view); setMobileMenuOpen(false); }} onSaveCompanyContext={setCompanyData} />;
    }
  };

  return (
    <div className={`min-h-screen relative transition-colors duration-300 ${theme === 'dark' ? 'bg-legal-900' : 'bg-slate-50'}`}>
      <Sidebar 
        currentView={currentView} 
        onChangeView={(view) => { setCurrentView(view); setMobileMenuOpen(false); }} 
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
      <div className={`transition-all duration-300 ${mobileMenuOpen ? 'opacity-50 pointer-events-none' : ''} md:opacity-100 md:pointer-events-auto`}>
        <Header onToggleMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main>{renderContent()}</main>
      </div>
      <SupportChat officeProfile={officeProfile} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;
