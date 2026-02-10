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
  
  // Construct the initial greeting based on the "Persona"
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

  // Re-initialize if context props change
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
    // 1. Limpamos o texto para formato de URL (evita erros de caracteres)
    const textoFormatado = encodeURIComponent(`⚖️ *JusTech - Parecer Técnico*\n\n${textoDaIA}`);
    
    // 2. Criamos o link oficial do WhatsApp (api.whatsapp)
    const url = `https://api.whatsapp.com/send?text=${textoFormatado}`;
    
    // 3. Abrimos em uma nova aba. 
    window.open(url, '_blank');
  };

  const exportToPDF = (content: string) => {
    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;

    // Convert Markdown-ish to HTML for print
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
    
    // --- MASTER INSTRUCTION INJECTION (O Segredo) ---
    // Injects the context ONLY once per session flow to prime the AI as Senior Lawyer
    let finalPrompt = userMsg.content;
    
    if (!hasUsedContext && (initialContext || companyContext)) {
         const masterInstruction = `
\n\n🔴 **INSTRUÇÃO MESTRE DO SISTEMA (MODO ESPECIALISTA TST)** 🔴

VOCÊ É O MOTOR JURÍDICO DO JUSTECH PREMIUM.
ATUE COMO UM ADVOGADO SÊNIOR COM 20 ANOS DE EXPERIÊNCIA EM DIREITO DO TRABALHO.

📋 **CONTEXTO ATUAL DA EMPRESA E CÁLCULOS**:
${companyContext ? `- Empresa: ${companyContext.nome}\n- CNAE: ${companyContext.cnae}\n- RAT: ${companyContext.rat}\n` : 'Empresa não informada.'}
${initialContext ? `- Salário Base: R$ ${initialContext.dadosOriginais.salario}\n- Valor Estimado da Causa: R$ ${initialContext.totalGeral}` : ''}

🎯 **SUA TAREFA**:
1. Responda como um Especialista em TST.
2. **SE O RAT FOR 3 (RISCO GRAVE)**: Foque obrigatoriamente em teses de INSALUBRIDADE e PERICULOSIDADE.
3. Use Súmulas e OJs do TST para fundamentar.
4. **FORMATAÇÃO OBRIGATÓRIA**:
   - Use **Negritos** para destacar pontos chave.
   - Use Emojis Jurídicos (⚖️, 📄, ⚠️, 💡) no início dos parágrafos.
   - Responda em tópicos organizados.
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
            msg.id === aiMsgId 
              ? { ...msg, content: fullResponse } 
              : msg
          ));
        },
        contextFiles
      );

      setMessages(prev => prev.map(msg => 
        msg.id === aiMsgId 
          ? { ...msg, isStreaming: false } 
          : msg
      ));

    } catch (error) {
      console.error(error);
      setMessages(prev => prev.map(msg => 
        msg.id === aiMsgId 
          ? { ...msg, content: "⚠️ Erro de conexão com o Motor Jurídico. Tente novamente.", isStreaming: false } 
          : msg
      ));
    } finally {
      setIsLoading(false);
      setAttachedFile(null);
    }
  };

  // Improved markdown renderer for legal texts
  const renderMessageContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      // Bold Headers
      if (line.trim().startsWith('###') || line.trim().startsWith('**Resumo') || line.trim().startsWith('**Funda') || line.trim().startsWith('**Estra') || line.trim().startsWith('**Risco')) {
        return <h3 key={idx} className="text-lg font-bold text-legal-900 mt-6 mb-2 pb-1 border-b border-gray-100">{line.replace(/###/g, '').replace(/\*\*/g, '')}</h3>;
      }
      // Bullet points
      if (line.trim().startsWith('- ')) {
        return <li key={idx} className="ml-4 text-gray-700 mb-1">{line.replace('- ', '')}</li>;
      }
      // Standard Paragraphs with Bold parsing
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={idx} className="mb-3 text-gray-700 leading-relaxed text-sm">
          {parts.map((part, i) => 
            part.startsWith('**') && part.endsWith('**') 
              ? <strong key={i} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong> 
              : part
          )}
        </p>
      );
    });
  };

  // --- VIEW: MENU SELECTION ---
  if (mode === 'MENU') {
    return (
      <div className="flex flex-col h-[calc(100vh-64px)] ml-64 bg-slate-50 p-8 overflow-y-auto animate-in fade-in duration-300">
        <div className="max-w-4xl mx-auto w-full mt-4">
            <div className="flex items-center space-x-4 mb-8">
                <div className="p-4 bg-legal-900 rounded-2xl shadow-xl">
                    <Scale className="w-10 h-10 text-legal-gold" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-legal-900">Especialista Trabalhista</h2>
                    <p className="text-gray-500 mt-1 text-lg">Selecione o fluxo de trabalho jurídico:</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button onClick={() => { setMode('CHAT'); handleSend("Gostaria de elaborar uma Reclamação Trabalhista. Por favor, inicie a entrevista guiada."); }} 
                  className="group p-6 bg-white rounded-2xl border border-gray-200 hover:border-legal-gold hover:shadow-lg transition-all text-left flex flex-col justify-between h-48 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-legal-100 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:bg-legal-gold/20 transition-colors"></div>
                    <div>
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-100">
                           <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-legal-900">Nova Reclamatória</h3>
                        <p className="text-sm text-gray-500 mt-2">Entrevista guiada para estruturar fatos, pedidos e cálculos.</p>
                    </div>
                </button>

                <button onClick={() => { setMode('CHAT'); handleSend("Estou enviando uma Sentença para análise de riscos e recursos. Aguardo instruções."); }}
                  className="group p-6 bg-white rounded-2xl border border-gray-200 hover:border-legal-gold hover:shadow-lg transition-all text-left flex flex-col justify-between h-48 relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-24 h-24 bg-legal-100 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:bg-legal-gold/20 transition-colors"></div>
                    <div>
                        <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center mb-4 group-hover:bg-green-100">
                           <Bot className="w-5 h-5 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-legal-900">Análise de Sentença (IA)</h3>
                        <p className="text-sm text-gray-500 mt-2">Upload de PDF para identificar contradições e pontos de recurso.</p>
                    </div>
                </button>

                 <button onClick={() => { setMode('CHAT'); handleSend("Preciso redigir um Recurso (RO/RR). Quais são os requisitos?"); }}
                  className="group p-6 bg-white rounded-2xl border border-gray-200 hover:border-legal-gold hover:shadow-lg transition-all text-left flex flex-col justify-between h-48 relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-24 h-24 bg-legal-100 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:bg-legal-gold/20 transition-colors"></div>
                    <div>
                        <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center mb-4 group-hover:bg-purple-100">
                           <Zap className="w-5 h-5 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-legal-900">Recursos TST</h3>
                        <p className="text-sm text-gray-500 mt-2">Elaboração de RO, RR e Agravos com jurisprudência atualizada.</p>
                    </div>
                </button>

                 <button onClick={() => { setMode('CHAT'); handleSend("Quero analisar um Acordo Extrajudicial. O que devo considerar?"); }}
                  className="group p-6 bg-white rounded-2xl border border-gray-200 hover:border-legal-gold hover:shadow-lg transition-all text-left flex flex-col justify-between h-48 relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-24 h-24 bg-legal-100 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:bg-legal-gold/20 transition-colors"></div>
                    <div>
                        <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center mb-4 group-hover:bg-amber-100">
                           <FileCheck className="w-5 h-5 text-amber-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-legal-900">Acordos & Consultoria</h3>
                        <p className="text-sm text-gray-500 mt-2">Validação de termos e cálculo de riscos de homologação.</p>
                    </div>
                </button>
            </div>
        </div>
      </div>
    );
  }

  // --- VIEW: CHAT INTERFACE ---
  return (
    <div className="flex flex-col h-[calc(100vh-64px)] ml-64 bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center shadow-sm z-10">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setMode('MENU')} 
            className="p-2 hover:bg-gray-100 rounded-full text-legal-900 transition-colors"
            title="Voltar ao Menu"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col">
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              <Briefcase className="w-4 h-4 mr-2 text-legal-gold" />
              Direito do Trabalho
            </h2>
            <div className="flex items-center text-xs text-green-600 font-medium">
              <span className="relative flex h-2 w-2 mr-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Gemini 3 Pro (Analysis) Ativo
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
            <button 
                onClick={() => setInput("Gostaria de pesquisar jurisprudência atualizada do TST sobre: ")}
                className="hidden md:flex items-center px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition cursor-pointer"
            >
                <FileText className="w-3 h-3 mr-1.5" />
                Jurisprudência TST
            </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden flex flex-col relative bg-slate-50/50">
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 legal-scroll pb-40">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex w-full ${msg.role === MessageRole.USER ? 'justify-end' : 'justify-start'}`}>
              
              {/* Bot Icon */}
              {msg.role === MessageRole.MODEL && (
                <div className="w-8 h-8 rounded-full bg-legal-900 flex items-center justify-center mr-3 mt-1 shadow-md flex-shrink-0 border border-legal-gold">
                  <Scale className="w-4 h-4 text-legal-gold" />
                </div>
              )}

              <div className={`flex flex-col max-w-[85%] md:max-w-2xl`}>
                <div 
                    className={`
                    rounded-2xl p-5 shadow-sm border text-sm md:text-base leading-relaxed
                    ${msg.role === MessageRole.USER 
                        ? 'bg-white border-gray-200 text-gray-800 rounded-tr-sm' 
                        : 'bg-white border-legal-gold/30 text-gray-800 rounded-tl-sm'
                    }
                    `}
                >
                    {msg.role === MessageRole.USER ? (
                        <div className="whitespace-pre-wrap font-medium">{msg.content}</div>
                    ) : (
                        <div>
                            {renderMessageContent(msg.content)}
                            {msg.isStreaming && <span className="inline-block w-2 h-4 bg-legal-gold ml-1 animate-pulse rounded-full"></span>}
                        </div>
                    )}
                </div>
                
                {/* Action Buttons for Bot Messages */}
                {msg.role === MessageRole.MODEL && !msg.isStreaming && (
                    <div className="flex flex-col items-start mt-2 ml-1 opacity-100 transition-opacity">
                      
                      {/* WhatsApp Button Custom Styled */}
                      <button 
                          onClick={() => enviarWhatsAppSeguro(msg.content)}
                          style={{
                            backgroundColor: '#25D366',
                            color: 'white',
                            border: 'none',
                            padding: '8px 15px',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}
                          className="hover:bg-[#20bd5a] transition-colors shadow-sm"
                      >
                          <Share2 className="w-3 h-3" />
                          Enviar Resumo ao Cliente
                      </button>

                      <div className="flex items-center space-x-2 mt-2">
                        <button 
                            onClick={() => exportToPDF(msg.content)}
                            className="flex items-center text-[10px] uppercase font-bold text-legal-900 bg-white hover:bg-gray-50 px-3 py-1.5 rounded-full transition-colors border border-gray-300 shadow-sm"
                        >
                            <Printer className="w-3 h-3 mr-1.5" />
                            Gerar PDF
                        </button>
                      </div>

                    </div>
                )}
              </div>

              {/* User Icon */}
              {msg.role === MessageRole.USER && (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center ml-3 mt-1 flex-shrink-0">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 shadow-2xl z-20">
          <div className="max-w-4xl mx-auto">
             
             {/* File Preview */}
            {attachedFile && (
              <div className="flex items-center bg-blue-50 p-2 rounded-lg mb-3 w-fit border border-blue-100 animate-in slide-in-from-bottom-2">
                <FileText className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-xs font-semibold text-blue-800 truncate max-w-[200px]">{attachedFile.name}</span>
                <button onClick={() => setAttachedFile(null)} className="ml-3 text-blue-400 hover:text-red-500 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="relative flex items-end bg-gray-50 border border-gray-300 rounded-xl focus-within:ring-2 focus-within:ring-legal-900/20 focus-within:border-legal-900 transition-all shadow-inner">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-3.5 text-gray-400 hover:text-legal-900 transition-colors"
                title="Anexar Documento (PDF, Imagem, DOCX)"
              >
                <Paperclip className="w-5 h-5" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,image/*"
                onChange={handleFileUpload}
              />
              
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Descreva o caso, cole uma sentença para análise ou peça uma minuta..."
                className="w-full max-h-40 p-3.5 bg-transparent border-none focus:ring-0 resize-none text-gray-900 placeholder-gray-400 text-sm legal-scroll leading-relaxed"
                rows={1}
                style={{minHeight: '52px'}}
              />
              
              <button 
                onClick={() => handleSend()}
                disabled={isLoading || (!input.trim() && !attachedFile)}
                className={`
                  p-3 m-1.5 rounded-lg transition-all duration-200 flex items-center justify-center
                  ${isLoading || (!input.trim() && !attachedFile)
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-legal-900 text-white hover:bg-legal-800 shadow-md transform hover:scale-105'}
                `}
              >
                {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Send className="w-5 h-5" />}
              </button>
            </div>
            
            <div className="mt-2 flex justify-between items-center px-2">
                <p className="text-[10px] text-gray-400 flex items-center">
                    <Bot className="w-3 h-3 mr-1" />
                    IA Jurídica (Gemini 3 Pro) pode cometer erros. Revise sempre.
                </p>
                <div className="text-[10px] text-gray-400 font-medium flex items-center">
                    <ShieldCheck className="w-3 h-3 mr-1 text-green-500" />
                    LGPD Compliance
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaborModule;
