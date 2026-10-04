import React, { useState } from 'react';
import { Mail, MessageSquare, Phone, Instagram, Send, CheckCircle2 } from 'lucide-react';
import { WindowFrame } from '../layout/WindowFrame';
import { PixelIcon } from '../common/PixelIcon';

interface ContactoWidgetProps {
  onClose?: () => void;
  className?: string;
}

export const ContactoWidget: React.FC<ContactoWidgetProps> = ({
  onClose,
  className = ''
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;
    setSent(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
      setSent(false);
    }, 4000);
  };

  return (
    <WindowFrame
      title="CONTACTO_DIRECTO.MSG - [Mesa de Ayuda & WhatsApp]"
      icon={<PixelIcon name="whatsapp" size={16} />}
      showControls={true}
      onClose={onClose}
      statusBarText="CANAL DE CONTACTO DIRECTO // RESPUESTA PROMEDIO: 4 MINUTOS"
      className={`max-w-md ${className}`}
    >
      <div className="space-y-3 font-sans text-xs text-gray-900">
        {/* Enlaces Rápidos WhatsApp e Instagram */}
        <div className="grid grid-cols-2 gap-2">
          <a
            href="https://wa.me/56991234567"
            target="_blank"
            rel="noopener noreferrer"
            className="winxp-button p-2 flex items-center gap-2 border border-green-600 bg-green-50 hover:bg-green-100 text-green-900"
          >
            <Phone className="w-4 h-4 text-green-700 shrink-0" />
            <div className="text-left">
              <div className="font-bold text-[11px]">WHATSAPP LIVE</div>
              <div className="font-mono text-[10px] text-green-800">+56 9 9123 4567</div>
            </div>
          </a>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="winxp-button p-2 flex items-center gap-2 border border-blue-400 bg-blue-50 hover:bg-blue-100 text-blue-900"
          >
            <Instagram className="w-4 h-4 text-blue-700 shrink-0" />
            <div className="text-left">
              <div className="font-bold text-[11px]">INSTAGRAM</div>
              <div className="font-mono text-[10px] text-blue-800">@nolimits.cl</div>
            </div>
          </a>
        </div>

        {/* Formulario de Mensaje */}
        <form onSubmit={handleSubmit} className="bg-[#f8fafc] border border-gray-300 p-3 space-y-2">
          <div className="font-bold text-xs text-[#003c74] flex items-center gap-1.5 pb-1 border-b border-gray-200">
            <MessageSquare className="w-3.5 h-3.5 text-blue-700" />
            <span>ENVÍO DIRECTO AL STREAMER / CONSERJERÍA</span>
          </div>

          {sent ? (
            <div className="p-3 bg-green-100 border border-green-400 text-center space-y-1 text-green-900">
              <CheckCircle2 className="w-6 h-6 text-green-700 mx-auto" />
              <div className="font-bold text-xs">¡Mensaje Enviado con Éxito!</div>
              <p className="text-[11px] text-green-800">Un asistente de NoLimits responderá a tu correo en breve.</p>
            </div>
          ) : (
            <>
              <div>
                <input
                  type="text"
                  required
                  placeholder="Tu Nombre o Apodo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full winxp-input text-xs py-1"
                />
              </div>

              <div>
                <input
                  type="email"
                  required
                  placeholder="correo@ejemplo.cl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full winxp-input text-xs py-1"
                />
              </div>

              <div>
                <textarea
                  rows={3}
                  required
                  placeholder="Escribe tu consulta sobre stock, reservas o despacho..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full winxp-input text-xs py-1"
                />
              </div>

              <button
                type="submit"
                className="winxp-button winxp-button-primary text-xs py-1.5 w-full font-bold text-blue-900"
              >
                <Send className="w-3 h-3 text-blue-700 inline mr-1" />
                <span>Enviar Consulta Ahora</span>
              </button>
            </>
          )}
        </form>
      </div>
    </WindowFrame>
  );
};
