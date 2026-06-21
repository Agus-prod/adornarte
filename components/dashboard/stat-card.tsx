import {
  Package,
  AlertTriangle,
  XCircle,
  Wallet,
  DollarSign,
  CalendarDays,
  Receipt,
} from "lucide-react";

type Props = {
  title: string;
  value: string;
};

export function StatCard({
  title,
  value,
}: Props) {
  const getIcon = () => {
    switch (title) {
      case "Productos":
        return <Package size={20} />;

      case "Stock Bajo":
        return (
          <AlertTriangle size={20} />
        );

      case "Sin Stock":
        return (
          <XCircle size={20} />
        );

      case "Valor Inventario":
        return <Wallet size={20} />;

      case "Ventas Hoy":
        return (
          <DollarSign size={20} />
        );

      case "Ventas Mes":
        return (
          <CalendarDays size={20} />
        );

      case "Total Ventas":
        return (
          <Receipt size={20} />
        );

      default:
        return <Package size={20} />;
    }
  };

  return (
    <div
      className="
        group
        rounded-3xl
        border
        border-white/60
        bg-white/80
        p-6
        shadow-sm
        backdrop-blur-xl
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
      "
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">
          {title}
        </p>

        <div
          className="
            rounded-2xl
            bg-pink-100
            p-3
            text-pink-600
          "
        >
          {getIcon()}
        </div>
      </div>

      <h2
        className="
          mt-4
          text-4xl
          font-bold
          tracking-tight
        "
      >
        {value}
      </h2>

      <p className="mt-2 text-xs text-gray-400">
        Actualizado en tiempo real
      </p>
    </div>
  );
}