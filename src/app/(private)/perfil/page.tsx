import React from "react";
import {
  Bell,
  BotMessageSquare,
  CalendarDays,
  Flame,
  GraduationCap,
  Mail,
  MapPin,
  MessageSquare,
  Pencil,
  Phone,
  Star,
  Trophy,
  User,
  UserRound,
  UsersRound,
} from "lucide-react";

type FriendStatus = "En línea" | "Ausente" | "Desconectado";

type Friend = {
  id: number;
  name: string;
  role: string;
  status: FriendStatus;
  avatar: string;
};

type Achievement = {
  id: number;
  title: string;
  description: string;
  progress: number;
  total: number;
  icon: React.ElementType;
  tone: "purple" | "red" | "blue" | "green" | "yellow";
};

const friends: Friend[] = [
  {
    id: 1,
    name: "Carlos Méndez",
    role: "Compañero",
    status: "En línea",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face",
  },
  {
    id: 2,
    name: "Valeria Ruiz",
    role: "Compañera",
    status: "En línea",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face",
  },
  {
    id: 3,
    name: "Andrés Gómez",
    role: "Organizador",
    status: "Ausente",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop&crop=face",
  },
  {
    id: 4,
    name: "Sofía Martínez",
    role: "Compañera",
    status: "Desconectado",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face",
  },
  {
    id: 5,
    name: "Diego Ramírez",
    role: "Compañero",
    status: "Desconectado",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face",
  },
  {
    id: 6,
    name: "Ana Torres",
    role: "Compañera",
    status: "Desconectado",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&crop=face",
  },
];

const achievements: Achievement[] = [
  {
    id: 1,
    title: "Primera amistad",
    description: "Agrega 1 amigo a tu red",
    progress: 1,
    total: 1,
    icon: UsersRound,
    tone: "purple",
  },
  {
    id: 2,
    title: "Red activa",
    description: "Ten 10 amigos en tu red",
    progress: 7,
    total: 10,
    icon: UsersRound,
    tone: "purple",
  },
  {
    id: 3,
    title: "Racha de 10 días",
    description: "Inicia sesión 10 días seguidos",
    progress: 6,
    total: 10,
    icon: Flame,
    tone: "red",
  },
  {
    id: 4,
    title: "Creador de salas",
    description: "Crea 5 salas de reserva",
    progress: 2,
    total: 5,
    icon: CalendarDays,
    tone: "blue",
  },
  {
    id: 5,
    title: "Participación semanal",
    description: "Participa en 10 eventos",
    progress: 5,
    total: 10,
    icon: CalendarDays,
    tone: "green",
  },
  {
    id: 6,
    title: "Coleccionista",
    description: "Completa 20 logros",
    progress: 5,
    total: 20,
    icon: Star,
    tone: "yellow",
  },
];

const toneStyles: Record<Achievement["tone"], string> = {
  purple: "bg-purple-100 text-purple-700",
  red: "bg-red-100 text-red-500",
  blue: "bg-blue-100 text-blue-500",
  green: "bg-emerald-100 text-emerald-600",
  yellow: "bg-amber-100 text-amber-500",
};

const statusStyles: Record<FriendStatus, string> = {
  "En línea": "bg-emerald-500",
  Ausente: "bg-amber-500",
  Desconectado: "bg-slate-400",
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function StatCard({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ElementType;
  value: string;
  label: string;
}) {
  return (
    <button className="group flex min-h-[76px] items-center gap-4 rounded-lg border border-slate-200 bg-container/70 px-5 text-left transition hover:-translate-y-0.5 hover:border-purple-200 hover:shadow-md">
      <div className="grid h-10 w-10 place-items-center rounded-lg bg-purple-50 text-purple-700 group-hover:bg-purple-100">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-md font-bold leading-tight text-slate-950">
          {value}
        </p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </button>
  );
}

function ProfileCard() {
  return (
    <section className="rounded-lg bg-container p-7 ring-1 ring-slate-200/80">
      <div className="flex gap-8">
        <div className="relative shrink-0">
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=220&h=220&fit=crop&crop=face"
            alt="Foto de perfil"
            className="h-36 w-36 rounded-full bg-purple-100 object-cover ring-8 ring-purple-100/70"
          />
        </div>

        <div className="min-w-0 flex-1 flex flex-col gap-2">
          <div className="flex items-start justify-between ">
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-bold tracking-tight text-slate-950">
                María Fernanda López
              </h2>
              <p className="text-md font-semibold text-purple-700">
                @mariafernanda
              </p>
              <p className="max-w-2xl text-sm leading-7 text-slate-600">
                Estudiante de ingeniería en Sistemas. Me encanta organizar
                reuniones productivas y conocer gente nueva.
              </p>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <GraduationCap className="h-5 w-5" />
                Estudiante universitario
              </div>
            </div>

            <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-container px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-purple-200 hover:text-purple-700">
              <Pencil className="h-4 w-4" />
              Editar perfil
            </button>
          </div>

          <div className="mt-7 grid grid-cols-4 gap-4">
            <StatCard icon={Star} value="2,450" label="Puntos" />
            <StatCard icon={Flame} value="12 días" label="Racha actual" />
            <StatCard icon={UsersRound} value="48" label="Amigos" />
            <StatCard icon={Trophy} value="18" label="Logros completados" />
          </div>
        </div>
      </div>
    </section>
  );
}

function FriendsCard() {
  return (
    <section className="rounded-lg bg-container p-6  ring-1 ring-slate-200/80">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-950">Amistades</h3>
        <button className="text-sm font-semibold text-purple-700 hover:text-purple-800">
          Ver todos
        </button>
      </div>

      <div className="divide-y divide-slate-100">
        {friends.map((friend) => (
          <div
            key={friend.id}
            className="grid grid-cols-[1fr_auto_auto] items-center gap-4 py-3.5 first:pt-0 last:pb-0"
          >
            <div className="flex min-w-0 items-center gap-4">
              <img
                src={friend.avatar}
                alt={friend.name}
                className="h-11 w-11 rounded-full object-cover"
              />
              <div className="min-w-0 flex flex-col gap-1">
                <p className="truncate text-sm font-semibold text-slate-950">
                  {friend.name}
                </p>
                <p className="text-xs font-medium text-purple-700">
                  {friend.role}
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex">
              <span
                className={cn(
                  "h-2.5 w-2.5 rounded-full",
                  statusStyles[friend.status],
                )}
              />
              {friend.status}
            </div>

            <button className="flex min-w-28 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-container px-4 py-2 text-sm font-semibold text-purple-700 transition hover:border-purple-200 hover:bg-purple-50">
              <User className="h-4 w-4" /> Ir a perfil
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function AchievementRow({ achievement }: { achievement: Achievement }) {
  const Icon = achievement.icon;
  const percentage = Math.round(
    (achievement.progress / achievement.total) * 100,
  );
  const completed = achievement.progress === achievement.total;

  return (
    <div className="grid grid-cols-[48px_1fr_auto] items-center gap-4 py-3.5 first:pt-0 last:pb-0">
      <div
        className={cn(
          "grid h-12 w-12 place-items-center rounded-lg",
          toneStyles[achievement.tone],
        )}
      >
        <Icon className="h-6 w-6" />
      </div>

      <div className="min-w-0">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-sm text-slate-950">
              {achievement.title}
            </p>
            <p className="text-xs text-slate-500">{achievement.description}</p>
          </div>
          <p className="shrink-0 text-xs font-semibold text-slate-600">
            {achievement.progress} / {achievement.total}
          </p>
        </div>

        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-purple-700"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {completed ? (
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
          Completado
        </span>
      ) : (
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
          {percentage}%
        </span>
      )}
    </div>
  );
}

function AchievementsCard() {
  return (
    <section className="rounded-lg bg-container p-6 ring-1 ring-slate-200/80">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-950">Logros</h3>
        <button className="text-sm font-semibold text-purple-700 hover:text-purple-800">
          Ver todos
        </button>
      </div>

      <div className="divide-y divide-slate-100">
        {achievements.map((achievement) => (
          <AchievementRow key={achievement.id} achievement={achievement} />
        ))}
      </div>
    </section>
  );
}

function InfoCard() {
  const items = [
    { icon: Mail, label: "maria.lopez@correo.com" },
    { icon: Phone, label: "+52 55 1234 5678" },
    { icon: MapPin, label: "Ciudad de México, México" },
    { icon: CalendarDays, label: "Se unió el 15 de feb de 2024" },
  ];

  return (
    <section className="rounded-lg bg-container p-6 ring-1 ring-slate-200/80">
      <h3 className="text-lg font-bold text-slate-950">Información personal</h3>
      <div className="mt-5 space-y-4">
        {items.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-4 text-xs text-slate-600"
          >
            <Icon className="h-5 w-5 text-slate-600" />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProgressSummaryCard() {
  return (
    <section className="rounded-lg bg-container p-6 ring-1 ring-slate-200/80">
      <h3 className="text-lg font-bold text-slate-950">Resumen de progreso</h3>

      <div className="mt-6 flex items-center gap-8">
        <div className="relative h-36 w-36 shrink-0">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <circle
              cx="60"
              cy="60"
              r="48"
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="10"
            />
            <circle
              cx="60"
              cy="60"
              r="48"
              fill="none"
              stroke="#7C0AED"
              strokeLinecap="round"
              strokeWidth="10"
              strokeDasharray={`${2 * Math.PI * 48}`}
              strokeDashoffset={`${2 * Math.PI * 48 * (1 - 0.72)}`}
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              <p className="text-xl font-bold text-slate-950">72%</p>
              <p className="text-xs text-slate-500">Completado</p>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-4 text-xs">
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-3 text-slate-600">
              <span className="h-3 w-3 rounded-full bg-purple-700" />
              Logros completados
            </span>
            <strong className="text-slate-950">18</strong>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-3 text-slate-600">
              <span className="h-3 w-3 rounded-full bg-purple-400" />
              En progreso
            </span>
            <strong className="text-slate-950">9</strong>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-3 text-slate-600">
              <span className="h-3 w-3 rounded-full bg-slate-300" />
              Por completar
            </span>
            <strong className="text-slate-950">7</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedAchievementsCard() {
  const featured = [
    {
      title: "Primera amistad",
      subtitle: "Completado",
      icon: UsersRound,
      className: "bg-purple-100 text-purple-700 ring-purple-200",
    },
    {
      title: "Racha de 10 días",
      subtitle: "Nivel 2",
      icon: Flame,
      className: "bg-red-100 text-red-500 ring-red-200",
    },
    {
      title: "Creador de salas",
      subtitle: "Nivel 1",
      icon: CalendarDays,
      className: "bg-blue-100 text-blue-500 ring-blue-200",
    },
  ];

  return (
    <section className="rounded-lg bg-container p-6 ring-1 ring-slate-200/80">
      <h3 className="text-lg font-bold text-slate-950">Logros destacados</h3>

      <div className="mt-7 grid grid-cols-3 gap-4">
        {featured.map(({ title, subtitle, icon: Icon, className }) => (
          <div key={title} className="text-center">
            <div
              className={cn(
                "mx-auto grid h-20 w-20 place-items-center rounded-[1.7rem] ring-4",
                className,
              )}
            >
              <Icon className="h-9 w-9" />
            </div>
            <p className="mt-3 text-sm font-semibold leading-tight text-slate-950">
              {title}
            </p>
            <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function UserProfilePage() {
  return (
    <div className="mx-auto w-full bg-background-page px-12 py-8">
      <div className="flex flex-col gap-2 mb-4">
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">
          Perfil de usuario
        </h1>
        <p className="text-sm text-slate-500">
          Consulta tu información, amistades y progreso de logros.
        </p>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_360px] gap-6 ">
        <div className="space-y-6">
          <ProfileCard />

          <div className="grid grid-cols-2 gap-6">
            <FriendsCard />
            <AchievementsCard />
          </div>
        </div>

        <aside className="self-stretch">
          <div className="sticky bottom-6 space-y-6">
            <InfoCard />
            <ProgressSummaryCard />
            <FeaturedAchievementsCard />
          </div>
        </aside>
      </div>
    </div>
  );
}
