export const obtenerDataImagen = (imagen) => {
  return new Promise((resolve, eject) => {
    const nombre = imagen.name;
    const extension = imagen.name.split(".").pop();

    const lector = new FileReader();
    lector.readAsDataURL(imagen);
    lector.onload = () =>
      resolve({
        nombre: nombre,
        data: lector.result.split(",")[1],
        extension: extension,
      });
    lector.onerror = (error) => PromiseRejectionEvent(error);
  });
};
