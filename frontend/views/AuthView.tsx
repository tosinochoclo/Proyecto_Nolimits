import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { WindowFrame } from '../components/layout/WindowFrame';
import { useAuth } from '../context/AuthContext';
import { PixelIcon } from '../components/common/PixelIcon';

/**
 * Logotipo vectorial de Google oficial
 */
const GoogleLogoSvg: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24">
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
);

export const AuthView: React.FC = () => {
  const { login, register, loginWithGoogle, currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Determinar la vista activa según la ruta o parámetro (?mode=login | ?mode=register)
  const determineViewMode = (): 'portal' | 'login' | 'register' => {
    if (location.pathname === '/login' || searchParams.get('mode') === 'login') return 'login';
    if (location.pathname === '/register' || searchParams.get('mode') === 'register') return 'register';
    return 'portal';
  };

  const [viewMode, setViewMode] = useState<'portal' | 'login' | 'register'>(determineViewMode);

  // Estados del formulario
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sincronizar cuando cambia la URL
  useEffect(() => {
    setViewMode(determineViewMode());
    setErrorMessage(null);
  }, [location.pathname, searchParams]);

  const goToPortal = () => {
    setViewMode('portal');
    navigate('/auth');
    setErrorMessage(null);
  };

  const goToLogin = () => {
    setViewMode('login');
    navigate('/login');
    setErrorMessage(null);
  };

  const goToRegister = () => {
    setViewMode('register');
    navigate('/register');
    setErrorMessage(null);
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      await loginWithGoogle();
      setMessage('¡Autenticado con Google exitosamente!');
      setTimeout(() => navigate('/profile'), 600);
    } catch {
      setErrorMessage('No se pudo autenticar con Google. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!email) return;

    setLoading(true);
    try {
      await login(email, password);
      setMessage('¡Sesión iniciada con éxito!');
      setTimeout(() => navigate('/profile'), 600);
    } catch {
      setErrorMessage('Error al iniciar sesión. Verifique sus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!email) return;

    if (password && confirmPassword && password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden. Por favor verifíquelas.');
      return;
    }

    setLoading(true);
    try {
      await register(name || email.split('@')[0], email, password);
      setMessage('¡Cuenta creada exitosamente en NoLimits! Bienvenido.');
      setTimeout(() => navigate('/profile'), 600);
    } catch {
      setErrorMessage('Ocurrió un error al registrar la cuenta.');
    } finally {
      setLoading(false);
    }
  };

  // Si ya tiene una sesión iniciada
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

  /* =========================================================================
     CASO 1: FORMULARIO DE ACCESO (En su propia pantalla/página al presionar Iniciar Sesión)
     ========================================================================= */
  if (viewMode === 'login') {
    return (
      <div className="max-w-md mx-auto py-6 font-sans">
        <WindowFrame
          title="Formulario_de_Acceso.exe - [Iniciar Sesión Windows XP]"
          icon={<PixelIcon name="key" size={16} />}
          statusBarText="SEGURIDAD SSL 128-BITS // FORMULARIO TRADICIONAL DE ACCESO"
        >
          <div className="space-y-4">
            {/* Cabecera estilo Logon */}
            <div className="flex items-center gap-3 p-2 bg-[#f0f4f8] border border-gray-300">
              <div className="w-12 h-12 bg-blue-100 border border-blue-400 flex items-center justify-center text-2xl shrink-0">
                👤
              </div>
              <div>
                <div className="font-bold text-xs text-blue-900">
                  Formulario de Acceso a NoLimits
                </div>
                <div className="text-[11px] text-gray-600">
                  Ingrese su correo electrónico y contraseña registrados.
                </div>
              </div>
            </div>

            {/* Mensajes */}
            {message && (
              <div className="p-2 bg-green-100 border border-green-500 text-green-900 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-700 shrink-0" />
                <span>{message}</span>
              </div>
            )}
            {errorMessage && (
              <div className="p-2 bg-red-100 border border-red-500 text-red-900 text-xs flex items-center gap-2">
                <PixelIcon name="error" size={15} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Formulario Tradicional de Acceso */}
            <form onSubmit={handleLoginSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Correo Electrónico:
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@correo.cl"
                  className="winxp-input w-full text-xs py-1"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Contraseña de Acceso:
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="winxp-input w-full text-xs py-1"
                />
              </div>

              <div className="pt-2">
                {/* Botón rojo con texto blanco garantizado */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-auth-login w-full font-bold py-2.5 px-4 rounded-xs text-sm shadow-xs transition-colors cursor-pointer text-center block"
                  style={{
                    backgroundColor: '#d6001c',
                    color: '#ffffff',
                  }}
                >
                  <span style={{ color: '#ffffff' }}>
                    {loading ? 'Validando credenciales...' : 'Iniciar sesión'}
                  </span>
                </button>
              </div>
            </form>

            {/* Navegación y enlace inferior */}
            <div className="pt-3 border-t border-gray-300 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={goToPortal}
                className="winxp-button text-xs py-1 px-2.5 text-gray-800"
              >
                <span>← Volver a opciones</span>
              </button>
              <button
                type="button"
                onClick={goToRegister}
                className="text-blue-700 hover:underline font-bold"
              >
                ¿Aún no estás registrado?
              </button>
            </div>
          </div>
        </WindowFrame>
      </div>
    );
  }

  /* =========================================================================
     CASO 2: FORMULARIO DE REGISTRO (En su propia pantalla/página al presionar ¡Regístrate ahora!)
     ========================================================================= */
  if (viewMode === 'register') {
    return (
      <div className="max-w-md mx-auto py-6 font-sans">
        <WindowFrame
          title="Registro_Usuario.exe - [Crear Cuenta Windows XP]"
          icon={<PixelIcon name="register" size={16} />}
          statusBarText="SEGURIDAD SSL 128-BITS // REGISTRO OFICIAL NOLIMITS"
        >
          <div className="space-y-4">
            {/* Cabecera estilo Logon */}
            <div className="flex items-center gap-3 p-2 bg-[#f0f4f8] border border-gray-300">
              <div className="w-12 h-12 bg-blue-100 border border-blue-400 flex items-center justify-center text-2xl shrink-0">
                👤
              </div>
              <div>
                <div className="font-bold text-xs text-blue-900">
                  Formulario de Registro de Usuario
                </div>
                <div className="text-[11px] text-gray-600">
                  Cree una cuenta para acumular Cyber Points y gestionar sus envíos.
                </div>
              </div>
            </div>

            {/* Mensajes */}
            {message && (
              <div className="p-2 bg-green-100 border border-green-500 text-green-900 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-700 shrink-0" />
                <span>{message}</span>
              </div>
            )}
            {errorMessage && (
              <div className="p-2 bg-red-100 border border-red-500 text-red-900 text-xs flex items-center gap-2">
                <PixelIcon name="error" size={15} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Formulario Tradicional de Registro */}
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Nombre Completo:
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Martín González"
                  className="winxp-input w-full text-xs py-1"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Correo Electrónico:
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@correo.cl"
                  className="winxp-input w-full text-xs py-1"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Contraseña de Acceso:
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="winxp-input w-full text-xs py-1"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Confirmar Contraseña:
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="winxp-input w-full text-xs py-1"
                />
              </div>

              <div className="pt-2">
                {/* Botón plomo más claro con texto blanco garantizado */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-auth-register w-full font-bold py-2.5 px-4 rounded-xs text-sm shadow-xs transition-colors cursor-pointer text-center block"
                  style={{
                    backgroundColor: '#7e8590',
                    color: '#ffffff',
                  }}
                >
                  <span style={{ color: '#ffffff' }}>
                    {loading ? 'Creando cuenta...' : '¡Regístrate ahora!'}
                  </span>
                </button>
              </div>
            </form>

            {/* Navegación y enlace inferior */}
            <div className="pt-3 border-t border-gray-300 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={goToPortal}
                className="winxp-button text-xs py-1 px-2.5 text-gray-800"
              >
                <span>← Volver a opciones</span>
              </button>
              <button
                type="button"
                onClick={goToLogin}
                className="text-blue-700 hover:underline font-bold"
              >
                ¿Ya tienes cuenta? Iniciar sesión aquí
              </button>
            </div>
          </div>
        </WindowFrame>
      </div>
    );
  }

  /* =========================================================================
     CASO 3: PÁGINA PORTAL DE ACCESO Y REGISTRO (Pantalla principal con los botones ordenados)
     ========================================================================= */
  return (
    <div className="max-w-md mx-auto py-6 font-sans">
      <WindowFrame
        title="Iniciar_Sesion.exe - [Windows XP Logon]"
        icon={<PixelIcon name="key" size={16} />}
        statusBarText="SEGURIDAD SSL 128-BITS // AUTENTICACIÓN OFICIAL NOLIMITS"
      >
        <div className="space-y-4">
          {/* Cabecera estilo Logon de Windows XP */}
          <div className="flex items-center gap-3 p-2 bg-[#f0f4f8] border border-gray-300">
            <div className="w-12 h-12 bg-blue-100 border border-blue-400 flex items-center justify-center text-2xl shrink-0">
              👤
            </div>
            <div>
              <div className="font-bold text-xs text-blue-900">
                Para comenzar, inicie su sesión
              </div>
              <div className="text-[11px] text-gray-600">
                Acceso a historial de pedidos, cupones y seguimiento de envíos.
              </div>
            </div>
          </div>

          {/* Mensajes de feedback */}
          {message && (
            <div className="p-2 bg-green-100 border border-green-500 text-green-900 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-700 shrink-0" />
              <span>{message}</span>
            </div>
          )}
          {errorMessage && (
            <div className="p-2 bg-red-100 border border-red-500 text-red-900 text-xs flex items-center gap-2">
              <PixelIcon name="error" size={15} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Bloque de Acciones Principales con Orden Intercambiado y Textos Blancos */}
          <div className="space-y-3.5 bg-[#f7f9fa] p-3.5 border border-gray-300 winxp-bevel-in">
            {/* 1. Botón "Continuar con Google" con borde negro fino, texto en negrita y perfectamente centrado */}
            <div>
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={loading}
                className="btn-auth-google relative w-full h-11 flex items-center justify-center rounded-xs shadow-xs text-white overflow-hidden transition-colors cursor-pointer group"
                style={{
                  backgroundColor: '#0078d4',
                  border: '1px solid #000000',
                  color: '#ffffff',
                }}
                title="Iniciar sesión directamente con Google"
              >
                {/* Logotipo en recuadro blanco fijado al lateral izquierdo */}
                <div className="absolute left-0 top-0 bottom-0 w-11 bg-white flex items-center justify-center border-r border-black shrink-0">
                  <GoogleLogoSvg className="w-5 h-5 transition-transform group-hover:scale-105" />
                </div>

                {/* Texto en negrita alineado exactamente al medio del botón */}
                <span
                  className="font-bold text-sm tracking-wide text-center px-12"
                  style={{
                    color: '#ffffff',
                    fontWeight: 'bold',
                  }}
                >
                  Continuar con Google
                </span>
              </button>
            </div>

            {/* 2. Botón "Iniciar Sesión" (Rojo) intercambiado al lugar superior:
                   Al hacer clic, abre el Formulario de Acceso en otra página */}
            <div className="pt-1">
              <button
                type="button"
                onClick={goToLogin}
                className="btn-auth-login w-full font-bold py-2.5 px-4 rounded-xs text-sm shadow-xs transition-colors cursor-pointer text-center block"
                style={{
                  backgroundColor: '#d6001c',
                  color: '#ffffff',
                }}
                title="Abrir formulario tradicional para Iniciar Sesión"
              >
                <span style={{ color: '#ffffff' }}>Iniciar sesión</span>
              </button>
            </div>

            {/* 3. Botón "¡Regístrate ahora!" intercambiado al lugar inferior con color plomo más claro */}
            <div className="pt-2 border-t border-gray-200 space-y-1.5 text-center">
              <p className="text-xs text-gray-700 font-medium">
                ¿Aún no estas registrado?
              </p>
              <button
                type="button"
                onClick={goToRegister}
                className="btn-auth-register w-full font-bold py-2.5 px-4 rounded-xs text-sm shadow-xs transition-colors cursor-pointer text-center block"
                style={{
                  backgroundColor: '#7e8590',
                  color: '#ffffff',
                }}
                title="Abrir formulario para Crear Nueva Cuenta"
              >
                <span style={{ color: '#ffffff' }}>¡Regístrate ahora!</span>
              </button>
            </div>
          </div>
        </div>
      </WindowFrame>
    </div>
  );
};
