document.addEventListener('DOMContentLoaded', () => {
    // seguridad
    const userRole = sessionStorage.getItem('userRole');
    if (userRole !== 'administrador') {
        alert('Acceso denegado. Debes ser administrador para ver esta página.');
        window.location.href = 'subli_home.html';
        return;
    }

    // logica crear producto
    const createProductForm = document.getElementById('create-product-form');
    if (createProductForm) {
        createProductForm.addEventListener('submit', (event) => {
            event.preventDefault();
            
            const code = document.getElementById('product-code');
            const name = document.getElementById('product-name');
            const description = document.getElementById('product-description');
            const price = document.getElementById('product-price');
            const stock = document.getElementById('product-stock');
            const stockCritical = document.getElementById('product-stock-critical');
            const category = document.getElementById('product-category');
            const image = document.getElementById('product-image');

            document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
            let isValid = true;
            if (code.value.trim().length < 3) {
                document.getElementById('error-code').textContent = 'El código es requerido (mín. 3 caracteres).'; isValid = false;
            }
            if (name.value.trim() === '' || name.value.length > 100) {
                document.getElementById('error-name').textContent = 'El nombre es requerido (máx. 100 caracteres).'; isValid = false;
            }
            if (description.value.length > 500) {
                document.getElementById('error-description').textContent = 'La descripción no puede exceder los 500 caracteres.'; isValid = false;
            }
            if (price.value === '' || parseFloat(price.value) < 0) {
                document.getElementById('error-price').textContent = 'El precio es requerido y no puede ser negativo.'; isValid = false;
            }
            if (stock.value === '' || parseInt(stock.value) < 0 || !Number.isInteger(parseFloat(stock.value))) {
                document.getElementById('error-stock').textContent = 'El stock es requerido y debe ser un número entero no negativo.'; isValid = false;
            }
            if (stockCritical.value !== '' && (parseInt(stockCritical.value) < 0 || !Number.isInteger(parseFloat(stockCritical.value)))) {
                document.getElementById('error-stock-critical').textContent = 'El stock crítico debe ser un número entero no negativo.'; isValid = false;
            }
            if (category.value === '') {
                document.getElementById('error-category').textContent = 'Debe seleccionar una categoría.'; isValid = false;
            }
            
            if (!isValid) return;

            const products = JSON.parse(localStorage.getItem('productos')) || [];
            
            const newProduct = {
                id: Date.now(),
                code: code.value, nombre: name.value, description: description.value,
                precio: parseFloat(price.value), stock: parseInt(stock.value),
                stockCritical: stockCritical.value ? parseInt(stockCritical.value) : null,
                categoria: category.value, imagen: image.value || 'images/placeholder.png'
            };

            products.push(newProduct);
            localStorage.setItem('productos', JSON.stringify(products));

            alert('¡Producto creado con éxito!');
            window.location.href = 'admin_listar_productos.html';
        });
    }

    // logica listar producto
    const productListBody = document.getElementById('product-list-body');
    if (productListBody) {
        function renderTable() {
            const products = JSON.parse(localStorage.getItem('productos')) || [];
            productListBody.innerHTML = '';
            if (products.length === 0) {
                productListBody.innerHTML = '<tr><td colspan="6">No hay productos. Visita primero la tienda para cargar el catálogo.</td></tr>';
            } else {
                products.forEach(product => {
                    const row = document.createElement('tr');
                    if (product.stockCritical !== null && product.stock <= product.stockCritical) {
                        row.classList.add('low-stock-warning');
                    }
                    row.innerHTML = `
                        <td>${product.code}</td>
                        <td>${product.nombre}</td>
                        <td>$${product.precio.toLocaleString('es-CL')}</td>
                        <td>${product.stock}</td>
                        <td>${product.categoria}</td>
                        <td>
                            <button class="action-btn delete-btn" data-id="${product.id}">Eliminar</button>
                        </td>
                    `;
                    productListBody.appendChild(row);
                });
            }
        }

        productListBody.addEventListener('click', (event) => {
            if (event.target.classList.contains('delete-btn')) {
                const productId = parseInt(event.target.getAttribute('data-id'));
                const isConfirmed = confirm('¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.');
                if (isConfirmed) {
                    let products = JSON.parse(localStorage.getItem('productos')) || [];
                    products = products.filter(product => product.id !== productId);
                    localStorage.setItem('productos', JSON.stringify(products));
                    renderTable(); 
                }
            }
        });

        renderTable();
    }
});