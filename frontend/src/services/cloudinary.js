export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("http://127.0.0.1:8000/api/upload", {
    method: "POST",
    body: formData
  });

  if (!res.ok) {
    throw new Error("Error al subir la imagen");
  }

  const data = await res.json();
  return data.url;
};
