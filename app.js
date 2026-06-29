let cart = [];
const appContainer = document.getElementById('app');
const cartCountEl = document.getElementById('cart-count');

renderListing();

// TASK 1: Listing Page
async function renderListing() {
    appContainer.innerHTML = '<h2>Loading products...</h2>';
    try {
        const response = await fetch('https://dummyjson.com/products?limit=20');
        const data = await response.json();

        let html = '<div class="product-grid">';
        data.products.forEach(product => {
            html += `
                <div class="product-card">
                    <img src="${product.thumbnail}" alt="${product.title}" onclick="renderProduct(${product.id})">
                    <h2 class="product-title" title="${product.title}">${product.title}</h2>
                    <p class="product-price">$${product.price}</p>
                    <button class="btn btn-secondary" onclick="renderProduct(${product.id})">View Details</button>
                </div>
            `;
        });
        html += '</div>';
        appContainer.innerHTML = html;
    } catch (error) {
        appContainer.innerHTML = '<p style="color:red;">Failed to load products.</p>';
    }
}

function renderProduct(id) { console.log("Product clicked:", id); }
function renderCartPage() { console.log("Cart clicked"); }