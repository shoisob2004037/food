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
            row.style.borderBottom = "2px dashed blue"; 
            row.style.marginBottom = "10px"; 
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
            const hTag = document.createElement('h3');
            const hTag2 = document.createElement('h2');
                hTag.innerHTML = 'Check the items again which you ordered.';
                orderSummary.appendChild(hTag);
                hTag2.innerHTML = 'You ordered : ';
                orderSummary.appendChild(hTag2);
                hTag.style.fontSize = '25px';
                hTag.style.color = 'green';
                hTag2.style.fontSize = '30px';
                hTag2.style.color = 'red';
                hTag2.style.textAlign = 'center';




            cart.forEach(item => {
                
                const pTag = document.createElement('p');
                pTag.innerText = ` ${item.title} - Quantity: ${item.quantity}`;
                orderSummary.appendChild(pTag);
            });

            const totalPriceTag = document.createElement('p');
            totalPriceTag.innerHTML = `<strong>Total Price: $${(totalPrice+taxAmount).toFixed(2)}</strong>`;
            orderSummary.appendChild(totalPriceTag);

            popupOverlay.style.display = 'flex';
        }

        closePopup.addEventListener('click', function() {
            popupOverlay.style.display = 'none';
        });
        

        confirmOrderButton.addEventListener('click', function() {
            
        });
       

        cartCount.innerText = cart.length;
        localStorage.setItem('foodCart', JSON.stringify(cart));

    
        const discountCode = localStorage.getItem('discountCode');
        let discountApplied = 0; 
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
        updateCartDisplay(); 
    }
    document.getElementById('apply-discount').addEventListener('click', applyDiscount);
    

    document.getElementById('confirm-order').addEventListener('click', function openFinalProcess() {
        const finalProcess = document.querySelector('.final-process');
        finalProcess.style.display = 'block';
    
        const orderSummary = document.querySelector('#order-summary');
        let orderItems = '';
        const summaryParagraphs = orderSummary.querySelectorAll('p');
        summaryParagraphs.forEach(p => {
            orderItems += p.innerText + '\n';
        });
    
        finalProcess.innerHTML = `
            <h2>Order Confirmation</h2>
            <form action="https://api.web3forms.com/submit" method="POST">
                <input type="hidden" name="access_key" value="49cbfe00-01ee-4fe3-ba7b-2bacf3cd14b5">
                <input type="text"  name="name" required placeholder="Your Name">
                <input type="text"  name="email" required placeholder="Your Email">
                <input type="text" name="address" required placeholder="Your Address">
                <input type="text" name="phone" required placeholder="Phone Number">
                <textarea name="message" cols="10" rows="10" required placeholder="Order Lists..readonly>${orderItems}"></textarea>
                <textarea name="message" cols="10" rows="10" required placeholder="Any Additional Message about Order.."</textarea>
                <div class="contact-btn">
                    <button type="button" id="back" style="margin-right:5px;">Back</button>
                    <button type="submit" style="margin-right:5px;">Order Confirm</button>
                    <button type="button" id="close-final-process">X</button>
                </div>
            </form>
        `;
    
        document.getElementById('close-final-process').addEventListener('click', function() {
            finalProcess.style.display = 'none';
        });
    
        document.getElementById('back').addEventListener('click', function() {
            finalProcess.style.display = 'none';
        });
    });
    
    

    function removeItem(img) {
        const itemIndex = cart.findIndex(item => item.img === img);
        if (itemIndex !== -1) {
            cart.splice(itemIndex, 1); 
            updateCartDisplay(); 
        }
    }
    
    window.removeItem = removeItem;
    

        function addToCart(img, title, price) {
        const existingItem = cart.find(item => item.img === img);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ img, title, price, quantity: 1 });
        }
        updateCartDisplay();
        }

        window.addToCart = addToCart;

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

        window.changeQuantity = changeQuantity; 

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

        if (!document.getElementById('closeCart')) {
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

            closeButton.addEventListener('click', function() {
                cartList.style.display = 'none';
            });

            cartList.appendChild(closeButton);
        }
        }
        });

        updateCartDisplay(); 
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
        const overlay = document.createElement('div');
        overlay.classList.add('overlay');
        overlay.onclick = closeCatagories;

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

