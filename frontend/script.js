// 1. БАЗА ДАННЫХ (КАТАЛОГ ДЕТАЛЕЙ)
const componentsCatalog = {
    frame: [
        { id: 'frame-1', name: 'Dartmoor Hornet Pro', price: 35000, weight: 2.5, headtube: 'tapered', bbType: 'BSA', rearAxle: '148x12', imageBack: 'assets/frame-1-back.png', imageFront: 'assets/frame-1-front.png', wheelSize: 27.5, 
            colors: [
            { id: 'Cosmic', name: "Glossy Cosmic", hex: '#604cfe', imageBack: "assets/frame-1-back-cosmic.png", imageFront: "assets/frame-1-front-cosmic.png" },
            { id: 'Dragon-Green', name: "Glossy Dragon Green", hex: '#238200', imageBack: "assets/frame-1-back-dragon_green.png", imageFront: "assets/frame-1-front-dragon_green.png" },
            { id: 'Black', name: "Matt Black", hex: '#242424', imageBack: "assets/frame-1-back-black.png", iamgeFront: "assets/frame-1-front-black.png" },
            { id: 'Silver', name: "Silver", hex: '#b8b8b8', imageBack: "assets/frame-1-back.png", imageFront: "assets/frame-1-front.png" }
        ]},

        // Добавили разделенные слои для Thunderbird:
        { id: 'frame-2', name: 'Dartmoor Thunderbird', price: 85000, weight: 3.1, headtube: 'tapered', bbType: 'BSA', rearAxle: '148x12', imageBack: 'assets/frame-2-back.png', imageFront: 'assets/frame-2-front.png', wheelSize: 29, 
            colors: [
                { id: "Cosmic", name: "Glossy Cosmic", hex: '#604cfe', imageBack: "assets/frame-2-back-cosmic.png", imageFront: "assets/frame-2-front-cosmic.png" },
                { id: "Dragon-Green", name: "Glossy Dragon Green", hex: '#238200', imageBack: "assets/frame-2-back-dragon_green.png", imageFront: "assets/frame-2-front-dragon_green.png" },
                { id: "Midnight-Black", name: "Matt Midnight Black", hex: '#242424', imageBack: "assets/frame-2-back.png", imageFront: "assets/frame-2-front.png" }
            ]
         }
    ],
    fork: [
        { id: 'fork-1', name: 'RockShox Lyrik', price: 36000, weight: 2.0, steerer: 'tapered', image: 'assets/fork-1.png', travel: 160, wheelSize: 27.5 },
        { id: 'fork-2', name: 'RockShox Zeb Ultimate', price: 62000, weight: 2.2, steerer: 'tapered', image: 'assets/fork-2.png', travel: 180, wheelSize: 29 },
        { id: 'fork-3', name: 'RST Dirt', price: 15000, weight: 2.8, steerer: 'straight', travel: 100, wheelSize: 26, image: 'assets/rst_dirt_.png' }
    ],
    wheels: [
        { id: 'wheel-1', name: 'DT Swiss EX1700', price: 40000, weight: 1.8, image: 'assets/wheels-1.png', wheelSize: 27.5, axleStandard: '148x12' },
        { id: 'wheel-2', name: 'NoName 29er', price: 12000, weight: 2.4, wheelSize: 29, axleStandard: '135x10' }
    ],
    tires: [
        { id: 'tire-1', name: 'Maxxis Assegai / Minion DHR II', price: 11000, weight: 2.2, width: 2.4, image: 'assets/tire-1.png', diameter: 27.5 },
        { id: 'tire-2', name: 'Maxxis Assegai / Minion DHR II', price: 12000, weight: 2.4, width: 2.5, image: 'assets/tire-2.png', diameter: 29 },
        { id: 'tire-3', name: 'Schwalbe Magic Mary / Big Betty', price: 13500, weight: 2.3, width: 2.4, image: 'assets/tire-3.png', diameter: 29 }
    ],
    drivetrain: [
        // Трансмиссия теперь тоже разделена на Front и Back:
        { id: 'drivetrain-1', name: 'SHIMANO Deore M8100', price: 17500, weight: 1.9, bbCompatibility: 'BSA', imageBack: 'assets/drivetrain-1-back.png', imageFront: 'assets/drivetrain-1-front.png', gears: 12 }
    ],
    brakes: [
        { id: 'brakes-1', name: 'Magura MT7', price: 38000, weight: 0.51, rotorSize: 203, image: 'assets/brakes-1.png' },
        { id: 'brakes-2', name: 'Shimano XT M8120', price: 29000, weight: 0.61, rotorSize: 203, image: 'assets/brakes-2.png' }
    ]
};

// 2. СОСТОЯНИЕ ТЕКУЩЕЙ СБОРКИ
let currentBuild = {
    frame: null,
    fork: null,
    wheels: null,
    drivetrain: null,
    brakes: null,
    frameColor: null,
    totalWeight: 0,
    totalPrice: 0
};

// 3. ВЫБОР ДЕТАЛИ
function selectComponent(category, componentId) {
    const selectedItem = componentsCatalog[category].find(item => item.id === componentId);

    if (selectedItem) {
        currentBuild[category] = selectedItem;
        if (category === `frame` && selectedItem.colors) {
            currentBuild.frameColor = selectedItem.colors[0];
        }
        
        RenderColorPalette();
        validateCompability();
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
    document.getElementById('selected-frame-name').innerText = currentBuild.frame ? currentBuild.frame.name : 'Не выбрано';
    document.getElementById('selected-fork-name').innerText = currentBuild.fork ? currentBuild.fork.name : 'Не выбрано';
    document.getElementById('selected-wheels-name').innerText = currentBuild.wheels ? currentBuild.wheels.name : 'Не выбрано';
    document.getElementById('selected-tires-name').innerText = currentBuild.tires ? currentBuild.tires.name : 'Не выбрано';
    document.getElementById('selected-drivetrain-name').innerText = currentBuild.drivetrain ? currentBuild.drivetrain.name : 'Не выбрано';
    document.getElementById('selected-brakes-name').innerText = currentBuild.brakes ? currentBuild.brakes.name : 'Не выбрано';

    document.getElementById('summary-frame').innerText = currentBuild.frame ? currentBuild.frame.name : '-';
    document.getElementById('summary-wheels').innerText = currentBuild.wheels ? `${currentBuild.wheels.wheelSize}"` : '-';
    document.getElementById('summary-tires').innerText = currentBuild.tires ? currentBuild.tires.name : '-';
    document.getElementById('summary-brakes').innerText = currentBuild.brakes ? currentBuild.brakes.name : '-';
    document.getElementById('summary-weight').innerText = `~ ${currentBuild.totalWeight.toFixed(1)} кг`;
    document.getElementById('total-price').innerText = `${currentBuild.totalPrice.toLocaleString('ru-RU')} ₽`;
}

// 6. СЛОЙ 2D-ВИЗУАЛИЗАЦИИ
function updateVisualizer() {
    let hasAnyPart = false;

    // Вспомогательная функция. Принимает ID тега <img> и путь к картинке
    function setLayer(id, imagePath) {
        // Ищем элемент в DOM по его ID
        const layer = document.getElementById(id);
        // Если элемента нет (например, опечатка в ID), прерываем выполнение функции, чтобы не было ошибок
        if (!layer) return;

        // Если путь к картинке передан (не null и не undefined)
        if (imagePath) {
            // Подставляем путь в атрибут src
            layer.src = imagePath;
            // Убираем CSS-класс 'hidden', чтобы картинка появилась на экране
            layer.classList.remove('hidden');
            // Запоминаем, что на холсте есть хотя бы одна деталь (нужно для отключения текста-подсказки)
            hasAnyPart = true;
        } else {
            // Если пути нет (деталь не выбрана), стираем src
            layer.src = '';
            // Вешаем класс 'hidden', чтобы скрыть пустой тег <img>
            layer.classList.add('hidden');
        }
    }

    // ЛОГИКА РЕНДЕРА РАМЫ
    if (currentBuild.frame) {
        // Если рама выбрана, передаем путь к заднему слою. Если его вдруг нет, передаем null.
        const frameBack = currentBuild.frameColor ? currentBuild.frameColor.imageBack : currentBuild.frame.imageBack;        
        // Передаем путь к переднему слою. 
        // || currentBuild.frame.image - это защита от дурака. Если у какой-то рамы будет только одно поле image, подставится оно.
        const frameFront = currentBuild.frameColor ? currentBuild.frameColor.imageFront : currentBuild.frame.imageFront;
        setLayer('layer-frame-back', frameBack || null);
        setLayer('layer-frame-front', frameFront || null);
    } else {
        // Если рама не выбрана, прячем оба слоя
        setLayer('layer-frame-back', null);
        setLayer('layer-frame-front', null);
    }

    // ЛОГИКА РЕНДЕРА ТРАНСМИССИИ
    if (currentBuild.drivetrain) {
        // Передаем кассету на нижний слой
        setLayer('layer-drivetrain-back', currentBuild.drivetrain.imageBack || null);
        // Передаем шатуны на верхний слой
        setLayer('layer-drivetrain-front', currentBuild.drivetrain.imageFront || currentBuild.drivetrain.image || null);
    } else {
        // Если трансмиссия не выбрана, прячем оба слоя
        setLayer('layer-drivetrain-back', null);
        setLayer('layer-drivetrain-front', null);
    }

    // ОДНОСЛОЙНЫЕ ДЕТАЛИ
    // Если колеса выбраны в стейте, передаем их картинку, иначе null
    setLayer('layer-wheels', currentBuild.wheels ? currentBuild.wheels.image : null);
    setLayer('layer-fork', currentBuild.fork ? currentBuild.fork.image : null);
    setLayer('layer-brakes', currentBuild.brakes ? currentBuild.brakes.image : null);

    // УПРАВЛЕНИЕ ПОДСКАЗКОЙ
    const hint = document.getElementById('viewport-hint');
    if (hint) {
        // Если hasAnyPart истинно (есть детали), применяем display: none. Иначе - display: block.
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
            const matchWheel = !item.wheelSize || item.wheelSize === selectedFrame.wheelSize;
            const matchSteerer = !item.steerer || item.steerer === selectedFrame.headtube;
            return matchWheel && matchSteerer;
        }
        if (category === 'wheels') {
            const matchWheel = !item.wheelSize || item.wheelSize === selectedFrame.wheelSize;
            const matchAxle = !item.axleStandard || item.axleStandard === selectedFrame.rearAxle;
            return matchWheel && matchAxle;
        }
        if (category === 'drivetrain') {
            return !item.bbCompatibility || item.bbCompatibility === selectedFrame.bbType;
        }
        if (category === 'tires') {
            const targetWheelSize = currentBuild.wheels ? currentBuild.wheels.wheelSize : selectedFrame.wheelSize;
            return item.diameter === targetWheelSize;
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
    if (!btn) return;

    btn.addEventListener('click', () => {
        // Проверяем data-part и на самом блоке, и на кнопке
        const category = item.dataset.part || btn.dataset.part || item.getAttribute('data-part');
        
        if (!category || !componentsCatalog[category]) {
            console.error(`Категория "${category}" не найдена в componentsCatalog! Проверь HTML разметку.`);
            return;
        }

        openModal(category);
    });
});

// Сброс конфигурации
document.getElementById('reset-btn').addEventListener('click', () => {
    currentBuild = {
        frameColor: null,
        frame: null,
        fork: null,
        wheels: null,
        tires: null,
        drivetrain: null,
        brakes: null,
        totalWeight: 0,
        totalPrice: 0
    };
    RenderColorPalette();
    calculateTotals();
    updateUI();
    updateVisualizer();
});

// Точка входа
function initApp() {
    RenderColorPalette();
    calculateTotals();
    updateUI();
    updateVisualizer();
}

document.addEventListener('DOMContentLoaded', initApp);

function validateCompability() {
    const frame = currentBuild.frame;
    if (!frame) return;
    
    const fork = currentBuild.fork;
    if (!fork) return;

    if (currentBuild.fork && currentBuild.fork.wheelSize !== currentBuild.frame.wheelSize) {
        console.warn('Вмлка не подходит к новой раме, сбрасываем!');
        currentBuild.fork = null;
    }

    const wheels = currentBuild.wheels;
    if (!wheels) return;

    if (currentBuild.wheels && currentBuild.wheels.wheelSize !== currentBuild.frame.wheelSize) {
        console.warn('Колёся не подходит к новой раме, сбрасываем!');
        currentBuild.wheels = null;
    }

    const tires = currentBuild.tires;
    if (!tires) return;

    if (currentBuild.tires && currentBuild.tires.diameter !== currentBuild.frame.wheelSize) {
        console.warn('Покрышки не подходит к новой раме, сбрасываем!');
        currentBuild.tires = null;
    }

    
}

function RenderColorPalette() {
    const paletteContainer = document.getElementById('frame-colors-palette');
    if (!paletteContainer) return;

    if (!currentBuild.frame || !currentBuild.frame.colors) {
        paletteContainer.classList.add('hidden');
        paletteContainer.innerHTML = '';
        return;
    }

    paletteContainer.classList.remove('hidden');
    paletteContainer.innerHTML = '';

    currentBuild.frame.colors.forEach(color => {
        const dot = document.createElement('div');
        dot.className = 'color-swatch';
        dot.style.backgroundColor = color.hex;

        if (currentBuild.frameColor && color.id === currentBuild.frameColor.id) {
            dot.classList.add('active');
        }

        dot.addEventListener('click', () => {
            currentBuild.frameColor = color;
            updateVisualizer();
            RenderColorPalette();
        });

        paletteContainer.appendChild(dot);
    });
}