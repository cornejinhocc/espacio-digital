"use client";

"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Mail,
  Send,
  Sparkles,
  X,
} from "lucide-react";

/* =========================================================
   STARFIELD
========================================================= */

function LumaStarfieldCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030308, 0.075);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    mount.appendChild(renderer.domElement);

    const count = 650;

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 6);
    const colors = new Float32Array(count * 6);

    const stars: Array<{
      x: number;
      y: number;
      z: number;
      len: number;
      speed: number;
      color: THREE.Color;
    }> = [];

    const palette = [
      new THREE.Color("#ffffff"),
      new THREE.Color("#dbeafe"),
      new THREE.Color("#93c5fd"),
      new THREE.Color("#c4b5fd"),
    ];

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 20;
      const z = Math.random() * -30;

      const len = 0.35 + Math.random() * 0.8;
      const speed = 0.12 + Math.random() * 0.26;

      const color = palette[Math.floor(Math.random() * palette.length)];

      stars.push({
        x,
        y,
        z,
        len,
        speed,
        color,
      });

      positions[i * 6] = x;
      positions[i * 6 + 1] = y;
      positions[i * 6 + 2] = z;

      positions[i * 6 + 3] = x;
      positions[i * 6 + 4] = y;
      positions[i * 6 + 5] = z - len;

      colors[i * 6] = color.r;
      colors[i * 6 + 1] = color.g;
      colors[i * 6 + 2] = color.b;

      colors[i * 6 + 3] = color.r * 0.18;
      colors[i * 6 + 4] = color.g * 0.18;
      colors[i * 6 + 5] = color.b * 0.18;
    }

    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    geometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 3)
    );

    const material = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.78,
      blending: THREE.AdditiveBlending,
    });

    const mesh = new THREE.LineSegments(geometry, material);

    scene.add(mesh);

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 0.7;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 0.7;
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    let animationId: number;

    const animate = () => {
      const array = geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < count; i++) {
        const star = stars[i];

        star.z += star.speed;

        if (star.z > 2) {
          star.z = -30;
          star.x = (Math.random() - 0.5) * 20;
          star.y = (Math.random() - 0.5) * 20;
        }

        array[i * 6] = star.x;
        array[i * 6 + 1] = star.y;
        array[i * 6 + 2] = star.z;

        array[i * 6 + 3] = star.x;
        array[i * 6 + 4] = star.y;
        array[i * 6 + 5] = star.z - star.len;
      }

      geometry.attributes.position.needsUpdate = true;

      camera.position.x += (mouseX - camera.position.x) * 0.025;
      camera.position.y += (-mouseY - camera.position.y) * 0.025;

      camera.rotation.z += 0.00035;

      renderer.render(scene, camera);

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);

      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      geometry.dispose();
      material.dispose();

      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }

      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}

/* =========================================================
   PROFILE
========================================================= */

function ProfileCard() {
  const [rotation, setRotation] = useState({
    x: 0,
    y: 0,
  });

  const [hovered, setHovered] = useState(false);

  const handleMove = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const x =
      (e.clientX - (rect.left + rect.width / 2)) /
      (rect.width / 2);

    const y =
      (e.clientY - (rect.top + rect.height / 2)) /
      (rect.height / 2);

    setRotation({
      x: -y * 8,
      y: x * 8,
    });
  };

  return (
    <motion.div
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setRotation({ x: 0, y: 0 });
      }}
      animate={{
        y: hovered ? 0 : [0, -8, 0],
      }}
      transition={{
        duration: 4,
        repeat: hovered ? 0 : Infinity,
        ease: "easeInOut",
      }}
      style={{
        width: "270px",
        height: "350px",
        perspective: "1200px",
      }}
    >
      <motion.div
        animate={{
          rotateX: rotation.x,
          rotateY: rotation.y,
        }}
        transition={{
          duration: 0.18,
        }}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          borderRadius: "30px",
          padding: "8px",
          background:
            "linear-gradient(145deg, rgba(255,255,255,.25), rgba(255,255,255,.03))",
          border: "1px solid rgba(255,255,255,.18)",
          boxShadow: hovered
            ? "0 35px 90px rgba(56,189,248,.24)"
            : "0 25px 70px rgba(0,0,0,.45)",
          transformStyle: "preserve-3d",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            overflow: "hidden",
            borderRadius: "24px",
            position: "relative",
            transform: "translateZ(25px)",
          }}
        >
          <img
            src="/profile.jpg"
            alt="Jimmy Cornejo"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: hovered ? "scale(1.045)" : "scale(1)",
              transition:
                "transform .7s cubic-bezier(.16,1,.3,1)",
            }}
          />

          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(0,0,0,.7), transparent 50%)",
            }}
          />

          <div
            style={{
              position: "absolute",
              bottom: "20px",
              left: "20px",
              right: "20px",
            }}
          >
            <div
              style={{
                fontSize: "10px",
                letterSpacing: ".18em",
                color: "#93c5fd",
                fontFamily: "monospace",
                marginBottom: "5px",
              }}
            >
              DIGITAL SPACE
            </div>

            <div
              style={{
                fontSize: "17px",
                fontWeight: 700,
                color: "#fff",
              }}
            >
              Jimmy Cornejo
            </div>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(147,197,253,.22), transparent 70%)",
            top: "-20px",
            right: "-15px",
            filter: "blur(2px)",
          }}
        />
      </motion.div>
    </motion.div>
  );
}

/* =========================================================
   ROCKET TRANSITION
   NO CAMBIAR
========================================================= */

function RocketTransition({
  active,
  onFinished,
}: {
  active: boolean;
  onFinished: () => void;
}) {
  useEffect(() => {
    if (!active) return;

    const timer = setTimeout(() => {
      onFinished();
    }, 2100);

    return () => clearTimeout(timer);
  }, [active, onFinished]);

  if (!active) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        background:
          "radial-gradient(circle at center, #111827 0%, #030308 65%)",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {Array.from({ length: 45 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: Math.random() * 1200 - 600,
            y: Math.random() * 800 - 400,
            opacity: 0,
          }}
          animate={{
            x: 0,
            y: 0,
            opacity: [0, 1, 0],
            scaleY: [1, 2.5, 5],
          }}
          transition={{
            duration: 1.4 + Math.random() * 0.8,
            delay: Math.random() * 0.4,
            ease: "easeIn",
          }}
          style={{
            position: "absolute",
            width: "2px",
            height: `${3 + Math.random() * 12}px`,
            background: "#fff",
            borderRadius: "999px",
          }}
        />
      ))}

      <motion.div
        initial={{
          scale: 0.5,
          y: 180,
          opacity: 0,
        }}
        animate={{
          scale: [0.7, 1, 1.08],
          y: [180, 0, -500],
          opacity: [0, 1, 1],
        }}
        transition={{
          duration: 2,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{
          position: "relative",
          zIndex: 10,
          fontSize: "80px",
          filter:
            "drop-shadow(0 0 30px rgba(255,255,255,.35))",
        }}
      >
        🚀
      </motion.div>

      <motion.div
        initial={{
          width: 0,
          opacity: 0,
        }}
        animate={{
          width: "280px",
          opacity: [0, 0.8, 0],
        }}
        transition={{
          duration: 1.8,
          ease: "easeOut",
        }}
        style={{
          position: "absolute",
          bottom: "30%",
          height: "4px",
          borderRadius: "999px",
          background:
            "linear-gradient(90deg, transparent, #38bdf8, transparent)",
          filter: "blur(2px)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: [0, 1, 0],
          y: [20, 0, -20],
        }}
        transition={{
          duration: 1.6,
          delay: 0.25,
        }}
        style={{
          position: "absolute",
          bottom: "22%",
          fontSize: "11px",
          fontFamily: "monospace",
          letterSpacing: ".25em",
          color: "#93c5fd",
          textTransform: "uppercase",
        }}
      >
        Entrando al espacio
      </motion.div>
    </motion.div>
  );
}

/* =========================================================
   SPACE EXPERIENCE
   NUEVA VERSION
========================================================= */

type Message = {
  id: number;
  name: string;
  message: string;
  angle: number;
  radius: number;
};

function SpaceExperience({
  lang,
  onBack,
}: {
  lang: "es" | "en";
  onBack: () => void;
}) {
  const [selected, setSelected] =
    useState<Message | null>(null);

  const [showMessageForm, setShowMessageForm] =
    useState(false);

  const [messageName, setMessageName] =
    useState("");

  const [messageText, setMessageText] =
    useState("");

  const [activeTab, setActiveTab] =
    useState<"orbit" | "about">("orbit");

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      name: "Carlos",
      message:
        lang === "es"
          ? "Qué chiva quedó este espacio."
          : "This space is really cool.",
      angle: 20,
      radius: 185,
    },
    {
      id: 2,
      name: "Andrea",
      message:
        lang === "es"
          ? "Me encantó la idea 🚀"
          : "I love the idea 🚀",
      angle: 105,
      radius: 225,
    },
    {
      id: 3,
      name: "Marco",
      message:
        lang === "es"
          ? "Muchos éxitos Jimmy."
          : "Wishing you the best Jimmy.",
      angle: 190,
      radius: 205,
    },
    {
      id: 4,
      name: "Sofi",
      message:
        lang === "es"
          ? "Saludos desde aquí ✨"
          : "Greetings from here ✨",
      angle: 280,
      radius: 225,
    },
  ]);

  const text =
    lang === "es"
      ? {
          eyebrow: "PERSONAL TRANSMISSION",
          title: "Mi espacio.",
          description:
            "No todo tiene que ser trabajo. Este es el rincón más personal de mi espacio digital.",
          orbit: "Órbita",
          about: "La idea",
          orbitTitle: "Personas que pasaron por aquí",
          orbitDescription:
            "Cada estrella representa una señal dejada por alguien que visitó este espacio.",
          leave: "Dejar una señal",
          back: "Volver",
          visitors: "señales activas",
          signal: "SEÑAL RECIBIDA",
          close: "Cerrar",
          newSignal: "NUEVA SEÑAL",
          name: "Tu nombre",
          message: "Escribe algo...",
          publish: "Enviar señal",
          empty:
            "Tu mensaje aparecerá aquí como una nueva estrella.",
          ideaTitle: "Un espacio sin propósito específico.",
          ideaText:
            "Quería que mi sitio tuviera un lugar que no hablara de servicios, experiencia o trabajo. Simplemente un pequeño universo donde las personas pudieran dejar una señal.",
          ideaQuote:
            "Internet también puede sentirse como un lugar.",
          status: "SISTEMA ONLINE",
        }
      : {
          eyebrow: "PERSONAL TRANSMISSION",
          title: "My space.",
          description:
            "Not everything has to be about work. This is the more personal corner of my digital space.",
          orbit: "Orbit",
          about: "The idea",
          orbitTitle: "People who passed through",
          orbitDescription:
            "Every star represents a signal left by someone who visited this space.",
          leave: "Leave a signal",
          back: "Back",
          visitors: "active signals",
          signal: "SIGNAL RECEIVED",
          close: "Close",
          newSignal: "NEW SIGNAL",
          name: "Your name",
          message: "Write something...",
          publish: "Send signal",
          empty:
            "Your message will appear here as a new star.",
          ideaTitle: "A space without a specific purpose.",
          ideaText:
            "I wanted my site to have a place that wasn't about services, experience or work. Just a small universe where people could leave a signal.",
          ideaQuote:
            "The internet can also feel like a place.",
          status: "SYSTEM ONLINE",
        };

  const submitMessage = () => {
    if (!messageName.trim() || !messageText.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      name: messageName.trim(),
      message: messageText.trim(),
      angle: Math.random() * 360,
      radius: 160 + Math.random() * 90,
    };

    setMessages((prev) => [...prev, newMessage]);

    setMessageName("");
    setMessageText("");
    setShowMessageForm(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        minHeight: "100vh",
        position: "relative",
        zIndex: 5,
        overflow: "hidden",
      }}
    >
      {/* ambient glow */}

      <div
        style={{
          position: "fixed",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(37,99,235,.10), rgba(37,99,235,.025) 35%, transparent 70%)",
          filter: "blur(10px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "1240px",
          minHeight: "100vh",
          margin: "0 auto",
          padding: "26px 28px 50px",
          position: "relative",
        }}
      >
        {/* TOP BAR */}

        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "relative",
            zIndex: 20,
          }}
        >
          <button
            onClick={onBack}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "9px",
              border:
                "1px solid rgba(255,255,255,.11)",
              background:
                "rgba(255,255,255,.035)",
              color: "#cbd5e1",
              borderRadius: "999px",
              padding: "9px 15px",
              cursor: "pointer",
              backdropFilter: "blur(20px)",
              fontSize: "12px",
            }}
          >
            ← {text.back}
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <div
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "#60a5fa",
                boxShadow:
                  "0 0 15px rgba(96,165,250,.9)",
              }}
            />

            <span
              style={{
                fontFamily: "monospace",
                fontSize: "9px",
                letterSpacing: ".2em",
                color: "#64748b",
              }}
            >
              {text.status}
            </span>

            <span
              style={{
                fontFamily: "monospace",
                fontSize: "9px",
                letterSpacing: ".2em",
                color: "#475569",
              }}
            >
              / JC-SPACE
            </span>
          </div>
        </header>

        {/* HERO */}

        <section
          style={{
            maxWidth: "850px",
            margin: "80px auto 0",
            textAlign: "center",
            position: "relative",
            zIndex: 5,
          }}
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            style={{
              fontFamily: "monospace",
              fontSize: "9px",
              letterSpacing: ".34em",
              color: "#60a5fa",
              marginBottom: "20px",
            }}
          >
            {text.eyebrow}
          </motion.div>

          <motion.h1
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.08,
              duration: 0.7,
            }}
            style={{
              margin: 0,
              fontSize:
                "clamp(58px, 10vw, 110px)",
              lineHeight: ".86",
              letterSpacing: "-.075em",
              fontWeight: 850,
              background:
                "linear-gradient(180deg, #ffffff 0%, #cbd5e1 55%, #64748b 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {text.title}
          </motion.h1>

          <motion.p
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.18,
              duration: 0.7,
            }}
            style={{
              maxWidth: "590px",
              margin: "25px auto 0",
              color: "#94a3b8",
              lineHeight: 1.75,
              fontSize: "15px",
            }}
          >
            {text.description}
          </motion.p>
        </section>

        {/* TABS */}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "5px",
            marginTop: "38px",
            position: "relative",
            zIndex: 10,
          }}
        >
          {[
            ["orbit", text.orbit],
            ["about", text.about],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() =>
                setActiveTab(
                  key as "orbit" | "about"
                )
              }
              style={{
                border:
                  activeTab === key
                    ? "1px solid rgba(147,197,253,.25)"
                    : "1px solid transparent",
                background:
                  activeTab === key
                    ? "rgba(96,165,250,.08)"
                    : "transparent",
                color:
                  activeTab === key
                    ? "#dbeafe"
                    : "#64748b",
                borderRadius: "999px",
                padding: "9px 17px",
                cursor: "pointer",
                fontSize: "11px",
                transition: "all .25s",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "orbit" ? (
            <motion.section
              key="orbit"
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -15,
              }}
              transition={{
                duration: 0.4,
              }}
              style={{
                position: "relative",
              }}
            >
              {/* ORBIT STAGE */}

              <div
                style={{
                  height: "650px",
                  marginTop: "-10px",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* outer orbit */}

                <motion.div
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 100,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    position: "absolute",
                    width:
                      "min(600px, 78vw)",
                    height:
                      "min(600px, 78vw)",
                    borderRadius: "50%",
                    border:
                      "1px solid rgba(148,163,184,.10)",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "#bfdbfe",
                      boxShadow:
                        "0 0 20px #60a5fa",
                      top: "50%",
                      right: "-4px",
                      transform:
                        "translateY(-50%)",
                    }}
                  />
                </motion.div>

                {/* middle orbit */}

                <motion.div
                  animate={{
                    rotate: -360,
                  }}
                  transition={{
                    duration: 55,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    position: "absolute",
                    width:
                      "min(470px, 62vw)",
                    height:
                      "min(470px, 62vw)",
                    borderRadius: "50%",
                    border:
                      "1px dashed rgba(96,165,250,.15)",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      width: "5px",
                      height: "5px",
                      borderRadius: "50%",
                      background: "#93c5fd",
                      boxShadow:
                        "0 0 14px #60a5fa",
                      bottom: "10%",
                      left: "10%",
                    }}
                  />
                </motion.div>

                {/* inner orbit */}

                <div
                  style={{
                    position: "absolute",
                    width:
                      "min(330px, 45vw)",
                    height:
                      "min(330px, 45vw)",
                    borderRadius: "50%",
                    border:
                      "1px solid rgba(255,255,255,.06)",
                  }}
                />

                {/* central planet */}

                <motion.div
                  animate={{
                    y: [0, -8, 0],
                    scale: [1, 1.015, 1],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    position: "absolute",
                    width: "155px",
                    height: "155px",
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle at 33% 27%, #ffffff 0%, #bfdbfe 8%, #60a5fa 25%, #2563eb 47%, #172554 72%, #020617 100%)",
                    boxShadow:
                      "0 0 50px rgba(59,130,246,.24), 0 0 130px rgba(37,99,235,.10), inset -28px -20px 35px rgba(0,0,0,.52)",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: "13px",
                      borderRadius: "50%",
                      border:
                        "1px solid rgba(255,255,255,.12)",
                    }}
                  />
                </motion.div>

                {/* central information */}

                <div
                  style={{
                    position: "absolute",
                    textAlign: "center",
                    zIndex: 5,
                    pointerEvents: "none",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "monospace",
                      fontSize: "9px",
                      letterSpacing: ".24em",
                      color: "#dbeafe",
                    }}
                  >
                    JIMMY'S SPACE
                  </div>

                  <div
                    style={{
                      marginTop: "9px",
                      fontSize: "10px",
                      color: "#64748b",
                    }}
                  >
                    {messages.length}{" "}
                    {text.visitors}
                  </div>
                </div>

                {/* visitor stars */}

                {messages.map((message, index) => {
                  const rad =
                    (message.angle *
                      Math.PI) /
                    180;

                  const x =
                    Math.cos(rad) *
                    message.radius;

                  const y =
                    Math.sin(rad) *
                    message.radius;

                  return (
                    <motion.div
                      key={message.id}
                      initial={{
                        opacity: 0,
                        scale: 0,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                      }}
                      transition={{
                        delay:
                          0.15 +
                          index * 0.1,
                        type: "spring",
                        stiffness: 180,
                        damping: 16,
                      }}
                      style={{
                        position:
                          "absolute",
                        transform: `translate(${x}px, ${y}px)`,
                        zIndex: 8,
                      }}
                    >
                      <motion.button
                        whileHover={{
                          scale: 1.35,
                        }}
                        whileTap={{
                          scale: 0.9,
                        }}
                        onClick={() =>
                          setSelected(
                            message
                          )
                        }
                        style={{
                          width: "45px",
                          height: "45px",
                          borderRadius:
                            "50%",
                          border:
                            "1px solid rgba(191,219,254,.35)",
                          background:
                            "radial-gradient(circle, #fff 0%, #bfdbfe 12%, #60a5fa 28%, #2563eb 48%, rgba(37,99,235,.12) 70%, transparent 73%)",
                          boxShadow:
                            "0 0 25px rgba(96,165,250,.5)",
                          cursor:
                            "pointer",
                          display: "block",
                        }}
                      />

                      <div
                        style={{
                          position:
                            "absolute",
                          top: "51px",
                          left: "50%",
                          transform:
                            "translateX(-50%)",
                          whiteSpace:
                            "nowrap",
                          color: "#64748b",
                          fontFamily:
                            "monospace",
                          fontSize: "9px",
                          letterSpacing:
                            ".05em",
                          pointerEvents:
                            "none",
                        }}
                      >
                        {message.name}
                      </div>
                    </motion.div>
                  );
                })}

                {/* CTA */}

                <motion.button
                  whileHover={{
                    y: -4,
                    scale: 1.03,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                  onClick={() =>
                    setShowMessageForm(
                      true
                    )
                  }
                  style={{
                    position: "absolute",
                    bottom: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "9px",
                    border:
                      "1px solid rgba(147,197,253,.2)",
                    background:
                      "rgba(8,15,30,.78)",
                    color: "#dbeafe",
                    borderRadius:
                      "999px",
                    padding:
                      "13px 21px",
                    cursor: "pointer",
                    backdropFilter:
                      "blur(20px)",
                    boxShadow:
                      "0 20px 60px rgba(0,0,0,.35)",
                    fontSize: "12px",
                  }}
                >
                  <Sparkles size={15} />
                  {text.leave}
                </motion.button>
              </div>

              {/* INFO */}

              <div
                style={{
                  textAlign: "center",
                  marginTop: "-4px",
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    color: "#e2e8f0",
                    fontWeight: 650,
                  }}
                >
                  {text.orbitTitle}
                </div>

                <div
                  style={{
                    fontSize: "12px",
                    color: "#64748b",
                    marginTop: "6px",
                  }}
                >
                  {text.orbitDescription}
                </div>
              </div>
            </motion.section>
          ) : (
            <motion.section
              key="about-space"
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -15,
              }}
              style={{
                maxWidth: "820px",
                margin: "80px auto 0",
                paddingBottom: "80px",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: "20px",
                }}
              >
                <div
                  style={{
                    minHeight: "360px",
                    borderRadius: "30px",
                    border:
                      "1px solid rgba(255,255,255,.09)",
                    background:
                      "linear-gradient(145deg, rgba(255,255,255,.06), rgba(255,255,255,.018))",
                    padding: "32px",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      fontFamily:
                        "monospace",
                      fontSize: "9px",
                      letterSpacing:
                        ".25em",
                      color: "#60a5fa",
                    }}
                  >
                    01 / THE IDEA
                  </div>

                  <h2
                    style={{
                      fontSize:
                        "clamp(27px, 4vw, 42px)",
                      lineHeight: 1.05,
                      letterSpacing:
                        "-.045em",
                      margin:
                        "25px 0 18px",
                      color: "#fff",
                    }}
                  >
                    {text.ideaTitle}
                  </h2>

                  <p
                    style={{
                      color: "#94a3b8",
                      lineHeight: 1.75,
                      fontSize: "14px",
                    }}
                  >
                    {text.ideaText}
                  </p>

                  <div
                    style={{
                      position:
                        "absolute",
                      width: "180px",
                      height: "180px",
                      borderRadius:
                        "50%",
                      right: "-80px",
                      bottom: "-80px",
                      background:
                        "radial-gradient(circle, rgba(59,130,246,.16), transparent 70%)",
                    }}
                  />
                </div>

                <div
                  style={{
                    minHeight: "360px",
                    borderRadius: "30px",
                    border:
                      "1px solid rgba(255,255,255,.09)",
                    background:
                      "rgba(255,255,255,.025)",
                    padding: "32px",
                    display: "flex",
                    flexDirection:
                      "column",
                    justifyContent:
                      "space-between",
                  }}
                >
                  <div
                    style={{
                      fontFamily:
                        "monospace",
                      fontSize: "9px",
                      letterSpacing:
                        ".25em",
                      color: "#64748b",
                    }}
                  >
                    02 / A THOUGHT
                  </div>

                  <div
                    style={{
                      fontSize:
                        "clamp(25px, 4vw, 38px)",
                      lineHeight: 1.08,
                      letterSpacing:
                        "-.045em",
                      color: "#e2e8f0",
                      fontWeight: 700,
                    }}
                  >
                    “{text.ideaQuote}”
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems:
                        "center",
                      gap: "10px",
                      color: "#64748b",
                      fontSize: "11px",
                    }}
                  >
                    <span
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius:
                          "50%",
                        background:
                          "#60a5fa",
                        boxShadow:
                          "0 0 12px #60a5fa",
                      }}
                    />
                    JIMMY CORNEJO
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      {/* MESSAGE VIEW */}

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() =>
              setSelected(null)
            }
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 500,
              background:
                "rgba(2,6,23,.76)",
              backdropFilter:
                "blur(18px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "25px",
            }}
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.85,
                y: 25,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              transition={{
                type: "spring",
                stiffness: 220,
                damping: 20,
              }}
              onClick={(e) =>
                e.stopPropagation()
              }
              style={{
                width:
                  "min(450px, 100%)",
                borderRadius: "30px",
                border:
                  "1px solid rgba(255,255,255,.12)",
                background:
                  "rgba(8,15,30,.96)",
                padding: "32px",
                boxShadow:
                  "0 40px 120px rgba(0,0,0,.7)",
                position: "relative",
              }}
            >
              <button
                onClick={() =>
                  setSelected(null)
                }
                style={{
                  position:
                    "absolute",
                  top: "20px",
                  right: "20px",
                  border: "none",
                  background:
                    "transparent",
                  color: "#64748b",
                  cursor: "pointer",
                }}
              >
                <X size={18} />
              </button>

              <div
                style={{
                  width: "55px",
                  height: "55px",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, #fff, #60a5fa 35%, #1d4ed8 65%, transparent 70%)",
                  boxShadow:
                    "0 0 35px rgba(96,165,250,.55)",
                  marginBottom: "25px",
                }}
              />

              <div
                style={{
                  fontFamily:
                    "monospace",
                  color: "#60a5fa",
                  fontSize: "9px",
                  letterSpacing:
                    ".22em",
                }}
              >
                {text.signal}
              </div>

              <h2
                style={{
                  color: "#fff",
                  fontSize: "28px",
                  letterSpacing:
                    "-.04em",
                  margin:
                    "14px 0 10px",
                }}
              >
                {selected.name}
              </h2>

              <p
                style={{
                  color: "#cbd5e1",
                  lineHeight: 1.75,
                  fontSize: "15px",
                  margin: 0,
                }}
              >
                “{selected.message}”
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MESSAGE FORM */}

      <AnimatePresence>
        {showMessageForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() =>
              setShowMessageForm(false)
            }
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 600,
              background:
                "rgba(2,6,23,.8)",
              backdropFilter:
                "blur(18px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "25px",
            }}
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.85,
                y: 25,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              onClick={(e) =>
                e.stopPropagation()
              }
              style={{
                width:
                  "min(480px, 100%)",
                borderRadius: "30px",
                border:
                  "1px solid rgba(255,255,255,.12)",
                background:
                  "rgba(8,15,30,.97)",
                padding: "34px",
                boxShadow:
                  "0 40px 120px rgba(0,0,0,.75)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "flex-start",
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily:
                        "monospace",
                      color: "#60a5fa",
                      fontSize: "9px",
                      letterSpacing:
                        ".22em",
                    }}
                  >
                    {text.newSignal}
                  </div>

                  <h2
                    style={{
                      color: "#fff",
                      fontSize: "28px",
                      letterSpacing:
                        "-.045em",
                      margin:
                        "10px 0 0",
                    }}
                  >
                    {text.leave}
                  </h2>
                </div>

                <button
                  onClick={() =>
                    setShowMessageForm(
                      false
                    )
                  }
                  style={{
                    border: "none",
                    background:
                      "transparent",
                    color: "#64748b",
                    cursor:
                      "pointer",
                  }}
                >
                  <X />
                </button>
              </div>

              <p
                style={{
                  color: "#64748b",
                  fontSize: "13px",
                  lineHeight: 1.65,
                  marginTop: "13px",
                }}
              >
                {text.empty}
              </p>

              <input
                value={messageName}
                onChange={(e) =>
                  setMessageName(
                    e.target.value
                  )
                }
                placeholder={text.name}
                style={{
                  width: "100%",
                  boxSizing:
                    "border-box",
                  marginTop: "20px",
                  padding:
                    "14px 16px",
                  borderRadius:
                    "14px",
                  border:
                    "1px solid rgba(255,255,255,.1)",
                  background:
                    "rgba(255,255,255,.04)",
                  color: "#fff",
                  outline: "none",
                  fontSize: "14px",
                }}
              />

              <textarea
                value={messageText}
                onChange={(e) =>
                  setMessageText(
                    e.target.value
                  )
                }
                placeholder={text.message}
                rows={4}
                style={{
                  width: "100%",
                  boxSizing:
                    "border-box",
                  marginTop: "12px",
                  padding:
                    "14px 16px",
                  borderRadius:
                    "14px",
                  border:
                    "1px solid rgba(255,255,255,.1)",
                  background:
                    "rgba(255,255,255,.04)",
                  color: "#fff",
                  outline: "none",
                  resize: "none",
                  fontFamily:
                    "inherit",
                  fontSize: "14px",
                }}
              />

              <button
                onClick={
                  submitMessage
                }
                style={{
                  width: "100%",
                  marginTop: "14px",
                  padding: "15px",
                  borderRadius:
                    "999px",
                  border: "none",
                  background:
                    "linear-gradient(135deg, #fff, #dbeafe)",
                  color: "#020617",
                  fontWeight: 750,
                  cursor:
                    "pointer",
                  display: "flex",
                  justifyContent:
                    "center",
                  alignItems:
                    "center",
                  gap: "8px",
                  fontSize: "13px",
                }}
              >
                <Send size={15} />
                {text.publish}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* =========================================================
   MAIN APP
========================================================= */

export default function App() {
  const [lang, setLang] =
    useState<"es" | "en">("es");

  const [page, setPage] =
    useState<
      "home" | "work" | "about" | "space" | "contact"
    >("home");

  const [rocket, setRocket] =
    useState(false);

  const content = {
    es: {
      small: "MI ESPACIO DIGITAL",

      name: "JIMMY CORNEJO",

      intro:
        "Negocios, operaciones y soluciones que funcionan.",

      work: "Explorar mi trabajo",

      space: "Entrar al espacio",

      workTitle: "Mi trabajo",

      workDescription:
        "Trabajo en la intersección entre operaciones, organización, digitalización y resolución de problemas.",

      areas: [
        "Operaciones",
        "Digitalización",
        "Procesos",
        "Coordinación",
      ],

      about: "Sobre mí",

      aboutTitle:
        "Construir orden donde antes había fricción.",

      aboutText:
        "Me interesa entender cómo funcionan realmente las cosas, encontrar lo que está frenando una operación y convertirlo en algo más claro, simple y eficiente.",

      contact: "Contacto",

      contactTitle: "Hablemos.",

      contactText:
        "Si tienes una operación que necesita orden, una idea que necesita estructura o simplemente quieres conectar, escríbeme.",

      send: "Enviar mensaje",

      back: "Volver",

      currently: "Actualmente",
    },

    en: {
      small: "MY DIGITAL SPACE",

      name: "JIMMY CORNEJO",

      intro:
        "Business, operations and solutions that work.",

      work: "Explore my work",

      space: "Enter the space",

      workTitle: "My work",

      workDescription:
        "I work at the intersection of operations, organization, digitalization and problem solving.",

      areas: [
        "Operations",
        "Digitalization",
        "Processes",
        "Coordination",
      ],

      about: "About me",

      aboutTitle:
        "Building order where there used to be friction.",

      aboutText:
        "I like understanding how things actually work, finding what is slowing an operation down, and turning it into something clearer, simpler and more efficient.",

      contact: "Contact",

      contactTitle: "Let's talk.",

      contactText:
        "If you have an operation that needs structure, an idea that needs direction, or simply want to connect, send me a message.",

      send: "Send message",

      back: "Back",

      currently: "Currently",
    },
  };

  const t = content[lang];

  const startSpace = () => {
    setRocket(true);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#030308",
        color: "#fff",
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        overflowX: "hidden",
      }}
    >
      <LumaStarfieldCanvas />

      <RocketTransition
        active={rocket}
        onFinished={() => {
          setRocket(false);
          setPage("space");
        }}
      />

      {page === "space" ? (
        <SpaceExperience
          lang={lang}
          onBack={() => setPage("home")}
        />
      ) : (
        <div
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: "1160px",
            margin: "0 auto",
            padding: "28px 28px 45px",
            minHeight: "100vh",
          }}
        >
          {/* HEADER */}

          <header
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
            }}
          >
            <button
              onClick={() =>
                setPage("home")
              }
              style={{
                border: "none",
                background:
                  "transparent",
                color: "#fff",
                cursor: "pointer",
                textAlign: "left",
                padding: 0,
              }}
            >
              <div
                style={{
                  fontWeight: 900,
                  letterSpacing:
                    ".12em",
                  fontSize: "17px",
                }}
              >
                JC
              </div>

              <div
                style={{
                  fontSize: "8px",
                  letterSpacing:
                    ".2em",
                  color: "#94a3b8",
                  marginTop: "3px",
                }}
              >
                DIGITAL SPACE
              </div>
            </button>

            <div
              style={{
                display: "flex",
                alignItems:
                  "center",
                gap: "20px",
              }}
            >
              <nav
                style={{
                  display: "flex",
                  gap: "20px",
                }}
              >
                {[
                  ["home", "Inicio"],
                  ["work", "Trabajo"],
                  ["about", "Sobre mí"],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() =>
                      setPage(
                        key as
                          | "home"
                          | "work"
                          | "about"
                      )
                    }
                    style={{
                      border: "none",
                      background:
                        "transparent",
                      color:
                        page === key
                          ? "#fff"
                          : "#64748b",
                      cursor:
                        "pointer",
                      fontSize: "12px",
                      padding: "5px 0",
                    }}
                  >
                    {lang === "en"
                      ? key === "home"
                        ? "Home"
                        : key === "work"
                        ? "Work"
                        : "About"
                      : label}
                  </button>
                ))}
              </nav>

              <button
                onClick={() =>
                  setLang(
                    lang === "es"
                      ? "en"
                      : "es"
                  )
                }
                style={{
                  border:
                    "1px solid rgba(255,255,255,.12)",
                  background:
                    "rgba(255,255,255,.04)",
                  color: "#cbd5e1",
                  borderRadius:
                    "999px",
                  padding:
                    "7px 11px",
                  cursor:
                    "pointer",
                  fontFamily:
                    "monospace",
                  fontSize: "10px",
                }}
              >
                {lang.toUpperCase()}
              </button>
            </div>
          </header>

          <AnimatePresence mode="wait">
            {/* HOME */}

            {page === "home" && (
              <motion.main
                key="home"
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -15,
                }}
                transition={{
                  duration: 0.45,
                }}
              >
                <section
                  style={{
                    minHeight:
                      "calc(100vh - 110px)",
                    display: "grid",
                    gridTemplateColumns:
                      "1fr 300px",
                    alignItems:
                      "center",
                    gap: "80px",
                  }}
                >
                  <div>
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 12,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay: 0.1,
                      }}
                      style={{
                        color: "#93c5fd",
                        fontFamily:
                          "monospace",
                        fontSize: "10px",
                        letterSpacing:
                          ".25em",
                        marginBottom:
                          "18px",
                      }}
                    >
                      {t.small}
                    </motion.div>

                    <motion.h1
                      initial={{
                        opacity: 0,
                        y: 20,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay: 0.15,
                      }}
                      style={{
                        fontSize:
                          "clamp(52px, 8vw, 92px)",
                        lineHeight:
                          ".9",
                        letterSpacing:
                          "-.065em",
                        margin: 0,
                        fontWeight:
                          850,
                        maxWidth:
                          "760px",
                      }}
                    >
                      {t.name}
                    </motion.h1>

                    <motion.p
                      initial={{
                        opacity: 0,
                        y: 15,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay: 0.25,
                      }}
                      style={{
                        margin:
                          "27px 0 0",
                        fontSize:
                          "clamp(17px, 2vw, 21px)",
                        lineHeight:
                          1.55,
                        color:
                          "#94a3b8",
                        maxWidth:
                          "610px",
                      }}
                    >
                      {t.intro}
                    </motion.p>

                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 20,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay: 0.38,
                      }}
                      style={{
                        display:
                          "flex",
                        gap: "12px",
                        marginTop:
                          "38px",
                        flexWrap:
                          "wrap",
                      }}
                    >
                      <motion.button
                        whileHover={{
                          y: -5,
                          rotateX: 4,
                        }}
                        whileTap={{
                          scale: 0.97,
                        }}
                        onClick={() =>
                          setPage(
                            "work"
                          )
                        }
                        style={{
                          position:
                            "relative",
                          padding:
                            "15px 22px",
                          borderRadius:
                            "16px",
                          border:
                            "1px solid rgba(255,255,255,.18)",
                          background:
                            "linear-gradient(145deg, rgba(255,255,255,.13), rgba(255,255,255,.04))",
                          color: "#fff",
                          cursor:
                            "pointer",
                          fontWeight:
                            650,
                          fontSize:
                            "13px",
                          display:
                            "flex",
                          alignItems:
                            "center",
                          gap: "10px",
                          boxShadow:
                            "0 15px 35px rgba(0,0,0,.25)",
                          backdropFilter:
                            "blur(15px)",
                        }}
                      >
                        <BriefcaseBusiness
                          size={15}
                        />
                        {t.work}
                        <ArrowUpRight
                          size={14}
                        />
                      </motion.button>

                      <motion.button
                        whileHover={{
                          y: -7,
                          scale: 1.02,
                        }}
                        whileTap={{
                          scale: 0.97,
                        }}
                        onClick={
                          startSpace
                        }
                        style={{
                          position:
                            "relative",
                          padding:
                            "15px 22px",
                          borderRadius:
                            "16px",
                          border:
                            "1px solid rgba(96,165,250,.3)",
                          background:
                            "linear-gradient(145deg, rgba(37,99,235,.18), rgba(15,23,42,.5))",
                          color: "#dbeafe",
                          cursor:
                            "pointer",
                          fontWeight:
                            650,
                          fontSize:
                            "13px",
                          display:
                            "flex",
                          alignItems:
                            "center",
                          gap: "10px",
                          boxShadow:
                            "0 0 35px rgba(59,130,246,.09)",
                          backdropFilter:
                            "blur(15px)",
                          overflow:
                            "hidden",
                        }}
                      >
                        <motion.span
                          animate={{
                            x: [
                              -5,
                              50,
                            ],
                            opacity: [
                              0,
                              1,
                              0,
                            ],
                          }}
                          transition={{
                            duration: 2,
                            repeat:
                              Infinity,
                          }}
                          style={{
                            position:
                              "absolute",
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width:
                              "45px",
                            background:
                              "linear-gradient(90deg, transparent, rgba(255,255,255,.15), transparent)",
                            transform:
                              "skewX(-20deg)",
                          }}
                        />

                        <span
                          style={{
                            position:
                              "relative",
                            zIndex: 2,
                          }}
                        >
                          ✦
                        </span>

                        <span
                          style={{
                            position:
                              "relative",
                            zIndex: 2,
                          }}
                        >
                          {t.space}
                        </span>
                      </motion.button>
                    </motion.div>
                  </div>

                  <div
                    style={{
                      display:
                        "flex",
                      justifyContent:
                        "center",
                    }}
                  >
                    <ProfileCard />
                  </div>
                </section>
              </motion.main>
            )}

            {/* WORK */}

            {page === "work" && (
              <motion.main
                key="work"
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -20,
                }}
                style={{
                  paddingTop:
                    "100px",
                  maxWidth:
                    "900px",
                  margin:
                    "0 auto",
                }}
              >
                <div
                  style={{
                    fontFamily:
                      "monospace",
                    fontSize:
                      "10px",
                    letterSpacing:
                      ".25em",
                    color:
                      "#93c5fd",
                  }}
                >
                  {lang === "es"
                    ? "TRABAJO"
                    : "WORK"}
                </div>

                <h1
                  style={{
                    fontSize:
                      "clamp(45px,7vw,72px)",
                    letterSpacing:
                      "-.055em",
                    margin:
                      "16px 0",
                  }}
                >
                  {t.workTitle}
                </h1>

                <p
                  style={{
                    color:
                      "#94a3b8",
                    maxWidth:
                      "620px",
                    lineHeight:
                      1.7,
                  }}
                >
                  {t.workDescription}
                </p>

                <div
                  style={{
                    display:
                      "grid",
                    gridTemplateColumns:
                      "repeat(2, 1fr)",
                    gap: "14px",
                    marginTop:
                      "55px",
                  }}
                >
                  {t.areas.map(
                    (
                      area,
                      index
                    ) => (
                      <motion.div
                        key={
                          area
                        }
                        whileHover={{
                          y: -5,
                        }}
                        style={{
                          padding:
                            "25px",
                          borderRadius:
                            "20px",
                          border:
                            "1px solid rgba(255,255,255,.1)",
                          background:
                            "rgba(255,255,255,.035)",
                          backdropFilter:
                            "blur(18px)",
                        }}
                      >
                        <div
                          style={{
                            color:
                              "#64748b",
                            fontFamily:
                              "monospace",
                            fontSize:
                              "10px",
                            marginBottom:
                              "20px",
                          }}
                        >
                          0
                          {index +
                            1}
                        </div>

                        <div
                          style={{
                            fontSize:
                              "20px",
                            fontWeight:
                              700,
                          }}
                        >
                          {
                            area
                          }
                        </div>
                      </motion.div>
                    )
                  )}
                </div>
              </motion.main>
            )}

            {/* ABOUT */}

            {page === "about" && (
              <motion.main
                key="about"
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -20,
                }}
                style={{
                  paddingTop:
                    "100px",
                  maxWidth:
                    "800px",
                  margin:
                    "0 auto",
                }}
              >
                <div
                  style={{
                    color:
                      "#93c5fd",
                    fontFamily:
                      "monospace",
                    fontSize:
                      "10px",
                    letterSpacing:
                      ".25em",
                  }}
                >
                  {t.about}
                </div>

                <h1
                  style={{
                    fontSize:
                      "clamp(42px,7vw,70px)",
                    lineHeight:
                      1,
                    letterSpacing:
                      "-.055em",
                    margin:
                      "18px 0 30px",
                  }}
                >
                  {t.aboutTitle}
                </h1>

                <p
                  style={{
                    fontSize:
                      "18px",
                    lineHeight:
                      1.8,
                    color:
                      "#cbd5e1",
                  }}
                >
                  {t.aboutText}
                </p>

                <div
                  style={{
                    marginTop:
                      "55px",
                    paddingTop:
                      "25px",
                    borderTop:
                      "1px solid rgba(255,255,255,.1)",
                    color:
                      "#64748b",
                    fontFamily:
                      "monospace",
                    fontSize:
                      "11px",
                    letterSpacing:
                      ".15em",
                  }}
                >
                  {t.currently.toUpperCase()}
                </div>

                <div
                  style={{
                    marginTop:
                      "15px",
                    color:
                      "#94a3b8",
                    lineHeight:
                      1.7,
                  }}
                >
                  Business operations ·
                  Digitalization · Process
                  improvement · Problem
                  solving
                </div>
              </motion.main>
            )}

            {/* CONTACT */}

            {page === "contact" && (
              <motion.main
                key="contact"
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                style={{
                  paddingTop:
                    "130px",
                  maxWidth:
                    "700px",
                  margin:
                    "0 auto",
                }}
              >
                <div
                  style={{
                    color:
                      "#93c5fd",
                    fontFamily:
                      "monospace",
                    fontSize:
                      "10px",
                    letterSpacing:
                      ".25em",
                  }}
                >
                  CONTACT
                </div>

                <h1
                  style={{
                    fontSize:
                      "clamp(52px,8vw,80px)",
                    letterSpacing:
                      "-.06em",
                    margin:
                      "15px 0 25px",
                  }}
                >
                  {t.contactTitle}
                </h1>

                <p
                  style={{
                    color:
                      "#94a3b8",
                    lineHeight:
                      1.8,
                    fontSize:
                      "16px",
                  }}
                >
                  {t.contactText}
                </p>

                <a
                  href="mailto:contacto@jimmycornejo.com"
                  style={{
                    display:
                      "inline-flex",
                    alignItems:
                      "center",
                    gap: "10px",
                    marginTop:
                      "35px",
                    padding:
                      "14px 20px",
                    borderRadius:
                      "999px",
                    background:
                      "#fff",
                    color:
                      "#020617",
                    textDecoration:
                      "none",
                    fontWeight:
                      700,
                    fontSize:
                      "13px",
                  }}
                >
                  <Mail size={15} />
                  {t.send}
                </a>
              </motion.main>
            )}
          </AnimatePresence>

          {/* FOOTER */}

          <footer
            style={{
              position:
                "absolute",
              bottom: "20px",
              left: "28px",
              right: "28px",
              display:
                "flex",
              justifyContent:
                "space-between",
              color:
                "#475569",
              fontSize:
                "10px",
              fontFamily:
                "monospace",
              letterSpacing:
                ".08em",
            }}
          >
            <span>
              JIMMY CORNEJO —{" "}
              {t.small}
            </span>

            <span>
              2026
            </span>
          </footer>
        </div>
      )}
    </div>
  );
}