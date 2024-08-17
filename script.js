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
                <td style="padding: 10px;"><img src="${item.img}" style="width: 50px; height: 50px; border-radius:50%;" /></td>
                <td style="padding: 10px;">${item.title}</td>
                <td style="padding: 10px;">$${item.price.toFixed(2)}</td>
                <td style="padding: 10px;">
                    <button style="background-color:green;border-radius:10px;" onclick="changeQuantity('${item.img}', -1)">-</button>
                    ${item.quantity}
                    <button style="background-color:green;border-radius:10px;"  onclick="changeQuantity('${item.img}', 1)">+</button>
                </td>
                <td style="padding: 10px;">$${(item.price * item.quantity).toFixed(2)}</td>
                <td style="padding: 10px;">
                    <button style="background-color:green;color:white;border-radius:10px;" onclick="removeItem('${item.img}')"><i class="fa-sharp-duotone fa-solid fa-trash"></i></button>
                </td>
            `;
            row.style.borderBottom = "2px solid red"; // Add a border for separation
            row.style.marginBottom = "10px"; // Add margin for spacing
            cartBody.appendChild(row);
            totalPrice += item.price * item.quantity;
        });
        totalPriceElement.innerText = `$${totalPrice.toFixed(2)}`;
        let initialTax = 0;
        const taxAmount = totalPrice*0.05;
        const taxDiv = document.querySelector('.tax');
        taxDiv.innerHTML = `Tax Amount is(5% on Total Price) : $${taxAmount.toFixed(2)} `;


        const orderButton = document.querySelector('#order-btn');
        const popupOverlay = document.querySelector('#popup-overlay');
        const closePopup = document.querySelector('#close-popup');
        const confirmOrderButton = document.querySelector('#confirm-order');

        orderButton.addEventListener('click', orderProcess);

        function orderProcess() {
            const orderSummary = document.querySelector('#order-summary');
            orderSummary.innerHTML = ''; // Clear previous content

            // Add ordered items to the popup
            cart.forEach(item => {
                const pTag = document.createElement('p');
                pTag.innerText = `You ordered: ${item.title} - Quantity: ${item.quantity}`;
                orderSummary.appendChild(pTag);
            });

            // Add total price to the popup
            const totalPriceTag = document.createElement('p');
            totalPriceTag.innerHTML = `<strong>Total Price: $${(totalPrice+taxAmount).toFixed(2)}</strong>`;
            orderSummary.appendChild(totalPriceTag);

            // Show the popup
            popupOverlay.style.display = 'flex';
        }

        closePopup.addEventListener('click', function() {
            popupOverlay.style.display = 'none';
        });
        

        
        // popupOverlay.addEventListener('click', function(event) {
        //     if (event.target === popupOverlay) {
        //         popupOverlay.style.display = 'none';
        //     }
        // });

        confirmOrderButton.addEventListener('click', function() {
            alert('Order Confirmed!'); // Add your order processing logic here
            popupOverlay.style.display = 'none'; // Close the popup after confirming
        });
       

        cartCount.innerText = cart.length;
        localStorage.setItem('foodCart', JSON.stringify(cart));

    
        // Apply discount if a valid code has been entered
        const discountCode = localStorage.getItem('discountCode');
        let discountApplied = 0; // To store the discount amount
        const finalPrice = document.querySelector('#total-price');
        if (discountCode === 'DISCOUNT10') {
            discountApplied = totalPrice * 0.1;
            totalPrice -= discountApplied; 
            document.getElementById('discount-message').innerText = 'Discount applied: 10% off';
            const finalPrice2 = document.querySelector('.final-price');
            finalPrice2.innerHTML = `Total Price after discount : <span style="color:green;font-weight:bold;">$${totalPrice.toFixed(2)}</span> `;
            const taxDiv = document.querySelector('.tax');
            taxDiv.innerHTML = `Tax Amount is(5% on Total Price) : <span style="color:green;font-weight:bold;">$${taxAmount.toFixed(2)}</span> `;
            const afterTaxFinalPrice = document.querySelector('.tax-final-price');
            const total = taxAmount + totalPrice;
            afterTaxFinalPrice.innerHTML = `Total Final Price : <span style="color:green;font-weight:bold;"> $${total.toFixed(2)} </span>`;
        } else if (discountCode === 'DISCOUNT20') {
            discountApplied = totalPrice * 0.2;
            totalPrice -= discountApplied; 
            document.getElementById('discount-message').innerText = 'Discount applied: 20% off';
            const finalPrice2 = document.querySelector('.final-price');
            finalPrice2.innerHTML = `Total Price after discount : <span style="color:green;font-weight:bold;">$${totalPrice.toFixed(2)}</span>`;    
            const taxDiv = document.querySelector('.tax');
            taxDiv.innerHTML = `Tax Amount is(5% on Total Price) : <span style="color:green;font-weight:bold;">$${taxAmount.toFixed(2)}</span> `;
            const afterTaxFinalPrice = document.querySelector('.tax-final-price');
            const total = taxAmount + totalPrice;
            afterTaxFinalPrice.innerHTML = `Total Final Price : <span style="color:green;font-weight:bold;"> $${total.toFixed(2)} </span>`;


        } else if (discountCode !== 'DISCOUNT10' && discountCode !== 'DISCOUNT20'){
            document.getElementById('discount-message').innerText = 'Invalid discount code';
            const taxDiv = document.querySelector('.tax');
            taxDiv.innerHTML = `Tax Amount is(5% on Total Price) : <span style="color:green;font-weight:bold;">$${taxAmount.toFixed(2)}</span> `;
            const afterTaxFinalPrice = document.querySelector('.tax-final-price');
            const total = taxAmount + totalPrice;
            afterTaxFinalPrice.innerHTML = `Total Final Price : <span style="color:green;font-weight:bold;"> $${total.toFixed(2)} </span>`;
        } else {
            document.getElementById('discount-message').innerText = '';
            const taxDiv = document.querySelector('.tax');
            taxDiv.innerHTML = `Tax Amount is(5% on Total Price) : <span style="color:green;font-weight:bold;">$${taxAmount.toFixed(2)}</span>`;
            const afterTaxFinalPrice = document.querySelector('.tax-final-price');
            const total = taxAmount + totalPrice;
            afterTaxFinalPrice.innerHTML = `Total Final Price : <span style="color:green;font-weight:bold;"> $${total.toFixed(2)} </span>`;
        }
    
        

        
    }
    
    function applyDiscount() {
        const discountInput = document.getElementById('discount-code').value.trim();
        if (discountInput === 'DISCOUNT10' || discountInput === 'DISCOUNT20') {
            localStorage.setItem('discountCode', discountInput);
        } else {
            localStorage.removeItem('discountCode');
        }
        updateCartDisplay(); // Recalculate the total with the discount
    }
    document.getElementById('apply-discount').addEventListener('click', applyDiscount);
    
    
    
    function removeItem(img) {
        const itemIndex = cart.findIndex(item => item.img === img);
        if (itemIndex !== -1) {
            cart.splice(itemIndex, 1); // Remove the item from the cart
            updateCartDisplay(); // Update the cart display after removal
        }
    }
    
    window.removeItem = removeItem; // Expose to global scope for inline HTML calls
    

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

document.body.appendChild(overlay);
document.body.appendChild(cataDiv);
}

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

