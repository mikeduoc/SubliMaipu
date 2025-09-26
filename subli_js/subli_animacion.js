// funcion mensaje exito
function mostrarMensajeExito(mensaje) {
    const divMensaje = document.createElement('div');
    divMensaje.className = 'success-toast';
    divMensaje.textContent = mensaje;
    document.body.appendChild(divMensaje);
    setTimeout(() => { divMensaje.classList.add('show'); }, 10);
    setTimeout(() => {
        divMensaje.classList.remove('show');
        setTimeout(() => { document.body.removeChild(divMensaje); }, 500);
    }, 3000);
}

// funcion actualizar menu navegacion
function actualizarMenu() {
    const menuUsuario = document.querySelector('.menu-usuario');
    if (!menuUsuario) return;
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const userRole = sessionStorage.getItem('userRole');
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);

    if (isLoggedIn === 'true') {
        const username = sessionStorage.getItem('username') || 'Mi Cuenta';
        const displayName = username.charAt(0).toUpperCase() + username.slice(1);
        let menuHTML = `<a href="#">${displayName}</a>`;
        if (userRole === 'administrador') {
            menuHTML += `<a href="admin_listar_productos.html" style="width: auto;">Admin Panel</a>`;
        }
        menuHTML += `
            <a href="#" id="logout-btn" style="width: auto;">Cerrar Sesión</a>
            <a href="carrito.html" class="cart-icon">🛒 Carrito (<span id="cart-count">${totalItems}</span>)</a>`;
        menuUsuario.innerHTML = menuHTML;
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (event) => {
                event.preventDefault();
                sessionStorage.clear();
                mostrarMensajeExito('Has cerrado la sesión.');
                setTimeout(() => window.location.href = 'iniciar_sesion.html', 1000);
            });
        }
    } else {
        menuUsuario.innerHTML = `
            <a href="iniciar_sesion.html">Iniciar Sesión</a>
            <a href="registro.html">Registrar Usuario</a>
            <a href="carrito.html" class="cart-icon">🛒 Carrito (<span id="cart-count">${totalItems}</span>)</a>`;
    }
}

// funcion contador carrito
function actualizarContadorCarrito() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        cartCount.textContent = totalItems;
    }
}

// funcion carga producto
function inicializarProductos() {
    const productosEnBodega = JSON.parse(localStorage.getItem('productos'));
    if (!productosEnBodega) {
        console.log("Creando bodega de productos por primera vez...");
        const productosIniciales = [
            { id: 1, code: 'TAZ-001', nombre: "Tazón Mágico", precio: 8000, imagen: "images/tazones1.jpg", categoria: "tazones", stock: 15, stockCritical: 5, description: '' },
            { id: 2, code: 'TAZ-002', nombre: "Tazón Clásico", precio: 8000, imagen: "images/tazones2.jpg", categoria: "tazones", stock: 20, stockCritical: 5, description: '' },
            { id: 3, code: 'TAZ-003', nombre: "Tazón con Asa", precio: 8000, imagen: "images/tazones3.jpg", categoria: "tazones", stock: 10, stockCritical: 5, description: '' },
            { id: 4, code: 'LLA-001', nombre: "Llavero de Acrílico", precio: 4000, imagen: "images/llaveros1.jpg", categoria: "llaveros", stock: 30, stockCritical: 10, description: '' },
            { id: 5, code: 'LLA-002', nombre: "Llavero Metálico", precio: 4000, imagen: "images/llaveros2.jpg", categoria: "llaveros", stock: 25, stockCritical: 10, description: '' },
            { id: 6, code: 'LLA-003', nombre: "Llavero Polímero", precio: 4000, imagen: "images/llaveros3.jpg", categoria: "llaveros", stock: 0, stockCritical: 10, description: '' },
            { id: 7, code: 'ROC-001', nombre: "Roca Fotográfica 1", precio: 12000, imagen: "images/rocafoto1.jpg", categoria: "rocas", stock: 8, stockCritical: 3, description: '' },
            { id: 8, code: 'ROC-002', nombre: "Roca Fotográfica 2", precio: 12000, imagen: "images/rocafoto2.jpg", categoria: "rocas", stock: 7, stockCritical: 3, description: '' },
            { id: 9, code: 'ROC-003', nombre: "Roca Fotográfica 3", precio: 12000, imagen: "images/rocafoto3.jpg", categoria: "rocas", stock: 5, stockCritical: 3, description: '' }
        ];
        localStorage.setItem('productos', JSON.stringify(productosIniciales));
    }
}

// funcion carga inicializacion usuario
function inicializarUsuarios() {
    const usuariosEnSistema = JSON.parse(localStorage.getItem('usuarios'));
    if (!usuariosEnSistema) {
        console.log("Creando lista de usuarios iniciales...");
        const usuariosIniciales = [
            { run: '1-9', nombre: 'Admin', email: 'admin@sublimaipu.cl', direccion: 'Admin', password: 'admin', role: 'administrador' },
            { run: '2-7', nombre: 'Vendedor', email: 'vendedor@sublimaipu.cl', direccion: 'Vendedor', password: 'vendedor', role: 'vendedor' },
            { run: '3-5', nombre: 'Cliente', email: 'cliente@gmail.com', direccion: 'Cliente', password: 'cliente', role: 'cliente' }
        ];
        localStorage.setItem('usuarios', JSON.stringify(usuariosIniciales));
    }
}


// logica principal
document.addEventListener('DOMContentLoaded', () => {
    actualizarMenu();
    inicializarProductos(); 
    inicializarUsuarios(); 

    // logica inicio sesion
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', event => {
            event.preventDefault();
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const errorElement = document.getElementById('login-error');
            errorElement.textContent = '';
            let esValido = true;

            const dominiosPermitidos = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com', '@sublimaipu.cl'];
            if (emailInput.value.trim() === '' || !dominiosPermitidos.some(d => emailInput.value.endsWith(d))) {
                errorElement.textContent = 'El formato o dominio del correo no es válido.'; esValido = false;
            }
            if (esValido && (passwordInput.value.length < 4 || passwordInput.value.length > 10)) {
                errorElement.textContent = 'La contraseña debe tener entre 4 y 10 caracteres.'; esValido = false;
            }

            if (esValido) {
                const users = JSON.parse(localStorage.getItem('usuarios')) || [];
                const foundUser = users.find(user => user.email === emailInput.value.trim() && user.password === passwordInput.value);
                if (foundUser) {
                    const username = foundUser.nombre.split(' ')[0];
                    sessionStorage.setItem('isLoggedIn', 'true');
                    sessionStorage.setItem('username', username);
                    sessionStorage.setItem('userRole', foundUser.role);
                    mostrarMensajeExito(`¡Bienvenido, ${username}!`);
                    if (foundUser.role === 'administrador') {
                        setTimeout(() => { window.location.href = 'admin_listar_productos.html'; }, 1500);
                    } else {
                        setTimeout(() => { window.location.href = 'index.html'; }, 1500);
                    }
                } else {
                    errorElement.textContent = 'Correo o contraseña incorrectos.';
                }
            }
        });
    }

    // logica registro
    const registroForm = document.getElementById('registro-form');
    if (registroForm) {
        registroForm.addEventListener('submit', event => {
            event.preventDefault();
            const runInput = document.getElementById('run');
            const nombreInput = document.getElementById('nombre');
            const emailInput = document.getElementById('email');
            const direccionInput = document.getElementById('direccion');
            const passwordInput = document.getElementById('password');
            const confirmPasswordInput = document.getElementById('confirm-password');
            const errorElement = document.getElementById('registro-error');
            errorElement.textContent = '';
            let isValid = true;

            if (runInput.value.length < 9) {
                errorElement.textContent = 'El RUN debe tener al menos 9 caracteres.'; isValid = false;
            }
            if (isValid && (nombreInput.value.trim() === '' || nombreInput.value.length > 50)) {
                errorElement.textContent = 'El nombre es requerido (máx. 50 caracteres).'; isValid = false;
            }
            const dominiosPermitidos = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
            if (isValid && !dominiosPermitidos.some(d => emailInput.value.endsWith(d))) {
                errorElement.textContent = 'El dominio del correo no es válido.'; isValid = false;
            }
            if (isValid && (direccionInput.value.trim() === '' || direccionInput.value.length > 300)) {
                errorElement.textContent = 'La dirección es requerida (máx. 300 caracteres).'; isValid = false;
            }
            if (isValid && (passwordInput.value.length < 4 || passwordInput.value.length > 10)) {
                errorElement.textContent = 'La contraseña debe tener entre 4 y 10 caracteres.'; isValid = false;
            }
            if (isValid && passwordInput.value !== confirmPasswordInput.value) {
                errorElement.textContent = 'Las contraseñas no coinciden.'; isValid = false;
            }

            if (isValid) {
                const users = JSON.parse(localStorage.getItem('usuarios')) || [];
                const userExists = users.some(user => user.email === emailInput.value || user.run === runInput.value);
                if (userExists) {
                    errorElement.textContent = 'El correo o RUN ya están registrados.';
                } else {
                    const newUser = {
                        run: runInput.value, nombre: nombreInput.value, email: emailInput.value,
                        direccion: direccionInput.value, password: passwordInput.value, role: 'cliente'
                    };
                    users.push(newUser);
                    localStorage.setItem('usuarios', JSON.stringify(users));
                    mostrarMensajeExito('¡Registro exitoso! Ahora puedes iniciar sesión.');
                    setTimeout(() => { window.location.href = 'iniciar_sesion.html'; }, 2000);
                }
            }
        });
    }

    // logica recuperacion
    const recuperarForm = document.getElementById('recuperar-form');
    if (recuperarForm) {
        recuperarForm.addEventListener('submit', event => {
            event.preventDefault();
            const emailInput = document.getElementById('email');
            const errorElement = document.getElementById('email-error');
            errorElement.textContent = '';
            const dominiosPermitidos = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com', '@sublimaipu.cl'];
            if (emailInput.value.trim() === '' || !dominiosPermitidos.some(d => emailInput.value.endsWith(d))) {
                errorElement.textContent = 'Por favor, ingresa un correo válido.';
            } else {
                mostrarMensajeExito('Si tu correo está registrado, recibirás las instrucciones.');
                recuperarForm.reset();
            }
        });
    }

// logica contacto
const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const nombre = document.getElementById('nombre');
            const correo = document.getElementById('email');
            const comentario = document.getElementById('comentario');
            const errorContainer = document.getElementById('contact-error');
            if (!nombre || !correo || !comentario || !errorContainer) {
                console.error("Error crítico: Faltan elementos en el form de contacto.");
                return;
            }
            errorContainer.textContent = '';
            let esValido = true;
            if (nombre.value.trim() === '' || nombre.value.length > 100) {
                errorContainer.textContent = "Nombre requerido (máx. 100 caracteres)."; esValido = false;
            }
            const dominiosPermitidos = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
            if (esValido && (correo.value.trim() === '' || correo.value.length > 100 || !dominiosPermitidos.some(d => correo.value.endsWith(d)))) {
                errorContainer.textContent = "Correo de dominio permitido requerido (máx. 100 caracteres)."; esValido = false;
            }
            if (esValido && (comentario.value.trim() === '' || comentario.value.length > 500)) {
                errorContainer.textContent = "Comentario requerido (máx. 500 caracteres)."; esValido = false;
            }
            if (esValido) {
                const form = event.target;
                const data = new FormData(form);
                fetch(form.action, {
                    method: form.method,
                    body: data,
                    headers: { 'Accept': 'application/json' }
                }).then(response => {
                    if (response.ok) {
                        mostrarMensajeExito("¡Mensaje enviado con éxito! Gracias.");
                        form.reset();
                    } else {
                        response.json().then(data => {
                            errorContainer.textContent = data.errors ? data.errors.map(e => e.message).join(", ") : "Oops! Hubo un problema al enviar.";
                        });
                    }
                }).catch(error => {
                    errorContainer.textContent = "Oops! Hubo un problema de conexión.";
                });
            }
        });
    }

    // lgica listar y gestionar producto
    const productos = JSON.parse(localStorage.getItem('productos')) || [];
    const contenedorTazones = document.getElementById('productos-tazones');
    const contenedorLlaveros = document.getElementById('productos-llaveros');
    const contenedorRocas = document.getElementById('productos-rocas');

    function crearProductoHTML(producto) {
        const botonComprarHTML = producto.stock > 0
            ? `<button class="add-to-cart-btn btn-3" data-id="${producto.id}">Añadir al Carrito</button>`
            : `<button class="btn-3 disabled" disabled>Sin Stock</button>`;
        return `
            <div class="swiper-slide">
                <div class="product">
                    <div class="product-img">
                        <h4>Nuevo</h4>
                        <img src="${producto.imagen}" alt="${producto.nombre}">
                    </div>
                    <div class="product-txt">
                        <h4>${producto.nombre}</h4>
                        <p>Calidad Premium</p>
                        <span class="price">$${producto.precio.toLocaleString('es-CL')}</span>
                        ${botonComprarHTML}
                    </div>
                </div>
            </div>`;
    }

    if (contenedorTazones) productos.filter(p => p.categoria === 'tazones').forEach(p => { contenedorTazones.innerHTML += crearProductoHTML(p); });
    if (contenedorLlaveros) productos.filter(p => p.categoria === 'llaveros').forEach(p => { contenedorLlaveros.innerHTML += crearProductoHTML(p); });
    if (contenedorRocas) productos.filter(p => p.categoria === 'rocas').forEach(p => { contenedorRocas.innerHTML += crearProductoHTML(p); });

    const mainProductsContainer = document.querySelector('main.products');
    if (mainProductsContainer) {
        mainProductsContainer.addEventListener('click', function(e) {
            if (e.target.classList.contains('add-to-cart-btn')) {
                const productoId = parseInt(e.target.getAttribute('data-id'));
                const productoSeleccionado = productos.find(p => p.id === productoId);
                let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
                const productoEnCarrito = carrito.find(p => p.id === productoId);
                if (productoEnCarrito) productoEnCarrito.cantidad++;
                else carrito.push({ ...productoSeleccionado, cantidad: 1 });
                localStorage.setItem('carrito', JSON.stringify(carrito));
                mostrarMensajeExito(`'${productoSeleccionado.nombre}' añadido al carrito.`);
                actualizarContadorCarrito();
            }
        });
    }
    
    // logica de carrito
    const cartContainer = document.getElementById('cart-items-container');
    if (cartContainer) {
        const cartSummary = document.getElementById('cart-summary');
        const emptyCartMessage = document.getElementById('empty-cart-message');
        const cartTotalPriceEl = document.getElementById('cart-total-price');
        const clearCartBtn = document.getElementById('clear-cart-btn');
        const checkoutBtn = document.getElementById('checkout-btn');
        function renderizarCarrito() {
            const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
            cartContainer.innerHTML = '';
            if (carrito.length === 0) {
                emptyCartMessage.style.display = 'block';
                cartSummary.style.display = 'none';
            } else {
                emptyCartMessage.style.display = 'none';
                cartSummary.style.display = 'block';
                let precioTotal = 0;
                carrito.forEach(producto => {
                    const itemHTML = `
                        <div class="cart-item">
                            <img src="${producto.imagen}" alt="${producto.nombre}">
                            <div class="item-details">
                                <h4>${producto.nombre}</h4>
                                <p>Cantidad: ${producto.cantidad}</p>
                                <span class="price">$${(producto.precio * producto.cantidad).toLocaleString('es-CL')}</span>
                            </div>
                            <button class="remove-item-btn btn-3" data-id="${producto.id}">Eliminar</button>
                        </div>
                    `;
                    cartContainer.innerHTML += itemHTML;
                    precioTotal += producto.precio * producto.cantidad;
                });
                cartTotalPriceEl.textContent = `$${precioTotal.toLocaleString('es-CL')}`;
            }
            actualizarContadorCarrito();
        }
        function eliminarDelCarrito(idProducto) {
            let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
            carrito = carrito.filter(producto => producto.id !== idProducto);
            localStorage.setItem('carrito', JSON.stringify(carrito));
            renderizarCarrito();
        }
        function vaciarCarrito() {
            localStorage.removeItem('carrito');
            renderizarCarrito();
        }
        cartContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-item-btn')) {
                eliminarDelCarrito(parseInt(e.target.getAttribute('data-id')));
            }
        });
        clearCartBtn.addEventListener('click', vaciarCarrito);
        checkoutBtn.addEventListener('click', () => {
            mostrarMensajeExito('¡Gracias por tu compra!');
            vaciarCarrito();
        });
        renderizarCarrito();
    }

    // inicializacion swiper
    if (document.querySelector(".mySwiper-1")) {
        new Swiper(".mySwiper-1", {
            slidesPerView: 1, spaceBetween: 30, loop: true,
            pagination: { el: ".swiper-pagination", clickable: true },
            navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
        });
    }
    if (document.querySelector(".mySwiper-2")) {
        new Swiper(".mySwiper-2", {
            slidesPerView: 3, spaceBetween: 20, loop: true,
            navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
            breakpoints: { 0: { slidesPerView: 1 }, 520: { slidesPerView: 2 }, 950: { slidesPerView: 3 } }
        });
    }
});
