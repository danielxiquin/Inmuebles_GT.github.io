document.addEventListener("DOMContentLoaded", function() {
    var boton = document.getElementById("submitButton");

    boton.addEventListener("click", function(event) {
        event.preventDefault(); 

        const form = document.getElementById("myForm");  
        const formData = new FormData(form);  

        fetch(form.action, {
            method: form.method,  
            body: formData  
        })
        .then(response => {
            if (response.ok) {
                window.location.href = "Subasta.html";
            } else {
                alert("Hubo un error al enviar los datos. Intenta de nuevo.");
            }
        })
        .catch(error => {
            console.error("Error al enviar el formulario:", error);
            alert("Error de conexión. Intenta de nuevo.");
        });
    });
});
