document.addEventListener('DOMContentLoaded', function() {
    const cart = JSON.parse(localStorage.getItem('foodCart')) || [];
    const cartCount = document.getElementById('cart-count');
    const cartBody = document.getElementById('cart-body');
    const totalPriceElement = document.getElementById('total-price');
    const filterButtons = document.querySelectorAll('.filter-button');
    const items = document.querySelectorAll('.item');

function updateCartDisplay() {
cartBody.innerHTML = '';
let totalPrice = 0;
cart.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><img src="${item.img}" style="width: 50px; height: 50px; border-radius:50%;" /></td>
        <td>${item.title}</td>
        <td>$${item.price.toFixed(2)}</td>
        <td>
            <button style="background-color:green;border-radius:10px;" onclick="changeQuantity('${item.img}', -1)">-</button>
            ${item.quantity}
            <button style="background-color:green;border-radius:10px;"  onclick="changeQuantity('${item.img}', 1)">+</button>
            
        </td>
        <td>$${(item.price * item.quantity).toFixed(2)}</td>
    `;
    cartBody.appendChild(row);
    totalPrice += item.price * item.quantity;
});
totalPriceElement.innerText = ` $${totalPrice.toFixed(2)}`;
cartCount.innerText = cart.length;
localStorage.setItem('foodCart', JSON.stringify(cart));
}

function addToCart(img, title, price) {
const existingItem = cart.find(item => item.img === img);
if (existingItem) {
    existingItem.quantity += 1;
} else {
    cart.push({ img, title, price, quantity: 1 });
}
updateCartDisplay();
}

window.addToCart = addToCart; // Expose to global scope for inline HTML calls

function changeQuantity(img, amount) {
const item = cart.find(item => item.img === img);
if (item) {
    item.quantity += amount;
    if (item.quantity <= 0) {
        const index = cart.indexOf(item);
        cart.splice(index, 1);
    }
    updateCartDisplay();
}
}

window.changeQuantity = changeQuantity; // Expose to global scope for inline HTML calls

function filterItems(category) {
items.forEach(item => {
    if (category === 'all' || item.getAttribute('data-category') === category) {
        item.style.display = 'block';
    } else {
        item.style.display = 'none';
    }
});
}

filterButtons.forEach(button => {
button.addEventListener('click', function() {
    const filter = this.getAttribute('data-filter');
    filterItems(filter);
});
});

document.getElementById('cart').addEventListener('click', function() {
const cartList = document.getElementById('cartList');

if (cartList.style.display === 'block') {
} else {
cartList.style.display = 'block';

// Check if the close button already exists
if (!document.getElementById('closeCart')) {
    // Create close button
    const closeButton = document.createElement('button');
    closeButton.id = 'closeCart';
    closeButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.background = 'transparent';
    closeButton.style.border = 'none';
    closeButton.style.fontSize = '30px';
    closeButton.style.color = 'black';
    closeButton.style.cursor = 'pointer';

    // Add close functionality
    closeButton.addEventListener('click', function() {
        cartList.style.display = 'none';
    });

    // Append close button to the cartList
    cartList.appendChild(closeButton);
}
}
});

updateCartDisplay(); // Initial update to display cart items
});

function openDetails(imgSrc, title, price, description) {
const existingDiv = document.querySelector('.newDiv');

const overlay = document.createElement('div');
overlay.classList.add('overlay');
document.body.appendChild(overlay);

const newDiv = document.createElement('div');
newDiv.classList.add('newDiv');

newDiv.innerHTML = `
<button class="closeBtn" onclick="closeDetails()"><i class="fa-solid fa-xmark"></i></button>
<img src="${imgSrc}" alt="${title}" style="width: 100%; height: auto;" />
<h2 style="text-align:center;font-weight:bold;color:green;">${title}</h2>
<p style="text-align:center;font-weight:bold;">Price: $${price.toFixed(2)}</p>
<hr>
<p style="color:black"> ${description}</p>
`;

document.body.appendChild(newDiv);
}

function closeDetails() {
const newDiv = document.querySelector('.newDiv');
const overlay = document.querySelector('.overlay');
if (newDiv) {
newDiv.remove();
}
if (overlay) {
overlay.remove();
}
}

function catagories(description) {
// Create the overlay div
const overlay = document.createElement('div');
overlay.classList.add('overlay');
overlay.onclick = closeCatagories;

// Create the category div
const cataDiv = document.createElement('div');
cataDiv.innerHTML = `
<button class="closeBtn" onclick="closeCatagories()"><i class="fa-solid fa-xmark"></i></button>
<p>${description}</p>`;
cataDiv.classList.add('cataDiv');

// Append the overlay and category div to the body
document.body.appendChild(overlay);
document.body.appendChild(cataDiv);
}

// Function to close the category view
function closeCatagories() {
const overlay = document.querySelector('.overlay');
const cataDiv = document.querySelector('.cataDiv');
if (overlay) {
document.body.removeChild(overlay);
}
if (cataDiv) {
document.body.removeChild(cataDiv);
}
}


