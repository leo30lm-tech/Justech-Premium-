import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, FileText, Download, X, AlertCircle, Bot, User, Play, Briefcase, Share2, ArrowLeft, Printer, Scale, FileCheck, Zap, ShieldCheck } from 'lucide-react';
import { ChatMessage, MessageRole } from '../types';
import { streamLegalResponse } from '../services/geminiService';

interface LaborModuleProps {
  initialContext?: any;
  companyContext?: any;
  officeProfile: any;
}

const LaborModule: React.FC<LaborModuleProps> = ({ initialContext, companyContext, officeProfile }) => {
  const [mode, setMode] = useState<'MENU' | 'CHAT'>(initialContext || companyContext ? 'CHAT' : 'MENU');
  const [hasUsedContext, setHasUsedContext] = useState(false);
  
  const getInitialMessage = () => {
    let message = 'Olá, Doutor(a). Sou sua Especialista em Direito do Trabalho (CLT/TST). \n\nEstou pronta para atuar como seu braço direito na construção de teses, peças e análises de risco.';
    
    if (companyContext) {
      message += `\n\n🏛️ **Contexto da Empresa Ativo**:\n- **${companyContext.nome}**\n- CNAE: ${companyContext.cnae}\n- RAT: ${companyContext.rat} (${companyContext.rat >= 3 ? 'Risco Elevado - Foco em Insalubridade' : 'Risco Leve/Médio'})\n- 💡 Tese Sugerida: ${companyContext.tese}`;
    }

    if (initialContext) {
      const formatCurrency = (val: number) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      message += `\n\n💰 **Dados do Liquidante Incorporados**:\n- Salário Base: ${formatCurrency(parseFloat(initialContext.dadosOriginais.salario))}\n- Admissão: ${new Date(initialContext.dadosOriginais.inicio).toLocaleDateString('pt-BR')}\n- **Total da Causa Estimado: ${formatCurrency(initialContext.totalGeral)}**`;
    }

    message += `\n\nComo deseja prosseguir? Posso redigir a peça inicial agora, analisar uma sentença ou calcular riscos processuais.`;
    return message;
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: MessageRole.MODEL,
      content: getInitialMessage(),
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{name: string, data: string, mimeType: string} | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, mode]);

  useEffect(() => {
    if (initialContext || companyContext) {
       setMessages([{
         id: 'context_update_' + Date.now(),
         role: MessageRole.MODEL,
         content: getInitialMessage(),
         timestamp: new Date()
       }]);
       setMode('CHAT');
       setHasUsedContext(false);
    }
  }, [initialContext, companyContext]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        setAttachedFile({
          name: file.name,
          data: base64Data,
          mimeType: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const enviarWhatsAppSeguro = (textoDaIA: string) => {
    const textoFormatado = encodeURIComponent(`⚖️ *JusTech - Parecer Técnico*\n\n${textoDaIA}`);
    const url = `https://api.whatsapp.com/send?text=${textoFormatado}`;
    window.open(url, '_blank');
  };

  const exportToPDF = (content: string) => {
    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;

    const formattedContent = content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/### (.*?)\n/g, '<h3>$1</h3>')
        .replace(/\n/g, '<br>');

    printWindow.document.write(`
      <html>
        <head>
          <title>${officeProfile.nome} - Documento Jurídico</title>
          <style>
            body { font-family: 'Georgia', serif; padding: 40px; color: #000; max-width: 800px; margin: 0 auto; line-height: 1.5; }
            h3 { font-size: 14pt; margin-top: 20px; text-decoration: underline; }
          </style>
        </head>
        <body>
          <div style="text-align: center; border-bottom: 2px solid gold; padding-bottom: 10px;">
            ${officeProfile.logo ? `<img src="${officeProfile.logo}" style="max-height: 80px; margin-bottom: 15px;" />` : ''}
            <h2 style="margin:0;">${officeProfile.nome}</h2>
            <small>OAB: ${officeProfile.oab}</small>
          </div>
          <div style="margin-top: 30px; text-align: justify;">${formattedContent}</div>
          <div style="margin-top: 50px; text-align: center;">
            <p>_____________________________________</p>
            <p>${officeProfile.nome}<br/>${officeProfile.oab}</p>
            <small style="color: #666;">${officeProfile.endereco}</small>
          </div>
          <script>window.onload = function() { setTimeout(function() { window.print(); }, 500); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleSend = async (overrideInput?: string) => {
    const textToSend = overrideInput || input;
    if ((!textToSend.trim() && !attachedFile) || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: MessageRole.USER,
      content: textToSend + (attachedFile ? `\n\n📎 [Arquivo Anexado: ${attachedFile.name}]` : ''),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const historyForApi = messages.map(m => ({ role: m.role, content: m.content }));
    let finalPrompt = userMsg.content;
    
    if (!hasUsedContext && (initialContext || companyContext)) {
         const masterInstruction = `
\n\n🔴 **INSTRUÇÃO MESTRE DO SISTEMA (MODO ESPECIALISTA TST)** 🔴
${companyContext ? `- Empresa: ${companyContext.nome}\n- CNAE: ${companyContext.cnae}\n- RAT: ${companyContext.rat}\n` : ''}
${initialContext ? `- Salário Base: R$ ${initialContext.dadosOriginais.salario}\n- Valor Estimado da Causa: R$ ${initialContext.totalGeral}` : ''}
`;
         finalPrompt = `${userMsg.content}\n${masterInstruction}`;
         setHasUsedContext(true);
    }

    historyForApi.push({ role: MessageRole.USER, content: finalPrompt });

    const aiMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: aiMsgId,
      role: MessageRole.MODEL,
      content: '',
      timestamp: new Date(),
      isStreaming: true
    }]);

    try {
      const contextFiles = attachedFile ? [{ data: attachedFile.data, mimeType: attachedFile.mimeType }] : [];
      let fullResponse = "";
      await streamLegalResponse(
        historyForApi,
        (chunk) => {
          fullResponse += chunk;
          setMessages(prev => prev.map(msg => 
            msg.id === aiMsgId ? { ...msg, content: fullResponse } : msg
          ));
        },
        contextFiles
      );
      setMessages(prev => prev.map(msg => 
        msg.id === aiMsgId ? { ...msg, isStreaming: false } : msg
      ));
    } catch (error) {
      console.error(error);
      setMessages(prev => prev.map(msg => 
        msg.id === aiMsgId ? { ...msg, content: "⚠️ Erro de conexão.", isStreaming: false } : msg
      ));
    } finally {
      setIsLoading(false);
      setAttachedFile(null);
    }
  };

  const renderMessageContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      if (line.trim().startsWith('###') || line.trim().startsWith('**')) {
        return <h3 key={idx} className="text-lg font-bold text-legal-900 mt-6 mb-2 pb-1 border-b border-gray-100">{line.replace(/###/g, '').replace(/\*\*/g, '')}</h3>;
      }
      if (line.trim().startsWith('- ')) {
        return <li key={idx} className="ml-4 text-gray-700 mb-1">{line.replace('- ', '')}</li>;
      }
      return <p key={idx} className="mb-3 text-gray-700 leading-relaxed text-sm">{line}</p>;
    });
  };

  if (mode === 'MENU') {
    return (
      <div className="flex flex-col h-[calc(100vh-64px)] md:ml-64 bg-slate-50 p-4 md:p-8 overflow-y-auto animate-in fade-in duration-300">
        <div className="max-w-4xl mx-auto w-full mt-4 pb-20 md:pb-0">
            <div className="flex items-center space-x-4 mb-8">
                <div className="p-4 bg-legal-900 rounded-2xl shadow-xl">
                    <Scale className="w-10 h-10 text-legal-gold" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-legal-900">Especialista Trabalhista</h2>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button onClick={() => { setMode('CHAT'); handleSend("Gostaria de elaborar uma Reclamação Trabalhista."); }} 
                  className="group p-6 bg-white rounded-2xl border border-gray-200 hover:border-legal-gold transition-all text-left flex flex-col justify-between h-48">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">Nova Reclamatória</h3>
                        <p className="text-sm text-gray-500 mt-2">Entrevista guiada para estruturar fatos.</p>
                    </div>
                </button>
                <button onClick={() => { setMode('CHAT'); handleSend("Estou enviando uma Sentença para análise."); }}
                  className="group p-6 bg-white rounded-2xl border border-gray-200 hover:border-legal-gold transition-all text-left flex flex-col justify-between h-48">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">Análise de Sentença</h3>
                        <p className="text-sm text-gray-500 mt-2">Upload de PDF para identificar contradições.</p>
                    </div>
                </button>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] md:ml-64 bg-slate-50">
      <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center shadow-sm z-10">
        <div className="flex items-center space-x-3">
          <button onClick={() => setMode('MENU')} className="p-2 hover:bg-gray-100 rounded-full text-legal-900"><ArrowLeft className="w-5 h-5" /></button>
          <h2 className="text-lg font-bold text-gray-900">Direito do Trabalho</h2>
        </div>
      </div>
      <div className="flex-1 overflow-hidden flex flex-col relative bg-slate-50/50">
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 legal-scroll pb-40">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex w-full ${msg.role === MessageRole.USER ? 'justify-end' : 'justify-start'}`}>
              <div className="flex flex-col max-w-[85%] md:max-w-2xl">
                <div className={`rounded-2xl p-5 shadow-sm border text-sm md:text-base ${msg.role === MessageRole.USER ? 'bg-white border-gray-200' : 'bg-white border-legal-gold/30'}`}>
                  {msg.role === MessageRole.USER ? <div className="whitespace-pre-wrap">{msg.content}</div> : <div>{renderMessageContent(msg.content)}</div>}
                </div>
                {msg.role === MessageRole.MODEL && !msg.isStreaming && (
                    <div className="flex items-center space-x-2 mt-2">
                      <button onClick={() => enviarWhatsAppSeguro(msg.content)} className="bg-[#25D366] text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Share2 className="w-3 h-3" /> WhatsApp</button>
                      <button onClick={() => exportToPDF(msg.content)} className="bg-white border border-gray-300 text-legal-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Printer className="w-3 h-3" /> PDF</button>
                    </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 shadow-2xl z-20">
          <div className="max-w-4xl mx-auto flex items-end gap-2">
            <button onClick={() => fileInputRef.current?.click()} className="p-3 text-gray-400 hover:text-legal-900 transition-colors"><Paperclip className="w-5 h-5" /></button>
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
            <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Descreva o caso..." className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-0 resize-none text-sm" rows={1} />
            <button onClick={() => handleSend()} disabled={isLoading} className="p-3 bg-legal-900 text-white rounded-lg"><Send className="w-5 h-5" /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaborModule;