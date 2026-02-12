import React, { useState, useEffect } from 'react';
import { Settings, User, Mail, Smartphone, FileText, Save, CheckCircle, MapPin, Building2, Upload, Moon, Sun, Globe, Monitor } from 'lucide-react';
import { useLanguage, Language } from '../contexts/LanguageContext';

interface SettingsModuleProps {
  currentProfile: any;
  onSaveProfile: (data: any) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const SettingsModule: React.FC<SettingsModuleProps> = ({ 
  currentProfile, 
  onSaveProfile,
  theme,
  setTheme,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [perfil, setPerfil] = useState(currentProfile);
  const [tomIA, setTomIA] = useState('Técnico / Conservador');
  const [saved, setSaved] = useState(false);

  // Sync state if parent props change
  useEffect(() => {
    setPerfil(currentProfile);
  }, [currentProfile]);

  const handleSave = () => {
    onSaveProfile(perfil);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPerfil({ ...perfil, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // Custom chevron for the select element to match the gold theme
  const customSelectStyle = {
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ccac00' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 1rem center',
    backgroundSize: '1.25em'
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] ml-64 bg-slate-50 dark:bg-slate-900 p-8 overflow-y-auto transition-colors duration-300">
      <div className="max-w-4xl mx-auto w-full">
        
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
            <div className="p-3 bg-legal-900 dark:bg-black rounded-xl shadow-lg">
                <Settings className="w-8 h-8 text-legal-gold" />
            </div>
            <div>
                <h2 className="text-3xl font-bold text-legal-900 dark:text-white">{t('settings.title')}</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">{t('settings.subtitle')}</p>
            </div>
        </div>

        <div className="bg-white dark:bg-legal-800 rounded-xl shadow-sm border border-gray-200 dark:border-legal-700 p-8 animate-in fade-in duration-500 transition-colors duration-300">
          
          {/* Section 0: Appearance & Language (NEW) */}
          <section className="mb-10">
            <h4 className="text-xl font-bold text-legal-gold border-b border-gray-100 dark:border-legal-700 pb-3 mb-6 flex items-center">
              <Monitor className="w-6 h-6 mr-2 text-legal-gold" />
              {t('settings.interface')}
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Theme Toggle */}
               <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">{t('settings.theme')}</label>
                  <div className="flex bg-gray-100 dark:bg-legal-900 rounded-lg p-1 border border-gray-200 dark:border-legal-700">
                     <button 
                        onClick={() => setTheme('light')}
                        className={`flex-1 flex items-center justify-center py-2 rounded-md text-sm font-bold transition-all ${theme === 'light' ? 'bg-white text-legal-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                     >
                        <Sun className="w-4 h-4 mr-2" /> {t('settings.theme.light')}
                     </button>
                     <button 
                        onClick={() => setTheme('dark')}
                        className={`flex-1 flex items-center justify-center py-2 rounded-md text-sm font-bold transition-all ${theme === 'dark' ? 'bg-legal-700 text-legal-gold shadow-sm' : 'text-gray-400 hover:text-gray-300'}`}
                     >
                        <Moon className="w-4 h-4 mr-2" /> {t('settings.theme.dark')}
                     </button>
                  </div>
               </div>

               {/* Language Select */}
               <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{t('settings.lang')}</label>
                  <div className="relative mt-1">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select 
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as Language)}
                        style={customSelectStyle}
                        className="w-full pl-10 p-3 border border-gray-300 dark:border-legal-600 rounded-lg bg-white dark:bg-legal-900 text-gray-900 dark:text-white appearance-none focus:ring-2 focus:ring-legal-gold outline-none"
                    >
                        <option value="pt-BR">Português (Brasil)</option>
                        <option value="en-US">English (US)</option>
                        <option value="es-ES">Español</option>
                    </select>
                  </div>
               </div>
            </div>
          </section>

          {/* Section 1: Office Profile */}
          <section className="mb-10">
            <h4 className="text-xl font-bold text-legal-gold border-b border-gray-100 dark:border-legal-700 pb-3 mb-2 flex items-center">
              <Building2 className="w-6 h-6 mr-2 text-legal-gold" />
              {t('settings.office')}
            </h4>
            <p className="text-sm text-gray-400 mb-6 opacity-80">{t('settings.office.desc')}</p>
            
            <div className="flex flex-col md:flex-row gap-8">
              {/* Logo Upload */}
              <div className="flex flex-col items-center justify-start pt-2 md:w-1/4">
                  <div className="relative group w-32 h-32 rounded-2xl border-2 border-dashed border-legal-gold bg-gray-50 dark:bg-legal-900 flex items-center justify-center overflow-hidden mb-3 hover:bg-gray-100 dark:hover:bg-legal-700 transition-colors">
                    {perfil.logo ? (
                      <img src={perfil.logo} alt="Logo Escritório" className="w-full h-full object-contain p-2" />
                    ) : (
                      <div className="text-center p-2">
                         <Upload className="w-8 h-8 text-legal-gold mx-auto mb-2 opacity-70" />
                         <span className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase">{t('settings.logo')}</span>
                      </div>
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleLogoChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      title="Clique para alterar a logo"
                    />
                  </div>
                  <span className="text-xs text-gray-400 font-medium">PNG, JPG ou GIF</span>
              </div>

              {/* Form Data */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{t('settings.office.name')}</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input 
                      value={perfil.nome}
                      onChange={(e) => setPerfil({...perfil, nome: e.target.value})}
                      placeholder="Ex: Dr. Silva Advogados" 
                      className="w-full pl-10 p-3 border border-gray-300 dark:border-legal-600 rounded-lg focus:ring-2 focus:ring-legal-gold focus:border-legal-gold transition-all text-gray-900 dark:text-white dark:bg-legal-900 dark:placeholder-gray-600"
                    />
                  </div>
                </div>

                {/* OAB */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{t('settings.office.oab')}</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input 
                      value={perfil.oab}
                      onChange={(e) => setPerfil({...perfil, oab: e.target.value})}
                      placeholder="Ex: SP 123.456" 
                      className="w-full pl-10 p-3 border border-gray-300 dark:border-legal-600 rounded-lg focus:ring-2 focus:ring-legal-gold focus:border-legal-gold transition-all text-gray-900 dark:text-white dark:bg-legal-900 dark:placeholder-gray-600"
                    />
                  </div>
                </div>

                {/* Address (Full Width) */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{t('settings.office.addr')}</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input 
                      value={perfil.endereco}
                      onChange={(e) => setPerfil({...perfil, endereco: e.target.value})}
                      placeholder="Av. Paulista, 1000 - CJ 12 - São Paulo/SP" 
                      className="w-full pl-10 p-3 border border-gray-300 dark:border-legal-600 rounded-lg focus:ring-2 focus:ring-legal-gold focus:border-legal-gold transition-all text-gray-900 dark:text-white dark:bg-legal-900 dark:placeholder-gray-600"
                    />
                  </div>
                </div>

                {/* Contact Info */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{t('settings.office.email')}</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input 
                      value={perfil.email}
                      onChange={(e) => setPerfil({...perfil, email: e.target.value})}
                      placeholder="contato@advocacia.com.br" 
                      className="w-full pl-10 p-3 border border-gray-300 dark:border-legal-600 rounded-lg focus:ring-2 focus:ring-legal-gold focus:border-legal-gold transition-all text-gray-900 dark:text-white dark:bg-legal-900 dark:placeholder-gray-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{t('settings.office.whats')}</label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input 
                      value={perfil.whatsapp}
                      onChange={(e) => setPerfil({...perfil, whatsapp: e.target.value})}
                      placeholder="(11) 99999-9999" 
                      className="w-full pl-10 p-3 border border-gray-300 dark:border-legal-600 rounded-lg focus:ring-2 focus:ring-legal-gold focus:border-legal-gold transition-all text-gray-900 dark:text-white dark:bg-legal-900 dark:placeholder-gray-600"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Tip Box */}
            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-dashed border-legal-gold rounded-lg">
              <span className="text-legal-gold text-sm">
                💡 <b>{t('settings.tip')}</b> {t('settings.tip.text')}
              </span>
            </div>
          </section>

          {/* Section 2: AI Preferences */}
          <section className="mb-8">
            <h4 className="text-lg font-bold text-gray-800 dark:text-white border-b border-gray-100 dark:border-legal-700 pb-3 mb-6 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-legal-gold" />
              {t('settings.ai')} (Gemini 3 Pro)
            </h4>
            
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{t('settings.ai.tone')}</label>
              <select 
                value={tomIA}
                onChange={(e) => setTomIA(e.target.value)}
                style={customSelectStyle}
                // High contrast styles
                className="w-full p-3 mt-1 border-2 border-legal-gold rounded-lg bg-white dark:bg-legal-900 text-black dark:text-white font-bold appearance-none cursor-pointer focus:ring-2 focus:ring-legal-gold focus:border-legal-gold transition-all text-base shadow-sm"
              >
                <option>Técnico / Conservador (Padrão TST)</option>
                <option>Agressivo / Persuasivo (Foco em Dano Moral)</option>
                <option>Conciliador (Foco em Acordos)</option>
              </select>
              <p className="text-xs text-gray-400 mt-2">{t('settings.ai.desc')}</p>
            </div>
          </section>

          {/* Footer Actions */}
          <div className="flex justify-end pt-6 border-t border-gray-100 dark:border-legal-700">
            <button 
              onClick={handleSave}
              className={`
                px-6 py-3 rounded-lg font-bold flex items-center transition-all duration-300 shadow-md
                ${saved ? 'bg-green-600 text-white' : 'bg-legal-900 dark:bg-black text-legal-gold hover:bg-legal-800'}
              `}
            >
              {saved ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  {t('settings.saved')}
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  {t('settings.save')}
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SettingsModule;