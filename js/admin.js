const productForm = document.getElementById("product-form");
const message = document.getElementById("message");
const productsContainer = document.getElementById("products-container");

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

//Hämta produkter
async function getProducts() {
    try {

        const response = await fetch(
            "http://localhost:3001/api/products"
        );

        const products = await response.json();

        displayProducts(products);

    } catch (error) {
        console.error(error);
    }
}

//Visa produkter
function displayProducts(products) {

    productsContainer.innerHTML = "";

    products.forEach(product => {

        productsContainer.innerHTML += `
            <div class="product-card">

                <h3>${product.name}</h3>

                <p>${product.description}</p>

                <p>${product.price} kr</p>

                <button class="edit-button">
                    Redigera
                </button>

                <button
                    class="delete-button"
                    data-id="${product._id}"
                >
                    Ta bort
                </button>

            </div>
        `;
    });
}

productForm.reset();
getProducts();