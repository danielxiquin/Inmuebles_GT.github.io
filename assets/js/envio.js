document.addEventListener("DOMContentLoaded", function () {
    const boton = document.getElementById("submitButton");
    boton.addEventListener("click", function (event) {
        event.preventDefault();  
        fetch('/addData', {
            method: 'POST',
            body: new FormData(document.getElementById("myForm"))
        }).then(response => {
            if (response.ok) {
                window.location.href = "/otraPagina.html";
            } else {
                alert("Hubo un error al enviar el formulario.");
            }
        });
    });
});
