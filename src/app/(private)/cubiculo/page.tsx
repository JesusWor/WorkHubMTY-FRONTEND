"use client";

import { useState, useRef, useEffect } from "react";
import { X, Search, Calendar, Clock, Users, Check, LogOut } from "lucide-react";

interface Invitado {
  id: string;
  nombre: string;
  email: string;
  tipo: "colaborador" | "invitado";
}

interface Sesion {
  fecha: string;
  inicio: string;
  fin: string;
}

interface Equipo {
  id: string;
  nombre: string;
  miembros: number;
  color: string;
}

interface Persona {
  id: string;
  nombre: string;
  email: string;
}

const SESIONES: Sesion[] = [
  { fecha: "04/13", inicio: "07:00 AM", fin: "12:00 PM" },
  { fecha: "04/13", inicio: "02:00 PM", fin: "04:00 PM" },
];

const EQUIPOS_MOCK: Equipo[] = [
  { id: "e1", nombre: "Equipo Alpha", miembros: 5, color: "#ede9fe" },
  { id: "e2", nombre: "Equipo Beta", miembros: 8, color: "#fce7f3" },
  { id: "e3", nombre: "Design Team", miembros: 4, color: "#e0f2fe" },
  { id: "e4", nombre: "Dev Team", miembros: 6, color: "#dcfce7" },
];

const RECIENTES_MOCK: Persona[] = [
  { id: "r1", nombre: "Cristian Ricardo Luque Arámbula", email: "cristian@accenture.com" },
  { id: "r2", nombre: "Jesús Eduardo Escobar Meza", email: "piti@accenture.com" },
  { id: "r3", nombre: "María Fernanda Torres", email: "mfernanda@accenture.com" },
];

const Avatar = ({
  nombre,
  bg = "#e5e7eb",
  color = "#6b7280",
  size = 40,
}: {
  nombre: string;
  bg?: string;
  color?: string;
  size?: number;
}) => {
  const initials = nombre.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: bg, color,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 600, fontSize: size * 0.32, flexShrink: 0,
    }}>
      {initials}
    </div>
  );
};

export default function Cubiculo() {
  const [invitados, setInvitados] = useState<Invitado[]>([
    { id: "1", nombre: "Cristian Ricardo", email: "cristian@accenture.com", tipo: "colaborador" },
    { id: "2", nombre: "Invitado", email: "juan@empresainteresada.com", tipo: "invitado" },
  ]);
  const [busqueda, setBusqueda] = useState("");
  const [dropdownAbierto, setDropdownAbierto] = useState(false);
  const [crearEquipo, setCrearEquipo] = useState(true);
  const searchRef = useRef<HTMLDivElement>(null);

  const personasFiltradas = busqueda.length > 1
    ? RECIENTES_MOCK.filter(
        (p) =>
          p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
          p.email.toLowerCase().includes(busqueda.toLowerCase())
      )
    : RECIENTES_MOCK;

  const equiposFiltrados = busqueda.length > 1
    ? EQUIPOS_MOCK.filter((e) => e.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    : EQUIPOS_MOCK;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setDropdownAbierto(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const eliminarInvitado = (id: string) =>
    setInvitados((prev) => prev.filter((i) => i.id !== id));

  const agregarPersona = (persona: Persona) => {
    if (invitados.find((i) => i.email === persona.email)) return;
    setInvitados((prev) => [
      ...prev,
      { id: persona.id, nombre: persona.nombre, email: persona.email, tipo: "colaborador" },
    ]);
    setBusqueda("");
    setDropdownAbierto(false);
  };

  const agregarEquipo = (equipo: Equipo) => {
    if (invitados.find((i) => i.id === `equipo-${equipo.id}`)) return;
    setInvitados((prev) => [
      ...prev,
      { id: `equipo-${equipo.id}`, nombre: equipo.nombre, email: `${equipo.miembros} miembros`, tipo: "colaborador" },
    ]);
    setBusqueda("");
    setDropdownAbierto(false);
  };

  const handleFinalizar = () => alert("¡Reserva finalizada con éxito!");

  return (
    <section className="flex h-full w-full overflow-hidden bg-gray-200 overflow-hidden">
            <div className="flex-1 px-[5rem] py-8 pt-23">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.8rem" }}>
                    <h3 style={{ fontSize: 28, fontWeight: 700, color: "#111827", margin: 0, letterSpacing: "-0.5px" }}>
                        Reserva completa
                    </h3>
                    <button
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            background: "white",
                            border: "1px solid #e5e7eb",
                            borderRadius: 12,
                            padding: "10px 20px",
                            cursor: "pointer",
                            fontWeight: 600,
                            fontSize: 15,
                            color: "#111827",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
                        }}
                    >
                        <Users size={22} color="#6b7280" />
                        Equipos
                    </button>
                </div>

                <div className="flex gap-6 flex-1 min-h-0">
                    <div style={{
                        background: "white", borderRadius: 5,
                        border: "1px solid #e5e7eb", padding: "1.5rem",
                        width: 300, flexShrink: 0,
                        display: "flex", flexDirection: "column",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                        }}
                    >
                    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                        <span style={{ fontWeight: 700, fontSize: 18, color: "#111827" }}>Sierra Madre</span>
                        <span style={{ fontSize: 13, color: "#9ca3af", fontWeight: 500 }}>ICSJ-3040</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "0.75rem", color: "#6b7280" }}>
                        <Users size={16} />
                        <span style={{ fontSize: 14, fontWeight: 500 }}>16</span>
                    </div>

                    <div style={{
                        borderRadius: 10, overflow: "hidden",
                        width: "100%", height: 160, marginBottom: "1.25rem",
                    }}>
                        <div style={{
                            width: "100%", height: "100%",
                            background: "linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#64748b", fontSize: 13,
                        }}>
                            No me jalo la imagen
                        </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                            <div style={{
                                display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
                                gap: 6, padding: "0 8px", marginBottom: 4
                            }}>
                                <div style={{ display: "flex", justifyContent: "center" }}>
                                    <Calendar size={15} color="#9ca3af" />
                                </div>
                                <div style={{ display: "flex", justifyContent: "center" }}>
                                    <Clock size={15} color="#9ca3af" />
                                </div>
                                <div style={{ display: "flex", justifyContent: "center" }}>
                                    <LogOut size={15} color="#9ca3af" />
                                </div>
                            </div>
                            {SESIONES.map((s, i) => (
                                <div key={i} style={{
                                    display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
                                    gap: 6, background: "#f9fafb", borderRadius: 10,
                                    padding: "10px 8px", border: "1px solid #f3f4f6",
                                }}>
                                    <span style={{ fontSize: 12, fontWeight: 600, color: "#374151", textAlign: "center" }}>{s.fecha}</span>
                                    <span style={{ fontSize: 12, fontWeight: 600, color: "#374151", textAlign: "center" }}>{s.inicio}</span>
                                    <span style={{ fontSize: 12, fontWeight: 600, color: "#374151", textAlign: "center" }}>{s.fin}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col flex-1 gap-4 min-h-0">
                    <div
                        ref={searchRef}
                        style={{
                            background: "white", borderRadius: 16,
                            border: "1px solid #e5e7eb", padding: "1.25rem 1.5rem",
                            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                            flexShrink: 0, position: "relative",
                        }}
                    >
                        <div style={{ position: "relative" }}>
                            <span style={{
                                position: "absolute", left: 14, top: "50%",
                                transform: "translateY(-50%)", color: "#9ca3af",
                                display: "flex", pointerEvents: "none",
                            }}>
                                <Search size={17} />
                            </span>
                <input
                    type="text"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    onFocus={() => setDropdownAbierto(true)}
                    placeholder="Buscar un correo, nombre o equipo para invitar"
                    style={{
                        width: "100%", padding: "12px 14px 12px 42px",
                        border: "1px solid #e5e7eb",
                        borderRadius: dropdownAbierto ? "10px 10px 0 0" : 10,
                        fontSize: 14, color: "#374151", outline: "none",
                        background: "white", boxSizing: "border-box",
                        fontFamily: "inherit",
                    }}
                    onFocus={(e) => {
                        setDropdownAbierto(true);
                        e.target.style.borderColor = "#a78bfa";
                    }}
                    onBlur={(e) => {
                        e.target.style.borderColor = "#e5e7eb";
                    }}
                />

                {dropdownAbierto && (
                    <div style={{
                        position: "absolute", top: "100%", left: 0, right: 0,
                        background: "white",
                        border: "1px solid #a78bfa", borderTop: "none",
                        borderRadius: "0 0 10px 10px",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
                        zIndex: 50,
                    }}>
                        <div style={{ padding: "10px 16px 4px" }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                                Recientes
                            </span>
                        </div>
                        {personasFiltradas.map((p) => (
                            <button
                                key={p.id}
                                onClick={() => agregarPersona(p)}
                                style={{
                                    display: "flex", alignItems: "center", gap: 12,
                                    width: "100%", padding: "9px 16px",
                                    background: "none", border: "none", cursor: "pointer",
                                    textAlign: "left", fontFamily: "inherit",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = "#f9fafb")}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                            >
                                <Avatar nombre={p.nombre} bg="#ede9fe" color="#6d28d9" size={36} />
                                <div>
                                    <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{p.nombre}</div>
                                    <div style={{ fontSize: 12, color: "#9ca3af" }}>{p.email}</div>
                                </div>
                            </button>
                        ))}

                        <div style={{ padding: "10px 16px 4px", borderTop: "1px solid #f3f4f6", marginTop: 4 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                                Equipos
                            </span>
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "8px 16px 14px" }}>
                            {equiposFiltrados.map((eq) => (
                                <button
                                    key={eq.id}
                                    onClick={() => agregarEquipo(eq)}
                                    style={{
                                        display: "flex", alignItems: "center", gap: 6,
                                        background: eq.color, border: "none", borderRadius: 20,
                                        padding: "7px 14px", cursor: "pointer",
                                        fontSize: 13, fontWeight: 600, color: "#374151",
                                        fontFamily: "inherit", transition: "opacity 0.15s",
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.75")}
                                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                                >
                                    <Users size={13} />
                                        {eq.nombre}
                                    <span style={{ fontSize: 11, color: "#6b7280" }}>({eq.miembros})</span>
                                </button>
                             ))}
                        </div>
                    </div>
                )}
            </div>
        </div>

        <div style={{
            background: "white", borderRadius: 16,
            border: "1px solid #e5e7eb",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            flex: 1, minHeight: 0,
            display: "flex", flexDirection: "column",
        }}>
            <div style={{
                flex: 1, overflowY: "auto",
                padding: "1.25rem 1.5rem 0.75rem",
                display: "flex", flexDirection: "column", gap: 10,
            }}>
                {invitados.map((inv) => (
                    <div key={inv.id} style={{
                        display: "flex", alignItems: "center", gap: 14,
                        background: "#f9fafb", borderRadius: 12,
                        padding: "12px 14px", border: "1px solid #f3f4f6",
                        flexShrink: 0, overflow: "auto",
                    }}>
                        <Avatar
                            nombre={inv.nombre}
                            bg={inv.tipo === "colaborador" ? "#ede9fe" : "#e0f2fe"}
                            color={inv.tipo === "colaborador" ? "#6d28d9" : "#0369a1"}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 600, fontSize: 15, color: "#111827", marginBottom: 2 }}>
                                {inv.nombre}
                            </div>
                            <div style={{ fontSize: 13, color: "#6b7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {inv.email}
                            </div>
                        </div>
                        {inv.tipo === "invitado" && (
                            <span style={{
                                fontSize: 11, fontWeight: 600, color: "#0369a1",
                                background: "#e0f2fe", borderRadius: 6, padding: "2px 8px", flexShrink: 0,
                            }}>
                                Invitado
                            </span>
                        )}
                        <button
                            onClick={() => eliminarInvitado(inv.id)}
                            style={{
                                background: "none", border: "none", cursor: "pointer",
                                color: "#9ca3af", display: "flex", alignItems: "center",
                                padding: 4, borderRadius: 6, flexShrink: 0, transition: "color 0.15s",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "#374151")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}
                            aria-label="Eliminar invitado"
                        >
                            <X size={18} />
                        </button>
                    </div>
                ))}

                {invitados.length === 0 && (
                  <p style={{ fontSize: 14, color: "#9ca3af", textAlign: "center", padding: "2rem 0" }}>
                    No hay invitados agregados aún.
                  </p>
                )}
              </div>

              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                borderTop: "1px solid #f3f4f6", padding: "1rem 1.5rem", flexShrink: 0,
              }}>
                <span style={{ fontSize: 14, color: "#6b7280" }}>
                  Crear equipo a partir de la selección
                </span>
                <button
                  onClick={() => setCrearEquipo(!crearEquipo)}
                  style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: crearEquipo ? "#7c3aed" : "#e5e7eb",
                    border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "background 0.2s", flexShrink: 0,
                  }}
                  aria-label="Toggle crear equipo"
                >
                  {crearEquipo && <Check size={18} color="white" strokeWidth={2.5} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <button
            onClick={handleFinalizar}
            className="flex-shrink-0 p-2 mt-3"
            style={{
                display: "grid", width: "100%",
                background: "#7c3aed", color: "white",
                border: "none", borderRadius: 5,
                fontSize: 18, fontWeight: 700,
                cursor: "pointer", letterSpacing: "0.2px",
                transition: "background 0.2s, transform 0.2s",
                fontFamily: "inherit",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#6d28d9")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#7c3aed")}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.99)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
            Finalizar
        </button>
      </div>
    </section>
  );
}