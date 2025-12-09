<template>
  <div class="register-bg min-vh-100 d-flex align-items-center justify-content-center position-relative">
    
    <!-- Partículas decorativas -->
    <div class="particles">
      <i class="particle bi bi-book-fill" v-for="n in 10" :key="'book'+n" :style="particleStyle(n)"></i>
      <i class="particle bi bi-stars" v-for="n in 10" :key="'star'+n" :style="particleStyle(n+10)"></i>
    </div>

    <div class="container">
      <div class="row justify-content-center">
        <div class="col-11 col-md-6 col-lg-5">
          
          <div class="card shadow-lg border-0 rounded-4 p-4 glass-effect animate-slide-up">
            
            <!-- Icono y título -->
            <div class="text-center mb-4">
              <div class="icon-container mb-3">
                <i class="bi bi-mortarboard-fill display-1 text-primary"></i>
              </div>
              <h2 class="fw-bold text-primary mb-2">¡Únete a la Aventura!</h2>
              <p class="text-muted">Crea tu cuenta de estudiante</p>
            </div>

            <!-- Formulario -->
            <form @submit.prevent="registerStudent">
              
              <!-- Nombre -->
              <div class="mb-3">
                <label class="form-label fw-semibold text-primary">
                 Nombre Completo
                </label>
                <div class="input-group input-group-lg">
                  <span class="input-group-text rounded-start-pill bg-light border-end-0">
                    <i class="bi bi-person-circle text-primary"></i>
                  </span>
                  <input 
                    v-model="username" 
                    type="text" 
                    class="form-control rounded-end-pill border-start-0 input-fancy" 
                    placeholder="Tu nombre completo"
                    required
                  />
                </div>
              </div>

              <!-- Correo -->
              <div class="mb-3">
                <label class="form-label fw-semibold text-primary">
                 Correo Electrónico
                </label>
                <div class="input-group input-group-lg">
                  <span class="input-group-text rounded-start-pill bg-light border-end-0">
                    <i class="bi bi-envelope-at text-primary"></i>
                  </span>
                  <input 
                    v-model="email" 
                    type="email" 
                    class="form-control rounded-end-pill border-start-0 input-fancy" 
                    placeholder="tu@email.com"
                    required
                  />
                </div>
              </div>

              <!-- Contraseña -->
              <div class="mb-3">
                <label class="form-label fw-semibold text-primary">
                  Contraseña
                </label>
                <div class="input-group input-group-lg">
                  <span class="input-group-text rounded-start-pill bg-light border-end-0">
                    <i class="bi bi-shield-lock text-primary"></i>
                  </span>
                  <input 
                    v-model="password" 
                    type="password" 
                    class="form-control rounded-end-pill border-start-0 input-fancy" 
                    placeholder="Mínimo 6 caracteres"
                    required
                  />
                </div>
              </div>

              <!-- Foto -->
              <div class="mb-4">
                <label class="form-label fw-semibold text-primary">
                  <i class="bi bi-camera-fill me-2"></i> Foto de Perfil
                </label>
                <div class="file-upload-wrapper">
                  <input 
                    type="file" 
                    @change="handleFile" 
                    class="d-none" 
                    id="fileInput"
                    accept="image/*"
                  />
                  <label for="fileInput" class="btn btn-primary w-100 rounded-pill py-3 file-label shadow-sm">
                    <span v-if="!file">
                      <i class="bi bi-image me-2"></i> Seleccionar foto
                    </span>
                    <span v-else class="fw-bold">
                      <i class="bi bi-check-circle-fill me-2"></i> {{ file.name }}
                    </span>
                  </label>
                </div>
              </div>

              <!-- Botón registrar -->
              <button 
                type="submit" 
                class="btn btn-primary btn-lg w-100 rounded-pill fw-bold btn-register shadow-lg"
                :disabled="isLoading"
              >
                <span v-if="!isLoading">
                  <i class="bi bi-rocket-takeoff-fill me-2"></i> Crear mi cuenta
                </span>
                <span v-else>
                  <span class="spinner-border spinner-border-sm me-2"></span> 
                  <i class="bi bi-hourglass-split me-2"></i> Registrando...
                </span>
              </button>

            </form>

            <!-- Mensaje alternativo -->
            <div class="text-center mt-4">
              <p class="text-muted small">
                <i class="bi bi-info-circle me-1"></i> 
                ¿Ya tienes cuenta? 
                <a href="#" @click.prevent="goToLogin" class="text-primary fw-bold text-decoration-none">
                  Inicia sesión aquí
                </a>
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { auth, db } from "../router/firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { uploadFile } from "../services/cloudinary";

const username = ref('');
const email = ref('');
const password = ref('');
const file = ref(null);
const isLoading = ref(false);
const router = useRouter();

const handleFile = (event) => {
  file.value = event.target.files[0];
}

const goToLogin = () => {
  router.push('/login');
}

const registerStudent = async () => {
  try {
    if (!username.value || !email.value || !password.value || !file.value) {
      alert("⚠️ Por favor completa todos los campos");
      return;
    }

    isLoading.value = true;

    // Crear usuario en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    const uid = userCredential.user.uid;

    // Subir foto a Cloudinary
    const avatarUrl = await uploadFile(file.value);

    // Guardar datos en Firestore
    await setDoc(doc(db, "usuarios", uid), {
      username: username.value,
      email: email.value,
      avatarUrl,
      progreso: 0,
      createdAt: new Date()
    });

    // Redirigir al Home después de guardar todo
    router.push("/home");

  } catch (error) {
    console.error(error);
    alert("❌ Error al registrar: " + error.message);
  } finally {
    isLoading.value = false;
  }
}

const particleStyle = (n) => {
  return {
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 5}s`,
    animationDuration: `${8 + Math.random() * 8}s`
  }
}
</script>

<style scoped>

/*Fondo degradado animado */
.register-bg {
  background: linear-gradient(-45deg, #667eea, #764ba2, #f093fb, #4facfe);
  background-size: 400% 400%;
  animation: gradient-shift 15s ease infinite;
  position: relative;
  overflow: hidden;
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/*Partículas flotantes */
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
  font-size: 2rem;
  opacity: 0;
  animation: float-particle 10s linear infinite;
  color: rgba(255, 255, 255, 0.6);
}

@keyframes float-particle {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% { opacity: 0.7; }
  90% { opacity: 0.7; }
  100% {
    transform: translateY(-100px) rotate(360deg);
    opacity: 0;
  }
}

/*Efecto cristal en la tarjeta */
.glass-effect {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  position: relative;
  z-index: 2;
}

/* Icono principal */
.icon-container {
  animation: bounce-icon 2s ease-in-out infinite;
}

@keyframes bounce-icon {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* Botón volver */
.back-btn {
  transition: all 0.3s ease;
  border-width: 2px;
  font-weight: 600;
}

.back-btn:hover {
  transform: translateX(-5px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

/* Inputs personalizados */
.input-fancy {
  background: #f8faff;
  transition: all 0.3s ease;
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

/* Label de archivo personalizado */
.file-label {
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
}

.file-label:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4) !important;
}

/* Botón de registro */
.btn-register {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  padding: 15px;
  font-size: 1.1rem;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
}

.btn-register::before {
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

.btn-register:hover::before {
  width: 400px;
  height: 400px;
}

.btn-register:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.5) !important;
}

.btn-register:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Animación de entrada */
.animate-slide-up {
  animation: slide-up 0.6s ease-out;
}

@keyframes slide-up {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .display-1 {
    font-size: 3.5rem;
  }
  
  h2 {
    font-size: 1.5rem;
  }
}

</style>