<template>
  <div class="min-h-screen flex justify-center items-center bg-gray-100 px-4">
    <div class="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">

      <h2 class="text-2xl font-bold text-center mb-6">Iniciar Sesión</h2>

      <form @submit.prevent="login" class="space-y-5">

        <!-- EMAIL -->
        <div>
          <label class="block mb-1 font-medium">Correo electrónico</label>
          <input
            v-model="email"
            type="email"
            required
            placeholder="correo@example.com"
            class="w-full border px-3 py-2 rounded-md focus:ring focus:ring-blue-500"
          />
        </div>

        <!-- PASSWORD -->
        <div>
          <label class="block mb-1 font-medium">Contraseña</label>
          <input
            v-model="password"
            type="password"
            required
            placeholder="••••••••"
            class="w-full border px-3 py-2 rounded-md focus:ring focus:ring-blue-500"
          />
        </div>

        <!-- ERROR -->
        <p v-if="error" class="text-red-600 text-center">{{ error }}</p>

        <!-- BOTÓN -->
        <button 
          type="submit"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
        >
          Iniciar Sesión
        </button>
      </form>

      <!-- LINK A REGISTRO -->
      <p class="mt-4 text-center">
        ¿No tienes cuenta?
        <router-link to="/register" class="text-blue-600 hover:underline">
          Crear cuenta
        </router-link>
      </p>

    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { auth } from "../router/firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default {
  setup() {
    const email = ref("");
    const password = ref("");
    const error = ref("");

    const router = useRouter();

    const login = async () => {
      error.value = "";

      try {
        await signInWithEmailAndPassword(auth, email.value, password.value);
        alert("Inicio de sesión exitoso 🎉");

        router.push("/home"); // ⬅️ Redirección a la página principal
      } catch (err) {
        error.value = "Correo o contraseña incorrectos";
      }
    };

    return {
      email,
      password,
      error,
      login
    };
  }
};
</script>
