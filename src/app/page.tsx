"use client";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, CheckCircle2, Send, ShieldCheck, Cpu, Building2, Briefcase, Layers, ArrowUpRight } from "lucide-react";

function LumaStarfieldCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

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

    const stars: Array<{ x: number; y: number; z: number; len: number; speed: number; baseColor: THREE.Color }> = [];

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

    const handleMouseMove = (e: MouseEvent) => {
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

    let animId: number;
    const animate = () => {
      const posArr = geometry.attributes.position.array as Float32Array;

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

function Profile3DCard() {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget.getBoundingClientRect();
    const cardWidth = card.width;
    const cardHeight = card.height;
    const centerX = card.left + cardWidth / 2;
    const centerY = card.top + cardHeight / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const rotateXUncapped = (-mouseY / (cardHeight / 2)) * 14;
    const rotateYUncapped = (mouseX / (cardWidth / 2)) * 14;

    setRotate({ x: rotateXUncapped, y: rotateYUncapped });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: "1000px",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <motion.div
        animate={!isHovered ? { y: [0, -10, 0] } : { y: 0 }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{
          width: "100%",
          maxHeight: "400px",
          aspectRatio: "3/4",
          borderRadius: "24px",
          position: "relative",
          transformStyle: "preserve-3d",
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
          transition: isHovered ? "transform 0.1s ease-out" : "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.02))",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(56, 189, 248, 0.3)",
          boxShadow: isHovered
            ? "0 25px 50px -12px rgba(56, 189, 248, 0.3)"
            : "0 20px 40px -15px rgba(0, 0, 0, 0.5)",
          padding: "10px",
          overflow: "hidden"
        }}
      >
        <div style={{
          width: "100%",
          height: "100%",
          borderRadius: "16px",
          overflow: "hidden",
          position: "relative",
          transform: "translateZ(20px)"
        }}>
          <img
            src="/profile.jpg"
            alt="Jimmy Cornejo"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.5s ease",
              transform: isHovered ? "scale(1.05)" : "scale(1)"
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}

const content = {
  es: {
    badge: "JIMMY CORNEJO — MI ESPACIO DIGITAL",
    nameTitle: "JIMMY CORNEJO",
    subBadge: "My Digital Space",
    jobTitle: "Business Administration & Operations",
    bio: "Especialista en estructurar operaciones, resolver cuellos de botella y optimizar la administración de tu negocio.",
    pillars: [
      { 
        title: "Gestión Operativa & Back-Office", 
        desc: "Estandarización de procesos internos, diseño de SOPs, control administrativo continuo y eliminación estratégica de cuellos de botella.", 
        color: "#38bdf8", 
        tab: "portfolio", 
        icon: Briefcase 
      },
      { 
        title: "Dirección Ejecutiva & Coordinación", 
        desc: "Liderazgo organizacional, gestión presupuestaria, planificación logística de proyectos, delegaciones e itinerarios.", 
        color: "#a855f7", 
        tab: "portfolio", 
        icon: Layers 
      },
      { 
        title: "Sistemas de Control & Productividad Digital", 
        desc: "Organización de workspaces digitales (Notion, suites de oficina), modelos de reporte en tiempo real y automatización ligera de flujos de trabajo.", 
        color: "#34d399", 
        tab: "portfolio", 
        icon: ShieldCheck 
      }
    ],
    tabs: { home: "Inicio", about: "Perfil", portfolio: "Especialidades", contact: "Contacto" },
    aboutTitle: "Arquitectura Operativa & Estrategia",
    aboutSub: "Soluciones de alto rendimiento para la gestión administrativa moderna.",
    aboutText1: "Especialista en estructurar y optimizar la columna vertebral operativa de empresas y organizaciones. Mi enfoque radica en convertir procesos lentos o desorganizados en sistemas ágiles, medibles y sostenibles.",
    aboutText2: "A través del diseño de manuales operativos (SOPs), la estructuración de modelos administrativos y el uso eficiente de herramientas digitales de gestión, garantizo un control total sobre las operaciones.",
    clearOpsCategory: "SERVICIOS PRINCIPALES",
    clearOpsTitle: "Gestión Operativa & Back-Office",
    clearOpsDesc: "Servicios integrales de soporte administrativo, control de gestión, resolución de cuellos de botella operativos y estandarización de procesos de trabajo para garantizar continuidad y escalabilidad.",
    sportsCategory: "DIRECCIÓN & COORDINACIÓN",
    sportsTitle: "Dirección Ejecutiva & Coordinación",
    sportsDesc: "Administración integral de recursos, estructuración presupuestaria, planificación logística de proyectos estratégicos y coordinación fluida entre equipos operativos.",
    techCategory: "SISTEMAS & PRODUCTIVIDAD",
    techTitle: "Sistemas de Control & Productividad Digital",
    techDesc: "Implementación de workspaces organizados, plantillas de reporte administrativo en tiempo real e integración de herramientas digitales para optimizar la comunicación interna.",
    formTitle: "Iniciar Conversación",
    formSub: "Cuéntame sobre tu empresa u operación para evaluar cómo optimizar tus procesos.",
    namePlaceholder: "Nombre completo o empresa",
    emailPlaceholder: "correo@ejemplo.com",
    msgPlaceholder: "Describe brevemente los procesos o cuellos de botella que deseas optimizar...",
    sendBtn: "Enviar Mensaje",
    sentMsg: "¡Mensaje preparado con éxito! Se abrirá tu aplicación de correo."
  },
  en: {
    badge: "JIMMY CORNEJO — MY DIGITAL SPACE",
    nameTitle: "JIMMY CORNEJO",
    subBadge: "My Digital Space",
    jobTitle: "Business Administration & Operations",
    bio: "Specializing in operational structuring, resolving bottlenecks, and refining administrative workflows for growing businesses.",
    pillars: [
      { 
        title: "Operations & Back-Office Management", 
        desc: "Internal process standardization, SOP creation, continuous administrative oversight, and bottleneck elimination.", 
        color: "#38bdf8", 
        tab: "portfolio", 
        icon: Briefcase 
      },
      { 
        title: "Executive Leadership & Coordination", 
        desc: "Organizational leadership, budget management, project logistics planning, delegations, and itineraries.", 
        color: "#a855f7", 
        tab: "portfolio", 
        icon: Layers 
      },
      { 
        title: "Digital Control & Productivity Systems", 
        desc: "Digital workspace organization (Notion, office suites), real-time reporting models, and streamlined administrative workflows.", 
        color: "#34d399", 
        tab: "portfolio", 
        icon: ShieldCheck 
      }
    ],
    tabs: { home: "Home", about: "Profile", portfolio: "Specialties", contact: "Contact" },
    aboutTitle: "Operational Architecture & Strategy",
    aboutSub: "High-performance solutions for modern administrative governance.",
    aboutText1: "Specializing in structuring and refining the operational backbone of businesses and organizations. I transform slow or fragmented workflows into agile, measurable, and efficient systems.",
    aboutText2: "By engineering Standard Operating Procedures (SOPs), structuring administrative models, and leveraging practical digital management tools, I ensure complete operational visibility.",
    clearOpsCategory: "CORE SERVICES",
    clearOpsTitle: "Operations & Back-Office Management",
    clearOpsDesc: "Comprehensive administrative support, operational auditing, friction elimination, and process standardization to drive scalability and accuracy.",
    sportsCategory: "LEADERSHIP & LOGISTICS",
    sportsTitle: "Executive Leadership & Coordination",
    sportsDesc: "Resource management, budget planning, strategic project execution, and seamless coordination across teams and stakeholders.",
    techCategory: "SYSTEMS & PRODUCTIVITY",
    techTitle: "Digital Control & Productivity Systems",
    techDesc: "Deployment of structured workspaces, real-time administrative reporting models, and digital tools integration to optimize operational output.",
    formTitle: "Initiate Contact",
    formSub: "Detail your operational goals or bottlenecks to receive a tailored strategic plan.",
    namePlaceholder: "Full Name or Organization",
    emailPlaceholder: "you@example.com",
    msgPlaceholder: "Briefly outline the operational bottlenecks or workflows you want to optimize...",
    sendBtn: "Dispatch Message",
    sentMsg: "Message staged successfully! Opening default email client."
  }
};

export default function App() {
  const [tab, setTab] = useState<"home" | "about" | "portfolio" | "contact">("home");
  const [lang, setLang] = useState<"es" | "en">("es");
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const t = content[lang];

  const pageVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.2 } }
  };

  const glassBoxStyle: React.CSSProperties = {
    background: "rgba(10, 12, 22, 0.75)",
    backdropFilter: "blur(28px)",
    WebkitBackdropFilter: "blur(28px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "24px",
    padding: "40px 36px",
    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.6)"
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      const mailtoUrl = `mailto:contacto@jimmycornejo.com?subject=Contacto desde Web - ${encodeURIComponent(formData.name)}&body=${encodeURIComponent(formData.message)} (Responder a: ${encodeURIComponent(formData.email)})`;
      window.location.href = mailtoUrl;
    }, 800);
  };

  return (
    <div style={{
      position: "relative",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#030308",
      color: "#f8fafc",
      fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      <LumaStarfieldCanvas />

      <div style={{ maxWidth: "1080px", margin: "0 auto", padding: "36px 24px", width: "100%", position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column" }}>

        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "48px" }}>
          <div onClick={() => setTab("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{
              fontSize: "20px",
              fontWeight: "900",
              color: "#ffffff",
              letterSpacing: "0.1em",
              background: "linear-gradient(135deg, #ffffff 0%, #38bdf8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              JC
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <nav style={{ display: "flex", gap: "24px" }}>
              {(["home", "about", "portfolio"] as const).map((key) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  style={{
                    background: "none",
                    border: "none",
                    color: tab === key ? "#ffffff" : "#94a3b8",
                    fontSize: "14px",
                    fontWeight: tab === key ? "600" : "500",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    padding: "4px 0",
                    borderBottom: tab === key ? "2px solid #38bdf8" : "2px solid transparent"
                  }}
                >
                  {t.tabs[key]}
                </button>
              ))}
            </nav>

            <button
              onClick={() => setTab("contact")}
              style={{
                background: tab === "contact" ? "#ffffff" : "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: tab === "contact" ? "#000000" : "#ffffff",
                padding: "8px 20px",
                borderRadius: "100px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.25s ease"
              }}
            >
              {t.tabs.contact}
            </button>

            <button
              onClick={() => setLang(lang === "es" ? "en" : "es")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                padding: "6px 12px",
                borderRadius: "8px",
                color: "#38bdf8",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
                fontFamily: "monospace"
              }}
            >
              <Globe size={13} />
              {lang.toUpperCase()}
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {tab === "home" && (
            <motion.main key="home" variants={pageVariants} initial="hidden" animate="visible" exit="exit" style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "40px", alignItems: "center" }}>
                <div>
                  <h1 style={{ fontSize: "52px", fontWeight: "900", color: "#ffffff", margin: "0 0 6px 0", lineHeight: "1.05", letterSpacing: "0.02em" }}>
                    {t.nameTitle}
                  </h1>

                  <div style={{ fontSize: "16px", fontWeight: "600", color: "#64748b", margin: "0 0 16px 0", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    {t.subBadge}
                  </div>

                  <h2 style={{ fontSize: "22px", fontWeight: "600", color: "#38bdf8", margin: "0 0 20px 0", lineHeight: "1.3" }}>
                    {t.jobTitle}
                  </h2>

                  <p style={{ color: "#cbd5e1", fontSize: "17px", lineHeight: "1.6", margin: 0, fontWeight: "400", maxWidth: "540px" }}>
                    {t.bio}
                  </p>
                </div>

                <Profile3DCard />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
                {t.pillars.map((item, idx) => {
                  const IconComp = item.icon;
                  return (
                    <motion.div
                      key={idx}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      onClick={() => setTab(item.tab as "home" | "about" | "portfolio" | "contact")}
                      style={{
                        background: "rgba(15, 23, 42, 0.65)",
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "20px",
                        padding: "24px",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                        boxShadow: "0 15px 30px rgba(0,0,0,0.3)"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "10px",
                          background: item.color + "1A",
                          border: "1px solid " + item.color + "50",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: item.color
                        }}>
                          <IconComp size={20} />
                        </div>
                        <ArrowUpRight size={18} color="#64748b" />
                      </div>

                      <div>
                        <div style={{ fontSize: "16px", fontWeight: "700", color: "#ffffff", marginBottom: "8px" }}>
                          {item.title}
                        </div>
                        <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8", lineHeight: "1.5", fontWeight: "400" }}>
                          {item.desc}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.main>
          )}

          {tab === "about" && (
            <motion.main key="about" variants={pageVariants} initial="hidden" animate="visible" exit="exit">
              <div style={glassBoxStyle}>
                <div style={{ fontSize: "12px", fontFamily: "monospace", color: "#38bdf8", letterSpacing: "0.15em", marginBottom: "12px", fontWeight: "600" }}>
                  PERFIL PROFESIONAL
                </div>
                <h2 style={{ fontSize: "32px", fontWeight: "800", color: "#ffffff", marginTop: 0, marginBottom: "8px" }}>
                  {t.aboutTitle}
                </h2>
                <div style={{ fontSize: "16px", color: "#38bdf8", marginBottom: "24px", fontWeight: "500" }}>
                  {t.aboutSub}
                </div>
                <p style={{ color: "#e2e8f0", fontSize: "15px", lineHeight: "1.8", marginBottom: "16px", fontWeight: "400" }}>
                  {t.aboutText1}
                </p>
                <p style={{ color: "#94a3b8", fontSize: "15px", lineHeight: "1.8", margin: 0, fontWeight: "400" }}>
                  {t.aboutText2}
                </p>
              </div>
            </motion.main>
          )}

          {tab === "portfolio" && (
            <motion.main key="portfolio" variants={pageVariants} initial="hidden" animate="visible" exit="exit" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={glassBoxStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                  <Cpu size={16} color="#38bdf8" />
                  <span style={{ fontSize: "12px", fontFamily: "monospace", color: "#38bdf8", letterSpacing: "1px", fontWeight: "600" }}>{t.clearOpsCategory}</span>
                </div>
                <h3 style={{ fontSize: "22px", fontWeight: "700", color: "#ffffff", margin: "0 0 10px 0" }}>{t.clearOpsTitle}</h3>
                <p style={{ color: "#cbd5e1", fontSize: "15px", margin: 0, lineHeight: "1.7", fontWeight: "400" }}>
                  {t.clearOpsDesc}
                </p>
              </div>

              <div style={glassBoxStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                  <Building2 size={16} color="#a855f7" />
                  <span style={{ fontSize: "12px", fontFamily: "monospace", color="#a855f7", letterSpacing: "1px", fontWeight: "600" }}>{t.sportsCategory}</span>
                </div>
                <h3 style={{ fontSize: "22px", fontWeight: "700", color: "#ffffff", margin: "0 0 10px 0" }}>{t.sportsTitle}</h3>
                <p style={{ color: "#cbd5e1", fontSize: "15px", margin: 0, lineHeight: "1.7", fontWeight: "400" }}>
                  {t.sportsDesc}
                </p>
              </div>

              <div style={glassBoxStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                  <ShieldCheck size={16} color="#34d399" />
                  <span style={{ fontSize: "12px", fontFamily: "monospace", color: "#34d399", letterSpacing: "1px", fontWeight: "600" }}>{t.techCategory}</span>
                </div>
                <h3 style={{ fontSize: "22px", fontWeight: "700", color: "#ffffff", margin: "0 0 10px 0" }}>{t.techTitle}</h3>
                <p style={{ color: "#cbd5e1", fontSize: "15px", margin: 0, lineHeight: "1.7", fontWeight: "400" }}>
                  {t.techDesc}
                </p>
              </div>
            </motion.main>
          )}

          {tab === "contact" && (
            <motion.main key="contact" variants={pageVariants} initial="hidden" animate="visible" exit="exit">
              <div style={glassBoxStyle}>
                <h2 style={{ fontSize: "30px", fontWeight: "800", color: "#ffffff", marginTop: 0, marginBottom: "8px" }}>
                  {t.formTitle}
                </h2>
                <p style={{ color: "#94a3b8", fontSize: "15px", lineHeight: "1.6", marginBottom: "28px", fontWeight: "400" }}>
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
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", padding: "14px 18px", color: "#fff", fontSize: "14px", outline: "none" }}
                    />
                    <input
                      type="email"
                      required
                      placeholder={t.emailPlaceholder}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", padding: "14px 18px", color: "#fff", fontSize: "14px", outline: "none" }}
                    />
                    <textarea
                      rows={4}
                      required
                      placeholder={t.msgPlaceholder}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", padding: "14px 18px", color: "#fff", fontSize: "14px", outline: "none", resize: "none" }}
                    />
                    <button
                      type="submit"
                      style={{ background: "#ffffff", color: "#000000", border: "none", padding: "14px 28px", borderRadius: "100px", fontSize: "14px", fontWeight: "600", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "8px" }}
                    >
                      <Send size={15} />
                      {t.sendBtn}
                    </button>
                  </form>
                )}
              </div>
            </motion.main>
          )}

        </AnimatePresence>

        <footer style={{ marginTop: "auto", paddingTop: "36px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: "#64748b", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <span>JIMMY CORNEJO — ESPACIO DIGITAL</span>
          <span style={{ fontFamily: "monospace" }}>2026</span>
        </footer>

      </div>
    </div>
  );
}
