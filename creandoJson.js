document.addEventListener('DOMContentLoaded', function() {
    // Accede al elemento resultado
    const resultadoElement = document.getElementById('resultado');

    // Obtiene el contenido del elemento
    const resultado = resultadoElement.textContent;

    // Llama a la función que necesitas con el resultado como argumento
    hacerAlgoConElResultado(resultado);
});

// Define la función hacerAlgoConElResultado
function hacerAlgoConElResultado(resultado) {
    // Aquí puedes hacer lo que necesites con el resultado
    console.log('El resultado recibido es:', resultado);
}