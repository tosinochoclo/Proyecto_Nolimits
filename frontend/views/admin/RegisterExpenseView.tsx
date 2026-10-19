import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Receipt,
  DollarSign,
  Calendar,
  Layers,
  FileText,
  ArrowLeft,
  CheckCircle2,
  Trash2,
  Store,
  PlusCircle,
  TrendingDown,
  Building2,
  AlertCircle
} from 'lucide-react';
import { WindowFrame } from '../../components/layout/WindowFrame';
import { PixelIcon } from '../../components/common/PixelIcon';
import { INITIAL_PRODUCTS, INITIAL_BRANCHES } from '../../services/mockData';
import { useAuth } from '../../context/AuthContext';

export interface ExpenseRecord {
  id: string;
  folio: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  branchId: string;
  branchName: string;
  paymentMethod: string;
  registeredBy: string;
  createdAt: string;
}

const DEFAULT_INITIAL_EXPENSES: ExpenseRecord[] = [
  {
    id: 'exp_01',
    folio: 'GST-2026-081',
    description: 'Compra de tela algodón pesado 480 GSM para Hoodies Cyber',
    amount: 1450000,
    category: 'Compra a Proveedor',
    date: '2026-10-18',
    branchId: 'central',
    branchName: 'Casa Matriz / Central',
    paymentMethod: 'Transferencia Bancaria',
    registeredBy: 'Root Administrator',
    createdAt: '2026-10-18T10:30:00'
  },
  {
    id: 'exp_02',
    folio: 'GST-2026-082',
    description: 'Pago de suministro eléctrico y fibra óptica sucursal Viña',
    amount: 185900,
    category: 'Servicios',
    date: '2026-10-17',
    branchId: 'vina_del_mar',
    branchName: 'Viña del Mar',
    paymentMethod: 'Tarjeta Corporativa',
    registeredBy: 'Sebastián Valdés',
    createdAt: '2026-10-17T15:20:00'
  },
  {
    id: 'exp_03',
    folio: 'GST-2026-083',
    description: 'Herrajes cromados y cierres metálicos dobles para Cargos',
    amount: 320000,
    category: 'Pantalones & Cargos',
    date: '2026-10-16',
    branchId: 'valparaiso',
    branchName: 'Valparaíso',
    paymentMethod: 'Transferencia Bancaria',
    registeredBy: 'Camila Rojas',
    createdAt: '2026-10-16T12:00:00'
  },
  {
    id: 'exp_04',
    folio: 'GST-2026-084',
    description: 'Mantenimiento preventivo aire acondicionado y POS transbank',
    amount: 95000,
    category: 'Servicios',
    date: '2026-10-15',
    branchId: 'quilpue',
    branchName: 'Quilpué',
    paymentMethod: 'Caja Chica',
    registeredBy: 'Martín Araya',
    createdAt: '2026-10-15T09:45:00'
  },
  {
    id: 'exp_05',
    folio: 'GST-2026-085',
    description: 'Reposición de cajas térmicas serigrafiadas Y2K para packaging',
    amount: 240000,
    category: 'Compra a Proveedor',
    date: '2026-10-14',
    branchId: 'vina_del_mar',
    branchName: 'Viña del Mar',
    paymentMethod: 'Transferencia Bancaria',
    registeredBy: 'Root Administrator',
    createdAt: '2026-10-14T17:10:00'
  }
];

export const RegisterExpenseView: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // 1. Obtener lista de categorías basadas en productos existentes + categorías extras
  const categoryOptions = useMemo(() => {
    const productCategories = Array.from(
      new Set(INITIAL_PRODUCTS.map((p) => p.category).filter(Boolean))
    );

    // Categorías extra solicitadas específicamente por el usuario:
    const extraCategories = ['Servicios', 'Compra a Proveedor'];

    // Unir sin duplicados
    const combined = Array.from(new Set([...productCategories, ...extraCategories]));
    return combined.sort();
  }, []);

  // Estado del formulario
  const [description, setDescription] = useState<string>('');
  const [rawAmount, setRawAmount] = useState<string>(''); // Valor numérico en string
  const [formattedAmount, setFormattedAmount] = useState<string>(''); // Con auto-separador
  const [category, setCategory] = useState<string>('Compra a Proveedor');
  const [date, setDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [branchId, setBranchId] = useState<string>('central');
  const [paymentMethod, setPaymentMethod] = useState<string>('Transferencia Bancaria');

  // Estado de mensajes y confirmación
  const [successDialog, setSuccessDialog] = useState<boolean>(false);
  const [lastRegisteredFolio, setLastRegisteredFolio] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Historial de gastos persistido en localStorage
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() => {
    try {
      const saved = localStorage.getItem('nolimits_expenses_records');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignorar fallback
    }
    return DEFAULT_INITIAL_EXPENSES;
  });

  // Guardar en localStorage cada vez que cambien los gastos
  useEffect(() => {
    try {
      localStorage.setItem('nolimits_expenses_records', JSON.stringify(expenses));
    } catch (e) {
      console.error('Error saving expenses to localStorage', e);
    }
  }, [expenses]);

  // Manejador del campo numérico con auto-separador de miles (formato chileno)
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    // Extraer únicamente los dígitos numéricos
    const numericOnly = inputVal.replace(/\D/g, '');

    if (!numericOnly) {
      setRawAmount('');
      setFormattedAmount('');
      return;
    }

    const num = parseInt(numericOnly, 10);
    setRawAmount(numericOnly);
    // Auto-separador de miles con puntos (formato es-CL)
    setFormattedAmount(num.toLocaleString('es-CL'));
    setErrorMsg('');
  };

  // Manejar envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim()) {
      setErrorMsg('Debe ingresar una descripción del gasto.');
      return;
    }

    const numAmount = parseInt(rawAmount, 10);
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMsg('Debe ingresar un monto válido mayor a 0 para el dinero gastado.');
      return;
    }

    if (!category) {
      setErrorMsg('Debe seleccionar una categoría para el gasto.');
      return;
    }

    if (!date) {
      setErrorMsg('Debe seleccionar una fecha para el gasto.');
      return;
    }

    // Determinar nombre de sucursal
    const branchName =
      branchId === 'central'
        ? 'Casa Matriz / Central'
        : INITIAL_BRANCHES.find((b) => b.id === branchId)?.city || 'Sucursal';

    // Generar nuevo folio y registro
    const nextFolioNumber = expenses.length + 86;
    const newFolio = `GST-2026-${String(nextFolioNumber).padStart(3, '0')}`;

    const newExpense: ExpenseRecord = {
      id: `exp_${Date.now()}`,
      folio: newFolio,
      description: description.trim(),
      amount: numAmount,
      category,
      date,
      branchId,
      branchName,
      paymentMethod,
      registeredBy: currentUser.name || 'Root Administrator',
      createdAt: new Date().toISOString()
    };

    setExpenses([newExpense, ...expenses]);
    setLastRegisteredFolio(newFolio);
    setSuccessDialog(true);

    // Limpiar campos para el siguiente registro
    setDescription('');
    setRawAmount('');
    setFormattedAmount('');
    setErrorMsg('');
  };

  // Eliminar un gasto
  const handleDeleteExpense = (id: string) => {
    if (window.confirm('¿Desea eliminar este registro de gasto del sistema?')) {
      setExpenses(expenses.filter((exp) => exp.id !== id));
    }
  };

  // Métricas acumuladas
  const totalSpent = useMemo(() => {
    return expenses.reduce((acc, exp) => acc + exp.amount, 0);
  }, [expenses]);

  const maxExpense = useMemo(() => {
    if (expenses.length === 0) return 0;
    return Math.max(...expenses.map((e) => e.amount));
  }, [expenses]);

  return (
    <div className="space-y-4 font-sans text-gray-900 pb-16">
      <WindowFrame
        title="SUPER_ROOT_EXPENSES.SYS - [Módulo de Registro de Gastos & Egresos]"
        icon={<PixelIcon name="notepad" size={16} />}
        statusBarText={`AUDITORÍA SUPER ADMIN // REGISTRO DE GASTOS // CATEGORÍAS DISPONIBLES: ${categoryOptions.length} // TOTAL REGISTRADO: $${totalSpent.toLocaleString('es-CL')} CLP`}
      >
        <div className="space-y-4">
          {/* Cabecera y Navegación Superior */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-300 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Link to="/admin/inventory">
                  <button
                    type="button"
                    className="winxp-button text-xs py-1 px-2.5 text-gray-800 flex items-center gap-1 font-semibold"
                    title="Regresar a Gestión de Inventario"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-green-700" />
                    <span>Inventario</span>
                  </button>
                </Link>

                <span className="bg-red-700 text-white text-[10px] font-black px-1.5 py-0.5 rounded-xs tracking-wider uppercase">
                  FINANZAS & EGRESOS
                </span>

                <h2 className="text-sm font-extrabold text-[#003c74] uppercase tracking-wide">
                  Registrar Gasto del Sistema
                </h2>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Ingreso de egresos operativos, servicios, compra a proveedores y suministros por sucursal con auto-separador de miles.
              </p>
            </div>

            {/* Accesos rápidos */}
            <div className="flex items-center gap-2">
              <Link to="/admin/top10">
                <button
                  type="button"
                  className="winxp-button text-xs py-1 px-3 text-blue-900 font-bold flex items-center gap-1"
                >
                  <PixelIcon name="floppy" size={14} />
                  <span>Ver Top 10</span>
                </button>
              </Link>

              <Link to="/admin">
                <button
                  type="button"
                  className="winxp-button text-xs py-1 px-2.5 text-gray-800"
                >
                  Dashboard Root
                </button>
              </Link>
            </div>
          </div>

          {/* Tarjetas KPI de Gastos */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white border border-[#7f9db9] p-3 shadow-xs">
              <div className="text-xs font-bold text-red-900 flex items-center justify-between">
                <span>TOTAL GASTOS REGISTRADOS</span>
                <TrendingDown className="w-4 h-4 text-red-600" />
              </div>
              <div className="text-2xl font-black text-red-700 mt-1 font-mono">
                ${totalSpent.toLocaleString('es-CL')}
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5">
                {expenses.length} egresos contabilizados
              </div>
            </div>

            <div className="bg-white border border-[#7f9db9] p-3 shadow-xs">
              <div className="text-xs font-bold text-blue-900 flex items-center justify-between">
                <span>MAYOR EGRESO REGISTRADO</span>
                <DollarSign className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-black text-gray-900 mt-1 font-mono">
                ${maxExpense.toLocaleString('es-CL')}
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5">
                Compra con mayor impacto financiero
              </div>
            </div>

            <div className="bg-white border border-[#7f9db9] p-3 shadow-xs">
              <div className="text-xs font-bold text-indigo-900 flex items-center justify-between">
                <span>CATEGORÍAS DE EGRESO</span>
                <Layers className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-black text-indigo-900 mt-1 font-mono">
                {categoryOptions.length} Tipos
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5">
                Incluye Servicios & Compra a Proveedor
              </div>
            </div>
          </div>

          {/* FORMULARIO DE REGISTRO DE GASTO (DISEÑO RETRO WINDOWS XP) */}
          <div className="bg-[#f0f4f8] border border-[#7f9db9] p-4 winxp-bevel-out space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-300 pb-2">
              <Receipt className="w-5 h-5 text-red-700" />
              <h3 className="font-bold text-xs text-blue-950 uppercase tracking-wide">
                Formulario de Ingreso de Nuevo Gasto
              </h3>
            </div>

            {errorMsg && (
              <div className="bg-red-50 border border-red-300 text-red-800 text-xs p-2.5 rounded-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span className="font-semibold">{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. CAMPO: DESCRIPCIÓN */}
                <div className="space-y-1">
                  <label htmlFor="expense-description" className="block text-xs font-bold text-blue-900 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-blue-700" />
                    <span>Descripción del Gasto:</span>
                    <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="expense-description"
                    type="text"
                    required
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      setErrorMsg('');
                    }}
                    placeholder="Ej: Pago de flete reposición telas, compra de etiquetas cromadas..."
                    className="w-full bg-white border border-[#7f9db9] px-2.5 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600 shadow-inner"
                  />
                  <p className="text-[10px] text-gray-500">
                    Escriba el detalle o motivo exacto del egreso para control contable.
                  </p>
                </div>

                {/* 2. CAMPO: DINERO GASTADO (NUMÉRICO CON AUTO-SEPARADOR) */}
                <div className="space-y-1">
                  <label htmlFor="expense-amount" className="block text-xs font-bold text-blue-900 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-green-700" />
                    <span>Dinero Gastado ($ CLP):</span>
                    <span className="text-red-600">*</span>
                    <span className="text-[10px] text-blue-600 font-normal bg-blue-50 px-1 py-0.2 rounded-xs border border-blue-200">
                      Auto-separador de miles activo
                    </span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-bold text-xs text-gray-500 select-none">
                      $
                    </span>
                    <input
                      id="expense-amount"
                      type="text"
                      inputMode="numeric"
                      required
                      value={formattedAmount}
                      onChange={handleAmountChange}
                      placeholder="0"
                      className="w-full bg-white border border-[#7f9db9] pl-7 pr-3 py-1.5 text-sm font-mono font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600 shadow-inner"
                    />
                  </div>
                  <p className="text-[10px] text-gray-500">
                    {rawAmount
                      ? `Monto numérico exacto: $${parseInt(rawAmount, 10).toLocaleString('es-CL')} Pesos Chilenos`
                      : 'Ingrese sólo números; los separadores de miles se agregan automáticamente.'}
                  </p>
                </div>

                {/* 3. CAMPO: CATEGORÍA (EXISTENTES + "Servicios" Y "Compra a Proveedor") */}
                <div className="space-y-1">
                  <label htmlFor="expense-category" className="block text-xs font-bold text-blue-900 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-purple-700" />
                    <span>Categoría:</span>
                    <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="expense-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white border border-[#7f9db9] px-2.5 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600 shadow-inner cursor-pointer font-semibold"
                  >
                    <optgroup label="Categorías Especiales">
                      <option value="Compra a Proveedor">★ Compra a Proveedor (Insumos, telas, importación)</option>
                      <option value="Servicios">★ Servicios (Luz, agua, internet, software, mantención)</option>
                    </optgroup>
                    <optgroup label="Categorías de Catálogo">
                      {categoryOptions
                        .filter((c) => c !== 'Servicios' && c !== 'Compra a Proveedor')
                        .map((catName) => (
                          <option key={catName} value={catName}>
                            Línea: {catName}
                          </option>
                        ))}
                    </optgroup>
                  </select>
                  <p className="text-[10px] text-gray-500">
                    Basado en las líneas del catálogo con las opciones especiales <strong>Servicios</strong> y <strong>Compra a Proveedor</strong>.
                  </p>
                </div>

                {/* 4. CAMPO: FECHA (SELECCIÓN TIPO CALENDARIO) */}
                <div className="space-y-1">
                  <label htmlFor="expense-date" className="block text-xs font-bold text-blue-900 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-700" />
                    <span>Fecha:</span>
                    <span className="text-red-600">*</span>
                    <span className="text-[10px] text-amber-700 font-normal">
                      (Selector de Calendario)
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      id="expense-date"
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-white border border-[#7f9db9] px-2.5 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600 shadow-inner cursor-pointer font-mono"
                    />
                  </div>
                  <p className="text-[10px] text-gray-500">
                    Haga clic en el icono para desplegar el calendario interactivo.
                  </p>
                </div>

                {/* SUCURSAL ASOCIADA AL GASTO */}
                <div className="space-y-1">
                  <label htmlFor="expense-branch" className="block text-xs font-bold text-blue-900 flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-blue-700" />
                    <span>Sucursal / Centro de Costos:</span>
                  </label>
                  <select
                    id="expense-branch"
                    value={branchId}
                    onChange={(e) => setBranchId(e.target.value)}
                    className="w-full bg-white border border-[#7f9db9] px-2.5 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600 shadow-inner cursor-pointer"
                  >
                    <option value="central">Casa Matriz / Central (Corporativo)</option>
                    {INITIAL_BRANCHES.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.city} - {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* MÉTODO DE PAGO */}
                <div className="space-y-1">
                  <label htmlFor="expense-payment-method" className="block text-xs font-bold text-blue-900 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-blue-700" />
                    <span>Método de Pago:</span>
                  </label>
                  <select
                    id="expense-payment-method"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full bg-white border border-[#7f9db9] px-2.5 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600 shadow-inner cursor-pointer"
                  >
                    <option value="Transferencia Bancaria">Transferencia Bancaria</option>
                    <option value="Tarjeta Corporativa">Tarjeta Corporativa (Débito/Crédito)</option>
                    <option value="Caja Chica">Caja Chica (Efectivo local)</option>
                    <option value="Cheque / Orden de Compra">Cheque / Orden de Compra</option>
                  </select>
                </div>
              </div>

              {/* Botones de Acción del Formulario */}
              <div className="pt-3 border-t border-gray-300 flex flex-wrap items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setDescription('');
                    setRawAmount('');
                    setFormattedAmount('');
                    setErrorMsg('');
                  }}
                  className="winxp-button text-xs py-1.5 px-4 text-gray-800"
                >
                  Limpiar
                </button>

                <button
                  type="submit"
                  className="winxp-button winxp-button-primary text-xs py-1.5 px-5 font-bold text-blue-900 flex items-center gap-1.5 shadow-sm"
                >
                  <PlusCircle className="w-4 h-4 text-blue-800" />
                  <span>Registrar Gasto en el Sistema</span>
                </button>
              </div>
            </form>
          </div>

          {/* TABLA DE AUDITORÍA: HISTORIAL DE GASTOS REGISTRADOS */}
          <div className="bg-white border border-[#7f9db9] p-3 shadow-xs space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-blue-800" />
                <h4 className="font-bold text-xs text-blue-900 uppercase tracking-wide">
                  Historial de Gastos Registrados
                </h4>
              </div>
              <div className="text-[11px] text-gray-500 font-semibold">
                Mostrando {expenses.length} registros contables
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-gray-200">
                <thead className="bg-[#e4ebf5] text-blue-950 font-bold border-b border-gray-300 text-[11px]">
                  <tr>
                    <th className="py-1.5 px-2">Folio</th>
                    <th className="py-1.5 px-2">Fecha</th>
                    <th className="py-1.5 px-2">Descripción</th>
                    <th className="py-1.5 px-2">Categoría</th>
                    <th className="py-1.5 px-2">Sucursal / Centro</th>
                    <th className="py-1.5 px-2">Método</th>
                    <th className="py-1.5 px-2 text-right">Dinero Gastado</th>
                    <th className="py-1.5 px-2 text-center w-12">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {expenses.map((exp) => {
                    const isSpecial =
                      exp.category === 'Compra a Proveedor' || exp.category === 'Servicios';
                    return (
                      <tr key={exp.id} className="hover:bg-blue-50/50 transition-colors">
                        <td className="py-1.5 px-2 font-mono font-bold text-blue-900 text-[11px]">
                          {exp.folio}
                        </td>
                        <td className="py-1.5 px-2 font-mono text-[11px] text-gray-700 whitespace-nowrap">
                          {exp.date}
                        </td>
                        <td className="py-1.5 px-2 font-semibold text-gray-900 max-w-xs truncate" title={exp.description}>
                          {exp.description}
                        </td>
                        <td className="py-1.5 px-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-xs border ${
                              exp.category === 'Compra a Proveedor'
                                ? 'bg-amber-100 text-amber-900 border-amber-300'
                                : exp.category === 'Servicios'
                                ? 'bg-blue-100 text-blue-900 border-blue-300'
                                : 'bg-gray-100 text-gray-800 border-gray-300'
                            }`}
                          >
                            {exp.category}
                          </span>
                        </td>
                        <td className="py-1.5 px-2 text-gray-700">
                          {exp.branchName}
                        </td>
                        <td className="py-1.5 px-2 text-[10px] text-gray-500 font-medium">
                          {exp.paymentMethod}
                        </td>
                        <td className="py-1.5 px-2 text-right font-mono font-bold text-red-700 text-xs whitespace-nowrap">
                          -${exp.amount.toLocaleString('es-CL')} CLP
                        </td>
                        <td className="py-1.5 px-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleDeleteExpense(exp.id)}
                            className="text-gray-400 hover:text-red-700 p-1 rounded-xs transition-colors"
                            title="Eliminar este gasto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </WindowFrame>

      {/* DIÁLOGO MODAL WINDOWS XP DE CONFIRMACIÓN */}
      {successDialog && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 animate-in fade-in duration-150">
          <WindowFrame
            title="SISTEMA CONTABLE - [Gasto Registrado con Éxito]"
            icon={<PixelIcon name="info" size={16} />}
            showControls={true}
            onClose={() => setSuccessDialog(false)}
            statusBarText="OPERACIÓN CONFIRMADA // LIBRO DIARIO ACTUALIZADO"
            className="max-w-md w-full shadow-2xl"
          >
            <div className="p-4 space-y-3 font-sans">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-8 h-8 text-green-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-blue-900">
                    ¡Gasto Contabilizado Correctamente!
                  </h4>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    El registro <strong className="font-mono text-blue-800">{lastRegisteredFolio}</strong> ha sido incorporado al libro contable de egresos de NoLimits y sincronizado con el balance general.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-300 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSuccessDialog(false)}
                  className="winxp-button winxp-button-primary text-xs py-1.5 px-5 font-bold text-blue-900 cursor-pointer"
                >
                  Aceptar
                </button>
              </div>
            </div>
          </WindowFrame>
        </div>
      )}
    </div>
  );
};
