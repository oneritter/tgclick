// Константы для авторизации
const CORRECT_USERNAME = 'ritter';
const CORRECT_PASSWORD = 'Vbh22tcnm';

// Элементы DOM
const loginPage = document.getElementById('loginPage');
const menuPage = document.getElementById('menuPage');
const templatePage = document.getElementById('templatePage');
const flowersPage = document.getElementById('flowersPage');
const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');
const logoutBtn = document.getElementById('logoutBtn');
const createStoreLink = document.getElementById('createStoreLink');
const storeListLink = document.getElementById('storeListLink');
const backToMenuBtn = document.getElementById('backToMenuBtn');
const backToTemplateBtn = document.getElementById('backToTemplateBtn');
const templateCards = document.querySelectorAll('.template-card');
const flowersGrid = document.getElementById('flowersGrid');
const addProductBtn = document.getElementById('addProductBtn');
const addProductModal = document.getElementById('addProductModal');
const addProductForm = document.getElementById('addProductForm');
const modalClose = document.querySelector('.modal-close');
const btnCancel = document.querySelector('.btn-cancel');
const productImageInput = document.getElementById('productImage');
const imagePreview = document.getElementById('imagePreview');

// Проверка авторизации при загрузке страницы
window.addEventListener('DOMContentLoaded', () => {
    const isAuthenticated = sessionStorage.getItem('authenticated') === 'true';
    if (isAuthenticated) {
        showMenu();
    } else {
        showLogin();
    }
    
    // Инициализация превью изображения
    if (imagePreview) {
        imagePreview.classList.add('empty');
    }
    
    // Загрузка данных баннера
    loadBanner();
});

// Обработка формы авторизации
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    // Очистка предыдущих ошибок
    errorMessage.textContent = '';
    
    // Проверка учетных данных
    if (username === CORRECT_USERNAME && password === CORRECT_PASSWORD) {
        // Сохранение состояния авторизации
        sessionStorage.setItem('authenticated', 'true');
        showMenu();
    } else {
        errorMessage.textContent = 'Неверный логин или пароль';
        // Очистка поля пароля
        document.getElementById('password').value = '';
    }
});

// Выход из системы
logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('authenticated');
    showLogin();
    // Очистка формы
    loginForm.reset();
    errorMessage.textContent = '';
});

// Обработка ссылок меню
createStoreLink.addEventListener('click', (e) => {
    e.preventDefault();
    showTemplatePage();
});

storeListLink.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Функция "Список магазинов" будет реализована позже');
});

// Возврат в меню
backToMenuBtn.addEventListener('click', () => {
    showMenu();
});

// Данные товаров (хранятся в localStorage)
let flowersProducts = JSON.parse(localStorage.getItem('flowersProducts')) || [
    {
        id: 1,
        name: 'Букет роз',
        price: 2500,
        image: null,
        description: 'Красивый букет красных роз'
    },
    {
        id: 2,
        name: 'Ромашки',
        price: 1500,
        image: null,
        description: 'Свежие ромашки'
    }
];

// Обработка выбора шаблона
templateCards.forEach(card => {
    card.addEventListener('click', () => {
        const template = card.getAttribute('data-template');
        if (template === 'flowers') {
            showFlowersPage();
            renderFlowers();
        } else {
            const templateName = card.querySelector('h2').textContent;
            alert(`Шаблон "${templateName}" будет реализован позже`);
        }
    });
});

// Возврат к шаблонам
backToTemplateBtn.addEventListener('click', () => {
    showTemplatePage();
});

// Открытие модального окна
addProductBtn.addEventListener('click', () => {
    addProductModal.classList.add('active');
});

// Закрытие модального окна
if (modalClose) {
    modalClose.addEventListener('click', () => {
        closeProductModal();
    });
}

if (btnCancel) {
    btnCancel.addEventListener('click', () => {
        closeProductModal();
    });
}

// Закрытие по клику вне модального окна
addProductModal.addEventListener('click', (e) => {
    if (e.target === addProductModal) {
        addProductModal.classList.remove('active');
        addProductForm.reset();
        imagePreview.innerHTML = '';
        imagePreview.classList.add('empty');
    }
});

// Превью изображения товара
if (productImageInput) {
    productImageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                imagePreview.innerHTML = `<img src="${event.target.result}" alt="Превью">`;
                imagePreview.classList.remove('empty');
            };
            reader.readAsDataURL(file);
        }
    });
}

// Добавление/редактирование товара
if (addProductForm) {
    addProductForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('productName').value;
        const price = document.getElementById('productPrice').value;
        const description = document.getElementById('productDescription').value;
        const editingId = document.getElementById('editingProductId').value;
        const imageFile = productImageInput ? productImageInput.files[0] : null;
        
        if (imageFile) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imageData = event.target.result;
                saveProduct(name, price, description, imageData, editingId);
            };
            reader.readAsDataURL(imageFile);
        } else {
            // Если редактируем и не загружаем новое изображение, используем старое
            let imageData = null;
            if (editingId) {
                const existingProduct = flowersProducts.find(p => p.id == editingId);
                imageData = existingProduct ? existingProduct.image : null;
            }
            saveProduct(name, price, description, imageData, editingId);
        }
    });
}

function saveProduct(name, price, description, imageData, editingId) {
    if (editingId) {
        // Редактирование существующего товара
        const index = flowersProducts.findIndex(p => p.id == editingId);
        if (index !== -1) {
            flowersProducts[index] = {
                ...flowersProducts[index],
                name: name,
                price: parseInt(price),
                description: description,
                image: imageData || flowersProducts[index].image
            };
        }
    } else {
        // Добавление нового товара
        const newProduct = {
            id: Date.now(),
            name: name,
            price: parseInt(price),
            description: description,
            image: imageData
        };
        flowersProducts.push(newProduct);
    }
    
    localStorage.setItem('flowersProducts', JSON.stringify(flowersProducts));
    renderFlowers();
    closeProductModal();
}

function closeProductModal() {
    if (addProductModal) {
        addProductModal.classList.remove('active');
    }
    if (addProductForm) {
        addProductForm.reset();
    }
    if (imagePreview) {
        imagePreview.innerHTML = '';
        imagePreview.classList.add('empty');
    }
    if (document.getElementById('editingProductId')) {
        document.getElementById('editingProductId').value = '';
    }
    if (document.getElementById('modalTitle')) {
        document.getElementById('modalTitle').textContent = 'Добавить товар';
    }
    if (document.getElementById('submitBtn')) {
        document.getElementById('submitBtn').textContent = 'Добавить';
    }
}

function openEditProductModal(product) {
    document.getElementById('productName').value = product.name;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productDescription').value = product.description || '';
    document.getElementById('editingProductId').value = product.id;
    document.getElementById('modalTitle').textContent = 'Редактировать товар';
    document.getElementById('submitBtn').textContent = 'Сохранить';
    
    if (product.image) {
        imagePreview.innerHTML = `<img src="${product.image}" alt="Превью">`;
        imagePreview.classList.remove('empty');
    } else {
        imagePreview.innerHTML = '';
        imagePreview.classList.add('empty');
    }
    
    if (addProductModal) {
        addProductModal.classList.add('active');
    }
}

// Рендеринг товаров
function renderFlowers() {
    if (!flowersGrid) return;
    
    flowersGrid.innerHTML = '';
    
    flowersProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = 'flower-card';
        
        card.innerHTML = `
            <button class="edit-product-btn" data-product-id="${product.id}" title="Редактировать">✏️</button>
            <div class="flower-image">
                ${product.image 
                    ? `<img src="${product.image}" alt="${product.name}">` 
                    : '🌸'}
            </div>
            <div class="flower-info">
                <h3 class="flower-title">${product.name}</h3>
                <div class="flower-price">${product.price} ₽</div>
                ${product.description ? `<p class="flower-description">${product.description}</p>` : ''}
            </div>
        `;
        
        flowersGrid.appendChild(card);
    });
    
    // Добавляем обработчики для кнопок редактирования
    document.querySelectorAll('.edit-product-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = parseInt(btn.getAttribute('data-product-id'));
            const product = flowersProducts.find(p => p.id === productId);
            if (product) {
                openEditProductModal(product);
            }
        });
    });
}

// Редактирование баннера
const editBannerBtn = document.getElementById('editBannerBtn');
const editBannerModal = document.getElementById('editBannerModal');
const editBannerForm = document.getElementById('editBannerForm');
const closeBannerModal = document.getElementById('closeBannerModal');
const cancelBannerBtn = document.getElementById('cancelBannerBtn');
const bannerImageInput = document.getElementById('bannerImage');
const bannerImagePreview = document.getElementById('bannerImagePreview');

// Загрузка данных баннера из localStorage
let bannerData = JSON.parse(localStorage.getItem('bannerData')) || {
    title: '101 ромашка за 2999',
    badge: 'Акция',
    image: null
};

function loadBanner() {
    const promoTitle = document.getElementById('promoTitle');
    const promoBadge = document.getElementById('promoBadge');
    const promoBanner = document.getElementById('promoBanner');
    
    if (promoTitle) promoTitle.textContent = bannerData.title;
    if (promoBadge) promoBadge.textContent = bannerData.badge;
    
    if (bannerData.image && promoBanner) {
        promoBanner.style.backgroundImage = `url(${bannerData.image})`;
        promoBanner.style.backgroundSize = 'cover';
        promoBanner.style.backgroundPosition = 'center';
    }
}

if (editBannerBtn) {
    editBannerBtn.addEventListener('click', () => {
        document.getElementById('bannerTitle').value = bannerData.title;
        document.getElementById('bannerBadge').value = bannerData.badge;
        
        if (bannerData.image && bannerImagePreview) {
            bannerImagePreview.innerHTML = `<img src="${bannerData.image}" alt="Превью баннера">`;
            bannerImagePreview.classList.remove('empty');
        } else if (bannerImagePreview) {
            bannerImagePreview.innerHTML = '';
            bannerImagePreview.classList.add('empty');
        }
        
        if (editBannerModal) {
            editBannerModal.classList.add('active');
        }
    });
}

if (bannerImageInput) {
    bannerImageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (bannerImagePreview) {
                    bannerImagePreview.innerHTML = `<img src="${event.target.result}" alt="Превью баннера">`;
                    bannerImagePreview.classList.remove('empty');
                }
            };
            reader.readAsDataURL(file);
        }
    });
}

if (editBannerForm) {
    editBannerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const title = document.getElementById('bannerTitle').value;
        const badge = document.getElementById('bannerBadge').value;
        const imageFile = bannerImageInput ? bannerImageInput.files[0] : null;
        
        if (imageFile) {
            const reader = new FileReader();
            reader.onload = (event) => {
                bannerData.image = event.target.result;
                saveBanner(title, badge);
            };
            reader.readAsDataURL(imageFile);
        } else {
            saveBanner(title, badge);
        }
    });
}

function saveBanner(title, badge) {
    bannerData.title = title;
    bannerData.badge = badge;
    localStorage.setItem('bannerData', JSON.stringify(bannerData));
    loadBanner();
    
    if (editBannerModal) {
        editBannerModal.classList.remove('active');
    }
    if (editBannerForm) {
        editBannerForm.reset();
    }
    if (bannerImagePreview) {
        bannerImagePreview.innerHTML = '';
        bannerImagePreview.classList.add('empty');
    }
}

if (closeBannerModal) {
    closeBannerModal.addEventListener('click', () => {
        if (editBannerModal) {
            editBannerModal.classList.remove('active');
        }
        if (editBannerForm) {
            editBannerForm.reset();
        }
        if (bannerImagePreview) {
            bannerImagePreview.innerHTML = '';
            bannerImagePreview.classList.add('empty');
        }
    });
}

if (cancelBannerBtn) {
    cancelBannerBtn.addEventListener('click', () => {
        if (editBannerModal) {
            editBannerModal.classList.remove('active');
        }
        if (editBannerForm) {
            editBannerForm.reset();
        }
        if (bannerImagePreview) {
            bannerImagePreview.innerHTML = '';
            bannerImagePreview.classList.add('empty');
        }
    });
}

// Закрытие модального окна баннера по клику вне его
if (editBannerModal) {
    editBannerModal.addEventListener('click', (e) => {
        if (e.target === editBannerModal) {
            editBannerModal.classList.remove('active');
            if (editBannerForm) {
                editBannerForm.reset();
            }
            if (bannerImagePreview) {
                bannerImagePreview.innerHTML = '';
                bannerImagePreview.classList.add('empty');
            }
        }
    });
}

// Загрузка баннера при открытии страницы
if (flowersPage) {
    const observer = new MutationObserver(() => {
        if (flowersPage.classList.contains('active')) {
            loadBanner();
        }
    });
    observer.observe(flowersPage, { attributes: true, attributeFilter: ['class'] });
}

// Функции переключения страниц
function showLogin() {
    loginPage.classList.add('active');
    menuPage.classList.remove('active');
    templatePage.classList.remove('active');
    flowersPage.classList.remove('active');
}

function showMenu() {
    loginPage.classList.remove('active');
    menuPage.classList.add('active');
    templatePage.classList.remove('active');
    flowersPage.classList.remove('active');
}

function showTemplatePage() {
    loginPage.classList.remove('active');
    menuPage.classList.remove('active');
    templatePage.classList.add('active');
    flowersPage.classList.remove('active');
}

function showFlowersPage() {
    loginPage.classList.remove('active');
    menuPage.classList.remove('active');
    templatePage.classList.remove('active');
    flowersPage.classList.add('active');
}

