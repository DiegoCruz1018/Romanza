export function toBase64(file: File): Promise<string>{

    //Crear y devolver una nueva promesa

    //resolve es cuando es cuando es exitoso y reject es cuando es un error
    return new Promise((resolve, reject) => {
        
        //Crear un objeto FileReader para leer el archivo
        const reader = new FileReader();

        //Leer el contenido del archivo como una URL de datos en base64
        reader.readAsDataURL(file);

        // Cuando la lectura del archivo sea exitosa, resolver la promesa con el resultado en Base64.
        // `onload` se activa cuando el archivo ha sido leído completamente.
        reader.onload = () => resolve(reader.result as string);

        // Si ocurre un error durante la lectura del archivo, rechazar la promesa con el error.
        reader.onerror = (error) => reject(error);
    });
}