export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("http://localhost:3000/upload", {
    method: "POST",
    body: formData
  });

  const data = await res.json();
  return data.url; // Esta es la URL que guardamos en Firestore
}
