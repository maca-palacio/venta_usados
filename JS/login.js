const button = document.getElementById("login");


document.addEventListener("DOMContentLoaded", (ev) => {
    button.addEventListener("click", async (ev) => {
        ev.preventDefault();

        const usernameInputValue = document.getElementById("username").value;
        const passwordInputValue = document.getElementById("password").value;

        const bodyPost={
            correo:usernameInputValue,
            password:passwordInputValue
        }
        
        var myHeader = new Headers();
        myHeader.append("Content-Type", "application/json");
        try {
            const responselogin = await fetch('http://localhost:3000/login', {
                method: "POST",
                body: JSON.stringify(bodyPost),
                headers: myHeader,
            });
            const responseObject = await responselogin.json();
            if (responselogin.status == 200) {
                alert("login exitoso");
                localStorage.setItem("token", JSON.stringify(responseObject));
              } else {
                alert(responseObject.error);
              }

        } catch (error) {
            alert("algo salió mal");
        }
    })
})

