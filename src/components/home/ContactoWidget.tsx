import React, { useState } from 'react';
import { Mail, MessageSquare, Phone, Instagram, Send, CheckCircle2 } from 'lucide-react';
import { WindowFrame } from '../layout/WindowFrame';
import { PixelButton } from '../common/PixelButton';

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
      variant="lavender"
      showControls={true}
      onClose={onClose}
      statusBarText="SOCKET: WHATSAPP DIRECT // RESPUESTA PROMEDIO: 4 MINUTOS"
      className={`max-w-md ${className}`}
    >
      <div className="space-y-3 font-['Chakra_Petch'] text-xs">
        {/* Quick Social & Chat Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <a
            href="https://wa.me/56991234567"
            target="_blank"
            rel="noopener noreferrer"
            className="bevel-raised bg-[#0d2a1b] hover:bg-[#133e28] text-green-300 p-2 flex items-center gap-2 border border-green-500/50 transition-colors"
          >
            <Phone className="w-4 h-4 text-green-400 shrink-0" />
            <div>
              <div className="font-['Silkscreen'] text-[10px] text-white">WHATSAPP LIVE</div>
              <div className="font-mono text-[9px] text-green-400">+56 9 9123 4567</div>
            </div>
          </a>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bevel-raised bg-[#280c20] hover:bg-[#3d1231] text-[#ff77b8] p-2 flex items-center gap-2 border border-[#ff007f]/50 transition-colors"
          >
            <Instagram className="w-4 h-4 text-[#ff007f] shrink-0" />
            <div>
              <div className="font-['Silkscreen'] text-[10px] text-white">INSTAGRAM</div>
              <div className="font-mono text-[9px] text-[#ff77b8]">@nolimits.cl</div>
            </div>
          </a>
        </div>

        {/* Message Form */}
        <form onSubmit={handleSubmit} className="bevel-chrome p-3 bg-[#0d0918] space-y-2">
          <div className="font-['Silkscreen'] text-[10px] text-white flex items-center gap-1.5 pb-1 border-b border-[#2d1e44]">
            <MessageSquare className="w-3.5 h-3.5 text-[#00d4ff]" />
            <span>ENVÍO DIRECTO AL STREAMER / CONSERJERÍA</span>
          </div>

          {sent ? (
            <div className="p-3 bevel-sunken bg-green-950/80 text-center space-y-1">
              <CheckCircle2 className="w-6 h-6 text-green-400 mx-auto" />
              <div className="font-['Silkscreen'] text-[11px] text-white">¡MENSAJE ENVIADO!</div>
              <p className="text-[10px] text-slate-300">
                El equipo de No Limits responderá a tu correo o WhatsApp a la brevedad.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Tu Nombre / Alias"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bevel-sunken p-1.5 bg-black text-white focus:outline-none"
                />
                <input
                  type="email"
                  required
                  placeholder="tu.correo@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bevel-sunken p-1.5 bg-black text-white focus:outline-none"
                />
              </div>

              <textarea
                required
                rows={2}
                placeholder="Consulta sobre tallas, reservas en directo o despacho..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bevel-sunken p-1.5 bg-black text-white focus:outline-none"
              />

              <PixelButton
                variant="primary"
                size="sm"
                type="submit"
                className="w-full text-[11px] py-1.5"
                icon={<Send className="w-3 h-3" />}
              >
                Enviar Mensaje Instantáneo
              </PixelButton>
            </>
          )}
        </form>
      </div>
    </WindowFrame>
  );
};
