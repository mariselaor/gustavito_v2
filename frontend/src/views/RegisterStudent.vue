<template>
  <div class="min-h-screen flex items-center justify-center bg-blue-100">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
      <h2 class="text-2xl font-bold text-center mb-6 text-blue-700">Registrar Estudiante</h2>

      <div class="mb-4">
        <label class="block mb-1 font-semibold">Nombre del estudiante</label>
        <input v-model="username" type="text" class="w-full border p-2 rounded" placeholder="Ej. Gustavito" />
      </div>

      <div class="mb-4">
        <label class="block mb-1 font-semibold">Foto</label>
        <input type="file" @change="handleFile" />
      </div>

      <button @click="registerStudent" class="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition">
        Registrar
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { db } from "../router/firebase/firebase"
import { doc, setDoc } from "firebase/firestore"
import { uploadFile } from "../services/cloudinary"

const username = ref('')
const file = ref(null)

const handleFile = (event) => {
  file.value = event.target.files[0]
}

const registerStudent = async () => {
  try {
    if (!username.value) return alert("Escribe el nombre del estudiante")
    if (!file.value) return alert("Selecciona una foto")

    // Subir foto al backend → Cloudinary
    const fileUrl = await uploadFile(file.value)

    // Guardar en Firestore
    await setDoc(doc(db, "estudiantes", username.value), {
      username: username.value,
      avatarUrl: fileUrl,
      progreso: 0,
      createdAt: new Date()
    })

    alert("Estudiante registrado con foto en la nube ✅")
    username.value = ''
    file.value = null
  } catch (error) {
    console.error(error)
    alert("Error al registrar estudiante")
  }
}
</script>
