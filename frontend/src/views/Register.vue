<template>
  <div class="min-h-screen flex items-center justify-center bg-blue-100">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
      <h2 class="text-2xl font-bold text-center mb-6 text-blue-700">Registrar Estudiante</h2>

      <div class="mb-4">
        <label>Nombre</label>
        <input v-model="username" type="text" class="w-full border p-2 rounded" />
      </div>

      <div class="mb-4">
        <label>Correo</label>
        <input v-model="email" type="email" class="w-full border p-2 rounded" />
      </div>

      <div class="mb-4">
        <label>Contraseña</label>
        <input v-model="password" type="password" class="w-full border p-2 rounded" />
      </div>

      <div class="mb-4">
        <label>Foto</label>
        <input type="file" @change="handleFile" />
      </div>

      <button @click="registerStudent" class="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">
        Registrar
      </button>
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
const router = useRouter();

const handleFile = (event) => {
  file.value = event.target.files[0];
}

const registerStudent = async () => {
  try {
    if (!username.value || !email.value || !password.value || !file.value)
      return alert("Completa todos los campos");

    // 1️⃣ Crear usuario en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    const uid = userCredential.user.uid;

    // 2️⃣ Subir foto a Cloudinary
    const avatarUrl = await uploadFile(file.value);

    // 3️⃣ Guardar datos en Firestore
    await setDoc(doc(db, "usuarios", uid), {
      username: username.value,
      email: email.value,
      avatarUrl,
      progreso: 0,
      createdAt: new Date()
    });

    // 4️⃣ Redirigir al Home después de guardar todo
    router.push("/home");

  } catch (error) {
    console.error(error);
    alert("Error al registrar estudiante: " + error.message);
  }
}
</script>
