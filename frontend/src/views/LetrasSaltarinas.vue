<template>
  <div
    ref="contenedor"
    class="juego-wrapper"
    @click="juegoIniciado && !gameOver && !victoria && clickLetra($event)"
  >
    <!-- BOTÓN REGRESAR -->
    <button class="btn-back" @click="volverAtras">←</button>

    <!-- CUENTA REGRESIVA -->
    <div v-if="cuentaRegresiva > 0" class="cuenta-regresiva">
      <div class="numero-grande">{{ cuentaRegresiva }}</div>
    </div>

    <!-- MENÚ INICIO -->
    <div v-if="!juegoIniciado && cuentaRegresiva === 0" class="menu-inicio">
      <h1>🔤 Letras Saltarinas</h1>
      <p class="instrucciones">¡Atrapa las letras correctas para formar la palabra!</p>
      <div class="tips">
        <div>✨ Toca las letras azules</div>
        <div>❤️ Evita perder las correctas</div>
        <div>⭐ Cada letra vale 10 puntos</div>
      </div>
      <button class="btn-jugar" @click="iniciarJuego">¡Jugar! 🚀</button>
    </div>

    <!-- HUD -->
    <div v-if="juegoIniciado && cuentaRegresiva === 0" class="hud">
      <div class="puntos-display">
        <span class="estrella">⭐</span>
        <span class="numero">{{ puntos }}</span>
      </div>
      <div class="palabras-progreso">
        <span class="progreso-texto">{{ palabrasCompletadas }}/{{ TOTAL_PALABRAS }}</span>
      </div>
      <div class="vidas-display">
        <span v-for="n in 3" :key="n" class="corazon">
          {{ n <= vidas ? '❤️' : '🖤' }}
        </span>
      </div>
    </div>

    <!-- PALABRA -->
    <div v-if="juegoIniciado && palabraActual && cuentaRegresiva === 0" class="palabra-zona">
      <div class="emoji">{{ palabraActual.imagen }}</div>
      <div class="slots">
        <div
          v-for="(l, i) in letrasEncontradas"
          :key="i"
          class="slot"
          :class="{ completa: l }"
        >
          {{ l || '_' }}
        </div>
      </div>
    </div>

    <canvas ref="canvas"></canvas>

    <!-- VICTORIA -->
    <div v-if="victoria" class="modal victoria-modal">
      <div class="modal-content">
        <div class="confetti">🎉🎊✨🎈🌟</div>
        <h2 class="modal-titulo">¡Completaste el Juego!</h2>
        <div class="palabras-info">
          ✅ Completaste {{ TOTAL_PALABRAS }} palabras
        </div>
        <div class="puntaje-final-grande">
          <div class="estrellas-container">
            <span v-for="n in calcularEstrellas()" :key="n" class="estrella-final">⭐</span>
          </div>
          <div class="puntos-finales-texto">{{ puntos }} puntos</div>
        </div>
        <div class="mensaje-estrellas">
          {{ mensajePorEstrellas() }}
        </div>
        <button class="btn-siguiente" @click="reiniciarJuego">
          Jugar de Nuevo 🎮
        </button>
      </div>
    </div>

    <!-- GAME OVER -->
    <div v-if="gameOver" class="modal gameover-modal">
      <div class="modal-content">
        <h2 class="modal-titulo">¡Juego Terminado!</h2>
        <div class="emoji-triste">😔</div>
        <p class="texto-gameover">La palabra era:</p>
        <div class="palabra-completa">
          <span class="emoji-grande">{{ palabraActual.imagen }}</span>
          <span class="palabra-texto">{{ palabraActual.palabra }}</span>
        </div>
        <div class="puntos-finales">
          <span class="estrella-grande">⭐</span>
          <span class="numero-puntos">{{ puntos }} puntos</span>
        </div>
        <button class="btn-reiniciar" @click="reiniciarJuego">
          Intentar de Nuevo 🔄
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const juegoIniciado = ref(false)
const palabraActual = ref(null)
const letrasEncontradas = ref([])
const letras = ref([])
const puntos = ref(0)
const vidas = ref(3)
const gameOver = ref(false)
const victoria = ref(false)
const canvas = ref(null)
const contenedor = ref(null)
const cuentaRegresiva = ref(0)
const palabrasCompletadas = ref(0)
const TOTAL_PALABRAS = 5
let ctx
let animation
let intervaloGenerador

const palabras = [
  { palabra: 'GATO', imagen: '🐱' },
  { palabra: 'CASA', imagen: '🏠' },
  { palabra: 'SOL', imagen: '☀️' },
  { palabra: 'FLOR', imagen: '🌸' },
  { palabra: 'LUNA', imagen: '🌙' },
  { palabra: 'PERRO', imagen: '🐶' },
  { palabra: 'ARBOL', imagen: '🌳' },
  { palabra: 'PATO', imagen: '🦆' },
  { palabra: 'RANA', imagen: '🐸' },
  { palabra: 'SAPO', imagen: '🐸' },
  { palabra: 'LOBO', imagen: '🐺' },
  { palabra: 'OSO', imagen: '🐻' },
  { palabra: 'ZORRO', imagen: '🦊' },
  { palabra: 'LEON', imagen: '🦁' },
  { palabra: 'TIGRE', imagen: '🐯' },
  { palabra: 'MONO', imagen: '🐵' },
  { palabra: 'PEZ', imagen: '🐟' },
  { palabra: 'POLLO', imagen: '🐔' },
  { palabra: 'VACA', imagen: '🐄' },
  { palabra: 'OVEJA', imagen: '🐑' },
  { palabra: 'CERDO', imagen: '🐷' },
  { palabra: 'CABRA', imagen: '🐐' },
  { palabra: 'CIELO', imagen: '🌌' },
  { palabra: 'NUBE', imagen: '☁️' },
  { palabra: 'MAR', imagen: '🌊' },
  { palabra: 'RIO', imagen: '💧' },
  { palabra: 'BOTE', imagen: '⛵' },
  { palabra: 'CARRO', imagen: '🚗' },
  { palabra: 'AVION', imagen: '✈️' },
  { palabra: 'TREN', imagen: '🚂' },
  { palabra: 'BICI', imagen: '🚲' },
  { palabra: 'BOLA', imagen: '⚽' },
  { palabra: 'LIBRO', imagen: '📖' },
  { palabra: 'LAPIZ', imagen: '✏️' },
  { palabra: 'RELOJ', imagen: '⏰' },
  { palabra: 'GLOBO', imagen: '🎈' },
  { palabra: 'ROBOT', imagen: '🤖' },
  { palabra: 'DADO', imagen: '🎲' },
  { palabra: 'BESO', imagen: '💋' },
  { palabra: 'MANO', imagen: '✋' },
  { palabra: 'PIE', imagen: '👣' },
  { palabra: 'OJO', imagen: '👁️' },
  { palabra: 'NARIZ', imagen: '👃' },
  { palabra: 'PELO', imagen: '💇' },
  { palabra: 'PAN', imagen: '🍞' },
  { palabra: 'LECHE', imagen: '🥛' },
  { palabra: 'QUESO', imagen: '🧀' },
  { palabra: 'HUEVO', imagen: '🥚' },
  { palabra: 'MIEL', imagen: '🍯' },
  { palabra: 'PIZZA', imagen: '🍕' },
  { palabra: 'TACO', imagen: '🌮' },
  { palabra: 'JUGO', imagen: '🧃' },
  { palabra: 'CAFE', imagen: '☕' },
  { palabra: 'PASTEL', imagen: '🎂' },
  { palabra: 'HELADO', imagen: '🍦' },
  { palabra: 'DULCE', imagen: '🍬' },
  { palabra: 'FRESA', imagen: '🍓' },
  { palabra: 'UVAS', imagen: '🍇' },
  { palabra: 'MANGO', imagen: '🥭' },
  { palabra: 'PERA', imagen: '🍐' },
  { palabra: 'LIMON', imagen: '🍋' }
]

const palabrasUsadas = ref([])

function obtenerPalabraAleatoria() {
  // Filtrar palabras que no se han usado en esta partida
  const disponibles = palabras.filter(p => !palabrasUsadas.value.includes(p.palabra))
  
  // Si ya se usaron todas, resetear (por si acaso)
  if (disponibles.length === 0) {
    palabrasUsadas.value = []
    return palabras[Math.floor(Math.random() * palabras.length)]
  }
  
  // Seleccionar una palabra aleatoria de las disponibles
  const palabraSeleccionada = disponibles[Math.floor(Math.random() * disponibles.length)]
  palabrasUsadas.value.push(palabraSeleccionada.palabra)
  return palabraSeleccionada
}

const todasLasLetras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

const ajustarCanvas = () => {
  if (!canvas.value || !contenedor.value) return
  canvas.value.width = contenedor.value.clientWidth
  canvas.value.height = contenedor.value.clientHeight
}

onMounted(() => {
  if (canvas.value) {
    ctx = canvas.value.getContext('2d')
    ajustarCanvas()
    window.addEventListener('resize', ajustarCanvas)
  }
})

onUnmounted(() => {
  if (animation) cancelAnimationFrame(animation)
  if (intervaloGenerador) clearInterval(intervaloGenerador)
  window.removeEventListener('resize', ajustarCanvas)
})

watch([gameOver, victoria], ([over, win]) => {
  if (over || win) {
    if (intervaloGenerador) clearInterval(intervaloGenerador)
    if (animation) cancelAnimationFrame(animation)
  }
})

function iniciarJuego() {
  cuentaRegresiva.value = 3
  const intervaloCuenta = setInterval(() => {
    cuentaRegresiva.value--
    if (cuentaRegresiva.value === 0) {
      clearInterval(intervaloCuenta)
      empezarJuego()
    }
  }, 1000)
}

function empezarJuego() {
  const p = obtenerPalabraAleatoria()
  palabraActual.value = p
  letrasEncontradas.value = Array(p.palabra.length).fill('')
  juegoIniciado.value = true
  loop()
  generar()
}

function generar() {
  if (intervaloGenerador) clearInterval(intervaloGenerador)
  
  intervaloGenerador = setInterval(() => {
    if (!juegoIniciado.value || gameOver.value || victoria.value) {
      clearInterval(intervaloGenerador)
      return
    }

    if (letras.value.length >= 5) return

    const canvasW = canvas.value.width
    const esCorrecta = Math.random() > 0.3
    
    let nuevaLetra
    if (esCorrecta && palabraActual.value) {
      const letrasRestantes = palabraActual.value.palabra.split('').filter(
        (letra, idx) => letrasEncontradas.value[idx] !== letra
      )
      if (letrasRestantes.length > 0) {
        nuevaLetra = letrasRestantes[Math.floor(Math.random() * letrasRestantes.length)]
      } else {
        nuevaLetra = palabraActual.value.palabra[
          Math.floor(Math.random() * palabraActual.value.palabra.length)
        ]
      }
    } else {
      nuevaLetra = todasLasLetras[Math.floor(Math.random() * todasLasLetras.length)]
    }

    letras.value.push({
      id: Date.now() + Math.random(),
      letra: nuevaLetra,
      x: Math.random() * (canvasW - 80) + 40,
      y: -50,
      v: 1.5 + Math.random() * 2
    })
  }, 1500)
}

function loop() {
  if (!ctx || !canvas.value) return
  
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)

  letras.value = letras.value.filter(l => {
    l.y += l.v
    
    if (l.y > canvas.value.height + 50) {
      if (palabraActual.value && palabraActual.value.palabra.includes(l.letra)) {
        const indicesPendientes = palabraActual.value.palabra.split('')
          .map((letra, i) => letra === l.letra && letrasEncontradas.value[i] === '' ? i : -1)
          .filter(i => i !== -1)
        
        if (indicesPendientes.length > 0) {
          perderVida()
        }
      }
      return false
    }

    const esCorrecta = palabraActual.value && palabraActual.value.palabra.includes(l.letra)
    
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
    ctx.shadowBlur = 10
    ctx.shadowOffsetX = 3
    ctx.shadowOffsetY = 3
    
    ctx.fillStyle = esCorrecta ? '#4facfe' : '#f5576c'
    ctx.strokeStyle = 'white'
    ctx.lineWidth = 4
    ctx.font = 'bold 45px Comic Sans MS'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    
    ctx.strokeText(l.letra, l.x, l.y)
    ctx.fillText(l.letra, l.x, l.y)
    
    ctx.shadowBlur = 0
    
    return true
  })

  if (juegoIniciado.value && !gameOver.value && !victoria.value) {
    animation = requestAnimationFrame(loop)
  }
}

function clickLetra(e) {
  const r = canvas.value.getBoundingClientRect()
  const x = e.clientX - r.left
  const y = e.clientY - r.top

  for (let i = letras.value.length - 1; i >= 0; i--) {
    const l = letras.value[i]
    const distancia = Math.sqrt(
      Math.pow(x - l.x, 2) + Math.pow(y - l.y, 2)
    )

    if (distancia < 35) {
      validarLetra(i)
      return
    }
  }
}

function validarLetra(index) {
  const letra = letras.value[index].letra
  letras.value.splice(index, 1)

  if (!palabraActual.value) return

  const pos = palabraActual.value.palabra
    .split('')
    .findIndex((l, i) => l === letra && letrasEncontradas.value[i] === '')

  if (pos !== -1) {
    letrasEncontradas.value[pos] = letra
    puntos.value += 10
    
    // Verificar si completó la palabra
    if (letrasEncontradas.value.every(l => l !== '')) {
      palabrasCompletadas.value++
      
      // Verificar si completó las 5 palabras
      if (palabrasCompletadas.value >= TOTAL_PALABRAS) {
        victoria.value = true
      } else {
        // Continuar con siguiente palabra
        setTimeout(() => {
          siguientePalabra()
        }, 800)
      }
    }
  } else {
    perderVida()
  }
}

function perderVida() {
  vidas.value--
  if (vidas.value <= 0) {
    gameOver.value = true
  }
}

function siguientePalabra() {
  letras.value = []
  const p = obtenerPalabraAleatoria()
  palabraActual.value = p
  letrasEncontradas.value = Array(p.palabra.length).fill('')
  loop()
  generar()
}

function reiniciarJuego() {
  letras.value = []
  puntos.value = 0
  vidas.value = 3
  gameOver.value = false
  victoria.value = false
  juegoIniciado.value = false
  cuentaRegresiva.value = 0
  palabrasUsadas.value = []
  palabrasCompletadas.value = 0
}

function volverAtras() {
  router.back()
}

function calcularEstrellas() {
  // Basado en palabras completadas y puntos
  const porcentaje = (puntos.value / (TOTAL_PALABRAS * 50)) * 100 // 50 es promedio de puntos por palabra
  if (porcentaje >= 80) return 3
  if (porcentaje >= 50) return 2
  return 1
}

function mensajePorEstrellas() {
  const estrellas = calcularEstrellas()
  if (estrellas === 3) return '¡Perfecto! Eres un campeón 🏆'
  if (estrellas === 2) return '¡Muy bien! Sigue practicando 💪'
  return '¡Buen intento! Inténtalo de nuevo 😊'
}
</script>

<style src="@/assets/styles/letras_saltarinas.css"></style>