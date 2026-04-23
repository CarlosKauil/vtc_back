const CRITICAL_MESSAGE =
  "Este caso requiere una intervención técnica especializada para garantizar una respuesta efectiva. Por favor, contacta directamente a soporte técnico: contacto@varticamv.com";

// 🔎 Utilidad para buscar palabras clave
function includesAny(msg, keywords) {
  return keywords.some(k => msg.includes(k));
}

// 💬 Respuesta base cuando no hay información
function fallbackResponse() {
  return addFollowUp(
    "Lo siento, no tengo esa información ahora mismo. Puedes intentar preguntarme sobre subastas, formatos, problemas técnicos, planes o controles."
  );
}

// 🎯 Preguntas de seguimiento
function addFollowUp(response) {
  const followUps = [
    "¿Te gustaría saber más sobre subastas?",
    "¿Quieres que te explique cómo subir una obra?",
    "¿Te interesa conocer los formatos permitidos?",
    "¿Quieres saber más sobre los planes disponibles?",
    "¿Necesitas ayuda con algún problema técnico?",
    "¿Te gustaría conocer cómo funcionan las subastas?",
    "¿Quieres más información sobre el uso del metaverso?"
  ];

  const random = followUps[Math.floor(Math.random() * followUps.length)];
  return response + "\n\n👉 " + random;
}

// 👋 SALUDO INTELIGENTE
function getGreeting() {
  return "Hola 👋 Soy el asistente virtual de VARTICA Metaverse 🤖. Estoy aquí para ayudarte con cualquier duda sobre la plataforma, subastas, obras o configuración. ¿En qué puedo ayudarte?";
}

export function getBotResponse(message) {
  const msg = message.toLowerCase();

  // ========================================
  // 👋 SALUDOS
  // ========================================
  if (includesAny(msg, ["hola", "buenas", "buenos días", "buenas tardes", "hey", "hello"])) {
    return getGreeting();
  }

  // ========================================
  // 🚨 ESCALACIÓN CRÍTICA
  // ========================================
  if (
    includesAny(msg, ["error 500", "servidor caído", "server error"]) ||
    (includesAny(msg, ["pago", "cobro", "tarjeta"]) &&
      includesAny(msg, ["error", "falló", "no pasó"])) ||
    includesAny(msg, ["hackeo", "seguridad", "cuenta comprometida"]) ||
    includesAny(msg, ["api", "integración", "backend"]) ||
    includesAny(msg, ["eliminar obra", "borrar obra", "cambiar datos críticos"]) ||
    includesAny(msg, ["vr no sincroniza", "error vr"]) ||
    includesAny(msg, ["multijugador no conecta", "sala llena", "afk"])
  ) {
    return CRITICAL_MESSAGE;
  }

  // ========================================
  // 🧩 IDENTIDAD
  // ========================================
  if (includesAny(msg, ["qué es vartica", "que es vartica", "vartica"])) {
    return addFollowUp(
      "VARTICA Metaverse es un entorno digital inmersivo creado por KreaVerse que fusiona arte tradicional con tecnología 3D. Permite a artistas exhibir y subastar sus obras en tiempo real."
    );
  }

  // ========================================
  // 💻 REQUISITOS
  // ========================================
  if (includesAny(msg, ["requisitos", "necesito para usar", "que necesito"])) {
    return addFollowUp(
      "Necesitas navegador actualizado (Chrome o Edge), aceleración por hardware activada, mínimo 10 Mbps de internet y soporte WebGL 2.0."
    );
  }

  if (includesAny(msg, ["navegador"])) {
    return addFollowUp(
      "Se recomienda Google Chrome o Microsoft Edge en su versión más reciente."
    );
  }

  if (includesAny(msg, ["internet", "velocidad"])) {
    return addFollowUp(
      "Se recomienda una conexión estable de al menos 10 Mbps."
    );
  }

  // ========================================
  // 🛠️ PROBLEMAS
  // ========================================
  if (includesAny(msg, ["pantalla negra", "no carga", "pantalla en negro"])) {
    return addFollowUp(
      "Intenta actualizar el navegador, desactivar bloqueadores y limpiar caché."
    );
  }

  if (includesAny(msg, ["lag", "lento", "se traba"])) {
    return addFollowUp(
      "Cierra pestañas en segundo plano o recarga el entorno para mejorar rendimiento."
    );
  }

  if (includesAny(msg, ["oferta no se registró", "no se registró mi puja"])) {
    return addFollowUp(
      "Verifica tu conexión. Si el tiempo terminó, el servidor define el resultado final."
    );
  }

  // ========================================
  // 🎨 OBRAS
  // ========================================
  if (includesAny(msg, ["subir obra", "registrar obra", "agregar obra"])) {
    return addFollowUp(
      "Ve a 'Gestionar mis obras' > 'Agregar' para registrar una nueva obra."
    );
  }

  if (includesAny(msg, ["aprobación", "cuánto tarda", "revision obra"])) {
    return addFollowUp(
      "El proceso de aprobación tarda entre 24 y 48 horas."
    );
  }

  if (includesAny(msg, ["estado obra", "estatus obra"])) {
    return addFollowUp(
      "Pendiente: en revisión. Aceptada: disponible. Rechazada: no cumple requisitos."
    );
  }

  if (includesAny(msg, ["perfil artista", "mi perfil"])) {
    return addFollowUp(
      "En 'Mi perfil artístico' puedes agregar redes sociales y datos de contacto."
    );
  }

  // ========================================
  // 📁 ARCHIVOS
  // ========================================
  if (includesAny(msg, ["formatos", "archivos", "tipo de archivo"])) {
    return addFollowUp(
      "Imágenes: JPG/PNG | Música: WAV | 3D: GLB (máx 1000 vértices) | Literatura: JPG/PNG + PDF."
    );
  }

  if (includesAny(msg, ["3d", "escultura"])) {
    return addFollowUp(
      "Modelos .GLB sin animaciones, malla limpia y máximo 1,000 vértices."
    );
  }

  // ========================================
  // 💰 SUBASTAS
  // ========================================
  if (includesAny(msg, ["subasta", "pujar"])) {
    return addFollowUp(
      "Pujas mínimas de $100 MXN. El ganador es el Top 1 al finalizar el tiempo."
    );
  }

  if (includesAny(msg, ["ganador"])) {
    return addFollowUp(
      "El ganador es el usuario en el Top 1 al terminar la subasta."
    );
  }

  if (includesAny(msg, ["pago", "pagar"])) {
    return addFollowUp(
      "El ganador tiene 7 días hábiles para completar el pago con tarjeta."
    );
  }

  if (includesAny(msg, ["entrega", "descarga"])) {
    return addFollowUp(
      "Tras el pago se habilita la descarga del archivo digital."
    );
  }

  // ========================================
  // 💳 PLANES
  // ========================================
  if (includesAny(msg, ["planes", "precio", "costo"])) {
    return addFollowUp(
      "Plan Básico: 35% comisión. Pro: $99/mes (30%). Galería: desde 25% con beneficios exclusivos."
    );
  }

  // ========================================
  // 🧍 AVATARES
  // ========================================
  if (includesAny(msg, ["avatar"])) {
    return addFollowUp(
      "Modo single: Jorge o Victoria. Multijugador: avatar personalizado."
    );
  }

  if (includesAny(msg, ["multijugador", "multiple"])) {
    return addFollowUp(
      "Hasta 20 usuarios simultáneos en modo multijugador."
    );
  }

  if (includesAny(msg, ["vr", "immersive"])) {
    return addFollowUp(
      "VR permite experiencia inmersiva con movimiento de cabeza."
    );
  }

  // ========================================
  // 🎮 CONTROLES
  // ========================================
  if (includesAny(msg, ["controles", "mover", "teclas"])) {
    return addFollowUp(
      "En PC: W, A, S, D para moverte, Espacio para saltar, Shift para correr y E para inspeccionar."
    );
  }

  if (includesAny(msg, ["móvil", "celular"])) {
    return addFollowUp(
      "Activa controles táctiles con el botón 'OFF' en pantalla."
    );
  }

  // ========================================
  // 🧭 INTERACCIONES
  // ========================================
  if (includesAny(msg, ["npc", "alfredo"])) {
    return addFollowUp(
      "Alfredo es el NPC guía en la entrada del metaverso."
    );
  }

  if (includesAny(msg, ["mapa", "minimapa"])) {
    return addFollowUp(
      "El minimapa permite teletransportarte a zonas del metaverso."
    );
  }

  if (includesAny(msg, ["sentarse"])) {
    return addFollowUp(
      "Puedes sentarte acercándote a los asientos blancos."
    );
  }

  // ========================================
  // 🔍 INSPECCIÓN
  // ========================================
  if (includesAny(msg, ["inspeccionar", "ver obra"])) {
    return addFollowUp(
      "Puedes ver ficha técnica, artista y acceder a la subasta."
    );
  }

  if (includesAny(msg, ["música", "reproductor"])) {
    return addFollowUp(
      "El reproductor permite escuchar música del artista y ver su perfil."
    );
  }

  // ========================================
  // 🖼️ ÁREAS DEL METAVERSO
  // ========================================
  if (
    includesAny(msg, ["áreas", "areas", "qué puedo subir", "que puedo subir", "tipos de arte", "categorías"])
  ) {
    return addFollowUp(
      "En VARTICA Metaverse puedes subir diferentes tipos de obras artísticas dependiendo del área en la que trabajes. Las principales áreas disponibles son:\n\n" +
        "🎨 Dibujo, pintura y fotografía: Imágenes en JPG o PNG.\n\n" +
        "📚 Literatura: Portada en JPG/PNG + archivo PDF.\n\n" +
        "🎵 Música: Archivos en formato WAV.\n\n" +
        "🗿 Escultura y modelado 3D: Archivos GLB sin animaciones y máximo 1,000 vértices.\n\n" +
        "Todas las obras pasan por revisión antes de ser publicadas y pueden participar en subastas."
    );
  }

  // ========================================
  // ❓ DEFAULT
  // ========================================
  return fallbackResponse();
}