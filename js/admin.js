const productForm = document.getElementById("product-form");
const message = document.getElementById("message");

//Lägg till produkt
productForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const token = localStorage.getItem("token");

    const productName = document.getElementById("product-name").value;
    const description = document.getElementById("description").value;
    const price = document.getElementById("price").value;

    try {
        const response = await fetch(
            "http://localhost:3001/api/products",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    productName,
                    description,
                    price
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            message.textContent = data.error;
            return;
        }

        message.textContent = data.message;

        productForm.reset();

    } catch (error) {

        message.textContent =
            "Kunde inte ansluta till servern.";
    }
});