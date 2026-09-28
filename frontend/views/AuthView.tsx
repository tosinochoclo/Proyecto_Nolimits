import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, User as UserIcon, CheckCircle2 } from 'lucide-react';
import { WindowFrame } from '../components/layout/WindowFrame';
import { useAuth } from '../context/AuthContext';
import { PixelIcon } from '../components/common/PixelIcon';

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
      setTimeout(() => navigate('/profile'), 500);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      setMessage('¡Autenticado con Google OAuth exitosamente!');
      setTimeout(() => navigate('/profile'), 500);
    } finally {
      setLoading(false);
    }
  };

  if (currentUser.role !== 'guest') {
    return (
      <div className="max-w-md mx-auto py-8 font-sans">
        <WindowFrame
          title="Sesion_Activa.exe - [Usuario Conectado]"
          icon={<PixelIcon name="windows-flag" size={16} />}
          statusBarText={`USUARIO: ${currentUser.email} // ROL: ${currentUser.role}`}
        >
          <div className="text-center py-6 space-y-3">
            <div className="w-16 h-16 rounded-sm border-2 border-gray-400 bg-amber-100 mx-auto flex items-center justify-center text-3xl shadow-md">
              🦆
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Sesión Iniciada en Windows XP
              </h2>
              <p className="text-sm text-blue-900 font-bold">{currentUser.name}</p>
              <p className="text-xs text-gray-600">{currentUser.email}</p>
            </div>

            <div className="flex justify-center gap-2 pt-3">
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="winxp-button winxp-button-primary text-xs py-1.5 px-4 font-bold text-blue-900"
              >
                <span>Ir a Mi Perfil</span>
              </button>
              <button
                type="button"
                onClick={logout}
                className="winxp-button text-xs py-1.5 px-3 text-red-800"
              >
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </WindowFrame>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-6 font-sans">
      <WindowFrame
        title="Iniciar_Sesion.exe - [Windows XP Logon]"
        icon={<PixelIcon name="key" size={16} />}
        statusBarText="SEGURIDAD SSL 128-BITS // CUENTA DE USUARIO"
      >
        <div className="space-y-4">
          {/* Cabecera estilo Logon de Windows XP */}
          <div className="flex items-center gap-3 p-2 bg-[#f0f4f8] border border-gray-300">
            <div className="w-12 h-12 bg-blue-100 border border-blue-400 flex items-center justify-center text-2xl shrink-0">
              👤
            </div>
            <div>
              <div className="font-bold text-xs text-blue-900">
                {isRegisterMode ? 'Crear Nueva Cuenta en NoLimits' : 'Para comenzar, inicie su sesión'}
              </div>
              <div className="text-[11px] text-gray-600">
                Acceso a historial de pedidos, cupones y seguimiento de envíos.
              </div>
            </div>
          </div>

          {message && (
            <div className="p-2 bg-green-100 border border-green-500 text-green-900 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-700 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {/* Formulario de Login / Registro */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {isRegisterMode && (
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Nombre Completo:
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Martín González"
                    className="winxp-input w-full text-xs py-1"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Correo Electrónico:
              </label>
              <div className="flex items-center">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@correo.cl"
                  className="winxp-input w-full text-xs py-1"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Contraseña de Acceso:
              </label>
              <div className="flex items-center">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="winxp-input w-full text-xs py-1"
                />
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="submit"
                disabled={loading}
                className="winxp-button winxp-button-primary text-xs py-1.5 w-full font-bold text-blue-900"
              >
                <span>{loading ? 'Validando credenciales...' : isRegisterMode ? 'Registrar Cuenta' : 'Entrar a Windows XP'}</span>
              </button>

              <button
                type="button"
                onClick={handleGoogleAuth}
                className="winxp-button text-xs py-1.5 w-full text-gray-800"
              >
                <span>Continuar con Google Workspace</span>
              </button>
            </div>
          </form>

          {/* Toggle entre Iniciar sesión y Registro */}
          <div className="pt-2 border-t border-gray-300 text-center text-xs">
            <button
              type="button"
              onClick={() => setIsRegisterMode(!isRegisterMode)}
              className="text-blue-700 hover:underline font-bold"
            >
              {isRegisterMode
                ? '¿Ya tienes una cuenta? Iniciar Sesión aquí'
                : '¿No tienes cuenta? Regístrate en 30 segundos'}
            </button>
          </div>
        </div>
      </WindowFrame>
    </div>
  );
};
