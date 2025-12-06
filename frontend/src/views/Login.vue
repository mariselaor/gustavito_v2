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

<style scoped>

/* Fondo degradado animado */
.login-bg {
  background: linear-gradient(-45deg, #667eea, #764ba2, #4facfe, #43e97b);
  background-size: 400% 400%;
  animation: gradient-shift 12s ease infinite;
  position: relative;
  overflow: hidden;
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Partículas flotantes */
.particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 1;
}

.particle {
  position: absolute;
  font-size: 1.8rem;
  opacity: 0;
  animation: float-particle 12s linear infinite;
  color: rgba(255, 255, 255, 0.7);
}

@keyframes float-particle {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% { opacity: 0.8; }
  90% { opacity: 0.8; }
  100% {
    transform: translateY(-100px) rotate(360deg);
    opacity: 0;
  }
}

/* Efecto cristal en la tarjeta */
.glass-effect {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(12px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  position: relative;
  z-index: 2;
}

/* Icono principal con pulso */
.icon-container {
  animation: float-icon 3s ease-in-out infinite;
}

.pulse-icon {
  animation: pulse 2s ease-in-out infinite;
  filter: drop-shadow(0 5px 15px rgba(102, 126, 234, 0.4));
}

@keyframes float-icon {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

/* Inputs personalizados */
.input-fancy {
  background: #f8faff;
  transition: all 0.3s ease;
  font-size: 1.1rem;
}

.input-fancy:focus {
  background: white;
  box-shadow: 0 0 0 0.25rem rgba(102, 126, 234, 0.15);
}

.input-group-text {
  background: #f8faff;
  border: 2px solid #e0e7ff;
}

.input-fancy {
  border: 2px solid #e0e7ff;
}

.input-fancy:focus {
  border-color: #667eea;
}

.input-group:focus-within .input-group-text {
  border-color: #667eea;
  background: white;
}

/* Botón login */
.btn-login {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  padding: 18px;
  font-size: 1.2rem;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
}

.btn-login::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.btn-login:hover::before {
  width: 400px;
  height: 400px;
}

.btn-login:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.5) !important;
}

.btn-login:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Botón registro */
.btn-register {
  transition: all 0.3s ease;
  border-width: 2px;
  font-weight: 600;
}

.btn-register:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
}

/* Divider elegante */
.divider-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(to right, transparent, #d1d5db, transparent);
}

.divider-text {
  color: #9ca3af;
  font-size: 1rem;
}

/* Animación de entrada */
.animate-slide-up {
  animation: slide-up 0.6s ease-out;
}

@keyframes slide-up {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 📱 Responsive */
@media (max-width: 768px) {
  .display-1 {
    font-size: 3.5rem;
  }
  
  h2 {
    font-size: 1.5rem;
  }
  
  .btn-login {
    font-size: 1.1rem;
    padding: 15px;
  }
  
  .btn-register {
    font-size: 1rem;
  }
}

</style>