const productForm = document.getElementById("product-form");
const message = document.getElementById("message");
const productsContainer = document.getElementById("products-container");
let editingProductId = null;

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
            message.textContent =
                "Produkten kunde inte sparas. Kontrollera att alla fält är ifyllda.";
            return;
        }

        message.textContent = data.message;

        productForm.reset();
        getProducts();

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

                <h3>${product.productName}</h3>

                <p>${product.description}</p>

                <p>${product.price} kr</p>

                <button class="edit-button" data-id="${product._id}">
                    Redigera
                </button>

                <button class="delete-button" data-id="${product._id}">
                    Ta bort
                </button>

                <div class="edit-form-container"></div>

            </div>
        `;
    });
}

//Ta bort produkt
productsContainer.addEventListener("click", async (e) => {

    if (!e.target.classList.contains("delete-button")) {
        return;
    }

    const productId = e.target.dataset.id;

    try {

        const token = localStorage.getItem("token");

        const response = await fetch(
            `http://localhost:3001/api/products/${productId}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        message.textContent = data.message;

        getProducts();

    } catch (error) {
        console.error(error);

        message.textContent =
            "Kunde inte ta bort produkten.";
    }
});

//Redigera produkt
productsContainer.addEventListener("click", (e) => {

    if (!e.target.classList.contains("edit-button")) {
        return;
    }

    editingProductId = e.target.dataset.id;

    console.log("Valt id:", editingProductId);

    const card = e.target.closest(".product-card");

    card.insertAdjacentHTML(
        "beforeend",
        `
    <form class="edit-form">
        <label>Produktnamn</label>
        <input type="text" class="edit-name" value="${card.querySelector("h3").textContent}">

        <label>Beskrivning</label>
        <textarea class="edit-description">${card.querySelectorAll("p")[0].textContent}</textarea>

        <label>Pris</label>
        <input type="number" class="edit-price" value="${card.querySelectorAll("p")[1].textContent.replace(" kr", "")}">

        <button type="submit">
            Spara ändringar
        </button>

        <p class="edit-message"></p>
    </form>
    `
    );
});

//Eventlyssnare för "redgierings-knapp"
productsContainer.addEventListener("submit", async (e) => {

    if (!e.target.classList.contains("edit-form")) {
        return;
    }

    e.preventDefault();

    const token = localStorage.getItem("token");

    const name = e.target.querySelector(".edit-name").value;
    const description = e.target.querySelector(".edit-description").value;
    const price = e.target.querySelector(".edit-price").value;

    try {

        console.log("PUT körs");
        console.log(editingProductId);
        const response = await fetch(
            `http://localhost:3001/api/products/${editingProductId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    productName: name,
                    description,
                    price
                })
            }
        );

        alert("Produkten uppdaterad!");

        getProducts();

    } catch (error) {

        message.textContent =
            "Kunde inte uppdatera produkten.";
    }
});

productForm.reset();
getProducts();