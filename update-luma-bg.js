const fs = require("fs");

const css = `@import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap");

html, body {
  margin: 0;
  padding: 0;
  background-color: #030308;
  color: #f4f4f5;
  font-family: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif;
  overflow-x: hidden;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}

* {
  box-sizing: border-box;
}

::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: #030308;
}
::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 3px;
}`;

const page = `"use client";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Cpu, Building2, Send, Globe, ArrowUpRight, CheckCircle2, Sparkles } from "lucide-react";

function LumaFluidCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(2, 2);

    const fragmentShader = \`
      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec2 uMouse;

      void main() {
        vec2 st = gl_FragCoord.xy / uResolution.xy;
        st.x *= uResolution.x / uResolution.y;

        vec2 mouse = uMouse * 0.15;
        vec2 p = st * 2.5 - vec2(1.2) + mouse;

        for(int i = 1; i < 6; i++) {
          float fi = float(i);
          p.x += 0.3 / fi * sin(fi * 3.0 * p.y + uTime * 0.4) + 0.2;
          p.y += 0.3 / fi * cos(fi * 2.5 * p.x + uTime * 0.3) + 0.1;
        }

        float wave = sin(p.x + p.y);

        vec3 col1 = vec3(0.01, 0.02, 0.06); // Dark base
        vec3 col2 = vec3(0.08, 0.22, 0.45); // Deep Teal/Blue
        vec3 col3 = vec3(0.35, 0.12, 0.55); // Vibrant Indigo/Violet
        vec3 col4 = vec3(0.12, 0.52, 0.85); // Electric Blue highlight

        vec3 color = mix(col1, col2, smoothstep(-1.0, 1.0, wave));
        color = mix(color, col3, smoothstep(0.1, 0.9, sin(uTime * 0.2 + p.x)));
        color = mix(color, col4, pow(max(0.0, sin(p.y * 2.0 + uTime * 0.5)), 4.0) * 0.35);

        gl_FragColor = vec4(color, 1.0);
      }
    \`;

    const vertexShader = \`
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    \`;

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uMouse: { value: new THREE.Vector2(0, 0) }
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      uniforms.uTime.value = elapsedTime;

      uniforms.uMouse.value.x += (targetMouseX - uniforms.uMouse.value.x) * 0.05;
      uniforms.uMouse.value.y += (targetMouseY - uniforms.uMouse.value.y) * 0.05;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
      geometry.dispose();
      material.dispose();
      if (mount && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 0, pointerEvents: "none" }} />;
}

const content = {
  es: {
    role: "ARQUITECTURA DE OPERACIONES & DIRECCIÓN EJECUTIVA",
    name: "Jimmy Cornejo",
    bio: "Especialista en optimización de back-office, diseño de flujos administrativos e integración de arquitectura tecnológica avanzada para eliminar la fricción operativa.",
    tabs: { home: "Inicio", about: "Perfil", operations: "Iniciativas", contact: "Contacto" },
    metrics: [
      { value: "Clear Ops", label: "Back-Office Operations" },
      { value: "+80%", label: "Reducción de Fricción" },
      { value: "Sports Exec", label: "Dirección Institucional" }
    ],
    cards: {
      profile: "Visión & Liderazgo",
      profileDesc: "Optimización estructural de procesos y dirección estratégica.",
      ops: "Operaciones & Ecosistemas",
      opsDesc: "Casos reales de intervención operativa y desarrollo digital.",
      contact: "Canal Directo",
      contactDesc: "Consultoría administrativa, alianzas e iniciativas ejecutivas."
    },
    aboutText1: "Enfocado en resolver el embotellamiento administrativo que frena el crecimiento de las empresas. A través de Clear Ops Back Office Operations, me especializo en estructurar procedimientos operativos estándar (SOPs), auditar flujos de trabajo e implementar arquitecturas digitales modernas.",
    aboutText2: "Mi enfoque combina la disciplina estratégica de la gestión institucional con herramientas tecnológicas de última generación (Node, Supabase, interfaces automatizadas y Next.js) para transformar áreas operativas obsoletas en sistemas ágiles y medibles.",
    clearOpsTitle: "Clear Ops Back Office Operations",
    clearOpsDesc: "Firma de consultoría enfocada en erradicar cuellos de botella administrativos. Diseñamos e implementamos flujos de trabajo automatizados, arquitecturas de datos y modelos operacionales para empresas que necesitan escalar sin aumentar desproporcionadamente su carga operativa.",
    sportsTitle: "Administración Institucional & Deportiva",
    sportsDesc: "Dirección estratégica ejecutiva en la presidencia de ligas deportivas. Gestión de operaciones generales, estructuración de calendarios de torneos, coordinación logística regional y selección técnica de equipos competitivos.",
    techTitle: "Infraestructura & Automatización Digital",
    techDesc: "Desarrollo e implementación de plataformas web customizadas e integraciones de bases de datos para proyectos del sector privado (incluyendo sistemas de gestión médica como Marca Dental) y herramientas internas de automatización.",
    formTitle: "Iniciar Conversación Directa",
    formSub: "Para consultorías operativas, dirección de proyectos o alianzas estratégicas.",
    namePlaceholder: "Tu Nombre / Empresa",
    emailPlaceholder: "correo@dominio.com",
    msgPlaceholder: "Detalla brevemente el contexto operativo o consulta...",
    sendBtn: "Enviar Mensaje Directo",
    sentMsg: "¡Mensaje listo! Se abrirá tu cliente de correo predeterminado."
  },
  en: {
    role: "OPERATIONS ARCHITECTURE & EXECUTIVE DIRECTION",
    name: "Jimmy Cornejo",
    bio: "Specializing in back-office optimization, administrative workflow architecture, and deploying modern tech ecosystems to eliminate operational friction.",
    tabs: { home: "Home", about: "Profile", operations: "Initiatives", contact: "Contact" },
    metrics: [
      { value: "Clear Ops", label: "Back-Office Operations" },
      { value: "+80%", label: "Friction Reduction" },
      { value: "Sports Exec", label: "Institutional Leadership" }
    ],
    cards: {
      profile: "Vision & Leadership",
      profileDesc: "Structural process optimization and strategic execution.",
      ops: "Operations & Systems",
      opsDesc: "Real-world operational overhauls and digital deployments.",
      contact: "Direct Channel",
      contactDesc: "Executive consulting, strategic partnerships, and inquiries."
    },
    aboutText1: "Dedicated to solving the administrative bottlenecks that stall business expansion. Through Clear Ops Back Office Operations, I focus on engineering Standard Operating Procedures (SOPs), auditing workflow inefficiencies, and deploying modern digital back-office infrastructure.",
    aboutText2: "My approach integrates executive discipline from institutional sports leadership with cutting-edge tech frameworks (Node, Supabase, automated interfaces, and Next.js) to transform stagnant administrative units into high-throughput systems.",
    clearOpsTitle: "Clear Ops Back Office Operations",
    clearOpsDesc: "Consulting framework specialized in eliminating operational friction. Designing automated workflows, database architectures, and back-office logistics for companies scaling beyond legacy processes.",
    sportsTitle: "Institutional & Sports League Administration",
    sportsDesc: "Executive direction as President of regional sports leagues. Overseeing governance, tournament scheduling, operational logistics, and competitive team selection management.",
    techTitle: "Digital Infrastructure & Process Automation",
    techDesc: "Building custom web platforms and database integrations for specialized private sectors (including dental clinic management platforms like Marca Dental) and automated internal tooling.",
    formTitle: "Direct Strategic Channel",
    formSub: "Reach out for operational consulting, executive direction, or partnerships.",
    namePlaceholder: "Your Name / Organization",
    emailPlaceholder: "name@company.com",
    msgPlaceholder: "Outline your operational bottleneck or project goals...",
    sendBtn: "Dispatch Message",
    sentMsg: "Message staged! Opening default mail client."
  }
};

export default function App() {
  const [tab, setTab] = useState("home");
  const [lang, setLang] = useState("es");
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const t = content[lang];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.2 } }
  };

  const cardStyle = {
    background: "rgba(10, 12, 20, 0.55)",
    backdropFilter: "blur(32px)",
    WebkitBackdropFilter: "blur(32px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "20px",
    padding: "32px",
    marginBottom: "20px",
    boxShadow: "0 30px 60px rgba(0, 0, 0, 0.4)",
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      const mailtoUrl = "mailto:contacto@jimmycornejo.com?subject=Inquiry from " + encodeURIComponent(formData.name) + "&body=" + encodeURIComponent(formData.message) + " (Reply to: " + encodeURIComponent(formData.email) + ")";
      window.location.href = mailtoUrl;
    }, 800);
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <LumaFluidCanvas />

      <div style={{ maxWidth: "820px", margin: "0 auto", padding: "40px 24px", width: "100%", position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column" }}>

        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "48px", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "20px" }}>
          <div
            onClick={() => setTab("home")}
            style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}
          >
            <div style={{ width: "38px", height: "38px", borderRadius: "12px", background: "linear-gradient(135deg, rgba(56,189,248,0.2), rgba(168,85,247,0.2))", border: "1px solid rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "13px", color: "#fff" }}>
              JC
            </div>
            <span style={{ fontSize: "14px", fontWeight: "600", color: "#f4f4f5", letterSpacing: "-0.01em" }}>
              Jimmy Cornejo
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <nav style={{ display: "flex", gap: "6px", background: "rgba(255,255,255,0.03)", padding: "4px", borderRadius: "30px", border: "1px solid rgba(255,255,255,0.06)" }}>
              {["home", "about", "operations", "contact"].map((key) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  style={{
                    background: tab === key ? "rgba(255, 255, 255, 0.12)" : "transparent",
                    border: tab === key ? "1px solid rgba(255, 255, 255, 0.2)" : "1px solid transparent",
                    color: tab === key ? "#ffffff" : "#a1a1aa",
                    padding: "7px 16px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                  }}
                >
                  {t.tabs[key]}
                </button>
              ))}
            </nav>

            <button
              onClick={() => setLang(lang === "es" ? "en" : "es")}
              style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#38bdf8", padding: "7px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "600", cursor: "pointer", fontFamily: "JetBrains Mono, monospace" }}
            >
              <Globe size={12} />
              {lang.toUpperCase()}
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">

          {tab === "home" && (
            <motion.main key="home" variants={cardVariants} initial="hidden" animate="visible" exit="exit">
              <div style={cardStyle}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "5px 14px", borderRadius: "20px", background: "rgba(56, 189, 248, 0.08)", border: "1px solid rgba(56, 189, 248, 0.25)", fontSize: "10px", fontFamily: "JetBrains Mono, monospace", color: "#38bdf8", marginBottom: "22px", letterSpacing: "0.05em" }}>
                  <Sparkles size={12} />
                  {t.role}
                </div>

                <h1 style={{ fontSize: "44px", fontWeight: "700", margin: "0 0 16px 0", color: "#ffffff", letterSpacing: "-0.03em", lineHeight: "1.1" }}>
                  {t.name}
                </h1>

                <p style={{ color: "#a1a1aa", fontSize: "16px", lineHeight: "1.7", margin: 0, maxWidth: "620px", fontWeight: "300" }}>
                  {t.bio}
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginTop: "36px", paddingTop: "28px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  {t.metrics.map((m, idx) => (
                    <div key={idx}>
                      <div style={{ fontSize: "20px", fontWeight: "700", color: "#ffffff", letterSpacing: "-0.02em" }}>{m.value}</div>
                      <div style={{ fontSize: "11px", color: "#71717a", marginTop: "4px", fontWeight: "400" }}>{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
                <motion.div whileHover={{ y: -4 }} style={{ ...cardStyle, padding: "24px", cursor: "pointer" }} onClick={() => setTab("about")}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <ShieldCheck size={20} color="#38bdf8" />
                    <ArrowUpRight size={16} color="#71717a" />
                  </div>
                  <h3 style={{ margin: "0 0 6px 0", fontSize: "15px", fontWeight: "600", color: "#fff" }}>{t.cards.profile}</h3>
                  <p style={{ margin: 0, fontSize: "12px", color: "#71717a", lineHeight: "1.5" }}>{t.cards.profileDesc}</p>
                </motion.div>

                <motion.div whileHover={{ y: -4 }} style={{ ...cardStyle, padding: "24px", cursor: "pointer" }} onClick={() => setTab("operations")}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <Cpu size={20} color="#a855f7" />
                    <ArrowUpRight size={16} color="#71717a" />
                  </div>
                  <h3 style={{ margin: "0 0 6px 0", fontSize: "15px", fontWeight: "600", color: "#fff" }}>{t.cards.ops}</h3>
                  <p style={{ margin: 0, fontSize: "12px", color: "#71717a", lineHeight: "1.5" }}>{t.cards.opsDesc}</p>
                </motion.div>

                <motion.div whileHover={{ y: -4 }} style={{ ...cardStyle, padding: "24px", cursor: "pointer" }} onClick={() => setTab("contact")}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <Building2 size={20} color="#34d399" />
                    <ArrowUpRight size={16} color="#71717a" />
                  </div>
                  <h3 style={{ margin: "0 0 6px 0", fontSize: "15px", fontWeight: "600", color: "#fff" }}>{t.cards.contact}</h3>
                  <p style={{ margin: 0, fontSize: "12px", color: "#71717a", lineHeight: "1.5" }}>{t.cards.contactDesc}</p>
                </motion.div>
              </div>
            </motion.main>
          )}

          {tab === "about" && (
            <motion.main key="about" variants={cardVariants} initial="hidden" animate="visible" exit="exit">
              <div style={cardStyle}>
                <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#fff", marginTop: 0, marginBottom: "20px", letterSpacing: "-0.02em" }}>
                  {t.cards.profile}
                </h2>
                <p style={{ color: "#d4d4d8", fontSize: "15px", lineHeight: "1.8", marginBottom: "20px", fontWeight: "300" }}>
                  {t.aboutText1}
                </p>
                <p style={{ color: "#a1a1aa", fontSize: "15px", lineHeight: "1.8", margin: 0, fontWeight: "300" }}>
                  {t.aboutText2}
                </p>
              </div>
            </motion.main>
          )}

          {tab === "operations" && (
            <motion.main key="operations" variants={cardVariants} initial="hidden" animate="visible" exit="exit">
              <div style={cardStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                  <Cpu size={18} color="#38bdf8" />
                  <span style={{ fontSize: "11px", fontFamily: "JetBrains Mono, monospace", color: "#38bdf8", textTransform: "uppercase", letterSpacing: "1px" }}>Consulting & Back-Office</span>
                </div>
                <h3 style={{ fontSize: "20px", fontWeight: "600", color: "#fff", margin: "0 0 12px 0" }}>{t.clearOpsTitle}</h3>
                <p style={{ color: "#a1a1aa", fontSize: "14px", margin: 0, lineHeight: "1.7", fontWeight: "300" }}>
                  {t.clearOpsDesc}
                </p>
              </div>

              <div style={cardStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                  <Building2 size={18} color="#a855f7" />
                  <span style={{ fontSize: "11px", fontFamily: "JetBrains Mono, monospace", color: "#a855f7", textTransform: "uppercase", letterSpacing: "1px" }}>Sports Administration</span>
                </div>
                <h3 style={{ fontSize: "20px", fontWeight: "600", color: "#fff", margin: "0 0 12px 0" }}>{t.sportsTitle}</h3>
                <p style={{ color: "#a1a1aa", fontSize: "14px", margin: 0, lineHeight: "1.7", fontWeight: "300" }}>
                  {t.sportsDesc}
                </p>
              </div>

              <div style={{ ...cardStyle, marginBottom: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                  <ShieldCheck size={18} color="#34d399" />
                  <span style={{ fontSize: "11px", fontFamily: "JetBrains Mono, monospace", color: "#34d399", textTransform: "uppercase", letterSpacing: "1px" }}>Tech Infrastructure</span>
                </div>
                <h3 style={{ fontSize: "20px", fontWeight: "600", color: "#fff", margin: "0 0 12px 0" }}>{t.techTitle}</h3>
                <p style={{ color: "#a1a1aa", fontSize: "14px", margin: 0, lineHeight: "1.7", fontWeight: "300" }}>
                  {t.techDesc}
                </p>
              </div>
            </motion.main>
          )}

          {tab === "contact" && (
            <motion.main key="contact" variants={cardVariants} initial="hidden" animate="visible" exit="exit">
              <div style={cardStyle}>
                <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#fff", marginTop: 0, marginBottom: "8px", letterSpacing: "-0.02em" }}>
                  {t.formTitle}
                </h2>
                <p style={{ color: "#a1a1aa", fontSize: "14px", lineHeight: "1.6", marginBottom: "28px", fontWeight: "300" }}>
                  {t.formSub}
                </p>

                {submitted ? (
                  <div style={{ padding: "20px", borderRadius: "12px", background: "rgba(52, 211, 153, 0.1)", border: "1px solid rgba(52, 211, 153, 0.3)", color: "#34d399", display: "flex", alignItems: "center", gap: "12px", fontSize: "14px" }}>
                    <CheckCircle2 size={20} />
                    {t.sentMsg}
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <input
                      type="text"
                      required
                      placeholder={t.namePlaceholder}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "14px 16px", color: "#fff", fontSize: "14px", outline: "none" }}
                    />
                    <input
                      type="email"
                      required
                      placeholder={t.emailPlaceholder}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "14px 16px", color: "#fff", fontSize: "14px", outline: "none" }}
                    />
                    <textarea
                      rows={4}
                      required
                      placeholder={t.msgPlaceholder}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "14px 16px", color: "#fff", fontSize: "14px", outline: "none", resize: "none" }}
                    />
                    <button
                      type="submit"
                      style={{ background: "#ffffff", color: "#000000", border: "none", padding: "14px 28px", borderRadius: "12px", fontSize: "13px", fontWeight: "600", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "8px" }}
                    >
                      <Send size={14} />
                      {t.sendBtn}
                    </button>
                  </form>
                )}
              </div>
            </motion.main>
          )}

        </AnimatePresence>

        <footer style={{ marginTop: "auto", paddingTop: "40px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: "#52525b" }}>
          <span>Jimmy Cornejo — Back Office Operations</span>
          <span style={{ fontFamily: "JetBrains Mono, monospace" }}>2026</span>
        </footer>

      </div>
    </div>
  );
}
`;

fs.writeFileSync("app/globals.css", css, "utf8");
fs.writeFileSync("app/page.tsx", page, "utf8");
console.log("Fondo estilo Luma aplicado con éxito!");

