const barmenu = document.querySelector('.nav-bar');
let navbars = document.querySelector('#menu-bar');
let header3 = document.querySelector('.header-3');
let scrollTop = document.querySelector('.scroll-top');
let cart = document.querySelector('.cart-items-container'); // Move this line here

document.querySelector("#menu-bar").onclick = () => {
    navbars.classList.toggle('fa-times');
    barmenu.classList.toggle('active');
    cart.classList.remove('active'); // Now `cart` is defined
};

/*
barmenu.addEventListener('click',()=>{
    navbars.classList.toggle('fa-times');
    barmenu.classList.toggle('active');
})
*/

window.onscroll = () => {

    navbars.classList.remove('fa-times');
    barmenu.classList.remove('active');
    if (window.scrollY > 250) {
        header3.classList.add('active');
    } else {
        header3.classList.remove('active');
    }
    if (window.scrollY > 250) {
        scrollTop.style.display = 'initial';
    } else {
        scrollTop.style.display = 'none';
    }

}
window.onload = () => {
    cart.classList.remove('active');
    userlogin.classList.remove('active');
    navbars.classList.remove('fa-times');
    barmenu.classList.remove('active');
}
const userlogin = document.querySelector('.login-form-container');
document.querySelector('#login-btn ').onclick = () => {
    userlogin.classList.toggle('active');
    navbars.classList.remove('fa-times');
    barmenu.classList.remove('active');
    cart.classList.remove('active');
}
const closeLogin = document.querySelector('.login-form-container');
document.querySelector('#close-login-btn').onclick = () => {
    closeLogin.classList.remove('active');

}

let swiper = new Swiper(".home-slider", {

    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    loop: true,
});
let countDate = new Date('june 1, 2023 00:00:00').getTime();

function countDown() {

    let now = new Date().getTime();

    gap = countDate - now;

    let second = 1000;
    let minute = second * 60;
    let hour = minute * 60;
    let day = hour * 24;

    let d = Math.floor(gap / (day));
    let h = Math.floor((gap % (day)) / (hour));
    let m = Math.floor((gap % (hour)) / (minute));
    let s = Math.floor((gap % (minute)) / (second));

    document.getElementById('day').innerText = d;
    document.getElementById('hour').innerText = h;
    document.getElementById('minute').innerText = m;
    document.getElementById('second').innerText = s;

}

setInterval(function() {
    countDown();
}, 1000)

// Cart and Wishlist functionality for GREENISH
document.addEventListener('DOMContentLoaded', function() {
    // State management
    const state = {
        cart: JSON.parse(localStorage.getItem('greenish-cart')) || [],
        wishlist: JSON.parse(localStorage.getItem('greenish-wishlist')) || [],
        isCartOpen: false,
        isWishlistOpen: false
    };

    // DOM elements
    const cartBtn = document.getElementById('cart-btn');
    const wishlistBtn = document.querySelector('.icons .fa-heart');
    const cartContainer = document.querySelector('.cart-items-container');
    const checkoutBtn = document.querySelector('.cart-items-container .btn');
    const heartBtns = document.querySelectorAll('.icons .fa-heart, .fas.fa-heart');
    const addToCartBtns = document.querySelectorAll('.box .btn');
    
    // Create wishlist container
    createWishlistContainer();

    // Add necessary CSS for cart container
    addCartStyles();

    // Initialize badges
    updateCartBadge();
    updateWishlistBadge();

    // Show/hide cart on click
    cartBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (state.isWishlistOpen) {
            toggleWishlistContainer();
        }
        toggleCartContainer();
    });

    // Show/hide wishlist on click
    wishlistBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (state.isCartOpen) {
            toggleCartContainer();
        }
        toggleWishlistContainer();
    });

    // Add event listeners to "Add to cart" buttons
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const productBox = this.closest('.box');
            const product = {
                id: Date.now().toString(),
                name: productBox.querySelector('h3').textContent,
                price: productBox.querySelector('.price').textContent.split('<span>')[0].trim(),
                fullPrice: productBox.querySelector('.price span')?.textContent.trim(),
                quantity: parseInt(productBox.querySelector('.quantify input').value) || 1,
                image: productBox.querySelector('img').src
            };
            addToCart(product);
        });
    });

    // Add event listeners to heart buttons for wishlist
    heartBtns.forEach(btn => {
        if (btn === wishlistBtn) return; // Skip the main wishlist button
        
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const productBox = this.closest('.box');
            if (!productBox) return;
            
            const product = {
                id: Date.now().toString(),
                name: productBox.querySelector('h3').textContent,
                price: productBox.querySelector('.price').textContent.split('<span>')[0].trim(),
                fullPrice: productBox.querySelector('.price span')?.textContent.trim(),
                image: productBox.querySelector('img').src
            };
            toggleWishlist(product);
            this.classList.toggle('active');
        });
    });

    // Listen for checkout button
    checkoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (state.cart.length === 0) {
            showNotification('Your cart is empty!');
            return;
        }
        showNotification('Proceeding to checkout...');
        // Here you would typically redirect to a checkout page
    });

    // Event delegation for cart item removal
    cartContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('fa-times')) {
            const cartItem = e.target.closest('.cart-item');
            const itemId = cartItem.dataset.id;
            removeFromCart(itemId);
        }
    });

    // Event delegation for wishlist
    const wishlistContainer = document.querySelector('.wishlist-items-container');
    wishlistContainer.addEventListener('click', function(e) {
        const wishlistItem = e.target.closest('.wishlist-item');
        if (!wishlistItem) return;
        
        // Handle remove button
        if (e.target.classList.contains('fa-times')) {
            const itemId = wishlistItem.dataset.id;
            removeFromWishlist(itemId);
        }
        
        // Handle "Add to cart" button
        if (e.target.classList.contains('add-to-cart')) {
            const itemId = wishlistItem.dataset.id;
            const item = state.wishlist.find(i => i.id === itemId);
            if (item) {
                const cartItem = {...item, quantity: 1};
                addToCart(cartItem);
            }
        }
    });

    // Close containers when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.cart-items-container') && 
            !e.target.closest('#cart-btn') &&
            state.isCartOpen) {
            toggleCartContainer();
        }
        
        if (!e.target.closest('.wishlist-items-container') && 
            !e.target.closest('.icons .fa-heart') &&
            state.isWishlistOpen) {
            toggleWishlistContainer();
        }
    });

    // Functions
    function addCartStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .cart-items-container {
                position: fixed;
                top: 0;
                right: -110%;
                width: 350px;
                height: 100vh;
                background: #fff;
                z-index: 1000;
                padding: 20px;
                box-shadow: 0 0 10px rgba(0,0,0,0.2);
                overflow-y: auto;
                transition: right 0.4s ease;
            }
            .cart-items-container.active {
                right: 0;
            }
            .cart-items-container .cart-item {
                position: relative;
                display: flex;
                align-items: center;
                gap: 1.5rem;
                padding: 1.5rem 0;
                border-bottom: 1px solid #eee;
            }
            .cart-items-container .cart-item .fa-times {
                position: absolute;
                top: 1rem;
                right: 1rem;
                font-size: 1.5rem;
                color: #999;
                cursor: pointer;
            }
            .cart-items-container .cart-item img {
                height: 7rem;
                width: 7rem;
                object-fit: cover;
            }
            .cart-items-container .cart-item .content h3 {
                font-size: 1.7rem;
                color: #333;
            }
            .cart-items-container .cart-item .content .price {
                font-size: 1.5rem;
                color: #71eb39;
            }
            .cart-items-container .btn {
                width: 100%;
                text-align: center;
                margin-top: 2rem;
            }
        `;
        document.head.appendChild(style);
    }

    function createWishlistContainer() {
        const wishlistContainer = document.createElement('div');
        wishlistContainer.className = 'wishlist-items-container';
        wishlistContainer.innerHTML = `
            <h3>My Wishlist</h3>
            <div class="wishlist-items"></div>
        `;
        
        // Add CSS for wishlist container
        const style = document.createElement('style');
        style.textContent = `
            .wishlist-items-container {
                position: fixed;
                top: 0;
                right: -110%;
                width: 350px;
                height: 100vh;
                background: #fff;
                z-index: 1000;
                padding: 20px;
                box-shadow: 0 0 10px rgba(0,0,0,0.2);
                overflow-y: auto;
                transition: right 0.4s ease;
            }
            .wishlist-items-container.active {
                right: 0;
            }
            .wishlist-items-container h3 {
                text-align: center;
                font-size: 2rem;
                color: #333;
                margin-bottom: 2rem;
                border-bottom: 1px solid #ddd;
                padding-bottom: 1rem;
            }
            .wishlist-item {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem 0;
                border-bottom: 1px solid #eee;
                position: relative;
            }
            .wishlist-item img {
                height: 5rem;
                width: 5rem;
                object-fit: cover;
            }
            .wishlist-item .content h3 {
                font-size: 1.5rem;
                color: #333;
                border: none;
                margin: 0;
                padding: 0;
                text-align: left;
            }
            .wishlist-item .content .price {
                font-size: 1.2rem;
                color: #71eb39;
            }
            .wishlist-item .fas.fa-times {
                position: absolute;
                top: 1rem;
                right: 1rem;
                font-size: 1.5rem;
                color: #999;
                cursor: pointer;
            }
            .wishlist-item .fas.fa-times:hover {
                color: #333;
            }
            .wishlist-item .add-to-cart {
                display: inline-block;
                margin-top: 0.5rem;
                padding: 0.3rem 0.8rem;
                background: #71eb39;
                color: #fff;
                border-radius: 3px;
                cursor: pointer;
                font-size: 0.9rem;
            }
            .wishlist-item .add-to-cart:hover {
                background: #5dc92e;
            }
            .wishlist-count-badge, .cart-count-badge {
                position: absolute;
                top: -5px;
                right: -5px;
                background-color: #71eb39;
                color: white;
                border-radius: 50%;
                width: 18px;
                height: 18px;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 12px;
            }
            .cart-notification {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background-color: #71eb39;
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.5s ease;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(wishlistContainer);
    }

    function addToCart(product) {
        const existingProductIndex = state.cart.findIndex(item => 
            item.name === product.name && item.price === product.price);
        
        if (existingProductIndex > -1) {
            state.cart[existingProductIndex].quantity += product.quantity;
        } else {
            state.cart.push(product);
        }
        
        saveCart();
        renderCart();
        updateCartBadge();
        showNotification(`Added ${product.name} to your cart!`);
        
        // Automatically show cart when adding items
        if (!state.isCartOpen) {
            toggleCartContainer();
        }
    }

    function removeFromCart(id) {
        state.cart = state.cart.filter(item => item.id !== id);
        saveCart();
        renderCart();
        updateCartBadge();
        showNotification('Item removed from cart');
    }

    function toggleWishlist(product) {
        const existingProductIndex = state.wishlist.findIndex(item => 
            item.name === product.name && item.price === product.price);
        
        if (existingProductIndex > -1) {
            state.wishlist.splice(existingProductIndex, 1);
            showNotification(`Removed ${product.name} from wishlist`);
        } else {
            state.wishlist.push(product);
            showNotification(`Added ${product.name} to wishlist!`);
        }
        
        saveWishlist();
        renderWishlist();
        updateWishlistBadge();
    }

    function removeFromWishlist(id) {
        const item = state.wishlist.find(item => item.id === id);
        state.wishlist = state.wishlist.filter(item => item.id !== id);
        saveWishlist();
        renderWishlist();
        updateWishlistBadge();
        showNotification(`Removed ${item?.name || 'item'} from wishlist`);
    }

    function renderCart() {
        // Clear cart items
        const cartItems = cartContainer.querySelectorAll('.cart-item');
        cartItems.forEach(item => item.remove());
        
        // Handle empty cart
        if (state.cart.length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.style.textAlign = 'center';
            emptyMessage.style.padding = '2rem 0';
            emptyMessage.textContent = 'Your cart is empty';
            checkoutBtn.insertAdjacentElement('beforebegin', emptyMessage);
            checkoutBtn.textContent = 'Continue Shopping';
            return;
        }
        
        // Add all cart items
        let total = 0;
        state.cart.forEach(item => {
            const price = parseFloat(item.price.replace('$', ''));
            total += price * item.quantity;
            
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.dataset.id = item.id;
            cartItem.innerHTML = `
                <span class="fas fa-times"></span>
                <img src="${item.image}" alt="${item.name}">
                <div class="content">
                    <h3>${item.name}</h3>
                    <div class="price">${item.price} × ${item.quantity}</div>
                </div>
            `;
            checkoutBtn.insertAdjacentElement('beforebegin', cartItem);
        });
        
        // Update checkout button text with total
        checkoutBtn.textContent = `Checkout now ($${total.toFixed(2)})`;
    }

    function renderWishlist() {
        const wishlistItems = document.querySelector('.wishlist-items');
        wishlistItems.innerHTML = '';
        
        if (state.wishlist.length === 0) {
            wishlistItems.innerHTML = '<p style="text-align: center; padding: 2rem 0;">Your wishlist is empty</p>';
            return;
        }
        
        state.wishlist.forEach(item => {
            const wishlistItem = document.createElement('div');
            wishlistItem.classList.add('wishlist-item');
            wishlistItem.dataset.id = item.id;
            wishlistItem.innerHTML = `
                <span class="fas fa-times"></span>
                <img src="${item.image}" alt="${item.name}">
                <div class="content">
                    <h3>${item.name}</h3>
                    <div class="price">${item.price}</div>
                    <div class="add-to-cart">Add to Cart</div>
                </div>
            `;
            wishlistItems.appendChild(wishlistItem);
        });
    }

    function updateCartBadge() {
        // Remove existing badge
        const existingBadge = document.querySelector('.cart-count-badge');
        if (existingBadge) existingBadge.remove();
        
        // Add new badge if cart has items
        if (state.cart.length > 0) {
            const cartCount = state.cart.reduce((acc, item) => acc + item.quantity, 0);
            const badge = document.createElement('span');
            badge.classList.add('cart-count-badge');
            badge.textContent = cartCount;
            cartBtn.style.position = 'relative';
            cartBtn.appendChild(badge);
        }
    }

    function updateWishlistBadge() {
        // Remove existing badge
        const existingBadge = document.querySelector('.wishlist-count-badge');
        if (existingBadge) existingBadge.remove();
        
        // Add new badge if wishlist has items
        if (state.wishlist.length > 0) {
            const badge = document.createElement('span');
            badge.classList.add('wishlist-count-badge');
            badge.textContent = state.wishlist.length;
            wishlistBtn.style.position = 'relative';
            wishlistBtn.appendChild(badge);
        }
    }

    function toggleCartContainer() {
        cartContainer.classList.toggle('active');
        state.isCartOpen = !state.isCartOpen;
        renderCart();
    }

    function toggleWishlistContainer() {
        const wishlistContainer = document.querySelector('.wishlist-items-container');
        wishlistContainer.classList.toggle('active');
        state.isWishlistOpen = !state.isWishlistOpen;
        renderWishlist();
    }

    function showNotification(message) {
        // Remove any existing notification
        const existingNotification = document.querySelector('.cart-notification');
        if (existingNotification) existingNotification.remove();
        
        // Create and show notification
        const notification = document.createElement('div');
        notification.classList.add('cart-notification');
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Fade in
        setTimeout(() => notification.style.opacity = 1, 10);
        
        // Fade out and remove
        setTimeout(() => {
            notification.style.opacity = 0;
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }

    function saveCart() {
        localStorage.setItem('greenish-cart', JSON.stringify(state.cart));
    }
    
    function saveWishlist() {
        localStorage.setItem('greenish-wishlist', JSON.stringify(state.wishlist));
    }

    // Initialize cart and wishlist
    renderCart();
    renderWishlist();

    // Timer for Deal section
    initCountdownTimer();
    
    function initCountdownTimer() {
        // Set the deal end date (1 week from now)
        const dealEndDate = new Date();
        dealEndDate.setDate(dealEndDate.getDate() + 7);
        
        // Update the timer every second
        const timer = setInterval(() => {
            const now = new Date();
            const diff = dealEndDate - now;
            
            if (diff <= 0) {
                clearInterval(timer);
                document.getElementById('day').textContent = '00';
                document.getElementById('hour').textContent = '00';
                document.getElementById('minute').textContent = '00';
                document.getElementById('second').textContent = '00';
                return;
            }
            
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            document.getElementById('day').textContent = days.toString().padStart(2, '0');
            document.getElementById('hour').textContent = hours.toString().padStart(2, '0');
            document.getElementById('minute').textContent = minutes.toString().padStart(2, '0');
            document.getElementById('second').textContent = seconds.toString().padStart(2, '0');
        }, 1000);
    }
});