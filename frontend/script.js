// 1. БАЗА ДАННЫХ (КАТАЛОГ ДЕТАЛЕЙ)
const componentsCatalog = {
    frame: [
        { id: 'frame-1', name: 'Dartmoor Hornet Pro', price: 35000, weight: 2.5, headtube: 'tapered', bbType: 'BSA', rearAxle: '148x12', image: 'assets/dartmoor_hornet_pro.png', wheelSize: 27.5 },
        { id: 'frame-2', name: 'Dartmoor Thunderbird', price: 85000, weight: 3.1, headtube: 'tapered', bbType: 'BSA', rearAxle: '148x12', image: 'assets/dartmoor_thunderbird.png', wheelSize: 29 }
    ],
    fork: [
        { id: 'fork-1', name: 'RockShox Lyrik', price: 36000, weight: 2.0, steerer: 'tapered', image: 'assets/rockshox_lyrik_select.png', travel: 160, wheelSize: 27.5 },
        { id: 'fork-2', name: 'RockShox Zeb Ultimate', price: 62000, weight: 2.2, steerer: 'tapered', image: 'assets/rockshox_zeb_ultimate_red.png', travel: 180, wheelSize: 29 },
        { id: 'fork-3', name: 'RST Dirt', price: 15000, weight: 2.8, steerer: 'straight', travel: 100, wheelSize: 26, image: 'assets/rst_dirt_.png' }
    ],
    wheels: [
        { id: 'wheel-1', name: 'DT Swiss EX1700', price: 40000, weight: 1.8, image: 'assets/dt_swiss_ex1700.png', wheelSize: 27.5, axleStandard: '148x12' },
        { id: 'wheel-2', name: 'NoName 29er', price: 12000, weight: 2.4, wheelSize: 29, axleStandard: '135x10' }
    ],
    drivetrain: [
        { id: 'drivetrain-1', name: 'SHIMANO Deore M8100', price: 17500, weight: 1.9, color: '#17d52d', bbCompatibility: 'BSA', image: 'assets/shimano_deore-xt_m8100_51t-groupset.png', gears: 12 }
    ]
};

// 2. СОСТОЯНИЕ ТЕКУЩЕЙ СБОРКИ
let currentBuild = {
    frame: null,
    fork: null,
    wheels: null,
    drivetrain: null,
    totalWeight: 0,
    totalPrice: 0
};

// 3. ВЫБОР ДЕТАЛИ
function selectComponent(category, componentId) {
    const selectedItem = componentsCatalog[category].find(item => item.id === componentId);

    if (selectedItem) {
        currentBuild[category] = selectedItem;
        
        calculateTotals();
        updateUI();
        updateVisualizer();
        closeModal();
    }
}

// 4. ПОДСЧЕТ ИТОГОВ
function calculateTotals() {
    let price = 0;
    let weight = 0;

    for (let key in currentBuild) {
        if (key !== 'totalPrice' && key !== 'totalWeight' && currentBuild[key] !== null) {
            price += currentBuild[key].price || 0;
            weight += currentBuild[key].weight || 0;
        }
    }

    currentBuild.totalPrice = price;
    currentBuild.totalWeight = weight;
}

// 5. ОБНОВЛЕНИЕ ТЕКСТОВОГО UI
function updateUI() {
    // Левая панель
    document.getElementById('selected-frame-name').innerText = currentBuild.frame ? currentBuild.frame.name : 'Не выбрано';
    document.getElementById('selected-fork-name').innerText = currentBuild.fork ? currentBuild.fork.name : 'Не выбрано';
    document.getElementById('selected-wheels-name').innerText = currentBuild.wheels ? currentBuild.wheels.name : 'Не выбрано';
    document.getElementById('selected-drivetrain-name').innerText = currentBuild.drivetrain ? currentBuild.drivetrain.name : 'Не выбрано';

    // Правая панель
    document.getElementById('summary-frame').innerText = currentBuild.frame ? currentBuild.frame.name : '-';
    document.getElementById('summary-wheels').innerText = currentBuild.wheels ? `${currentBuild.wheels.wheelSize}"` : '-';
    document.getElementById('summary-weight').innerText = `~ ${currentBuild.totalWeight.toFixed(1)} кг`;
    document.getElementById('total-price').innerText = `${currentBuild.totalPrice.toLocaleString('ru-RU')} ₽`;
}

// 6. СЛОЙ 2D-ВИЗУАЛИЗАЦИИ
function updateVisualizer() {
    const categories = ['wheels', 'fork', 'frame', 'drivetrain'];
    let hasAnyPart = false;

    categories.forEach(cat => {
        const layer = document.getElementById(`layer-${cat}`);
        if (!layer) return;

        if (currentBuild[cat] && currentBuild[cat].image) {
            layer.src = currentBuild[cat].image;
            layer.classList.remove('hidden');
            hasAnyPart = true;
        } else {
            layer.classList.add('hidden');
        }
    });

    const hint = document.getElementById('viewport-hint');
    if (hint) {
        hint.style.display = hasAnyPart ? 'none' : 'block';
    }
}

// 7. СОВМЕСТИМОСТЬ
function getCompatibleComponents(category) {
    const allItems = componentsCatalog[category];
    const selectedFrame = currentBuild.frame;

    if (!selectedFrame || category === 'frame') {
        return allItems;
    }

    return allItems.filter(item => {
        if (category === 'fork') {
            return item.wheelSize === selectedFrame.wheelSize && item.steerer === selectedFrame.headtube;
        }
        if (category === 'wheels') {
            return item.wheelSize === selectedFrame.wheelSize && item.axleStandard === selectedFrame.rearAxle;
        }
        if (category === 'drivetrain') {
            return item.bbCompatibility === selectedFrame.bbType;
        }
        return true; 
    });
}

// 8. МОДАЛЬНОЕ ОКНО
const modalOverlay = document.getElementById('modal-overlay');
const modalBody = document.getElementById('modal-body');
const closeModalBtn = document.getElementById('close-modal-btn');

function openModal(category) {
    modalBody.innerHTML = '';
    const compatibleItems = getCompatibleComponents(category);

    if (compatibleItems.length === 0) {
        modalBody.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 20px 0;">Нет совместимых деталей для текущей рамы.</p>';
    } else {
        compatibleItems.forEach(item => {
            const card = document.createElement('div');
            card.className = 'component-card';

            const infoDiv = document.createElement('div');
            infoDiv.className = 'component-card-info';
            infoDiv.innerHTML = `
                <h3>${item.name}</h3>
                <p>Цена: ${item.price.toLocaleString('ru-RU')} ₽ | Вес: ${item.weight || '?'} кг</p>
            `;

            const selectBtn = document.createElement('button');
            selectBtn.className = 'component-select-btn';
            selectBtn.innerText = 'Добавить';
            
            // Чистый слушатель вместо инлайн onclick
            selectBtn.addEventListener('click', () => {
                selectComponent(category, item.id);
            });

            card.appendChild(infoDiv);
            card.appendChild(selectBtn);
            modalBody.appendChild(card);
        });
    }

    modalOverlay.classList.remove('hidden');
}

function closeModal() {
    modalOverlay.classList.add('hidden');
}

closeModalBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
});

document.querySelectorAll('.part-item').forEach(item => {
    const btn = item.querySelector('.add-btn');
    const category = item.getAttribute('data-part');
    btn.addEventListener('click', () => {
        openModal(category);
    });
});

// Сброс сборки
document.getElementById('reset-btn').addEventListener('click', () => {
    currentBuild = {
        frame: null,
        fork: null,
        wheels: null,
        drivetrain: null,
        totalWeight: 0,
        totalPrice: 0
    };
    calculateTotals();
    updateUI();
    updateVisualizer();
});

// Точка входа: начальная инициализация UI
function initApp() {
    calculateTotals();
    updateUI();
    updateVisualizer();
}

document.addEventListener('DOMContentLoaded', initApp);