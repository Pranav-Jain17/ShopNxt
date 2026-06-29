let cart = [];
let allProducts = [];
let currentPage = 1;
const itemsPerPage = 20;
const appContainer = document.getElementById('app');
const cartCountEl = document.getElementById('cart-count');

renderListing();

// TASK 1: Listing Page
async function renderListing() {
    appContainer.innerHTML = '<h2>Loading products...</h2>';

    try {
        if (allProducts.length === 0) {
            const response = await fetch('https://dummyjson.com/products?limit=194');
            const data = await response.json();
            allProducts = data.products;
        }
        displayPage(currentPage);

    } catch (error) {
        appContainer.innerHTML = '<p style="color:red;">Failed to load products.</p>';
    }
}

// Function to slice the array and render a specific page
function displayPage(page) {
    currentPage = page;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = allProducts.slice(startIndex, endIndex);

    let html = '<div class="product-grid">';
    paginatedItems.forEach(product => {
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
    html += renderPaginationControls();
    appContainer.innerHTML = html;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Function to build the Prev/Next and Page Number buttons
function renderPaginationControls() {
    const totalPages = Math.ceil(allProducts.length / itemsPerPage);
    let controlsHtml = '<div class="pagination">';
    controlsHtml += `<button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="displayPage(${currentPage - 1})">Prev</button>`;
    for (let i = 1; i <= totalPages; i++) {
        controlsHtml += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="displayPage(${i})">${i}</button>`;
    }
    controlsHtml += `<button class="page-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="displayPage(${currentPage + 1})">Next</button>`;

    controlsHtml += '</div>';
    return controlsHtml;
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

// TASK 3: Cart Logic
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    cartCountEl.innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.classList.remove('cart-animate');
    void cartCountEl.offsetWidth;
    cartCountEl.classList.add('cart-animate');
    alert(`${product.title} has been added to your cart.`);
}

function renderCartPage() {
    if (cart.length === 0) {
        appContainer.innerHTML = '<h2 style="margin-top:50px;">Your Cart is Empty</h2><span class="back-link" onclick="renderListing()">Go shopping</span>';
        return;
    }

    let html = `<h2>Shopping Cart</h2><div class="cart-layout"><div class="cart-items-container">`;

    cart.forEach(item => {
        html += `
            <div class="cart-item">
                <div style="display:flex; align-items:center;">
                    <img src="${item.thumbnail}">
                    <div><h3>${item.title}</h3><p>$${item.price} x ${item.quantity}</p></div>
                </div>
                <strong>$${(item.price * item.quantity).toFixed(2)}</strong>
            </div>
        `;
    });

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.10;
    const total = subtotal + tax;

    html += `
        </div>
        <div class="cart-summary">
            <h3>Order Summary</h3>
            <div class="summary-row"><span>Subtotal:</span><span>$${subtotal.toFixed(2)}</span></div>
            <div class="summary-row"><span>Tax (10%):</span><span>$${tax.toFixed(2)}</span></div>
            <div class="summary-row summary-total"><span>Total:</span><span>$${total.toFixed(2)}</span></div>
            <button class="btn-success" onclick="alert('Checkout Complete!')">Proceed to Checkout</button>
        </div></div>`;

    appContainer.innerHTML = html;
}
