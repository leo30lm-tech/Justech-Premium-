import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, FileText, Bot, User, Share2, Printer, AlertCircle, X, Download, ArrowLeft } from 'lucide-react';
import { ChatMessage, MessageRole } from './types';
import { streamLegalResponse } from './geminiService';

interface SimpleChatModuleProps {
  title: string;
  subtitle: string;
  initialMessage: string;
  icon: React.ElementType;
  colorClass: string; // e.g., 'text-purple-600'
  iconBgClass: string; // e.g., 'bg-purple-600'
  officeProfile: any;
}

const SimpleChatModule: React.FC<SimpleChatModuleProps> = ({ 
  title, subtitle, initialMessage, icon: Icon, colorClass, iconBgClass, officeProfile 
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: MessageRole.MODEL,
      content: initialMessage,
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
  }, [messages]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        setAttachedFile({ name: file.name, data: base64Data, mimeType: file.type });
      };
      reader.readAsDataURL(file);
    }
  };

  const shareToWhatsApp = (text: string) => {
    const link = `https://wa.me/?text=${encodeURIComponent(`⚖️ *JusTech Premium - ${title}*\n\n` + text)}`;
    window.open(link, '_blank');
  };

  const exportToPDF = (content: string) => {
    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;
    const formattedContent = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
    
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

  const handleSend = async () => {
    if ((!input.trim() && !attachedFile) || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: MessageRole.USER,
      content: input + (attachedFile ? `\n\n[Arquivo Anexado: ${attachedFile.name}]` : ''),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const historyForApi = messages.map(m => ({ role: m.role, content: m.content }));
    historyForApi.push({ role: MessageRole.USER, content: userMsg.content });

    const aiMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: aiMsgId, role: MessageRole.MODEL, content: '', timestamp: new Date(), isStreaming: true }]);

    try {
      const contextFiles = attachedFile ? [{ data: attachedFile.data, mimeType: attachedFile.mimeType }] : [];
      let fullResponse = "";
      await streamLegalResponse(
        historyForApi,
        (chunk) => {
          fullResponse += chunk;
          setMessages(prev => prev.map(msg => msg.id === aiMsgId ? { ...msg, content: fullResponse } : msg));
        },
        contextFiles
      );
      setMessages(prev => prev.map(msg => msg.id === aiMsgId ? { ...msg, isStreaming: false } : msg));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setAttachedFile(null);
    }
  };

  const renderMessageContent = (content: string) => {
    return content.split('\n').map((line, idx) => {
      if (line.trim().startsWith('**') && line.trim().endsWith('**')) 
        return <h4 key={idx} className="font-bold text-legal-900 mt-4 mb-2">{line.replace(/\*\*/g, '')}</h4>;
      return <p key={idx} className="mb-2 text-gray-700 leading-relaxed whitespace-pre-wrap">{line}</p>;
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] md:ml-64 bg-slate-50">
      <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${iconBgClass} bg-opacity-20`}>
            <Icon className={`w-5 h-5 ${colorClass}`} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
            <p className="text-xs text-gray-500 flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>IA Especialista Ativa</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col relative">
        <div className="flex-1 overflow-y-auto p-6 space-y-6 legal-scroll pb-32">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === MessageRole.USER ? 'justify-end' : 'justify-start'}`}>
              {msg.role === MessageRole.MODEL && (
                <div className="w-8 h-8 rounded-full bg-legal-900 flex items-center justify-center mr-3 mt-1 shadow-md flex-shrink-0">
                  <Bot className="w-5 h-5 text-legal-gold" />
                </div>
              )}
              <div className="flex flex-col items-start max-w-3xl">
                <div className={`rounded-xl p-6 shadow-sm border w-full ${msg.role === MessageRole.USER ? 'bg-white border-gray-200 text-gray-800' : 'bg-white border-legal-gold/30'}`}>
                  {msg.role === MessageRole.USER ? <div className="whitespace-pre-wrap">{msg.content}</div> : 
                    <div className="text-sm">
                      {renderMessageContent(msg.content)}
                      {msg.isStreaming && <span className="inline-block w-2 h-4 bg-legal-gold ml-1 animate-pulse"></span>}
                    </div>}
                </div>
                {msg.role === MessageRole.MODEL && !msg.isStreaming && (
                    <div className="flex items-center space-x-2 mt-2 ml-1">
                      <button onClick={() => shareToWhatsApp(msg.content)} className="flex items-center text-xs font-medium text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-full transition-colors border border-green-200"><Share2 className="w-3 h-3 mr-1.5" />WhatsApp</button>
                      <button onClick={() => exportToPDF(msg.content)} className="flex items-center text-xs font-medium text-legal-900 hover:text-legal-700 bg-white hover:bg-gray-50 px-3 py-1.5 rounded-full transition-colors border border-legal-gold"><Printer className="w-3 h-3 mr-1.5" />Gerar PDF Timbrado</button>
                    </div>
                )}
              </div>
              {msg.role === MessageRole.USER && <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center ml-3 mt-1 flex-shrink-0"><User className="w-5 h-5 text-gray-600" /></div>}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 shadow-lg z-20">
          <div className="max-w-4xl mx-auto">
            {attachedFile && (
              <div className="flex items-center bg-gray-100 p-2 rounded-lg mb-2 w-fit border border-gray-200">
                <FileText className="w-4 h-4 text-legal-700 mr-2" />
                <span className="text-xs font-medium text-gray-700 truncate max-w-[200px]">{attachedFile.name}</span>
                <button onClick={() => setAttachedFile(null)} className="ml-2 text-gray-400 hover:text-red-500"><X className="w-4 h-4" /></button>
              </div>
            )}
            <div className="relative flex items-end bg-gray-50 border border-gray-300 rounded-xl focus-within:ring-2 focus-within:ring-legal-700/50 focus-within:border-legal-700 transition-all">
              <button onClick={() => fileInputRef.current?.click()} className="p-3 text-gray-400 hover:text-legal-700 transition-colors" title="Anexar Documento"><Paperclip className="w-5 h-5" /></button>
              <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.doc,.docx,.txt,image/*" onChange={handleFileUpload} />
              <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder="Digite sua dúvida ou peça jurídica..." className="w-full max-h-32 p-3 bg-transparent border-none focus:ring-0 resize-none text-gray-800 placeholder-gray-400 text-sm legal-scroll" rows={1} style={{minHeight: '48px'}} />
              <button onClick={handleSend} disabled={isLoading || (!input.trim() && !attachedFile)} className={`p-3 m-1 rounded-lg transition-all ${isLoading || (!input.trim() && !attachedFile) ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-legal-900 text-legal-gold hover:bg-legal-800 shadow-md'}`}><Send className="w-5 h-5" /></button>
            </div>
            <div className="mt-2 flex justify-between items-center px-1"><p className="text-[10px] text-gray-400 flex items-center"><AlertCircle className="w-3 h-3 mr-1" />A IA pode cometer erros. Verifique informações.</p><div className="text-[10px] text-gray-400">Processamento seguro (LGPD)</div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleChatModule;