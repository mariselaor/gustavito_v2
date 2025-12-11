<template>
  <div class="login-bg min-vh-100 d-flex align-items-center justify-content-center position-relative">

    <!-- Partículas decorativas -->
    <div class="particles">
      <i class="particle bi bi-star-fill" v-for="n in 8" :key="'star'+n" :style="particleStyle(n)"></i>
      <i class="particle bi bi-heart-fill" v-for="n in 8" :key="'heart'+n" :style="particleStyle(n+8)"></i>
    </div>

    <div class="container">
      <div class="row justify-content-center">
        <div class="col-11 col-md-8 col-lg-6 col-xl-5">

          <div class="card shadow-lg border-0 rounded-4 p-5 glass-effect animate-slide-up">

            <!-- Título -->
            <div class="text-center mb-4">
              <div class="icon-container mb-3">
                <i class="bi bi-person-circle display-1 text-primary pulse-icon"></i>
              </div>
              <h2 class="fw-bold text-primary">¡Bienvenido de Nuevo!</h2>
              <p class="text-muted">Inicia sesión para continuar</p>
            </div>

            <!-- Formulario -->
            <form @submit.prevent="login">

              <!-- Email -->
              <div class="mb-4">
                <label class="form-label fw-semibold text-primary fs-5">
                 Correo Electrónico
                </label>
                <div class="input-group input-group-lg">
                  <span class="input-group-text rounded-start-pill bg-light border-end-0 px-4">
                    <i class="bi bi-at text-primary fs-5"></i>
                  </span>
                  <input 
                    v-model="email"
                    type="email"
                    class="form-control rounded-end-pill border-start-0 input-fancy py-3"
                    placeholder="tu@email.com"
                    required
                  >
                </div>
              </div>

              <!-- Contraseña -->
              <div class="mb-4">
                <label class="form-label fw-semibold text-primary fs-5">
                  Contraseña
                </label>
                <div class="input-group input-group-lg">
                  <span class="input-group-text rounded-start-pill bg-light border-end-0 px-4">
                    <i class="bi bi-key-fill text-primary fs-5"></i>
                  </span>
                  <input 
                    v-model="password"
                    type="password"
                    class="form-control rounded-end-pill border-start-0 input-fancy py-3"
                    placeholder="Tu contraseña"
                    required
                  >
                </div>
              </div>

              <!-- Botón Login -->
              <button
                type="submit"
                class="btn btn-primary btn-lg w-100 rounded-pill fw-bold btn-login shadow-lg mb-4"
                :disabled="isLoading"
              >
                <span v-if="!isLoading">
                  <i class="bi bi-box-arrow-in-right me-2"></i> Iniciar Sesión
                </span>
                <span v-else>
                  <span class="spinner-border spinner-border-sm me-2"></span>
                  <i class="bi bi-hourglass-split me-2"></i> Entrando...
                </span>
              </button>

            </form>

            <!-- Divider -->
            <div class="divider-container my-4">
              <div class="divider-line"></div>
              <span class="divider-text px-3">
                <i class="bi bi-three-dots"></i>
              </span>
              <div class="divider-line"></div>
            </div>

            <!-- Ir al registro -->
            <div class="text-center">
              <p class="mb-3 text-muted fs-6">
                <i class="bi bi-question-circle me-1"></i> ¿No tienes cuenta?
              </p>
              <button class="btn btn-outline-primary rounded-pill px-5 py-3 btn-register fs-5" @click="goToRegister">
                <i class="bi bi-person-plus-fill me-2"></i> Crear una cuenta
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '../router/firebase/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const router = useRouter()

const login = async () => {
  try {
    if (!email.value || !password.value) {
      alert("⚠️ Por favor completa todos los campos")
      return
    }

    isLoading.value = true

    await signInWithEmailAndPassword(auth, email.value, password.value)

    router.push('/home')

  } catch (error) {
    console.error(error)
    alert("❌ Error al iniciar sesión: " + error.message)
  } finally {
    isLoading.value = false
  }
}

const goToRegister = () => {
  router.push('/register')
}

const particleStyle = (n) => {
  return {
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 5}s`,
    animationDuration: `${6 + Math.random() * 8}s`
  }
}
</script>

<style src="../assets/styles/login.css"></style>