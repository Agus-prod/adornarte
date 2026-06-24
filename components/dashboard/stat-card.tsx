import {
  Package,
  AlertTriangle,
  XCircle,
  Wallet,
  DollarSign,
  CalendarDays,
  Receipt,
  PiggyBank,
  TrendingUp,
  Users,
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

      case "Agotados":
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

      case "Clientes":
        return <Users size={20} />;

      case "Ganancia":
        return (
          <PiggyBank size={20} />
        );

      case "Margen":
        return (
          <TrendingUp size={20} />
        );

      default:
        return <Package size={20} />;
    }
  };

  const getStyles = () => {
    switch (title) {
      case "Agotados":
      case "Sin Stock":
        return {
          icon:
            "bg-red-100 text-red-600",
          border:
            "border-red-200",
        };

      case "Stock Bajo":
        return {
          icon:
            "bg-yellow-100 text-yellow-700",
          border:
            "border-yellow-200",
        };

      case "Clientes":
        return {
          icon:
            "bg-green-100 text-green-600",
          border:
            "border-green-200",
        };

      case "Valor Inventario":
        return {
          icon:
            "bg-blue-100 text-blue-600",
          border:
            "border-blue-200",
        };

      default:
        return {
          icon:
            "bg-pink-100 text-pink-600",
          border:
            "border-white/60",
        };
    }
  };

  const styles =
    getStyles();

  return (
    <div
      className={`
        group
        rounded-3xl
        border
        ${styles.border}
        bg-white/80
        p-6
        shadow-sm
        backdrop-blur-xl
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
      `}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">
          {title}
        </p>

        <div
          className={`
            rounded-2xl
            p-3
            ${styles.icon}
          `}
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