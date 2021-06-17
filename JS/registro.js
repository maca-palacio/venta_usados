const button = document.getElementById("btn-register");


document.addEventListener("DOMContentLoaded", (ev) => {
    button.addEventListener("click", async (ev) => {
        ev.preventDefault();
        const nameInputValue = document.getElementById("nombre").value;
        const usernameInputValue = document.getElementById("correo").value;
        const passwordInputValue = document.getElementById("password").value;

        const bodyPost={
            nombre:nameInputValue,    
            correo:usernameInputValue,
            password:passwordInputValue
        }
        
        var myHeader = new Headers();
        myHeader.append("Content-Type", "application/json");
        try {
            const responselogin = await fetch('http://localhost:3000/register', {
                method: "POST",
                body: JSON.stringify(bodyPost),
                headers: myHeader,
            });
            const responseObject = await responselogin.json();
            if (responselogin.status == 200) {
                alert("registro exitoso");
              } else {
                alert(responseObject.error);
              }

        } catch (error) {
            alert("algo salió mal");
        }
    })
})