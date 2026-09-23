import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { WindowFrame } from '../components/layout/WindowFrame';
import { PixelButton } from '../components/common/PixelButton';
import { AlertOctagon, ShieldAlert, CornerUpLeft } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { currentRole, setRole } = useAuth();

  const isAuthorized = allowedRoles.includes(currentRole);

  if (!isAuthorized) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <WindowFrame
          title="SECURITY_EXCEPTION.SYS - [Acceso Restringido]"
          variant="chrome"
          statusBarText="ERROR 403: PRIVILEGIOS INSUFICIENTES // ACCESS_DENIED"
        >
          <div className="text-center py-6 space-y-4">
            <div className="inline-flex p-3 rounded-full bg-red-950/60 border-2 border-red-500 text-red-400">
              <ShieldAlert className="w-12 h-12" />
            </div>

            <div className="space-y-1">
              <h2 className="font-['Silkscreen'] text-lg text-white font-bold">
                ACCESO DENEGADO (CODIGO 0x00000403)
              </h2>
              <p className="font-['Chakra_Petch'] text-sm text-slate-300 max-w-md mx-auto">
                Tu rol actual es <span className="text-[#ff007f] font-mono font-bold">[{currentRole.toUpperCase()}]</span>. Esta sección requiere credenciales autorizadas ({allowedRoles.join(', ')}).
              </p>
            </div>

            <div className="bevel-sunken p-3 text-left font-['VT323'] text-sm text-red-300 max-w-md mx-auto space-y-1">
              <div>// SUB-KERNEL PERMISSION CHECK: FAILED</div>
              <div>// SUCURSAL ISOLATION POLICY: ACTIVE</div>
              <div>// CONTACTA AL SUPER ADMINISTRADOR O CAMBIA DE ROL</div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              <PixelButton
                variant="primary"
                onClick={() => setRole('super_admin')}
                icon={<AlertOctagon className="w-4 h-4" />}
              >
                Elevar a Super Admin
              </PixelButton>

              <PixelButton
                variant="retro"
                onClick={() => setRole('branch_admin')}
              >
                Elevar a Admin Sucursal
              </PixelButton>

              <PixelButton
                variant="accent"
                onClick={() => window.location.href = '#/'}
                icon={<CornerUpLeft className="w-4 h-4" />}
              >
                Volver a la Tienda
              </PixelButton>
            </div>
          </div>
        </WindowFrame>
      </div>
    );
  }

  return <>{children}</>;
};
