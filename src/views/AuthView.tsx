import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, User as UserIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import { WindowFrame } from '../components/layout/WindowFrame';
import { PixelButton } from '../components/common/PixelButton';
import { useAuth } from '../context/AuthContext';

export const AuthView: React.FC = () => {
  const { login, loginWithGoogle, currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await login(email, password);
      setMessage('¡Sesión iniciada con éxito!');
      setTimeout(() => navigate('/profile'), 600);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      setMessage('¡Autenticado con Google OAuth exitosamente!');
      setTimeout(() => navigate('/profile'), 600);
    } finally {
      setLoading(false);
    }
  };

  if (currentUser.role !== 'guest') {
    return (
      <div className="max-w-md mx-auto py-8">
        <WindowFrame
          title="AUTH_SESSION_ACTIVE.EXE - [Sesión Iniciada]"
          variant="lavender"
          statusBarText={`USUARIO: ${currentUser.email} // ROL: ${currentUser.role}`}
        >
          <div className="text-center py-6 space-y-4">
            <div className="inline-flex p-3 rounded-full bg-[#ff007f]/20 border border-[#ff007f] text-[#ff007f]">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h2 className="font-['Silkscreen'] text-base text-white">SESIÓN ACTIVA</h2>
              <p className="font-['Chakra_Petch'] text-sm text-[#00d4ff] font-bold">{currentUser.name}</p>
              <p className="font-['VT323'] text-sm text-slate-400">{currentUser.email}</p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <PixelButton variant="primary" onClick={() => navigate('/profile')}>
                Ir a Mi Perfil
              </PixelButton>
              <PixelButton variant="retro" onClick={logout}>
                Cerrar Sesión
              </PixelButton>
            </div>
          </div>
        </WindowFrame>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-6">
      <WindowFrame
        title="AUTH_PORTAL.SYS - [Acceso Clientes No Limits]"
        variant="lavender"
        statusBarText="PROTOCOLO JWT ACTIVO // SSL ENCRIPTADO"
      >
        <div className="space-y-4">
          <div className="text-center space-y-1">
            <h2 className="font-['Silkscreen'] text-sm sm:text-base text-white">
              {isRegisterMode ? 'REGISTRO DE NUEVO CLIENTE' : 'INICIAR SESIÓN'}
            </h2>
            <p className="font-['Chakra_Petch'] text-xs text-slate-300">
              Guarda tus pedidos, acumula puntos por compra y accede a drops exclusivos antes de los lives.
            </p>
          </div>

          {/* Quick Google OAuth Button (mitigates digital divide) */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full bevel-raised bg-white text-slate-800 p-2.5 flex items-center justify-center gap-3 font-['Chakra_Petch'] font-bold text-sm hover:bg-slate-100 transition-all select-none cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continuar con Google (1 Clic)</span>
          </button>

          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-[#3b2b52] w-full"></div>
            <span className="bg-[#0e0c16] px-2 font-['VT323'] text-xs text-slate-400 uppercase">
              o formulario tradicional
            </span>
          </div>

          {/* Traditional Form */}
          <form onSubmit={handleSubmit} className="space-y-3 font-['Chakra_Petch'] text-xs">
            {isRegisterMode && (
              <div className="space-y-1">
                <label className="text-slate-300">Nombre Completo:</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Sebastián Valdés"
                  className="w-full bevel-sunken p-2 bg-black text-white focus:outline-none focus:border-[#ff007f]"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-slate-300">Correo Electrónico:</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu.correo@ejemplo.cl"
                className="w-full bevel-sunken p-2 bg-black text-white focus:outline-none focus:border-[#ff007f]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300">Contraseña:</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bevel-sunken p-2 bg-black text-white focus:outline-none focus:border-[#ff007f]"
              />
            </div>

            {message && (
              <div className="p-2 bevel-sunken bg-green-950/60 border border-green-500 text-green-300 text-[11px] text-center font-['Silkscreen']">
                {message}
              </div>
            )}

            <PixelButton
              variant="primary"
              size="md"
              type="submit"
              disabled={loading}
              className="w-full text-xs py-2 mt-2"
            >
              {isRegisterMode ? 'CREAR CUENTA' : 'INGRESAR'}
            </PixelButton>
          </form>

          {/* Toggle Register / Login */}
          <div className="pt-2 border-t border-[#30214a] text-center font-['Chakra_Petch'] text-xs text-slate-400">
            {isRegisterMode ? (
              <span>
                ¿Ya tienes una cuenta?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegisterMode(false)}
                  className="text-[#00d4ff] hover:underline font-bold"
                >
                  Inicia sesión aquí
                </button>
              </span>
            ) : (
              <span>
                ¿Eres nuevo en No Limits?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegisterMode(true)}
                  className="text-[#ff007f] hover:underline font-bold"
                >
                  Regístrate aquí
                </button>
              </span>
            )}
          </div>
        </div>
      </WindowFrame>
    </div>
  );
};
