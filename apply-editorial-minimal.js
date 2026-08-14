const fs = require("fs");

const page = `"use client";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, ArrowUpRight, CheckCircle2, Send, ShieldCheck, Cpu, Building2 } from "lucide-react";

function LumaStarfieldCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030308, 0.08);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const count = 600;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 6);
    const colors = new Float32Array(count * 6);

    const stars = [];

    const colorPalette = [
      new THREE.Color("#38bdf8"),
      new THREE.Color("#818cf8"),
      new THREE.Color("#c084fc"),
      new THREE.Color("#ffffff"),
    ];

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 20;
      const z = Math.random() * -30;
      const len = 0.4 + Math.random() * 0.8;
      const speed = 0.15 + Math.random() * 0.25;

      const baseColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];

      stars.push({ x, y, z, len, speed, baseColor });

      positions[i * 6] = x;
      positions[i * 6 + 1] = y;
      positions[i * 6 + 2] = z;

      positions[i * 6 + 3] = x;
      positions[i * 6 + 4] = y;
      positions[i * 6 + 5] = z - len;

      colors[i * 6] = baseColor.r;
      colors[i * 6 + 1] = baseColor.g;
      colors[i * 6 + 2] = baseColor.b;

      colors[i * 6 + 3] = baseColor.r * 0.2;
      colors[i * 6 + 4] = baseColor.g * 0.2;
      colors[i * 6 + 5] = baseColor.b * 0.2;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      linewidth: 1.5,
    });

    const linesMesh = new THREE.LineSegments(geometry, material);
    scene.add(linesMesh);

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 0.8;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 0.8;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    let animId;
    const animate = () => {
      const posArr = geometry.attributes.position.array;

      for (let i = 0; i < count; i++) {
        const star = stars[i];

        star.z += star.speed;

        if (star.z > 2) {
          star.z = -30;
          star.x = (Math.random() - 0.5) * 20;
          star.y = (Math.random() - 0.5) * 20;
        }

        posArr[i * 6] = star.x;
        posArr[i * 6 + 1] = star.y;
        posArr[i * 6 + 2] = star.z;

        posArr[i * 6 + 3] = star.x;
        posArr[i * 6 + 4] = star.y;
        posArr[i * 6 + 5] = star.z - star.len;
      }

      geometry.attributes.position.needsUpdate = true;

      camera.position.x += (mouseX - camera.position.x) * 0.04;
      camera.position.y += (-mouseY - camera.position.y) * 0.04;
      camera.rotation.z += 0.0005;

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
    heroTitle1: "Operaciones",
    heroTitle2: "Digitales",
    pillars: [
      { tag: "CLEAR OPS", title: "Administración", color: "#38bdf8", tab: "operations" },
      { tag: "ESTRATEGIA", title: "Flujos de Trabajo", color: "#a855f7", tab: "operations" },
      { tag: "SOPORTE", title: "Soluciones Back-Office", color: "#34d399", tab: "about" }
    ],
    bio: "Espacio digital de Jimmy Cornejo. Optimización de procesos administrativos, estructuración de flujos de trabajo e innovación operacional para empresas e instituciones.",
    tabs: { home: "INICIO", about: "PERFIL", operations: "INICIATIVAS", contact: "CONTACTO" },
    contactBtn: "CONTACTAME",
    aboutText1: "Me especializo en resolver la fricción administrativa que frena el crecimiento operativo. A través de Clear Ops Back Office Operations, diseño e implemento procedimientos operativos estándar (SOPs), organizo estructuras organizacionales y optimizo flujos de trabajo.",
    aboutText2: "Combinando visión estratégica y herramientas de productividad digital para transformar áreas operativas en sistemas ágiles y medibles.",
    clearOpsTitle: "Clear Ops Back Office Operations",
    clearOpsDesc: "Consultoría de back-office orientada a erradicar cuellos de botella administrativos y escalar flujos operacionales.",
    sportsTitle: "Dirección Institucional & Deportiva",
    sportsDesc: "Administración ejecutiva en ligas deportivas, gestión de calendarios, logística de competencias y coordinación general.",
    techTitle: "Soporte de Infraestructura Digital",
    techDesc: "Estructuración de entornos de trabajo digitales e integración de plataformas informáticas para la gestión del día a día.",
    formTitle: "Iniciar Contacto Directo",
    formSub: "Completa tus datos para agendar una consulta o propuesta de colaboración.",
    namePlaceholder: "Tu Nombre o Empresa",
    emailPlaceholder: "tu@correo.com",
    msgPlaceholder: "Cuéntame sobre el flujo u operación que deseas optimizar...",
    sendBtn: "Enviar Mensaje",
    sentMsg: "¡Mensaje enviado! Se abrirá tu aplicación de correo."
  },
  en: {
    heroTitle1: "Digital",
    heroTitle2: "Operations",
    pillars: [
      { tag: "CLEAR OPS", title: "Administration", color: "#38bdf8", tab: "operations" },
      { tag: "STRATEGY", title: "Workflows", color: "#a855f7", tab: "operations" },
      { tag: "SUPPORT", title: "Back-Office Solutions", color: "#34d399", tab: "about" }
    ],
    bio: "Jimmy Cornejo digital space. Dedicated to optimizing administrative workflows, eliminating operational bottlenecks, and structuring efficient back-office ecosystems.",
    tabs: { home: "HOME", about: "PROFILE", operations: "INITIATIVES", contact: "CONTACT" },
    contactBtn: "CONTACT ME",
    aboutText1: "I specialize in eliminating administrative friction that stalls business growth. Through Clear Ops Back Office Operations, I engineer Standard Operating Procedures (SOPs), audit internal bottlenecks, and structure seamless digital operations.",
    aboutText2: "Combining executive leadership with modern digital tools to transform slow back-office operations into high-throughput systems.",
    clearOpsTitle: "Clear Ops Back Office Operations",
    clearOpsDesc: "Back-office advisory aimed at eliminating operational friction and enabling scalable internal workflows.",
    sportsTitle: "Institutional & Sports Direction",
    sportsDesc: "Executive management for sports leagues, overseeing governance, tournament logistics, and operational planning.",
    techTitle: "Digital Infrastructure Support",
    techDesc: "Structuring modern digital workspaces and administrative tools for smooth operational visibility.",
    formTitle: "Direct Contact",
    formSub: "Fill out the form below to initiate operational consulting or project inquiries.",
    namePlaceholder: "Your Name or Company",
    emailPlaceholder: "you@email.com",
    msgPlaceholder: "Briefly detail the operational bottleneck or project goals...",
    sendBtn: "Dispatch Message",
    sentMsg: "Message staged! Opening default email application."
  }
};

export default function App() {
  const [tab, setTab] = useState("home");
  const [lang, setLang] = useState("es");
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const t = content[lang];

  const pageVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.2 } }
  };

  const glassBoxStyle = {
    background: "rgba(10, 12, 22, 0.5)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "24px",
    padding: "48px 40px",
    boxShadow: "0 30px 60px rgba(0, 0, 0, 0.45)",
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      const mailtoUrl = "mailto:contacto@jimmycornejo.com?subject=Contacto desde Web - " + encodeURIComponent(formData.name) + "&body=" + encodeURIComponent(formData.message) + " (Responder a: " + encodeURIComponent(formData.email) + ")";
      window.location.href = mailtoUrl;
    }, 800);
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <LumaStarfieldCanvas />

      <div style={{ maxWidth: "980px", margin: "0 auto", padding: "40px 24px", width: "100%", position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column" }}>

        {/* HEADER LIMPIO TIPO EJEMPLO */}
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "64px" }}>
          <div
            onClick={() => setTab("home")}
            style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}
          >
            <span style={{ fontSize: "15px", fontWeight: "800", color: "#ffffff", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              JIMMY CORNEJO
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
            <nav style={{ display: "flex", gap: "24px" }}>
              {["home", "about", "operations"].map((key) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  style={{
                    background: "none",
                    border: "none",
                    color: tab === key ? "#ffffff" : "#888893",
                    fontSize: "12px",
                    fontWeight: "600",
                    letterSpacing: "0.1em",
                    cursor: "pointer",
                    transition: "color 0.2s ease",
                    padding: 0,
                    borderBottom: tab === key ? "2px solid #38bdf8" : "2px solid transparent",
                    paddingBottom: "4px"
                  }}
                >
                  {t.tabs[key]}
                </button>
              ))}
            </nav>

            <button
              onClick={() => setTab("contact")}
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "#ffffff",
                padding: "8px 20px",
                borderRadius: "4px",
                fontSize: "11px",
                fontWeight: "700",
                letterSpacing: "0.12em",
                cursor: "pointer",
                transition: "all 0.25s ease"
              }}
            >
              {t.contactBtn}
            </button>

            <button
              onClick={() => setLang(lang === "es" ? "en" : "es")}
              style={{ display: "flex", alignItems: "center", gap: "4px", background: "none", border: "none", color: "#38bdf8", fontSize: "11px", fontWeight: "600", cursor: "pointer", fontFamily: "JetBrains Mono, monospace" }}
            >
              <Globe size={12} />
              {lang.toUpperCase()}
            </button>
          </div>
        </header>

        {/* CONTENIDO PRINCIPAL */}
        <AnimatePresence mode="wait">

          {/* HOME TIPO EDITORIAL */}
          {tab === "home" && (
            <motion.main key="home" variants={pageVariants} initial="hidden" animate="visible" exit="exit" style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
              
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "40px", alignItems: "start" }}>
                <div>
                  <h1 style={{ fontSize: "76px", fontWeight: "300", color: "rgba(255, 255, 255, 0.9)", margin: 0, lineHeight: "0.95", letterSpacing: "-0.04em" }}>
                    {t.heroTitle1}
                  </h1>
                  <h1 style={{ fontSize: "76px", fontWeight: "800", color: "#ffffff", margin: "0 0 32px 0", lineHeight: "0.95", letterSpacing: "-0.04em" }}>
                    {t.heroTitle2}
                  </h1>

                  {/* PILARES CON PUNTOS DE COLOR */}
                  <div style={{ display: "flex", gap: "28px", flexWrap: "wrap", marginTop: "40px" }}>
                    {t.pillars.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => setTab(item.tab)}
                        style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
                      >
                        <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: item.color }} />
                        <div>
                          <div style={{ fontSize: "10px", fontFamily: "JetBrains Mono, monospace", color: "#666673", letterSpacing: "0.08em" }}>{item.tag}</div>
                          <div style={{ fontSize: "15px", fontWeight: "700", color: "#ffffff", letterSpacing: "-0.01em" }}>{item.title}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* TARJETA LATERAL DE PRESENTACIÓN EN CRISTAL */}
                <div style={{ ...glassBoxStyle, padding: "32px", display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div style={{ fontSize: "11px", fontFamily: "JetBrains Mono, monospace", color: "#38bdf8", letterSpacing: "0.15em" }}>
                    JIMMY CORNEJO
                  </div>
                  <p style={{ color: "#a1a1aa", fontSize: "14px", lineHeight: "1.7", margin: 0, fontWeight: "300" }}>
                    {t.bio}
                  </p>
                  <div
                    onClick={() => setTab("about")}
                    style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#ffffff", fontSize: "12px", fontWeight: "600", cursor: "pointer", marginTop: "8px" }}
                  >
                    <span>Conoce más del perfil</span>
                    <ArrowUpRight size={14} color="#38bdf8" />
                  </div>
                </div>
              </div>

            </motion.main>
          )}

          {/* ACERCA DE / PERFIL */}
          {tab === "about" && (
            <motion.main key="about" variants={pageVariants} initial="hidden" animate="visible" exit="exit">
              <div style={glassBoxStyle}>
                <div style={{ fontSize: "11px", fontFamily: "JetBrains Mono, monospace", color: "#38bdf8", letterSpacing: "0.15em", marginBottom: "12px" }}>
                  PERFIL & VISIÓN
                </div>
                <h2 style={{ fontSize: "32px", fontWeight: "700", color: "#fff", marginTop: 0, marginBottom: "24px", letterSpacing: "-0.02em" }}>
                  Soluciones Administrativas & Operacionales
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

          {/* INICIATIVAS / OPERACIONES */}
          {tab === "operations" && (
            <motion.main key="operations" variants={pageVariants} initial="hidden" animate="visible" exit="exit" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={glassBoxStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <Cpu size={16} color="#38bdf8" />
                  <span style={{ fontSize: "10px", fontFamily: "JetBrains Mono, monospace", color: "#38bdf8", textTransform: "uppercase", letterSpacing: "1px" }}>Consulting & Back-Office</span>
                </div>
                <h3 style={{ fontSize: "20px", fontWeight: "600", color: "#fff", margin: "0 0 10px 0" }}>{t.clearOpsTitle}</h3>
                <p style={{ color: "#a1a1aa", fontSize: "14px", margin: 0, lineHeight: "1.7", fontWeight: "300" }}>
                  {t.clearOpsDesc}
                </p>
              </div>

              <div style={glassBoxStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <Building2 size={16} color="#a855f7" />
                  <span style={{ fontSize: "10px", fontFamily: "JetBrains Mono, monospace", color="#a855f7", textTransform: "uppercase", letterSpacing: "1px" }}>Sports Administration</span>
                </div>
                <h3 style={{ fontSize: "20px", fontWeight: "600", color: "#fff", margin: "0 0 10px 0" }}>{t.sportsTitle}</h3>
                <p style={{ color: "#a1a1aa", fontSize: "14px", margin: 0, lineHeight: "1.7", fontWeight: "300" }}>
                  {t.sportsDesc}
                </p>
              </div>

              <div style={glassBoxStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <ShieldCheck size={16} color="#34d399" />
                  <span style={{ fontSize: "10px", fontFamily: "JetBrains Mono, monospace", color: "#34d399", textTransform: "uppercase", letterSpacing: "1px" }}>Digital Infrastructure</span>
                </div>
                <h3 style={{ fontSize: "20px", fontWeight: "600", color: "#fff", margin: "0 0 10px 0" }}>{t.techTitle}</h3>
                <p style={{ color: "#a1a1aa", fontSize: "14px", margin: 0, lineHeight: "1.7", fontWeight: "300" }}>
                  {t.techDesc}
                </p>
              </div>
            </motion.main>
          )}

          {/* CONTACTO */}
          {tab === "contact" && (
            <motion.main key="contact" variants={pageVariants} initial="hidden" animate="visible" exit="exit">
              <div style={glassBoxStyle}>
                <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#fff", marginTop: 0, marginBottom: "8px", letterSpacing: "-0.02em" }}>
                  {t.formTitle}
                </h2>
                <p style={{ color: "#a1a1aa", fontSize: "14px", lineHeight: "1.6", marginBottom: "32px", fontWeight: "300" }}>
                  {t.formSub}
                </p>

                {submitted ? (
                  <div style={{ padding: "20px", borderRadius: "12px", background: "rgba(52, 211, 153, 0.1)", border: "1px solid rgba(52, 211, 153, 0.25)", color: "#34d399", display: "flex", alignItems: "center", gap: "12px", fontSize: "14px" }}>
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
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "14px 18px", color: "#fff", fontSize: "14px", outline: "none" }}
                    />
                    <input
                      type="email"
                      required
                      placeholder={t.emailPlaceholder}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "14px 18px", color: "#fff", fontSize: "14px", outline: "none" }}
                    />
                    <textarea
                      rows={4}
                      required
                      placeholder={t.msgPlaceholder}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "14px 18px", color: "#fff", fontSize: "14px", outline: "none", resize: "none" }}
                    />
                    <button
                      type="submit"
                      style={{ background: "#ffffff", color: "#000000", border: "none", padding: "14px 28px", borderRadius: "6px", fontSize: "12px", fontWeight: "700", letterSpacing: "0.1em", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "8px" }}
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

        <footer style={{ marginTop: "auto", paddingTop: "48px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", color: "#555560", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <span>JIMMY CORNEJO — BACK OFFICE OPERATIONS</span>
          <span style={{ fontFamily: "JetBrains Mono, monospace" }}>2026</span>
        </footer>

      </div>
    </div>
  );
}
`;

fs.writeFileSync("app/page.tsx", page, "utf8");
console.log("Diseño estilo editorial aplicado sobre el fondo de Luma!");

