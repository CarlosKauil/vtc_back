import React, { useState, useRef, useEffect } from "react";
import { getBotResponse } from "../api/chatbotLogic";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hola 👋 Soy el asistente de VARTICA. ¿En qué puedo ayudarte?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  // 🔽 Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (text = input) => {
    if (!text.trim() || isTyping) return;

    const userMsg = { sender: "user", text };

    setMessages(prev => [...prev, userMsg]);
    setInput("");

    // Activar animación "escribiendo"
    setIsTyping(true);

    setTimeout(() => {
      const botMsg = {
        sender: "bot",
        text: getBotResponse(text)
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 8500); // ⏱️ delay
  };

  // ⚡ Botones rápidos
  const quickActions = [
    "Subastas",
    "Formatos",
    "Planes",
    "Problemas técnicos"
  ];

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          border: "none",
          cursor: "pointer",
          background: "linear-gradient(135deg, #6c5ce7, #00cec9)",
          color: "#fff",
          fontSize: "26px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 99999,
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
        }}
      >
        🤖
      </button>

      {/* Chat */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: "350px",
            height: "500px",
            borderRadius: "20px",
            backdropFilter: "blur(15px)",
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            display: "flex",
            flexDirection: "column",
            zIndex: 99999,
            overflow: "hidden"
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "12px",
              background: "rgba(0,0,0,0.3)",
              color: "#fff",
              fontWeight: "bold",
              textAlign: "center"
            }}
          >
            Asistente VARTICA
          </div>

          {/* Mensajes */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "10px"
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                  marginBottom: "8px"
                }}
              >
                <div
                  style={{
                    maxWidth: "75%",
                    padding: "10px",
                    borderRadius: "12px",
                    background:
                      msg.sender === "user"
                        ? "linear-gradient(135deg, #6c5ce7, #00cec9)"
                        : "rgba(255,255,255,0.2)",
                    color: "#fff",
                    backdropFilter: "blur(5px)"
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* 🧠 Animación escribiendo */}
            {isTyping && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div
                  style={{
                    padding: "10px",
                    borderRadius: "12px",
                    background: "rgba(255,255,255,0.2)",
                    display: "flex",
                    gap: "5px"
                  }}
                >
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Botones rápidos */}
          <div
            style={{
              padding: "8px",
              display: "flex",
              flexWrap: "wrap",
              gap: "6px",
              justifyContent: "center"
            }}
          >
            {quickActions.map((action, i) => (
              <button
                key={i}
                onClick={() => handleSend(action)}
                style={{
                  padding: "6px 10px",
                  borderRadius: "10px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "12px",
                  background: "rgba(255,255,255,0.2)",
                  color: "#fff"
                }}
              >
                {action}
              </button>
            ))}
          </div>

          {/* Input */}
          <div
            style={{
              display: "flex",
              borderTop: "1px solid rgba(255,255,255,0.2)"
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe..."
              style={{
                flex: 1,
                padding: "10px",
                border: "none",
                outline: "none",
                background: "transparent",
                color: "#fff"
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />

            <button
              onClick={() => handleSend()}
              style={{
                padding: "10px",
                border: "none",
                cursor: "pointer",
                background: "linear-gradient(135deg, #6c5ce7, #00cec9)",
                color: "#fff"
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}

      {/* 🎨 Animaciones + Responsive */}
      <style>
        {`
          .dot {
            width: 6px;
            height: 6px;
            background: white;
            border-radius: 50%;
            animation: blink 1.4s infinite both;
          }

          .dot:nth-child(2) {
            animation-delay: 0.2s;
          }
          .dot:nth-child(3) {
            animation-delay: 0.4s;
          }

          @keyframes blink {
            0% { opacity: 0.2; transform: translateY(0px); }
            50% { opacity: 1; transform: translateY(-3px); }
            100% { opacity: 0.2; transform: translateY(0px); }
          }

          @media (max-width: 600px) {
            div[style*="width: 350px"] {
              width: 90% !important;
              right: 5% !important;
              height: 70% !important;
            }
          }
        `}
      </style>
    </>
  );
}