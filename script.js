// ==============================
// VARIABLES GLOBALES
// ==============================

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let selectedProduct = {};
let selectedSize = null;
let quantity = 1;
let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Productos disponibles para búsqueda
const products = [
    { name: 'Camisa Blanca', price: 199, image: 'https://images.unsplash.com/photo-1602810316693-3667c854239a?w=500', category: 'Hombre' },
    { name: 'Pantalón Negro', price: 249, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500', category: 'Hombre' },
    { name: 'Vestido Rojo', price: 299, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500', category: 'Mujer' },
    { name: 'Chaqueta Azul', price: 349, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500', category: 'Hombre' },
    { name: 'Falda Negra', price: 179, image: 'https://images.unsplash.com/photo-1583496661160-fb5886a6aaaa?w=500', category: 'Mujer' },
    { name: 'Zapatos Deportivos', price: 299, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500', category: 'Zapatos' },
    { name: 'Blusa Rosa', price: 149, image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=500', category: 'Mujer' },
    { name: 'Jeans Azules', price: 249, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500', category: 'Hombre' },
    { name: 'Sudadera Gris', price: 199, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500', category: 'Hombre' },
    { name: 'Camiseta Negra', price: 99, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', category: 'Hombre' },
    { name: 'Pantalones Beige', price: 229, image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500', category: 'Hombre' },
    { name: 'Vestido Azul', price: 279, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500', category: 'Mujer' },
    { name: 'Chaleco Verde', price: 189, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500', category: 'Hombre' },
    { name: 'Falda Plisada', price: 169, image: 'https://images.unsplash.com/photo-1583496661160-fb5886a6aaaa?w=500', category: 'Mujer' }
];

// ==============================
// CARRITO
// ==============================

function toggleCart(event) {
    if (event) event.preventDefault();
    document.getElementById('cartModal').classList.toggle('active');
}

function addToCart(productName, price) {
    const existingItem = cart.find(item => item.name === productName);

    if (existingItem) {
        existingItem.qty++;
    } else {
        cart.push({
            id: Date.now(),
            name: productName,
            price: price,
            qty: 1
        });
    }

    updateCart();
    if (isLoggedIn && currentUser && currentUser.email === 'admin@rm.com') {
        updateDashboardStats();
    }
    document.getElementById('cartModal').classList.add('active');
}


function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
    if (isLoggedIn && currentUser && currentUser.email === 'admin@rm.com') {
        updateDashboardStats();
    }
}

function updateCart() {
     const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
        cartTotal.textContent = '$0.00';
        return;
    }

    let total = 0;
    cartItems.innerHTML = '';

    cart.forEach(item => {
        const subtotal = item.price * item.qty;
        total += subtotal;

        cartItems.innerHTML += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price} c/u</div>

                    <div class="cart-qty">
                        <button onclick="changeCartQty(${item.id}, -1)">−</button>
                        <span>${item.qty}</span>
                        <button onclick="changeCartQty(${item.id}, 1)">+</button>
                    </div>

                    <div class="cart-subtotal">
                        Subtotal: $${subtotal.toFixed(2)}
                    </div>
                </div>

                <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                    🗑️
                </button>
            </div>
        `;
    });

    cartTotal.textContent = '$' + total.toFixed(2);
}

// ==============================
// MODAL DE PRODUCTO (ESTILO IMAGEN)
// ==============================

function changeCartQty(id, value) {
    const item = cart.find(p => p.id === id);
    if (!item) return;

    item.qty += value;

    if (item.qty <= 0) {
        removeFromCart(id);
    } else {
        updateCart();
    }
}


function openProductModal(name, price, image) {
    selectedProduct = { name, price, image };
    selectedSize = null;
    quantity = 1;

    document.getElementById("modalName").innerText = name;
    document.getElementById("modalPrice").innerText = price;
    document.getElementById("modalImage").src = image;
    document.getElementById("qty").innerText = quantity;

    // Find product category
    const product = products.find(p => p.name === name);
    let sizes;
    if (product && product.category === 'Zapatos') {
        sizes = ['38 (US 7.5)', '39 (US 8)', '40 (US 8.5)', '41 (US 9)', '42 (US 9.5)', '43 (US 10)'];
    } else {
        sizes = ['S', 'M', 'L', 'XL'];
    }

    // Update size options dynamically
    const sizeOptions = document.querySelector(".size-options");
    sizeOptions.innerHTML = sizes.map(size => `<button onclick="selectSize(this)">${size}</button>`).join('');

    document.querySelectorAll(".size-options button")
        .forEach(btn => btn.classList.remove("active"));

    document.getElementById("productModal").classList.add("active");
}

function closeProductModal() {
    document.getElementById("productModal").classList.remove("active");
}

function selectSize(btn) {
    document.querySelectorAll(".size-options button")
        .forEach(b => b.classList.remove("active"));

    btn.classList.add("active");
    selectedSize = btn.innerText;
}

function changeQty(value) {
    quantity = Math.max(1, quantity + value);
    document.getElementById("qty").innerText = quantity;
}

function addProductFromModal() {
    if (!selectedSize) {
        alert("Selecciona una talla");
        return;
    }

    for (let i = 0; i < quantity; i++) {
        addToCart(
            `${selectedProduct.name} (${selectedSize})`,
            selectedProduct.price
        );
    }

    closeProductModal();
}

// ==============================
// EVENTOS GENERALES
// ==============================

// Carrito permanece abierto hasta que el usuario lo cierre manualmente

// Newsletter
document.querySelector('.newsletter-form').addEventListener('submit', e => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;

    // Simulación de envío (en producción usarías una API real)
    console.log('Newsletter subscription:', email);

    // Mostrar mensaje de éxito con animación
    const button = e.target.querySelector('button');
    const originalText = button.innerHTML;
    button.innerHTML = '<span>¡Suscrito!</span> <i class="fas fa-check"></i>';
    button.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
    button.disabled = true;

    // Resetear después de 3 segundos
    setTimeout(() => {
        button.innerHTML = originalText;
        button.style.background = '';
        button.disabled = false;
        e.target.reset();
    }, 3000);

    // Aquí podrías enviar los datos a tu servidor
    // fetch('/api/newsletter', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email })
    // });
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        e.preventDefault();
        document.querySelector(anchor.getAttribute('href'))
            ?.scrollIntoView({ behavior: 'smooth' });
    });
});

// Animaciones al hacer scroll
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.product-card, .categoria-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// ==============================
// BÚSQUEDA
// ==============================

function toggleSearch(event) {
    if (event) event.preventDefault();
    const modal = document.getElementById('searchModal');
    modal.classList.toggle('active');
    if (modal.classList.contains('active')) {
        document.getElementById('searchInput').focus();
    }
}

function filterProducts() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const resultsContainer = document.getElementById('searchResults');

    if (query === '') {
        resultsContainer.innerHTML = '<p class="no-results">Escribe algo para buscar...</p>';
        return;
    }

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(query)
    );

    if (filteredProducts.length === 0) {
        resultsContainer.innerHTML = '<p class="no-results">No se encontraron productos</p>';
        return;
    }

    resultsContainer.innerHTML = filteredProducts.map(product => `
        <div class="search-result-item" onclick="openProductModal('${product.name}', ${product.price}, '${product.image}')">
            <img src="${product.image}" alt="${product.name}">
            <div class="search-result-info">
                <h4>${product.name}</h4>
                <p>$${product.price}</p>
            </div>
        </div>
    `).join('');
}

// ==============================
// LOGIN
// ==============================

function toggleLogin(event) {
    if (event) event.preventDefault();
    const modal = document.getElementById('loginModal');
    modal.classList.toggle('active');
    if (modal.classList.contains('active')) {
        document.getElementById('email').focus();
    }
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const messageEl = document.getElementById('loginMessage');

    // Simulación de login (en producción usarías una API real)
    if (email === 'admin@rm.com' && password === 'admin123') {
        isLoggedIn = true;
        currentUser = { email: email, name: 'Admin' };
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        messageEl.textContent = '¡Inicio de sesión exitoso!';
        messageEl.style.color = 'green';

        setTimeout(() => {
            toggleLogin();
            if (currentUser.email === 'admin@rm.com') {
                showDashboard();
            }
        }, 1500);
    } else {
        messageEl.textContent = 'Credenciales incorrectas';
        messageEl.style.color = 'red';
    }
}

function switchToLogin() {
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('registerForm').classList.add('hidden');
    document.getElementById('loginTab').classList.add('active');
    document.getElementById('registerTab').classList.remove('active');
}

function switchToRegister() {
    document.getElementById('registerForm').classList.remove('hidden');
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerTab').classList.add('active');
    document.getElementById('loginTab').classList.remove('active');
}

function handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const messageEl = document.getElementById('registerMessage');

    // Validaciones
    if (password !== confirmPassword) {
        messageEl.textContent = 'Las contraseñas no coinciden';
        messageEl.style.color = 'red';
        return;
    }

    if (password.length < 6) {
        messageEl.textContent = 'La contraseña debe tener al menos 6 caracteres';
        messageEl.style.color = 'red';
        return;
    }

    // Simulación de registro (en producción usarías una API real)
    // Aquí podrías guardar los datos del usuario en localStorage o enviar a un servidor
    console.log('Registro:', { name, email, password });

    messageEl.textContent = '¡Registro exitoso! Ahora puedes iniciar sesión.';
    messageEl.style.color = 'green';

    setTimeout(() => {
        switchToLogin();
        messageEl.textContent = '';
        event.target.reset();
    }, 2000);
}

// ==============================
// CHECKOUT
// ==============================

function checkout() {
    if (!isLoggedIn) {
        alert('Debes iniciar sesión para realizar la compra');
        toggleLogin();
        return;
    }

    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }

    // Simulación de checkout
    alert(`¡Compra realizada con éxito!\nTotal: $${cart.reduce((total, item) => total + (item.price * item.qty), 0).toFixed(2)}\n\nGracias por tu compra, ${currentUser.name}!`);

    // Limpiar carrito
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
    toggleCart();
}

// ==============================
// SIDEBAR Y FILTROS
// ==============================

function toggleSidebar() {
    const sidebar = document.getElementById('categorySidebar');
    sidebar.classList.toggle('active');
}

function filterProductsByCategory() {
    const checkboxes = document.querySelectorAll('.category-filter input[type="checkbox"]:checked');
    const selectedCategories = Array.from(checkboxes).map(cb => cb.value);

    const productsGrid = document.getElementById('productsGrid');
    const allProducts = productsGrid.querySelectorAll('.product-card');

    if (selectedCategories.length === 0) {
        // Mostrar todos los productos si no hay filtros seleccionados
        allProducts.forEach(card => card.style.display = 'block');
        return;
    }

    allProducts.forEach(card => {
        const productName = card.querySelector('.product-name').textContent;
        const product = products.find(p => p.name === productName);

        if (product && selectedCategories.includes(product.category)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// ==============================
// FILTRO POR PRODUCTO DEL GRÁFICO
// ==============================

function filterByProduct(productName) {
    const product = products.find(p => p.name === productName);
    if (!product) return;

    const category = product.category;

    // Filtrar productos por categoría
    const productsGrid = document.getElementById('productsGrid');
    const allProducts = productsGrid.querySelectorAll('.product-card');

    allProducts.forEach(card => {
        const cardProductName = card.querySelector('.product-name').textContent;
        const cardProduct = products.find(p => p.name === cardProductName);

        if (cardProduct && cardProduct.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });

    // Scroll a la sección de productos
    document.getElementById('colecciones').scrollIntoView({ behavior: 'smooth' });
}

// ==============================
// ANNOUNCEMENT MODAL
// ==============================

function showAnnouncementModal() {
    document.getElementById('announcementModal').classList.add('active');
}

function closeAnnouncementModal() {
    document.getElementById('announcementModal').classList.remove('active');
}

function handleAnnouncementSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('announcementName').value;
    const email = document.getElementById('announcementEmail').value;
    const phone = document.getElementById('announcementPhone').value;
    const preferences = Array.from(document.querySelectorAll('.preferences input[type="checkbox"]:checked')).map(cb => cb.value);

    // Validaciones
    const nameRegex = /^[a-zA-Z\s]+$/;
    const phoneRegex = /^[0-9]+$/;

    if (!nameRegex.test(name)) {
        alert('El nombre solo puede contener letras y espacios.');
        return;
    }

    if (!phoneRegex.test(phone)) {
        alert('El teléfono solo puede contener números.');
        return;
    }

    if (!email.includes('@')) {
        alert('El correo electrónico debe contener el símbolo @.');
        return;
    }

    // Simulación de envío (en producción usarías una API real)
    console.log('Datos del anuncio:', { name, email, phone, preferences });
    alert('¡Gracias por suscribirte! Te mantendremos informado de nuestras novedades.');

    // Cerrar modal y resetear formulario
    closeAnnouncementModal();
    event.target.reset();
}

// ==============================
// HAMBURGER MENU
// ==============================

function toggleMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
}

// ==============================
// DASHBOARD ADMIN
// ==============================

function showDashboard() {
    document.getElementById('adminDashboard').classList.remove('hidden');
    document.body.classList.add('dashboard-mode');
    addAdminIcon();
    updateDashboardStats();
}

function logout() {
    isLoggedIn = false;
    currentUser = null;
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    document.getElementById('adminDashboard').classList.add('hidden');
    document.body.classList.remove('dashboard-mode');
    removeAdminIcon();
    // Opcional: recargar la página o redirigir
}

function addAdminIcon() {
    if (document.getElementById('adminLink')) return; // Ya existe

    const navIcons = document.querySelector('.nav-icons');
    const adminLink = document.createElement('a');
    adminLink.href = '#';
    adminLink.id = 'adminLink';
    adminLink.className = 'nav-icon';
    adminLink.onclick = scrollToDashboard;
    adminLink.title = 'Dashboard Admin';
    adminLink.innerHTML = '<i class="fas fa-tachometer-alt"></i>';
    navIcons.appendChild(adminLink);
}

function removeAdminIcon() {
    const adminLink = document.getElementById('adminLink');
    if (adminLink) {
        adminLink.remove();
    }
}

function scrollToDashboard(event) {
    event.preventDefault();
    document.getElementById('adminDashboard').scrollIntoView({ behavior: 'smooth' });
}

function updateDashboardStats() {
    // Total productos
    document.getElementById('totalProducts').textContent = products.length;

    // Ventas totales (simulado basado en carrito)
    const totalSales = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    document.getElementById('totalSales').textContent = `$${totalSales.toFixed(2)}`;

    // Usuarios registrados (simulado)
    document.getElementById('totalUsers').textContent = '1'; // Solo admin por ahora

    // Pedidos pendientes (simulado)
    document.getElementById('pendingOrders').textContent = '0';

    // Crecimiento mensual (simulado)
    document.getElementById('monthlyGrowth').textContent = '+15%';

    // Producto más vendido (simulado)
    const topProduct = products[Math.floor(Math.random() * products.length)].name;
    document.getElementById('topProduct').textContent = topProduct;

    // Inicializar gráficos y calendario
    initCharts();
    initCalendar();
}

// ==============================
// GRÁFICOS Y CALENDARIO
// ==============================

let salesChart, productsChart;
let currentCalendarDate = new Date();

function initCharts() {
    // Gráfico de ventas por mes
    const salesCtx = document.getElementById('salesChart').getContext('2d');
    const salesData = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        datasets: [{
            label: 'Ventas ($)',
            data: [1200, 1900, 3000, 5000, 2000, 3000, 4500, 6000, 3500, 4000, 5500, 7000],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    };
    salesChart = new Chart(salesCtx, {
        type: 'line',
        data: salesData,
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Gráfico de productos más vendidos
    const productsCtx = document.getElementById('productsChart').getContext('2d');
    const productsData = {
        labels: ['Camisa Blanca', 'Pantalón Negro', 'Vestido Rojo', 'Chaqueta Azul', 'Falda Negra'],
        datasets: [{
            label: 'Unidades Vendidas',
            data: [12, 19, 3, 5, 2],
            backgroundColor: [
                'rgba(255, 99, 132, 0.8)',
                'rgba(54, 162, 235, 0.8)',
                'rgba(255, 205, 86, 0.8)',
                'rgba(75, 192, 192, 0.8)',
                'rgba(153, 102, 255, 0.8)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 205, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1
        }]
    };
    productsChart = new Chart(productsCtx, {
        type: 'pie',
        data: productsData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                }
            },
            onClick: function(event, elements) {
                if (elements.length > 0) {
                    const index = elements[0].index;
                    const productName = productsData.labels[index];
                    filterByProduct(productName);
                }
            }
        }
    });
}

function initCalendar() {
    renderCalendar();
}

function renderCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    const calendarMonth = document.getElementById('calendarMonth');

    calendarGrid.innerHTML = '';

    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();

    calendarMonth.textContent = `${getMonthName(month)} ${year}`;

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    for (let i = 0; i < 42; i++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';

        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);

        if (currentDate.getMonth() !== month) {
            dayElement.classList.add('empty');
            dayElement.textContent = '';
        } else {
            dayElement.textContent = currentDate.getDate();

            // Simular días de alta, media y baja venta
            const salesLevel = Math.random();
            if (salesLevel > 0.7) {
                dayElement.classList.add('high-sales');
                dayElement.title = 'Alto volumen de ventas';
            } else if (salesLevel > 0.4) {
                dayElement.classList.add('medium-sales');
                dayElement.title = 'Volumen medio de ventas';
            } else {
                dayElement.classList.add('low-sales');
                dayElement.title = 'Bajo volumen de ventas';
            }
        }

        calendarGrid.appendChild(dayElement);
    }
}

function getMonthName(month) {
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return months[month];
}

function prevMonth() {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
    renderCalendar();
}

function nextMonth() {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
    renderCalendar();
}

// Verificar si admin está logueado al cargar
if (isLoggedIn && currentUser && currentUser.email === 'admin@rm.com') {
    showDashboard();
}

// ==============================
// HEADER DINÁMICO POR SECCIÓN
// ==============================

function initDynamicHeader() {
    const header = document.querySelector('header');
    const sections = [
        { element: document.querySelector('.hero'), className: 'header-white' },
        { element: document.querySelector('#colecciones'), className: null }, // normal
        { element: document.querySelector('.newsletter'), className: 'header-dark' }
    ];

    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px', // Trigger when section is in the middle
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove all header classes
                header.classList.remove('header-white', 'header-dark');
                // Add the specific class for this section
                const section = sections.find(s => s.element === entry.target);
                if (section && section.className) {
                    header.classList.add(section.className);
                }
            }
        });
    }, observerOptions);

    // Observe each section
    sections.forEach(section => {
        if (section.element) {
            observer.observe(section.element);
        }
    });
}

// ==============================
// INICIALIZACIÓN
// ==============================

// Actualizar carrito al cargar la página y mostrar modal de anuncio
document.addEventListener('DOMContentLoaded', () => {
    updateCart();
    showAnnouncementModal();
    initDynamicHeader();

    // Hamburger menu functionality
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', toggleMenu);
    }
});
