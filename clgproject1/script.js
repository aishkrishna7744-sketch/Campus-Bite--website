const foods = [
    { id: 1, name: "Idli", price: 20, category: "Breakfast", emoji: "🥘" },
    { id: 2, name: "Dosa", price: 40, category: "Breakfast", emoji: "🥞" },
    { id: 3, name: "Poori", price: 35, category: "Breakfast", emoji: "🍽️" },
    { id: 4, name: "Veg Meals", price: 80, category: "Lunch", emoji: "🍛" },
    { id: 5, name: "Fried Rice", price: 60, category: "Lunch", emoji: "🍚" },
    { id: 6, name: "Noodles", price: 50, category: "Lunch", emoji: "🍜" },
    { id: 7, name: "Tea", price: 10, category: "Drinks", emoji: "☕" },
    { id: 8, name: "Coffee", price: 15, category: "Drinks", emoji: "🥤" }
];

let cart = JSON.parse(localStorage.getItem("campusCart")) || [];
let currentCategory = "All";

// Display food menu
function displayMenu() {
    const menu = document.getElementById("menu");
    const search = document.getElementById("search").value.toLowerCase();

    const filteredFoods = foods.filter(food => {
        const matchesCategory =
            currentCategory === "All" ||
            food.category === currentCategory;

        const matchesSearch =
            food.name.toLowerCase().includes(search);

        return matchesCategory && matchesSearch;
    });

    menu.innerHTML = "";

    if (filteredFoods.length === 0) {
        menu.innerHTML = "<p>No food items found.</p>";
        return;
    }

    filteredFoods.forEach(food => {
        menu.innerHTML += `
            <div class="food-card">
                <div class="emoji">${food.emoji}</div>
                <h3>${food.name}</h3>
                <p>Category: ${food.category}</p>
                <h3>₹${food.price}</h3>
                <button onclick="addToCart(${food.id})">
                    Add to Cart
                </button>
            </div>
        `;
    });
}

// Filter food category
function filterFood(category) {
    currentCategory = category;
    displayMenu();
}

// Add food to cart
function addToCart(id) {
    const food = foods.find(item => item.id === id);
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...food,
            quantity: 1
        });
    }

    saveCart();
    displayCart();
}

// Change quantity
function changeQuantity(id, change) {
    const item = cart.find(food => food.id === id);

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        cart = cart.filter(food => food.id !== id);
    }

    saveCart();
    displayCart();
}

// Save cart
function saveCart() {
    localStorage.setItem("campusCart", JSON.stringify(cart));
}

// Display cart and calculate bill
function displayCart() {
    const cartDiv = document.getElementById("cart");
    cartDiv.innerHTML = "";

    let subtotal = 0;

    if (cart.length === 0) {
        cartDiv.innerHTML = "<p>Your cart is empty.</p>";
    }

    cart.forEach(item => {
        const amount = item.price * item.quantity;
        subtotal += amount;

        cartDiv.innerHTML += `
            <div class="cart-item">
                <span>
                    ${item.name} - ₹${item.price}
                </span>

                <span>
                    <button onclick="changeQuantity(${item.id}, -1)">−</button>
                    ${item.quantity}
                    <button onclick="changeQuantity(${item.id}, 1)">+</button>
                </span>

                <strong>₹${amount}</strong>
            </div>
        `;
    });

    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + tax;

    document.getElementById("subtotal").innerText = "₹" + subtotal;
    document.getElementById("tax").innerText = "₹" + tax;
    document.getElementById("total").innerText = "₹" + total;
}

// Place order
function placeOrder() {
    if (cart.length === 0) {
        alert("Please add food items to your cart!");
        return;
    }

    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + tax;

    const orderNumber = "CB" + Date.now().toString().slice(-6);

    document.getElementById("orderId").innerText =
        "Order ID: " + orderNumber;

    let receiptHTML = "";

    cart.forEach(item => {
        receiptHTML += `
            <p>${item.name} × ${item.quantity}
            = ₹${item.price * item.quantity}</p>
        `;
    });

    receiptHTML += `
        <hr>
        <p>Subtotal: ₹${subtotal}</p>
        <p>Tax: ₹${tax}</p>
    `;

    document.getElementById("receiptDetails").innerHTML =
        receiptHTML;

    document.getElementById("receiptTotal").innerText =
        "Total Paid: ₹" + total;

    document.getElementById("receipt").hidden = false;

    cart = [];
    saveCart();
    displayCart();

    document.getElementById("receipt").scrollIntoView({
        behavior: "smooth"
    });
}

// Search food
document.getElementById("search").addEventListener(
    "input", displayMenu
);

// Initial display
displayMenu();
displayCart();
