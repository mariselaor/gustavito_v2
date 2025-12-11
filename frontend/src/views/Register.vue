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

<style src="../assets/styles/register.css"></style>