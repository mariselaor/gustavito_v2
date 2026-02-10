<template>
  <div class="juego-wrapper">
    <button class="btn-back" @click="$router.back()">←</button>

    <!-- CUENTA REGRESIVA -->
    <div v-if="cuentaRegresiva > 0" class="cuenta-regresiva">
      <div class="numero-grande">{{ cuentaRegresiva }}</div>
    </div>

    <!-- MENÚ INICIO -->
    <div v-if="!juegoIniciado && cuentaRegresiva === 0" class="menu-inicio">
      <h1>📝 Forma la Palabra</h1>
      <p class="instrucciones">¡Ordena las letras para formar la palabra correcta!</p>
      <div class="tips">
        <div>🖼️ Mira la imagen y la pista</div>
        <div>🔤 Toca las letras en orden</div>
        <div>⭐ Cada palabra vale 20 puntos</div>
      </div>
      <button class="btn-jugar" @click="iniciarJuego">¡Jugar! 🚀</button>
    </div>

    <!-- HUD -->
    <div v-if="juegoIniciado && cuentaRegresiva === 0" class="hud">
      <div class="hud-item">
        <span class="estrella">⭐</span>
        <span class="numero">{{ puntos }}</span>
      </div>
      <div class="hud-item">
        <span class="progreso">{{ palabrasCompletadas }}/{{ TOTAL_PALABRAS }}</span>
      </div>
      <div class="hud-item">
        <span v-for="n in 3" :key="n">{{ n <= vidas ? '❤️' : '🖤' }}</span>
      </div>
    </div>

    <!-- ÁREA DEL JUEGO -->
    <div v-if="juegoIniciado && palabraActual && cuentaRegresiva === 0" class="area-juego">
      <div class="imagen-palabra">{{ palabraActual.imagen }}</div>
      <div class="pista">💡 {{ palabraActual.pista }}</div>

      <!-- Respuesta del usuario -->
      <div class="respuesta-container">
        <div class="respuesta-area">
          <div
            v-for="letra in respuestaUsuario"
            :key="letra.id"
            class="letra-respuesta"
            @click="quitarLetra(letra)"
          >
            {{ letra.letra }}
          </div>
          <div
            v-for="n in (palabraActual.palabra.length - respuestaUsuario.length)"
            :key="'vacio-' + n"
            class="espacio-vacio"
          >
            _
          </div>
        </div>
      </div>

      <!-- Mensaje -->
      <div v-if="mensaje" class="mensaje" :class="{ correcto: mensaje.includes('Correcto') }">
        {{ mensaje }}
      </div>

      <!-- Letras disponibles -->
      <div class="letras-container">
        <div
          v-for="letra in letrasDesordenadas"
          :key="letra.id"
          class="letra-disponible"
          @click="agregarLetra(letra)"
        >
          {{ letra.letra }}
        </div>
      </div>

      <!-- Botón verificar -->
      <button
        v-if="respuestaUsuario.length === palabraActual.palabra.length && !mensaje"
        class="btn-verificar"
        @click="verificarPalabra"
      >
        Verificar ✓
      </button>
    </div>

    <!-- VICTORIA -->
    <div v-if="victoria" class="modal">
      <div class="modal-content">
        <div class="confetti">🎉🎊✨🎈🌟</div>
        <h2 class="modal-titulo">¡Completaste el Juego!</h2>
        <div class="palabras-info">✅ Completaste {{ TOTAL_PALABRAS }} palabras</div>
        <div class="puntaje-final">
          <div class="estrellas-container">
            <span v-for="n in calcularEstrellas()" :key="n" class="estrella-final">⭐</span>
          </div>
          <div class="puntos-finales">{{ puntos }} puntos</div>
        </div>
        <div class="mensaje-estrellas">{{ mensajePorEstrellas() }}</div>
        <button class="btn-modal" @click="reiniciarJuego">Jugar de Nuevo 🎮</button>
      </div>
    </div>

    <!-- GAME OVER -->
    <div v-if="gameOver" class="modal">
      <div class="modal-content">
        <h2 class="modal-titulo">¡Juego Terminado!</h2>
        <div class="emoji-triste">😔</div>
        <p class="texto-gameover">La palabra era:</p>
        <div class="palabra-revelada">
          <span class="emoji-grande">{{ palabraActual.imagen }}</span>
          <span class="palabra-texto">{{ palabraActual.palabra }}</span>
        </div>
        <div class="puntaje-final">
          <span class="estrella-grande">⭐</span>
          <span class="puntos-finales">{{ puntos }} puntos</span>
        </div>
        <button class="btn-modal" @click="reiniciarJuego">Intentar de Nuevo 🔄</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const juegoIniciado = ref(false)
const cuentaRegresiva = ref(0)
const palabraActual = ref(null)
const letrasDesordenadas = ref([])
const respuestaUsuario = ref([])
const puntos = ref(0)
const vidas = ref(3)
const palabrasCompletadas = ref(0)
const victoria = ref(false)
const gameOver = ref(false)
const mensaje = ref('')
const palabrasUsadas = ref([])

const TOTAL_PALABRAS = 5

const palabras = [
  { palabra: 'GATO', imagen: '🐱', pista: 'Animal que dice miau' },
  { palabra: 'PERRO', imagen: '🐶', pista: 'Animal que dice guau' },
  { palabra: 'CASA', imagen: '🏠', pista: 'Donde vivimos' },
  { palabra: 'SOL', imagen: '☀️', pista: 'Brilla en el día' },
  { palabra: 'LUNA', imagen: '🌙', pista: 'Brilla en la noche' },
  { palabra: 'FLOR', imagen: '🌸', pista: 'Planta con colores' },
  { palabra: 'ARBOL', imagen: '🌳', pista: 'Planta grande y alta' },
  { palabra: 'PATO', imagen: '🦆', pista: 'Ave que nada' },
  { palabra: 'SAPO', imagen: '🐸', pista: 'Salta y hace croac' },
  { palabra: 'OSO', imagen: '🐻', pista: 'Animal grande y peludo' },
  { palabra: 'LEON', imagen: '🦁', pista: 'Rey de la selva' },
  { palabra: 'MONO', imagen: '🐵', pista: 'Animal que come bananas' },
  { palabra: 'PEZ', imagen: '🐟', pista: 'Animal que vive en el agua' },
  { palabra: 'VACA', imagen: '🐄', pista: 'Animal que da leche' },
  { palabra: 'POLLO', imagen: '🐔', pista: 'Ave que pone huevos' },
  { palabra: 'BALON', imagen: '⚽', pista: 'Juguete redondo' },
  { palabra: 'LIBRO', imagen: '📖', pista: 'Tiene muchas páginas' },
  { palabra: 'NUBE', imagen: '☁️', pista: 'Blanca en el cielo' },
  { palabra: 'MAR', imagen: '🌊', pista: 'Agua salada grande' },
  { palabra: 'PAN', imagen: '🍞', pista: 'Alimento que comemos' }
]

function obtenerPalabraAleatoria() {
  const disponibles = palabras.filter(p => !palabrasUsadas.value.includes(p.palabra))
  if (disponibles.length === 0) {
    palabrasUsadas.value = []
    return palabras[Math.floor(Math.random() * palabras.length)]
  }
  const seleccionada = disponibles[Math.floor(Math.random() * disponibles.length)]
  palabrasUsadas.value.push(seleccionada.palabra)
  return seleccionada
}

function desordenarLetras(palabra) {
  const letras = palabra.split('').map((letra, index) => ({
    letra,
    id: index
  }))
  
  for (let i = letras.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letras[i], letras[j]] = [letras[j], letras[i]]
  }
  
  return letras
}

function iniciarJuego() {
  cuentaRegresiva.value = 3
  const intervalo = setInterval(() => {
    cuentaRegresiva.value--
    if (cuentaRegresiva.value === 0) {
      clearInterval(intervalo)
      empezarJuego()
    }
  }, 1000)
}

function empezarJuego() {
  const palabra = obtenerPalabraAleatoria()
  palabraActual.value = palabra
  letrasDesordenadas.value = desordenarLetras(palabra.palabra)
  respuestaUsuario.value = []
  juegoIniciado.value = true
  mensaje.value = ''
}

function agregarLetra(letraObj) {
  if (respuestaUsuario.value.length < palabraActual.value.palabra.length) {
    respuestaUsuario.value.push(letraObj)
    letrasDesordenadas.value = letrasDesordenadas.value.filter(l => l.id !== letraObj.id)
  }
}

function quitarLetra(letraObj) {
  respuestaUsuario.value = respuestaUsuario.value.filter(l => l.id !== letraObj.id)
  letrasDesordenadas.value.push(letraObj)
}

function verificarPalabra() {
  const palabraFormada = respuestaUsuario.value.map(l => l.letra).join('')
  
  if (palabraFormada === palabraActual.value.palabra) {
    mensaje.value = '¡Correcto! 🎉'
    puntos.value += 20
    palabrasCompletadas.value++
    
    setTimeout(() => {
      if (palabrasCompletadas.value >= TOTAL_PALABRAS) {
        victoria.value = true
      } else {
        siguientePalabra()
      }
    }, 1500)
  } else {
    mensaje.value = '¡Inténtalo de nuevo! ❌'
    vidas.value--
    
    if (vidas.value <= 0) {
      gameOver.value = true
    } else {
      setTimeout(() => {
        respuestaUsuario.value = []
        letrasDesordenadas.value = desordenarLetras(palabraActual.value.palabra)
        mensaje.value = ''
      }, 1500)
    }
  }
}

function siguientePalabra() {
  const palabra = obtenerPalabraAleatoria()
  palabraActual.value = palabra
  letrasDesordenadas.value = desordenarLetras(palabra.palabra)
  respuestaUsuario.value = []
  mensaje.value = ''
}

function reiniciarJuego() {
  puntos.value = 0
  vidas.value = 3
  palabrasCompletadas.value = 0
  victoria.value = false
  gameOver.value = false
  juegoIniciado.value = false
  cuentaRegresiva.value = 0
  palabrasUsadas.value = []
}

function calcularEstrellas() {
  const porcentaje = (puntos.value / (TOTAL_PALABRAS * 20)) * 100
  if (porcentaje >= 80) return 3
  if (porcentaje >= 50) return 2
  return 1
}

function mensajePorEstrellas() {
  const estrellas = calcularEstrellas()
  if (estrellas === 3) return '¡Perfecto! 🏆'
  if (estrellas === 2) return '¡Muy bien! Sigue practicando 💪'
  return '¡Buen intento! Inténtalo de nuevo 😊'
}
</script>

<style src="@/assets/styles/formapalabras.css"></style>