const productsContainer = document.getElementById("products-container");

//Hämta produkter från API
async function getProducts() {

    try {

        const response = await fetch("http://localhost:3001/api/products");
        const products = await response.json();

        displayProducts(products);

    } catch (error) {
        console.error("Kunde inte hämta produkter:", error);
    }
}

//Visa produkter på sidan
function displayProducts(products) {

    productsContainer.innerHTML = "";

    products.forEach(product => {

        productsContainer.innerHTML += `
            <article class="product-card">

                <h3>${product.name}</h3>

                <p>${product.description}</p>

                <p><strong>${product.price} kr</strong></p>

            </article>
        `;
    });
}

getProducts();
