<template>
  <div class="p-6 flex flex-col items-center">
    <h1 class="text-3xl font-bold mb-4">Bienvenid@ {{ username }}</h1>

    <!-- Mostrar la foto si existe -->
    <div v-if="photoURL" class="mb-4">
      <img :src="photoURL" alt="Foto del usuario"
           class="w-32 h-32 rounded-full object-cover border-2 border-blue-500"/>
    </div>

    <button @click="logout" class="mt-4 bg-red-500 text-white p-2 rounded hover:bg-red-600">
      Cerrar Sesión
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { auth, db } from "../router/firebase/firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from 'vue-router';

const username = ref('');
const photoURL = ref('');
const router = useRouter();

const logout = async () => {
  await signOut(auth);
  router.push("/");
}

onMounted(async () => {
  // Esperar a que el usuario esté logueado
  const user = auth.currentUser;
  if (!user) return router.push("/");

  const docRef = doc(db, "usuarios", user.uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    username.value = data.username || "Usuario";
    photoURL.value = data.avatarUrl || "";
  } else {
    username.value = "Usuario";
    photoURL.value = "";
  }
});
</script>
