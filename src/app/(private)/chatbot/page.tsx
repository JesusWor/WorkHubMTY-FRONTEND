"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, CalendarDays, Users, LayoutGrid, MessageSquare } from "lucide-react";
import AccentureLogo from "../../../../public/accenture_logo_purple1.png";
import DownTransition from "@/app/components/PageTransition/DownTransition";

interface Message {
  id: number;
  role: "bot" | "user";
  text: string;
  routeKey?: string;
}

interface ActionCard {
  label: string;
  query: string;
  icon: React.ReactNode;
}

const ROUTE_MAP: Record<string, { label: string; href: string }> = {
  salas: { label: "Salas disponibles", href: "/reservaciones" },
  reserva: { label: "Reservar espacio", href: "/reservaciones" },
  amigos: { label: "Compañeros hoy", href: "/home" },
  agenda: { label: "Calendario", href: "/calendario" },
  tablero: { label: "Tablero", href: "/tablero" },
  perfil: { label: "Mi perfil", href: "/perfil" },
};

const RESPONSES: Record<string, string> = {
  salas: "Encontré estas salas disponibles para hoy. Puedes reservar directamente desde aquí.",
  reserva: "Te ayudo a reservar tu espacio. ¿Qué fecha y horario necesitas?",
  amigos: "Hoy están confirmados 4 compañeros en la oficina. ¿Quieres ver quiénes son?",
  agenda: "Listo, te muestro tu agenda múltiple con todos los eventos del equipo.",
  tablero: "Aquí tienes tu tablero con las métricas más recientes.",
  perfil: "Te muestro la sección de tu perfil.",
  default: "Entendido. ¿Hay algo más específico en lo que te pueda ayudar?",
};

const ACTION_CARDS: ActionCard[] = [
  { label: "Busca salas disponibles", query: "Busca salas disponibles", icon: <Search size={26} strokeWidth={1.5} />      },
  { label: "Reserva un espacio", query: "Reserva un espacio", icon: <CalendarDays size={26} strokeWidth={1.5} /> },
  { label: "¿Qué amigos van hoy a la oficina?", query: "¿Qué amigos van hoy a la oficina?",icon: <Users size={26} strokeWidth={1.5} />        },
  { label: "Realiza una agenda múltiple", query: "Realiza una agenda múltiple", icon: <LayoutGrid size={26} strokeWidth={1.5} />   },
];

function matchKey(text: string): string | null {
  const t = text.toLowerCase();
  if (t.includes("sala") || t.includes("busca")) return "salas";
  if (t.includes("reserva") || t.includes("espacio")) return "reserva";
  if (t.includes("amigo") || t.includes("compañero") || t.includes("oficina")) return "amigos";
  if (t.includes("agenda") || t.includes("múltiple") || t.includes("multiple")) return "agenda";
  if (t.includes("tablero")) return "tablero";
  if (t.includes("perfil")) return "perfil";
  return null;
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 rounded-xl rounded-tl-sm bg-white border border-gray-200 px-3 py-2.5 w-fit">
      {[0, 150, 300].map((d) => (
        <span key={d} className="h-1.5 w-1.5 rounded-full bg-purple-300 animate-bounce" style={{ animationDelay: `${d}ms` }} />
      ))}
    </div>
  );
}

let msgId = 0;

export default function ChatBot() {
  const router = useRouter();
  const [view, setView] = useState<"home" | "chat">("home");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const msgsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    msgsRef.current?.scrollTo({ top: msgsRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  function goToChat(query?: string) {
    setView("chat");
    setTimeout(() => inputRef.current?.focus(), 50);
    if (query) sendMessage(query);
  }

  function goHome() {
    setView("home");
    setMessages([]);
    setInput("");
  }

  function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setInput("");
    setMessages((prev) => [...prev, { id: ++msgId, role: "user", text: trimmed }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const key = matchKey(trimmed);
      setMessages((prev) => [...prev, {
        id: ++msgId,
        role: "bot",
        text: key ? RESPONSES[key] : RESPONSES.default,
        routeKey: key ?? undefined,
      }]);
    }, 700);
  }

  const Header = () => (
    <div className="flex items-center gap-3 px-5 py-3 bg-[#f5f5f5] border-b border-gray-200 shrink-0">
      <a href="/home">
        <Image src={AccentureLogo} alt="Accenture" width={32} height={32} />
      </a>
      <span className="text-[17px] font-medium text-gray-900">Chatbot</span>
    </div>
  );

  const BottomBar = ({ onInputClick }: { onInputClick?: () => void }) => (
    <div className="flex items-center gap-3 px-4 py-3 border-t border-gray-200 bg-[#f5f5f5] shrink-0">
      <button
        onClick={goHome}
        className="text-[13px] text-gray-500 hover:text-gray-700 transition-colors whitespace-nowrap bg-transparent border-none cursor-pointer"
      >
        Volver
      </button>
      <div
        className="flex flex-1 items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2.5 cursor-text"
        onClick={onInputClick}
      >
        <span className="text-gray-400 flex items-center"><MessageSquare size={16} /></span>
        {view === "chat" ? (
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Solicita al chatbot..."
            className="flex-1 text-[13px] text-gray-800 placeholder:text-gray-400 bg-transparent outline-none border-none"
          />
        ) : (
          <span className="text-[13px] text-gray-400 select-none">Solicita al chatbot...</span>
        )}
      </div>
    </div>
  );

  if (view === "home") {
    return (
      <div className="flex h-full flex-col bg-[#f5f5f5]">
        <Header />
        <div className="flex flex-1 flex-col items-center justify-center px-6 pb-4">
          <p className="text-[20px] text-gray-900 mb-8 text-center">¡Hola! ¿Cómo puedo asistirle hoy?</p>
          <div className="grid grid-cols-4 gap-3 w-full max-w-2xl">
            {ACTION_CARDS.map((card) => (
              <button
                key={card.query}
                onClick={() => goToChat(card.query)}
                className="flex flex-col items-center gap-3 bg-white border border-gray-200 rounded-2xl px-3 py-5 cursor-pointer transition-all hover:border-purple-300 hover:bg-purple-50 text-gray-800"
              >
                <span className="text-gray-700">{card.icon}</span>
                <span className="text-[12px] text-center leading-snug">{card.label}</span>
              </button>
            ))}
          </div>
        </div>
        <BottomBar onInputClick={() => goToChat()} />
      </div>
    );
  }

  return (
    <DownTransition>
        <div className="flex h-full flex-col bg-[#f5f5f5]">
        <Header />
        <div ref={msgsRef} className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3 min-h-0">
            {messages.map((msg) =>
            msg.role === "user" ? (
                <div key={msg.id} className="flex justify-end">
                <div className="max-w-[75%] rounded-xl rounded-br-sm bg-violet-700 px-3.5 py-2.5 text-[13px] leading-relaxed text-white">
                    {msg.text}
                </div>
                </div>
            ) : (
                <div key={msg.id} className="flex flex-col items-start gap-2 max-w-[75%]">
                <div className="rounded-xl rounded-tl-sm bg-white border border-gray-200 px-3.5 py-2.5 text-[13px] leading-relaxed text-gray-800">
                    {msg.text}
                </div>
                {msg.routeKey && ROUTE_MAP[msg.routeKey] && (
                    <button
                    onClick={() => router.push(ROUTE_MAP[msg.routeKey!].href)}
                    className="flex items-center gap-1.5 rounded-full border border-purple-300 bg-white px-3 py-1.5 text-[12px] text-purple-700 hover:bg-purple-50 transition-colors cursor-pointer"
                    >
                    Ir a {ROUTE_MAP[msg.routeKey].label}
                    <span className="text-purple-400">→</span>
                    </button>
                )}
                </div>
            )
            )}
            {typing && <TypingIndicator />}
        </div>
        <BottomBar />
        </div>
    </DownTransition>
  );
}