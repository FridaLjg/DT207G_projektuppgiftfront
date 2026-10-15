const form = document.getElementById("login-form");
const errorMessage = document.getElementById("error-message");

//Eventlyssnare
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    errorMessage.textContent = "";

    //Hämtar värden från input
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {

        //Skickar inloggningsuppgifter till backend
        const response = await fetch("http://localhost:3001/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password
            })
        });

        const data = await response.json();

        //Om fel
        if (!response.ok) {
            errorMessage.textContent = data.error;
            return;
        }

        //Spara JWT-token i localStorage
        localStorage.setItem("token", data.token);

        window.location.href = "admin.html";

    } catch (error) {
        errorMessage.textContent = "Kunde inte ansluta till servern.";
    }
});