// --- Global Variables ---
const API_URL = 'http://localhost:3000/api';

// --- Functions ---

// 1. Load Products (Home Page)
async function loadProducts() {
    const container = document.getElementById('product-list');
    try {
        const res = await fetch(`${API_URL}/products`);
        const products = await res.json();
        
        container.innerHTML = products.map(p => `
            <div class="card">
                <img src="${p.image}" alt="${p.name}">
                <div class="card-body">
                    <h3>${p.name}</h3>
                    <p class="price">$${p.price}</p>
                    <p>${p.description}</p>
                    <button class="btn" onclick="addToCart('${p._id}', '${p.name}', ${p.price})">Add to Cart</button>
                </div>
            </div>
        `).join('');
    } catch (err) {
        container.innerHTML = "<p>Please run database seed first!</p>";
    }
    updateCartCount();
}

// 2. Add to Cart (Uses LocalStorage)
function addToCart(id, name, price) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push({ id, name, price });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(`${name} added to cart!`);
}

// 3. Load Cart (Cart Page)
function loadCart() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const container = document.getElementById('cart-items');
    const totalSpan = document.getElementById('total-price');
    
    if (cart.length === 0) {
        container.innerHTML = "<p>Your cart is empty.</p>";
        totalSpan.innerText = "0";
        return;
    }

    let total = 0;
    container.innerHTML = cart.map((item, index) => {
        total += item.price;
        return `
            <div class="cart-item">
                <h4>${item.name}</h4>
                <span>$${item.price}</span>
                <button class="btn-remove" onclick="removeFromCart(${index})">Remove</button>
            </div>
        `;
    }).join('');
    
    totalSpan.innerText = total;
}

// 4. Remove Item
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart(); // Refresh page list
    updateCartCount();
}

// 5. Checkout (Place Order)
async function checkout() {
    const name = document.getElementById('customer-name').value;
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (!name || cart.length === 0) {
        alert("Please enter your name and add items!");
        return;
    }

    const total = cart.reduce((sum, item) => sum + item.price, 0);

    const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerName: name, items: cart, total })
    });

    if (res.ok) {
        alert("Order Placed Successfully!");
        localStorage.removeItem('cart'); // Clear cart
        window.location.href = 'index.html'; // Go back home
    } else {
        alert("Order failed!");
    }
}

// Helper: Update badge count
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = document.getElementById('cart-count');
    if(count) count.innerText = cart.length;
}