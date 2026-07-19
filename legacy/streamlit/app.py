import streamlit as st
import random
import os
import json
import time
import html
import google.generativeai as genai
from data import generar_lote, generar_insulto, generar_tasacion_local, generar_consejo_fantasma, generar_juicio_rata

# ==============================================================================
# PAGE CONFIGURATION & METADATA
# ==============================================================================
st.set_page_config(
    page_title="Remates del Caos",
    page_icon=None,
    layout="wide",
    initial_sidebar_state="expanded"
)

# ==============================================================================
# CUSTOM LUXURY DARK THEME STYLING (CSS)
# ==============================================================================
st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Montserrat:wght@300;400;600&display=swap');

/* Main app background with a luxurious radial gradient */
.stApp {
    background-color: #0A0A0A !important;
    background-image: radial-gradient(circle, #1c1810 0%, #070707 100%) !important;
    color: #E2D1B3 !important;
    font-family: 'Playfair Display', serif !important;
}

/* Titles and Headers styling */
h1, h2, h3, .luxury-header {
    font-family: 'Cinzel', serif !important;
    color: #D4AF37 !important;
    text-shadow: 0px 0px 10px rgba(212, 175, 55, 0.4);
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 2px;
}

.luxury-subheader {
    font-family: 'Cinzel', serif !important;
    color: #C5A059 !important;
    text-align: center;
    font-style: italic;
    font-size: 1.1rem;
    margin-bottom: 2rem;
    text-transform: uppercase;
    letter-spacing: 1px;
}

/* Sidebar Custom Styling */
section[data-testid="stSidebar"] {
    background-color: #0c0b08 !important;
    border-right: 1px solid rgba(212, 175, 55, 0.25) !important;
}

section[data-testid="stSidebar"] hr {
    border-top: 1px solid rgba(212, 175, 55, 0.2) !important;
}

/* Custom styled luxury card container */
.luxury-card {
    background-color: #110f0a;
    border: 2px solid #C5A059;
    border-radius: 8px;
    padding: 30px;
    margin: 20px 0;
    box-shadow: 0px 0px 25px rgba(212, 175, 55, 0.12), inset 0px 0px 20px rgba(0,0,0,0.8);
    position: relative;
    overflow: hidden;
}

.luxury-card::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #110f0a, #D4AF37, #110f0a);
}

.luxury-card-title {
    font-family: 'Cinzel', serif;
    color: #D4AF37;
    font-size: 1.6rem;
    font-weight: 700;
    margin-bottom: 15px;
    border-bottom: 1px solid rgba(212, 175, 55, 0.3);
    padding-bottom: 10px;
    letter-spacing: 1px;
}

.luxury-card-desc {
    font-family: 'Playfair Display', serif;
    font-size: 1.2rem;
    line-height: 1.7;
    color: #E2D1B3;
    font-style: italic;
    margin-bottom: 20px;
}

.luxury-card-bid {
    font-family: 'Cinzel', serif;
    font-weight: bold;
    color: #D4AF37;
    font-size: 1.3rem;
    text-align: right;
    text-shadow: 0px 0px 5px rgba(212, 175, 55, 0.3);
}

/* Metric component styling */
div[data-testid="stMetricValue"] {
    font-family: 'Cinzel', serif !important;
    color: #D4AF37 !important;
    font-size: 2.8rem !important;
    font-weight: 700 !important;
    text-shadow: 0px 0px 12px rgba(212, 175, 55, 0.5) !important;
    text-align: center !important;
}

div[data-testid="stMetricLabel"] > div {
    font-family: 'Montserrat', sans-serif !important;
    color: #C5A059 !important;
    text-transform: uppercase !important;
    letter-spacing: 2px !important;
    font-size: 0.9rem !important;
    text-align: center !important;
}

/* Number input custom design */
div[data-testid="stNumberInput"] label {
    font-family: 'Montserrat', sans-serif !important;
    color: #C5A059 !important;
    text-transform: uppercase !important;
    letter-spacing: 1px !important;
    font-size: 0.85rem !important;
}

div[data-testid="stNumberInput"] input {
    background-color: #14120e !important;
    color: #D4AF37 !important;
    border: 1px solid #C5A059 !important;
    font-family: 'Playfair Display', serif !important;
    font-size: 1.3rem !important;
    font-weight: bold !important;
    text-align: center !important;
}

/* Global button styles */
div.stButton > button {
    width: 100% !important;
    background-color: #12100b !important;
    color: #D4AF37 !important;
    border: 2px solid #D4AF37 !important;
    border-radius: 4px !important;
    font-family: 'Cinzel', serif !important;
    font-weight: 700 !important;
    text-transform: uppercase !important;
    letter-spacing: 2px !important;
    padding: 12px 24px !important;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5) !important;
}

div.stButton > button:hover {
    background-color: #D4AF37 !important;
    color: #0A0A0A !important;
    box-shadow: 0px 0px 20px rgba(212, 175, 55, 0.7) !important;
    transform: translateY(-2px) !important;
}

div.stButton > button:active {
    transform: translateY(1px) !important;
}

/* Pass button styling override */
div[data-testid="column"]:nth-of-type(2) button {
    border-color: #7f7560 !important;
    color: #a89c84 !important;
}

div[data-testid="column"]:nth-of-type(2) button:hover {
    background-color: #8b0000 !important;
    border-color: #ff0000 !important;
    color: #ffffff !important;
    box-shadow: 0px 0px 20px rgba(255, 0, 0, 0.6) !important;
}

/* Inventory List style */
.inventory-container {
    background-color: #0f0d09;
    border: 1px solid rgba(212, 175, 55, 0.2);
    border-radius: 6px;
    padding: 20px;
    margin-top: 35px;
    box-shadow: inset 0px 0px 15px rgba(0,0,0,0.6);
}

.inventory-item {
    padding: 15px;
    border-bottom: 1px solid rgba(212, 175, 55, 0.15);
}

.inventory-item:last-child {
    border-bottom: none;
}

.inventory-item-name {
    font-family: 'Cinzel', serif;
    color: #D4AF37;
    font-size: 1.1rem;
    font-weight: 700;
}

.inventory-item-details {
    font-family: 'Playfair Display', serif;
    font-style: italic;
    color: #C0B095;
    margin-top: 5px;
    font-size: 0.95rem;
}

/* Alerts and feedback formatting */
.stAlert {
    background-color: #1a160e !important;
    color: #e2c070 !important;
    border: 1px solid #D4AF37 !important;
}

/* Chat container styles */
.chat-container {
    background-color: #0d0b07;
    border: 1px solid rgba(212, 175, 55, 0.2);
    border-radius: 6px;
    padding: 12px;
    max-height: 280px;
    overflow-y: auto;
    margin-bottom: 12px;
    box-shadow: inset 0px 0px 10px rgba(0,0,0,0.8);
}

.chat-bubble-user {
    background-color: #1a160d;
    border-left: 3px solid #C5A059;
    padding: 8px 12px;
    margin: 6px 0;
    border-radius: 4px;
    font-size: 0.88rem;
    color: #e2c070;
    text-align: left;
}

.chat-bubble-npc {
    background-color: #110e0a;
    border-left: 3px solid #ff3333;
    padding: 8px 12px;
    margin: 6px 0;
    border-radius: 4px;
    font-size: 0.88rem;
    color: #f1e5d3;
    font-style: italic;
    text-align: left;
}

/* Keyframes for the chaotic moving Pujar button when an item is bought */
@keyframes chaotic-move {
  0% { transform: translate(0, 0); }
  10% { transform: translate(140px, -90px) rotate(8deg); }
  20% { transform: translate(-170px, 110px) rotate(-12deg); }
  35% { transform: translate(190px, -160px) rotate(18deg); }
  50% { transform: translate(-230px, 60px) rotate(-8deg); }
  65% { transform: translate(170px, 140px) rotate(22deg); }
  80% { transform: translate(-140px, -80px) rotate(-15deg); }
  90% { transform: translate(70px, 50px) rotate(5deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
}
</style>
""", unsafe_allow_html=True)

# ==============================================================================
# GEMINI API CHAT & LOT CONNECTORS
# ==============================================================================
def get_elite_lot_from_gemini(api_key, past_items=[]):
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    system_instruction = (
        "Eres un subastador de una casa de remates de lujo corrupto, histérico y sumamente burlón. "
        "Hoy estás vendiendo un lote especial de Elite. Debes generar un ítem que sea ridículamente absurdo, "
        "grotesco, e inútil en español. Tu tono es majestuoso y de comedia negra. "
        "Usa modismos latinoamericanos y chilenos vulgares refinados, sin censura pero sin herir sensibilidades graves.\n\n"
        "Generarás UN ítem en este formato JSON estricto (y nada más, solo el JSON, sin ```json o texto adicional):\n"
        '{"nombre_item": "[Nombre ridículo, largo y elegante]", "descripcion": "[Por qué es espectacular, usando palabras refinadas como exquisito, magistral]", "puja_inicial": [un número entre 1500 y 4000], "letra_pequena": "[Una consecuencia fatalmente molesta y graciosa si alguien compra esto]"}\n\n'
        f"Evita repetir o asemejarte a cualquiera de estos ítems: {', '.join(past_items[:10])}."
    )
    
    try:
        response = model.generate_content(
            "Genera el lote de subasta especial de Elite.",
            generation_config={
                "response_mime_type": "application/json",
                "temperature": 1.0,
            },
            system_instruction=system_instruction
        )
        text = response.text.strip()
        
        if text.startswith("```json"):
            text = text.replace("```json", "", 1)
        if text.endswith("```"):
            text = text.rsplit("```", 1)[0]
        text = text.strip()
        
        data = json.loads(text)
        required_keys = ["nombre_item", "descripcion", "puja_inicial", "letra_pequena"]
        if not all(k in data for k in required_keys):
            raise ValueError("Faltan llaves requeridas en el JSON del lote de Elite.")
            
        data["puja_inicial"] = int(data["puja_inicial"])
        data["es_elite"] = True
        return data
    except Exception:
        item = generar_lote(past_items)
        item["nombre_item"] = f"LOTE DE ELITE PROCEDURAL: {item['nombre_item']}"
        item["puja_inicial"] = int(item["puja_inicial"] * 2.5)
        item["es_elite"] = True
        return item

def get_auctioneer_insult(api_key):
    if not api_key:
        return generar_insulto()
        
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    prompt = (
        "Eres un subastador de una casa de remates de lujo corrupto, histérico y teatral. "
        "El jugador acaba de rechazar la oferta del ítem actual. "
        "Genera un insulto rápido, histérico, absurdamente elegante, barroco y majestuoso hacia el jugador. "
        "Usa chilenismos o modismos latinos en un formato muy chistoso, elegante y ligeramente vulgar pero de clase. "
        "Sé extremadamente breve (máximo 20 palabras) y dramático. "
        "No uses comillas ni emojis en la respuesta, solo devuelve el insulto crudo en español."
    )
    try:
        response = model.generate_content(
            prompt,
            generation_config={"temperature": 1.0}
        )
        return response.text.strip().replace('"', '')
    except Exception:
        return generar_insulto()

# Fallback dialogs for chat
FALLBACK_CHAT_RESPONSES = {
    "subastador": [
        "¿Me estás contando tus problemas existenciales? ¡Eso no aumenta tu puja, pedazo de miserable! ¡Paga o lárgate!",
        "Tu vida suena tan aburrida que preferiría subastar mi propia tumba. ¡Pujar es lo único que te queda!",
        "Eso que llamas 'trabajo' suena a esclavitud de oficina. ¡Empeña tu alma aquí, rinde más!",
        "¿Tus amigos no te invitan a salir? Lógico, yo tampoco lo haría. Compra este lote y hazte amigo de la letra pequeña.",
        "Qué historia tan deprimente. Me dan ganas de llorar pesos falsos. ¡Siguiente puja!"
    ],
    "fantasma": [
        "Psst... a mí no me interesan tus dramas existenciales. Lo único que flota aquí es mi desinterés. Soborname y olvida tus penas.",
        "¿De verdad te preocupa tu futuro laboral? Si murieras como yo, no tendrías que pagar arriendo. Piénsalo.",
        "Qué historia tan deprimente. Si tuviera lágrimas, lloraría ectoplasma. Mejor dame 150 pesos y te digo el secreto.",
        "Tu vida amorosa está más muerta que yo. Y mira que yo llevo tres siglos enterrado en Rancagua.",
        "Eso que me cuentas me da sueño, y eso que yo ya no duermo. Búscate un pasatiempo real, como pujar."
    ],
    "rata": [
        "Qué aburrimiento de confesión. Los chillidos de mis crías en las alcantarillas son más intelectuales que tu vida entera.",
        "¿Te quejas de tu sueldo? Típico humano flojo. Yo busco comida en la basura y tengo más clase que tú con tu monóculo invisible.",
        "Tus fracasos académicos no me sorprenden. Tu cerebro no llena ni media cáscara de nuez. Qué vergüenza.",
        "¿Tu novia te dejó? Inteligente mujer. Al menos ella no tiene que oler tu aliento a desesperación de oficina.",
        "Chillidos inútiles de un ser inferior. Tus lamentos de vida no valen ni un trozo de queso rancio."
    ]
}

def get_npc_chat_response(api_key, npc_key, user_message, past_confessions):
    if not api_key:
        return random.choice(FALLBACK_CHAT_RESPONSES[npc_key])
        
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    npc_details = {
        "subastador": {
            "nombre": "El Subastador Decrépito",
            "persona": "Un viejo subastador de lujo corrupto, histérico y pervertido. Te habla de forma lenta, profunda, arrastrada, con un tono sensual perturbador y burlón. Te trata de cobarde, tacaño y mediocre de oficina."
        },
        "fantasma": {
            "nombre": "El Fantasma Coimero",
            "persona": "Un espectro tramposo que habita la sala flotando entre monedas. Habla con susurros cínicos y flojos. Te aconseja de forma corrupta y busca que le pagues sobornos de 150 pesos."
        },
        "rata": {
            "nombre": "La Rata Aristócrata",
            "persona": "Un roedor gigante con corona y monóculo de extrema arrogancia. Habla rápido y con chillidos pedantes. Considera a los humanos escoria inferior y se burla de tus finanzas y tus fracasos."
        }
    }
    
    char = npc_details[npc_key]
    confessions_str = "\n".join([f"- {c}" for c in past_confessions])
    
    system_instruction = (
        f"Eres {char['nombre']}, un personaje en una sala de subastas oscuras y absurdas.\n"
        f"Tu personalidad: {char['persona']}.\n\n"
        f"El usuario te está confesando detalles personales o contándote cosas de su vida.\n"
        f"Tu objetivo es usar cualquier información personal revelada (como sus fracasos amorosos, deudas, soledad, miedos, trabajo de oficina) "
        f"para burlarte de él, humillarlo y usarlo en su contra. Debes ser extremadamente creativo, sarcástico, burlón, hiriente y divertido, "
        f"sin censura pero de forma comediante.\n\n"
        f"Historial de detalles personales del usuario conocidos hasta ahora:\n{confessions_str}\n\n"
        "Responde en español, en primera persona, de forma directa (máximo 45 palabras), sin disculpas, introducciones ni emojis."
    )
    
    try:
        response = model.generate_content(
            user_message,
            generation_config={"temperature": 1.0},
            system_instruction=system_instruction
        )
        return response.text.strip().replace('"', '')
    except Exception:
        return random.choice(FALLBACK_CHAT_RESPONSES[npc_key])

# ==============================================================================
# SESSION STATE INITIALIZATION
# ==============================================================================
if 'budget' not in st.session_state:
    st.session_state.budget = 10000
if 'inventory' not in st.session_state:
    st.session_state.inventory = []
if 'current_item' not in st.session_state:
    st.session_state.current_item = None
if 'last_action' not in st.session_state:
    st.session_state.last_action = None
if 'last_item' not in st.session_state:
    st.session_state.last_item = None
if 'auctioneer_msg' not in st.session_state:
    st.session_state.auctioneer_msg = ""
if 'show_bizarre_animation' not in st.session_state:
    st.session_state.show_bizarre_animation = False
if 'game_over' not in st.session_state:
    st.session_state.game_over = False
if 'past_items' not in st.session_state:
    st.session_state.past_items = []
if 'turn_count' not in st.session_state:
    st.session_state.turn_count = 1
if 'speak_text' not in st.session_state:
    st.session_state.speak_text = ""
if 'trigger_speech' not in st.session_state:
    st.session_state.trigger_speech = False
if 'speech_voice_type' not in st.session_state:
    st.session_state.speech_voice_type = "subastador"
if 'chat_history' not in st.session_state:
    st.session_state.chat_history = {
        "subastador": [],
        "fantasma": [],
        "rata": []
    }
if 'confessions' not in st.session_state:
    st.session_state.confessions = []
if 'ghost_leaked' not in st.session_state:
    st.session_state.ghost_leaked = False
if 'current_ghost_advice' not in st.session_state:
    st.session_state.current_ghost_advice = ""
if 'current_rat_judgment' not in st.session_state:
    st.session_state.current_rat_judgment = ""

# ==============================================================================
# PROCEDURAL GAME HELPER
# ==============================================================================
def obtener_siguiente_lote_completo(api_key):
    es_elite = (st.session_state.turn_count % 10 == 0)
    if es_elite:
        if api_key:
            item = get_elite_lot_from_gemini(api_key, st.session_state.past_items)
        else:
            item = generar_lote(st.session_state.past_items, st.session_state.confessions)
            item["nombre_item"] = f"LOTE DE ELITE PROCEDURAL: {item['nombre_item']}"
            item["puja_inicial"] = int(item["puja_inicial"] * 2.5)
            item["es_elite"] = True
    else:
        item = generar_lote(st.session_state.past_items, st.session_state.confessions)
        item["es_elite"] = False
    return item

# ==============================================================================
# SIDEBAR
# ==============================================================================
with st.sidebar:
    st.markdown('<h2 class="luxury-header" style="font-size: 1.1rem; margin-top: 10px;">◈ Christie\'s del Caos ◈</h2>', unsafe_allow_html=True)
    st.markdown("---")
    
    env_api_key = os.environ.get("GEMINI_API_KEY", "")
    api_key_input = st.text_input(
        "Gemini API Key",
        value=env_api_key,
        type="password",
        help="Ingresa tu clave de API de Google Gemini para habilitar la conversación personalizada y lotes de Elite."
    )
    
    if api_key_input:
        st.markdown("<p style='color: #4CAF50; font-size: 0.85rem; font-weight: bold; text-align: center;'>Conexión con Gemini establecida</p>", unsafe_allow_html=True)
    else:
        st.markdown("<p style='color: #FF9800; font-size: 0.85rem; font-style: italic; text-align: center;'>Usando catálogo procesal local</p>", unsafe_allow_html=True)
        
    st.markdown("---")
    
    # Audio controls
    music_enabled = st.checkbox("Activar Música de Fondo (Sinte Raro)", value=False)
    tts_enabled = st.checkbox("Activar Voz del Subastador (Sensual y Raro)", value=True)
    
    st.markdown("---")
    st.markdown(f"""
    Ronda actual: {st.session_state.turn_count}
    
    **Reglas del Salón:**
    1. Entras a la subasta con 10000 pesos.
    2. El subastador ofrece lotes de dudosa utilidad.
    3. Cada 10 rondas se subasta un Lote de Elite.
    4. Si tu presupuesto baja de 100 pesos, quedas en quiebra.
    """)
    
    st.markdown("---")
    if st.button("Reiniciar Subasta"):
        st.session_state.budget = 10000
        st.session_state.inventory = []
        st.session_state.current_item = None
        st.session_state.last_action = None
        st.session_state.last_item = None
        st.session_state.auctioneer_msg = ""
        st.session_state.show_bizarre_animation = False
        st.session_state.game_over = False
        st.session_state.past_items = []
        st.session_state.turn_count = 1
        st.session_state.speak_text = ""
        st.session_state.trigger_speech = False
        st.session_state.speech_voice_type = "subastador"
        st.session_state.chat_history = {
            "subastador": [],
            "fantasma": [],
            "rata": []
        }
        st.session_state.confessions = []
        st.session_state.ghost_leaked = False
        st.session_state.current_ghost_advice = ""
        st.session_state.current_rat_judgment = ""
        st.rerun()

# ==============================================================================
# DYNAMIC WEB AUDIO API SYNTHESIZED SOUNDTRACK (100% LOCAL & CORS-PROOF)
# ==============================================================================
if music_enabled:
    st.components.v1.html("""
    <script>
    (function() {
        var parentWin = window.parent;
        if (!parentWin) return;
        
        if (parentWin.weirdMusicPlaying) {
            return;
        }
        
        parentWin.weirdMusicPlaying = true;
        
        var AudioContext = parentWin.AudioContext || parentWin.webkitAudioContext || window.AudioContext;
        if (!AudioContext) return;
        
        var ctx = new AudioContext();
        parentWin.weirdAudioCtx = ctx;
        
        var drone = ctx.createOscillator();
        var droneGain = ctx.createGain();
        drone.type = 'triangle';
        drone.frequency.value = 65.41;
        droneGain.gain.setValueAtTime(0.08, ctx.currentTime);
        drone.connect(droneGain);
        droneGain.connect(ctx.destination);
        drone.start();
        parentWin.weirdDroneOsc = drone;
        
        var notes = [130.81, 155.56, 196.00, 207.65, 246.94, 261.63, 246.94, 207.65];
        var index = 0;
        
        var interval = setInterval(function() {
            if (ctx.state === 'suspended') {
                ctx.resume();
            }
            var now = ctx.currentTime;
            var osc = ctx.createOscillator();
            var gain = ctx.createGain();
            var filter = ctx.createBiquadFilter();
            
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(notes[index], now);
            
            var lfo = ctx.createOscillator();
            var lfoGain = ctx.createGain();
            lfo.frequency.value = 3.8;
            lfoGain.gain.value = 4;
            lfo.connect(lfoGain);
            lfoGain.connect(osc.frequency);
            lfo.start();
            
            filter.type = 'lowpass';
            filter.frequency.value = 380;
            
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.05, now + 0.2);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.7);
            
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start(now);
            osc.stop(now + 1.8);
            lfo.stop(now + 1.8);
            
            index = (index + 1) % notes.length;
        }, 1200);
        
        parentWin.weirdMusicInterval = interval;
    })();
    </script>
    """, height=0, width=0)
else:
    st.components.v1.html("""
    <script>
    (function() {
        var parentWin = window.parent;
        if (!parentWin) return;
        
        parentWin.weirdMusicPlaying = false;
        
        if (parentWin.weirdAudioCtx) {
            try { parentWin.weirdAudioCtx.close(); } catch(e) {}
            parentWin.weirdAudioCtx = null;
        }
        if (parentWin.weirdMusicInterval) {
            clearInterval(parentWin.weirdMusicInterval);
            parentWin.weirdMusicInterval = null;
        }
        if (parentWin.weirdDroneOsc) {
            try { parentWin.weirdDroneOsc.stop(); } catch(e) {}
            parentWin.weirdDroneOsc = null;
        }
    })();
    </script>
    """, height=0, width=0)

# ==============================================================================
# BROWSER-SIDE TEXT-TO-SPEECH (TTS) WITH VOICE TYPE MODULATION
# ==============================================================================
def render_tts_component():
    if tts_enabled and st.session_state.get('trigger_speech', False) and st.session_state.get('speak_text', ''):
        escaped_speech = json.dumps(st.session_state.speak_text)
        voice_type = st.session_state.get('speech_voice_type', 'subastador')
        st.components.v1.html(f"""
        <script>
        (function() {{
            var synth = window.speechSynthesis || window.parent.speechSynthesis;
            if (!synth) return;
            
            var speak = function() {{
                synth.cancel();
                var voices = synth.getVoices();
                var esVoices = voices.filter(function(v) {{ return v.lang.startsWith("es"); }});
                var selectedVoice = null;
                
                var voiceType = "{voice_type}";
                var rate = 1.0;
                var pitch = 1.0;
                var gender = "male";
                
                if (voiceType === "subastador") {{
                    rate = 0.82;
                    pitch = 0.60;
                    gender = "male";
                }} else if (voiceType === "fantasma") {{
                    rate = 1.05;
                    pitch = 1.45;
                    gender = "female"; // high pitch for ghostly whisper
                }} else if (voiceType === "rata") {{
                    rate = 1.35;
                    pitch = 1.65;
                    gender = "male"; // fast squeaky
                }}
                
                if (gender === "male") {{
                    var maleNames = ["jorge", "javier", "diego", "juan", "carlos", "enrique", "pablo", "alvaro"];
                    for (var i = 0; i < maleNames.length; i++) {{
                        selectedVoice = esVoices.find(function(v) {{
                            return v.name.toLowerCase().indexOf(maleNames[i]) !== -1;
                        }});
                        if (selectedVoice) break;
                    }}
                }} else if (gender === "female") {{
                    var femaleNames = ["monica", "paulina", "marisol", "angelica", "sara", "helena", "laura"];
                    for (var i = 0; i < femaleNames.length; i++) {{
                        selectedVoice = esVoices.find(function(v) {{
                            return v.name.toLowerCase().indexOf(femaleNames[i]) !== -1;
                        }});
                        if (selectedVoice) break;
                    }}
                }}
                
                if (!selectedVoice && esVoices.length > 0) {{
                    selectedVoice = esVoices[0];
                }}
                
                var msg = new SpeechSynthesisUtterance({escaped_speech});
                if (selectedVoice) {{
                    msg.voice = selectedVoice;
                }}
                
                msg.rate = rate;
                msg.pitch = pitch;
                synth.speak(msg);
            }};
            
            if (synth.getVoices().length === 0) {{
                synth.onvoiceschanged = speak;
            }} else {{
                speak();
            }}
        }})();
        </script>
        """, height=0, width=0)
        st.session_state.trigger_speech = False

# Render TTS element early to execute
render_tts_component()

# ==============================================================================
# MAIN PAGE ROUTING & RENDER
# ==============================================================================

# Verify bankruptcy
if st.session_state.budget < 100:
    st.session_state.game_over = True

# --- GAME OVER SCREEN ---
if st.session_state.game_over:
    st.markdown('<h1 class="luxury-header">◈ BANCARROTA ABSOLUTA ◈</h1>', unsafe_allow_html=True)
    st.balloons()
    
    evaluation_text = generar_tasacion_local(st.session_state.inventory)
        
    st.markdown(f"""
    <div class="luxury-card" style="border-color: #8b0000; box-shadow: 0px 0px 30px rgba(255, 0, 0, 0.25);">
        <div class="luxury-card-title" style="color: #ff3333; border-color: rgba(255, 0, 0, 0.4);">
            Veredicto de Liquidación Forzosa
        </div>
        <p style="font-size: 1.15rem; line-height: 1.7; color: #f1e5d3; font-style: italic;">
            "{html.escape(evaluation_text)}"
        </p>
    </div>
    """, unsafe_allow_html=True)
    
    col_stat1, col_stat2 = st.columns(2)
    with col_stat1:
        st.metric("Reliquias Adquiridas", f"{len(st.session_state.inventory)} lotes")
    with col_stat2:
        total_despilfarrado = 10000 - st.session_state.budget
        st.metric("Presupuesto Despilfarrado", f"${total_despilfarrado:,}")
        
    if st.session_state.inventory:
        st.markdown('<div class="inventory-container">', unsafe_allow_html=True)
        st.markdown('<div class="luxury-header" style="font-size: 1.2rem; text-align: left; margin-bottom: 10px;">◈ Registro de tus Adquisiciones Absurdas:</div>', unsafe_allow_html=True)
        for i, item_inv in enumerate(st.session_state.inventory):
            st.markdown(f"""
            <div class="inventory-item">
                <span class="inventory-item-name">{i+1}. {html.escape(item_inv['nombre_item'])}</span>
                <span style="color: #ff3333; font-weight: bold; margin-left: 10px;">[Costo: ${item_inv.get('precio_compra', 0):,}]</span>
                <div class="inventory-item-details">"{html.escape(item_inv['descripcion'])}"</div>
                <div style="color: #ffaa00; font-size: 0.85rem; margin-top: 4px; font-weight: bold;">Consecuencia: {html.escape(item_inv['letra_pequena'])}</div>
            </div>
            """, unsafe_allow_html=True)
        st.markdown('</div>', unsafe_allow_html=True)
    else:
        st.markdown("<p style='text-align: center; font-style: italic; color: #a89c84;'>No lograste comprar absolutamente nada. Qué existencia tan austera y aburrida.</p>", unsafe_allow_html=True)
        
    if st.button("Volver a Entrar a la Sala"):
        st.session_state.budget = 10000
        st.session_state.inventory = []
        st.session_state.current_item = None
        st.session_state.last_action = None
        st.session_state.last_item = None
        st.session_state.auctioneer_msg = ""
        st.session_state.show_bizarre_animation = False
        st.session_state.game_over = False
        st.session_state.past_items = []
        st.session_state.turn_count = 1
        st.session_state.speak_text = ""
        st.session_state.trigger_speech = False
        st.session_state.speech_voice_type = "subastador"
        st.session_state.chat_history = {
            "subastador": [],
            "fantasma": [],
            "rata": []
        }
        st.session_state.confessions = []
        st.session_state.ghost_leaked = False
        st.session_state.current_ghost_advice = ""
        st.session_state.current_rat_judgment = ""
        st.rerun()
        
    st.stop()

# --- ACTIVE GAMEPLAY (SPLIT LAYOUT) ---

st.markdown('<h1 class="luxury-header">◈ Remates del Caos ◈</h1>', unsafe_allow_html=True)
st.markdown('<p class="luxury-subheader">Subastas de Lujo e Inutilidad Interdimensional</p>', unsafe_allow_html=True)

# Initial Item Load Check
if st.session_state.current_item is None:
    item = obtener_siguiente_lote_completo(api_key_input if api_key_input else None)
    st.session_state.current_item = item
    st.session_state.past_items.append(item["nombre_item"])
    st.session_state.current_ghost_advice = generar_consejo_fantasma()
    st.session_state.current_rat_judgment = generar_juicio_rata()
    st.session_state.ghost_leaked = False
    
    st.session_state.speak_text = (
        f"Bienvenidos a la casa de remates del caos. Siguiente lote. {item['nombre_item']}. "
        f"{item['descripcion']}. Puja inicial en {item['puja_inicial']} pesos."
    )
    st.session_state.speech_voice_type = "subastador"
    st.session_state.trigger_speech = True

item = st.session_state.current_item

# Columns layout
col_left, col_right = st.columns([1, 2])

# --- LEFT COLUMN: NPC SELECTION & CONFESSION CHAT ---
with col_left:
    st.markdown('<h3 class="luxury-header" style="font-size: 1.1rem; text-align: left;">◈ Espectadores de la Sala ◈</h3>', unsafe_allow_html=True)
    npc_selection = st.selectbox(
        "Selecciona un personaje para hablar:",
        options=["Subastador", "Fantasma", "Rata"],
        key="active_npc_selector"
    )
    
    npc_map = {
        "Subastador": "subastador",
        "Fantasma": "fantasma",
        "Rata": "rata"
    }
    npc_key = npc_map[npc_selection]
    
    npc_portraits = {
        "subastador": ("assets/subastador.jpg", "El Subastador Decrépito", "Un viejo corrupto, pervertido y majestuoso. Adora el despilfarro y te insulta con un tono sensual arrastrado."),
        "fantasma": ("assets/fantasma.jpg", "El Fantasma Coimero", "Un espectro tramposo rodeado de doblones flotantes. Te susurra secretos del lote por una propina de $150."),
        "rata": ("assets/rata.jpg", "La Rata Aristócrata", "Un roedor gigante con monóculo y corona. Te considera escoria inferior y vigila tu tacañería.")
    }
    
    img_path, npc_name, npc_desc = npc_portraits[npc_key]
    st.image(img_path, use_container_width=True)
    st.markdown(f"<p style='font-family: Cinzel, serif; color: #D4AF37; font-weight: bold; margin-top: 5px;'>{npc_name}</p>", unsafe_allow_html=True)
    st.markdown(f"<p style='font-size: 0.9rem; font-style: italic; color: #a89c84; margin-top: -10px;'>{npc_desc}</p>", unsafe_allow_html=True)
    
    # Ghost Bribe Option
    if npc_key == "fantasma":
        if st.session_state.ghost_leaked:
            st.info("El Fantasma ya te reveló el secreto de este lote.")
        else:
            if st.button("Sobornar al Fantasma ($150)"):
                if st.session_state.budget < 150:
                    st.error("Error: No tienes suficiente dinero para pagar esta coima.")
                else:
                    st.session_state.budget -= 150
                    st.session_state.ghost_leaked = True
                    st.session_state.speak_text = f"Trato hecho... la letra pequeña de esta porquería dice: {item['letra_pequena']}. No le digas al jefe."
                    st.session_state.speech_voice_type = "fantasma"
                    st.session_state.trigger_speech = True
                    st.rerun()
                    
    st.markdown("---")
    st.markdown("<p style='font-family: Cinzel, serif; color: #C5A059; font-size: 0.95rem; font-weight: bold;'>Susurros y Confesiones</p>", unsafe_allow_html=True)
    
    # Render Chat Log
    chat_log = st.session_state.chat_history[npc_key]
    chat_html = ""
    for msg in chat_log:
        if msg["role"] == "user":
            chat_html += f'<div class="chat-bubble-user">Tú: {html.escape(msg["text"])}</div>'
        else:
            border_color = "#ff3333" if npc_key == "subastador" else "#4CAF50" if npc_key == "fantasma" else "#8b7e66"
            chat_html += f'<div class="chat-bubble-npc" style="border-left-color: {border_color};">{html.escape(msg["text"])}</div>'
            
    if chat_html:
        st.markdown(f'<div class="chat-container">{chat_html}</div>', unsafe_allow_html=True)
    else:
        st.markdown("<p style='font-style: italic; font-size: 0.85rem; color: #a89c84;'>La sala está en silencio. Confiésate para recibir tu humillación.</p>", unsafe_allow_html=True)
        
    # Text input for confession
    user_conf = st.text_input(
        "Confiesa algo sobre tu vida:",
        key=f"conf_input_{npc_key}",
        placeholder="e.g. Odio madrugar / Mi novia me dejó..."
    )
    
    if st.button("Enviar Confesión", key=f"btn_conf_{npc_key}"):
        if user_conf.strip() == "":
            st.error("Error: No puedes confesar el vacío.")
        else:
            with st.spinner("Masticando tus fracasos..."):
                response = get_npc_chat_response(
                    api_key_input if api_key_input else None,
                    npc_key,
                    user_conf,
                    st.session_state.confessions
                )
            
            # Save confession & update log
            st.session_state.confessions.append(user_conf)
            st.session_state.chat_history[npc_key].append({"role": "user", "text": user_conf})
            st.session_state.chat_history[npc_key].append({"role": "npc", "text": response})
            
            # Configure Speech Synthesis
            st.session_state.speak_text = response
            st.session_state.speech_voice_type = npc_key
            st.session_state.trigger_speech = True
            st.rerun()

# --- RIGHT COLUMN: ACTIVE AUCTION ROOM ---
with col_right:
    # Display budget
    st.metric("Presupuesto Disponible", f"${st.session_state.budget:,}")
    
    # Inject chaotic animation style if we just purchased an item
    if st.session_state.show_bizarre_animation:
        st.markdown("""
        <style>
        div[data-testid="column"]:first-child button {
            animation: chaotic-move 3.5s cubic-bezier(0.25, 0.1, 0.25, 1) 1 !important;
            position: relative !important;
            z-index: 9999 !important;
            background-color: #8b0000 !important;
            border-color: #ff0000 !important;
            color: #ffffff !important;
            box-shadow: 0px 0px 25px rgba(255, 0, 0, 0.8) !important;
        }
        </style>
        """, unsafe_allow_html=True)
        st.session_state.show_bizarre_animation = False

    # Action notifications
    if st.session_state.last_action == 'bid_success' and st.session_state.last_item:
        last = st.session_state.last_item
        st.warning(
            f"[ADJUDICADO] Has ganado el lote '{html.escape(last['nombre_item'])}' por un precio final de ${last['precio_compra']:,}.\n\n"
            f"[LETRA PEQUEÑA] Consecuencia inevitable: {html.escape(last['letra_pequena'])}"
        )
    elif st.session_state.last_action == 'pass':
        st.error(f"[SUBASTADOR] El subastador escupe indignado: \"{html.escape(st.session_state.auctioneer_msg)}\"")

    nombre_item_esc = html.escape(item["nombre_item"])
    descripcion_esc = html.escape(item["descripcion"])
    puja_inicial_val = item["puja_inicial"]

    # Lot card rendering
    is_elite = item.get("es_elite", False)
    card_border_style = "border-color: #D4AF37; box-shadow: 0px 0px 25px rgba(212, 175, 55, 0.2);" if not is_elite else "border-color: #ff0000; box-shadow: 0px 0px 30px rgba(255, 0, 0, 0.4);"
    badge_text = " [LOTE DE ELITE] " if is_elite else ""

    st.markdown(f"""
    <div class="luxury-card" style="{card_border_style}">
        <div class="luxury-card-title">{badge_text}Lote en Subasta: {nombre_item_esc}</div>
        <div class="luxury-card-desc">"{descripcion_esc}"</div>
        <div class="luxury-card-bid">Valor Inicial de Salida: ${puja_inicial_val:,}</div>
    </div>
    """, unsafe_allow_html=True)

    # Reveal box if ghost bribed
    if st.session_state.ghost_leaked:
        st.markdown(f"""
        <div style="background-color: #0b1a0d; border: 1px solid #4CAF50; border-radius: 6px; padding: 15px; margin-bottom: 20px;">
            <span style="color: #4CAF50; font-family: 'Cinzel', serif; font-weight: bold; font-size: 0.95rem;">◈ El Fantasma Coimero revela la Letra Pequeña:</span><br/>
            <span style="color: #e2e2e2; font-style: italic; font-size: 0.95rem;">"{html.escape(item['letra_pequena'])}"</span>
        </div>
        """, unsafe_allow_html=True)

    # Procedural side comments
    col_adv, col_judg = st.columns(2)
    with col_adv:
        st.markdown(f"""
        <div style="background-color: #0d1210; border: 1px solid rgba(76, 175, 80, 0.2); border-radius: 6px; padding: 12px; height: 100%;">
            <span style="color: #4CAF50; font-family: 'Cinzel', serif; font-size: 0.85rem; font-weight: bold;">◇ Susurro del Fantasma:</span><br/>
            <span style="color: #c0b095; font-style: italic; font-size: 0.85rem;">"{html.escape(st.session_state.current_ghost_advice)}"</span>
        </div>
        """, unsafe_allow_html=True)
    with col_judg:
        st.markdown(f"""
        <div style="background-color: #120d0d; border: 1px solid rgba(139, 126, 102, 0.2); border-radius: 6px; padding: 12px; height: 100%;">
            <span style="color: #8b7e66; font-family: 'Cinzel', serif; font-size: 0.85rem; font-weight: bold;">◇ Chillido de la Rata:</span><br/>
            <span style="color: #c0b095; font-style: italic; font-size: 0.85rem;">"{html.escape(st.session_state.current_rat_judgment)}"</span>
        </div>
        """, unsafe_allow_html=True)

    st.markdown("<br/>", unsafe_allow_html=True)

    # Bidding Actions
    bid_amount = st.number_input(
        "Ingresa el monto de tu puja ($):",
        min_value=int(puja_inicial_val),
        max_value=100000,
        value=int(puja_inicial_val),
        step=50,
        key="active_bid_input"
    )

    col_bid, col_pass = st.columns(2)

    with col_bid:
        if st.button("¡Pujar!"):
            if bid_amount > st.session_state.budget:
                st.error("Error: Presupuesto insuficiente para sustentar esta oferta extravagante.")
            else:
                old_item = item.copy()
                st.session_state.budget -= bid_amount
                bought = old_item.copy()
                bought["precio_compra"] = bid_amount
                st.session_state.inventory.append(bought)
                
                st.session_state.last_action = 'bid_success'
                st.session_state.last_item = bought
                st.session_state.show_bizarre_animation = True
                st.session_state.turn_count += 1
                
                if st.session_state.budget < 100:
                    st.session_state.game_over = True
                    st.session_state.speak_text = f"Adjudicado por {bid_amount} pesos. Consecuencia inevitable: {old_item['letra_pequena']}. Bancarrota total. Te has quedado sin dinero. Fuera de mi sala de subastas."
                    st.session_state.speech_voice_type = "subastador"
                    st.session_state.trigger_speech = True
                else:
                    new_item = obtener_siguiente_lote_completo(api_key_input if api_key_input else None)
                    st.session_state.current_item = new_item
                    st.session_state.past_items.append(new_item["nombre_item"])
                    st.session_state.current_ghost_advice = generar_consejo_fantasma()
                    st.session_state.current_rat_judgment = generar_juicio_rata()
                    st.session_state.ghost_leaked = False
                    
                    st.session_state.speak_text = (
                        f"Adjudicado por {bid_amount} pesos. Consecuencia inevitable: {old_item['letra_pequena']}. "
                        f"Siguiente lote. {new_item['nombre_item']}. {new_item['descripcion']}. Puja inicial en {new_item['puja_inicial']} pesos."
                    )
                    st.session_state.speech_voice_type = "subastador"
                    st.session_state.trigger_speech = True
                st.rerun()

    with col_pass:
        if st.button("Paso"):
            with st.spinner("El subastador mastica su rencor..."):
                insult_text = get_auctioneer_insult(api_key_input if api_key_input else None)
            
            st.session_state.last_action = 'pass'
            st.session_state.last_item = None
            st.session_state.auctioneer_msg = insult_text
            st.session_state.turn_count += 1
            
            if st.session_state.budget < 100:
                st.session_state.game_over = True
                st.session_state.speak_text = f"{insult_text}. Bancarrota total. Te has quedado sin dinero. Fuera de mi sala de subastas."
                st.session_state.speech_voice_type = "subastador"
                st.session_state.trigger_speech = True
            else:
                new_item = obtener_siguiente_lote_completo(api_key_input if api_key_input else None)
                st.session_state.current_item = new_item
                st.session_state.past_items.append(new_item["nombre_item"])
                st.session_state.current_ghost_advice = generar_consejo_fantasma()
                st.session_state.current_rat_judgment = generar_juicio_rata()
                st.session_state.ghost_leaked = False
                
                st.session_state.speak_text = (
                    f"{insult_text}. "
                    f"Siguiente lote. {new_item['nombre_item']}. {new_item['descripcion']}. Puja inicial en {new_item['puja_inicial']} pesos."
                )
                st.session_state.speech_voice_type = "subastador"
                st.session_state.trigger_speech = True
            st.rerun()

    # --- INVENTORY CONTAINER ---
    if st.session_state.inventory:
        st.markdown('<div class="inventory-container">', unsafe_allow_html=True)
        st.markdown('<h3 class="luxury-header" style="font-size: 1.1rem; text-align: left; margin-bottom: 10px;">◈ Mi Inventario de Mierdas ◈</h3>', unsafe_allow_html=True)
        for i, item_inv in enumerate(reversed(st.session_state.inventory)):
            st.markdown(f"""
            <div class="inventory-item">
                <span class="inventory-item-name">{item_inv['nombre_item']}</span>
                <span style="color: #C5A059; margin-left: 10px;">(${item_inv.get('precio_compra', 0):,})</span>
                <div class="inventory-item-details">{html.escape(item_inv['descripcion'])}</div>
                <div style="color: #ffaa00; font-size: 0.85rem; margin-top: 3px; font-style: italic;">Letra pequeña: {html.escape(item_inv['letra_pequena'])}</div>
            </div>
            """, unsafe_allow_html=True)
        st.markdown('</div>', unsafe_allow_html=True)
