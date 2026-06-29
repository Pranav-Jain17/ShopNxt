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

// TASK 2: Product Page
async function renderProduct(id) {
    appContainer.innerHTML = '<h2>Loading details...</h2>';
    try {
        const response = await fetch(`https://dummyjson.com/products/${id}`);
        const product = await response.json();

        appContainer.innerHTML = `
            <div class="details-view">
                <img src="${product.thumbnail}" class="details-image">
                <div class="details-info">
                    <span class="details-category">${product.category}</span>
                    <h1 class="details-title">${product.title}</h1>
                    <p>${product.description}</p>
                    <p class="product-price" style="margin: 20px 0; font-size: 28px;">$${product.price}</p>
                    
                    <button class="btn btn-primary" style="width: fit-content;" 
                            onclick='addToCart(${JSON.stringify(product).replace(/'/g, "&#39;")})'>
                        Add to Cart
                    </button>
                </div>
            </div>
            <span class="back-link" onclick="renderListing()">&larr; Back to Products</span>
        `;
    } catch (error) {
        appContainer.innerHTML = '<p style="color:red;">Failed to load product.</p>';
    }
}

function addToCart(product) { console.log("Added to cart:", product.title); }