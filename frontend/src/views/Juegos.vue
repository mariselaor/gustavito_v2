<template>
  <div class="games-container">
    <button class="btn-back" @click="$router.push('/home')">←</button>
    
    <h1 class="title">🎮 Gustavito: Aprender Jugando</h1>

    <div class="grid">
      <button
        v-for="nivel in niveles"
        :key="nivel.id"
        class="cards"
        :class="{ locked: !nivel.desbloqueado }"
        :disabled="!nivel.desbloqueado"
        @click="goToLevel(nivel.id)"
      >
        <span class="nivel-numero">{{ nivel.titulo }}</span>
        <span class="nivel-juego">{{ nivel.juego }}</span>
        <span v-if="!nivel.desbloqueado" class="candado">🔒</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const niveles = [
  { 
    id: 1, 
    titulo: 'Nivel 1', 
    juego: '🔤 Letras',
    desbloqueado: true 
  },
  { 
    id: 2, 
    titulo: 'Nivel 2', 
    juego: '📝 Palabras',
    desbloqueado: true 
  },
  { 
    id: 3, 
    titulo: 'Nivel 3', 
    juego: '📖 Lectura',
    desbloqueado: false 
  },
  { 
    id: 4, 
    titulo: 'Nivel 4', 
    juego: '🎯 Retos',
    desbloqueado: false 
  }
]

function goToLevel(id) {
  router.push(`/juegos/nivel/${id}`)
}
</script>

<style src="../assets/styles/juegos.css"></style>