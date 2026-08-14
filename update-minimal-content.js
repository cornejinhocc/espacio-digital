const fs = require("fs");

const page = `"use client";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Cpu, Building2, Send, Globe, ArrowUpRight, CheckCircle2, Sparkles } from "lucide-react";

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
    tagline: "ESPACIO DIGITAL",
    name: "Jimmy Cornejo",
    subheading: "Administración, arquitectura de flujos operativos y resolución de cuellos de botella.",
    tabs: { home: "Inicio", about: "Perfil", operations: "Iniciativas", contact: "Contacto" },
    cards: {
      profile: "Perfil & Visión",
      profileDesc: "Optimización estructural de procesos y dirección ejecutiva.",
      ops: "Operaciones & Proyectos",
      opsDesc: "Casos de intervención en back-office y soporte digital.",
      contact: "Contacto",
      contactDesc: "Consultoría administrativa e iniciativas operativas."
    },
    aboutText1: "Enfocado en resolver el embotellamiento administrativo que frena el crecimiento de las empresas. A través de Clear Ops Back Office Operations, me especializo en estructurar procedimientos operativos estándar (SOPs), auditar flujos de trabajo e implementar soluciones de organización digital.",
    aboutText2: "Mi enfoque combina la disciplina estratégica de la gestión institucional con la implementación de herramientas modernas para transformar áreas operativas en sistemas ágiles y ordenados.",
    clearOpsTitle: "Clear Ops Back Office Operations",
    clearOpsDesc: "Servicios enfocados en erradicar cuellos de botella administrativos. Diseñamos e implementamos flujos de trabajo eficientes y modelos operacionales para empresas que necesitan escalar su organización interna.",
    sportsTitle: "Administración Institucional & Deportiva",
    sportsDesc: "Gestión ejecutiva en la dirección de ligas deportivas. Coordinación de operaciones generales, estructuración de calendarios de torneos y logística regional.",
    techTitle: "Soporte & Organización Digital",
    techDesc: "Estructuración de workspaces digitales e integración de herramientas informáticas para la optimización de procesos operativos.",
    formTitle: "Contacto Directo",
    formSub: "Para consultorías operativas o consultas de proyectos.",
    namePlaceholder: "Nombre / Empresa",
    emailPlaceholder: "correo@dominio.com",
    msgPlaceholder: "Detalla brevemente tu consulta...",
    sendBtn: "Enviar Mensaje",
    sentMsg: "¡Mensaje listo! Se abrirá tu cliente de correo predeterminado."
  },
  en: {
    tagline: "DIGITAL SPACE",
    name: "Jimmy Cornejo",
    subheading: "Business administration, workflow architecture, and operational problem-solving.",
    tabs: { home: "Home", about: "Profile", operations: "Initiatives", contact: "Contact" },
    cards: {
      profile: "Profile & Vision",
      profileDesc: "Structural process optimization and administrative leadership.",
      ops: "Operations & Projects",
      opsDesc: "Back-office overhauls and digital organization cases.",
      contact: "Contact",
      contactDesc: "Operational consulting and direct inquiries."
    },
    aboutText1: "Dedicated to solving administrative bottlenecks that stall business efficiency. Through Clear Ops Back Office Operations, I focus on standard operating procedures (SOPs), workflow auditing, and digital workspace organization.",
    aboutText2: "Combining executive discipline with digital productivity tools to turn stagnant back-office processes into clear, efficient workflows.",
    clearOpsTitle: "Clear Ops Back Office Operations",
    clearOpsDesc: "Operational advisory focused on eliminating back-office friction and setting up scalable internal workflows.",
    sportsTitle: "Institutional & Sports Administration",
    sportsDesc: "Executive management for sports leagues, overseeing governance, tournament logistics, and operational planning.",
    techTitle: "Digital Workspace Support",
    techDesc: "Structuring modern digital workflows and administrative tools for clear operational oversight.",
    formTitle: "Direct Inquiry",
    formSub: "Reach out for operational consulting or project management.",
    namePlaceholder: "Name / Organization",
    emailPlaceholder: "name@company.com",
    msgPlaceholder: "Briefly outline your query...",
    sendBtn: "Send Message",
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
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
  };

  const cardStyle = {
    background: "rgba(10, 12, 22, 0.55)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "20px",
    padding: "36px",
    marginBottom: "20px",
    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.4)",
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      const mailtoUrl = "mailto:contacto@jimmycornejo.com?subject=Consulta de " + encodeURIComponent(formData.name) + "&body=" + encodeURIComponent(formData.message) + " (Responder a: " + encodeURIComponent(formData.email) + ")";
      window.location.href = mailtoUrl;
    }, 800);
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <LumaStarfieldCanvas />

      <div style={{ maxWidth: "780px", margin: "0 auto", padding: "48px 24px", width: "100%", position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column" }}>

        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "56px" }}>
          <div
            onClick={() => setTab("home")}
            style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
          >
            <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "600", fontSize: "12px", color: "#fff" }}>
              JC
            </div>
            <span style={{ fontSize: "13px", fontWeight: "500", color: "#a1a1aa", letterSpacing: "0.02em" }}>
              Jimmy Cornejo
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <nav style={{ display: "flex", gap: "4px", background: "rgba(255,255,255,0.03)", padding: "4px", borderRadius: "30px", border: "1px solid rgba(255,255,255,0.06)" }}>
              {["home", "about", "operations", "contact"].map((key) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  style={{
                    background: tab === key ? "rgba(255, 255, 255, 0.12)" : "transparent",
                    border: tab === key ? "1px solid rgba(255, 255, 255, 0.18)" : "1px solid transparent",
                    color: tab === key ? "#ffffff" : "#a1a1aa",
                    padding: "6px 14px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: 400,
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
              style={{ display: "flex", alignItems: "center", gap: "5px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#38bdf8", padding: "6px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "500", cursor: "pointer", fontFamily: "JetBrains Mono, monospace" }}
            >
              <Globe size={11} />
              {lang.toUpperCase()}
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">

          {tab === "home" && (
            <motion.main key="home" variants={cardVariants} initial="hidden" animate="visible" exit="exit" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ ...cardStyle, textAlign: "left", padding: "48px 40px" }}>
                <div style={{ fontSize: "11px", fontFamily: "JetBrains Mono, monospace", color: "#38bdf8", letterSpacing: "0.2em", uppercase: "true", marginBottom: "16px" }}>
                  {t.tagline}
                </div>

                <h1 style={{ fontSize: "48px", fontWeight: "700", margin: "0 0 16px 0", color: "#ffffff", letterSpacing: "-0.03em", lineHeight: "1.05" }}>
                  {t.name}
                </h1>

                <p style={{ color: "#a1a1aa", fontSize: "16px", lineHeight: "1.6", margin: 0, fontWeight: "300", maxWidth: "540px" }}>
                  {t.subheading}
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }}>
                <motion.div whileHover={{ y: -3 }} style={{ ...cardStyle, padding: "20px", margin: 0, cursor: "pointer" }} onClick={() => setTab("about")}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <ShieldCheck size={18} color="#38bdf8" />
                    <ArrowUpRight size={14} color="#52525b" />
                  </div>
                  <h3 style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: "600", color: "#fff" }}>{t.cards.profile}</h3>
                  <p style={{ margin: 0, fontSize: "11px", color: "#71717a", lineHeight: "1.4" }}>{t.cards.profileDesc}</p>
                </motion.div>

                <motion.div whileHover={{ y: -3 }} style={{ ...cardStyle, padding: "20px", margin: 0, cursor: "pointer" }} onClick={() => setTab("operations")}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <Cpu size={18} color="#a855f7" />
                    <ArrowUpRight size={14} color="#52525b" />
                  </div>
                  <h3 style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: "600", color: "#fff" }}>{t.cards.ops}</h3>
                  <p style={{ margin: 0, fontSize: "11px", color: "#71717a", lineHeight: "1.4" }}>{t.cards.opsDesc}</p>
                </motion.div>

                <motion.div whileHover={{ y: -3 }} style={{ ...cardStyle, padding: "20px", margin: 0, cursor: "pointer" }} onClick={() => setTab("contact")}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <Building2 size={18} color="#34d399" />
                    <ArrowUpRight size={14} color="#52525b" />
                  </div>
                  <h3 style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: "600", color: "#fff" }}>{t.cards.contact}</h3>
                  <p style={{ margin: 0, fontSize: "11px", color: "#71717a", lineHeight: "1.4" }}>{t.cards.contactDesc}</p>
                </motion.div>
              </div>
            </motion.main>
          )}

          {tab === "about" && (
            <motion.main key="about" variants={cardVariants} initial="hidden" animate="visible" exit="exit">
              <div style={cardStyle}>
                <h2 style={{ fontSize: "22px", fontWeight: "600", color: "#fff", marginTop: 0, marginBottom: "20px", letterSpacing: "-0.02em" }}>
                  {t.cards.profile}
                </h2>
                <p style={{ color: "#d4d4d8", fontSize: "14px", lineHeight: "1.8", marginBottom: "18px", fontWeight: "300" }}>
                  {t.aboutText1}
                </p>
                <p style={{ color: "#a1a1aa", fontSize: "14px", lineHeight: "1.8", margin: 0, fontWeight: "300" }}>
                  {t.aboutText2}
                </p>
              </div>
            </motion.main>
          )}

          {tab === "operations" && (
            <motion.main key="operations" variants={cardVariants} initial="hidden" animate="visible" exit="exit">
              <div style={cardStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                  <Cpu size={16} color="#38bdf8" />
                  <span style={{ fontSize: "10px", fontFamily: "JetBrains Mono, monospace", color: "#38bdf8", textTransform: "uppercase", letterSpacing: "1px" }}>Consulting & Back-Office</span>
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#fff", margin: "0 0 10px 0" }}>{t.clearOpsTitle}</h3>
                <p style={{ color: "#a1a1aa", fontSize: "13px", margin: 0, lineHeight: "1.7", fontWeight: "300" }}>
                  {t.clearOpsDesc}
                </p>
              </div>

              <div style={cardStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                  <Building2 size={16} color="#a855f7" />
                  <span style={{ fontSize: "10px", fontFamily: "JetBrains Mono, monospace", color: "#a855f7", textTransform: "uppercase", letterSpacing: "1px" }}>Sports Administration</span>
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#fff", margin: "0 0 10px 0" }}>{t.sportsTitle}</h3>
                <p style={{ color: "#a1a1aa", fontSize: "13px", margin: 0, lineHeight: "1.7", fontWeight: "300" }}>
                  {t.sportsDesc}
                </p>
              </div>

              <div style={cardStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                  <ShieldCheck size={16} color="#34d399" />
                  <span style={{ fontSize: "10px", fontFamily: "JetBrains Mono, monospace", color: "#34d399", textTransform: "uppercase", letterSpacing: "1px" }}>Digital Organization</span>
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#fff", margin: "0 0 10px 0" }}>{t.techTitle}</h3>
                <p style={{ color: "#a1a1aa", fontSize: "13px", margin: 0, lineHeight: "1.7", fontWeight: "300" }}>
                  {t.techDesc}
                </p>
              </div>
            </motion.main>
          )}

          {tab === "contact" && (
            <motion.main key="contact" variants={cardVariants} initial="hidden" animate="visible" exit="exit">
              <div style={cardStyle}>
                <h2 style={{ fontSize: "22px", fontWeight: "600", color: "#fff", marginTop: 0, marginBottom: "8px", letterSpacing: "-0.02em" }}>
                  {t.formTitle}
                </h2>
                <p style={{ color: "#a1a1aa", fontSize: "13px", lineHeight: "1.6", marginBottom: "24px", fontWeight: "300" }}>
                  {t.formSub}
                </p>

                {submitted ? (
                  <div style={{ padding: "18px", borderRadius: "12px", background: "rgba(52, 211, 153, 0.1)", border: "1px solid rgba(52, 211, 153, 0.25)", color: "#34d399", display: "flex", alignItems: "center", gap: "10px", fontSize: "13px" }}>
                    <CheckCircle2 size={18} />
                    {t.sentMsg}
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <input
                      type="text"
                      required
                      placeholder={t.namePlaceholder}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "12px 16px", color: "#fff", fontSize: "13px", outline: "none" }}
                    />
                    <input
                      type="email"
                      required
                      placeholder={t.emailPlaceholder}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "12px 16px", color: "#fff", fontSize: "13px", outline: "none" }}
                    />
                    <textarea
                      rows={4}
                      required
                      placeholder={t.msgPlaceholder}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "12px 16px", color: "#fff", fontSize: "13px", outline: "none", resize: "none" }}
                    />
                    <button
                      type="submit"
                      style={{ background: "#ffffff", color: "#000000", border: "none", padding: "12px 24px", borderRadius: "10px", fontSize: "12px", fontWeight: "600", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "4px" }}
                    >
                      <Send size={13} />
                      {t.sendBtn}
                    </button>
                  </form>
                )}
              </div>
            </motion.main>
          )}

        </AnimatePresence>

        <footer style={{ marginTop: "auto", paddingTop: "32px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", color: "#52525b" }}>
          <span>Jimmy Cornejo — Back Office Operations</span>
          <span style={{ fontFamily: "JetBrains Mono, monospace" }}>2026</span>
        </footer>

      </div>
    </div>
  );
}
`;

fs.writeFileSync("app/page.tsx", page, "utf8");
console.log("Contenido actualizado a la versión minimalista!");

