const componentsCatalog = {
    frame: [
        { id: 'frame-1', name: 'Dartmoor Hornet Pro', price: 35000, color: '#1e1e1e', image: 'assets/dartmoor_hornet_pro.png', wheelSize: 27.5 },
        { id: 'frame-2', name: 'Dartmoor Thunderbird', price: 85000, color: '#457b9d', image: 'assets/dartmoor_thunderbird.png', wheelSize: 29 },
    ],
    fork: [
        { id: 'fork-1', name: 'RockShox Lyrik', price: 36000, color: '#682add', image: 'assets/rockshox_lyrik_select.png', travelSize: 160 },
        { id: 'fork-2', name: 'RockShox Zeb Ultimate', price: 62000, color: '#c75427', image: 'assets/rockshox_zeb_ultimate_red.png', travelSize: 180 },
    ],
    wheels: [
        { id: 'wheel-1', name: 'DT Swiss EX1700', price: 40000, color: '#16d2d8', image: 'assets/dt_swiss_ex1700.png', wheelSize: [27.5, 29] },
    ],
    drivetrain: [
        { id: 'drivetrain-1', name: 'SHIMANO Deore M8100', price: 17500, color: '#17d52d', image: 'assets/shimano_deore-xt_m8100_51t-groupset.png', gears: 12 }
    ]
};

let currentBuild = {
    frame: null,
    fork: null,
    wheels: null,
    drivetrain: null,
    totalPrice: 0
};

function selectComponent(category, componentId) {
    const selectedItem = componentsCatalog[category].find(item => item.id === componentId);

    if (selectedItem) {
        currentBuild[category] = selectedItem;
        updateTotalPrice();
        updateUI();

        closeModal();

        console.log(`В сборку добавлено: ${selectedItem.name}`);
        console.log(currentBuild);
    }
}

function updateTotalPrice() {
    let price = 0;

    for (let key in currentBuild) {
        if (key !== 'totalPrice' && currentBuild[key] !== null) {
            price += currentBuild[key].price;
        }
    }

    currentBuild.totalPrice = price;
    console.log(`Текущая стоимость сборки: ${currentBuild.totalPrice} руб.`);
}

function updateUI() {
    document.getElementById('selected-frame-name').innerText = currentBuild.frame ? currentBuild.frame.name : 'Не выбрано';
    document.getElementById('selected-fork-name').innerText = currentBuild.fork ? currentBuild.fork.name : 'Не выбрано';
    document.getElementById('selected-wheels-name').innerText = currentBuild.wheels ? currentBuild.wheels.name : 'Не выбрано';
    document.getElementById('selected-drivetrain-name').innerText = currentBuild.drivetrain ? currentBuild.drivetrain.name : 'Не выбрано';

    document.getElementById('summary-frame').innerText = currentBuild.frame ? currentBuild.frame.name : 'Не выбрано';

    if (currentBuild.wheels) {
        document.getElementById('summary-wheels').innerText = currentBuild.wheels.wheelSize.join(', ');
    } else {
        document.getElementById('summary-wheels').innerText = '-';
    }

    const totalPriceElement = document.getElementById('total-price');

    totalPriceElement.innerText = `${currentBuild.totalPrice.toLocaleString('ru-RU')} ₽`;
}

const modalOverlay = document.getElementById('modal-overlay');
const modalBody = document.getElementById('modal-body');
const closeModalBtn = document.getElementById('close-modal-btn');

function openModal(category) {
    modalBody.innerHTML = '';

    componentsCatalog[category].forEach(item => {
        const card = document.createElement('div');
        card.className = 'component-card';

        card.style.padding = '15px';
        card.style.background = 'var(--card-bg)';
        card.style.borderRadius = 'var(--radius-sm)';
        card.style.border = '1px solid var(--border-color)';
        card.style.display = 'flex';
        card.style.justifyContent = 'space-between';
        card.style.alignItems = 'center';

        card.innerHTML = `
        <div>
            <h3 style="font-size: 1rem; margin-bottom: 5px;">${item.name}</h3>
            <p style="color: var(--text-muted); font-size: 0.9rem;">Цена: ${item.price} руб.</p>
        </div>
        <button class="add-btn" style="width: auto; padding: 5px 15px; border-radius: 5px;" onclick="selectComponent('${category}', '${item.id}')">Добавить</button>
        `;
        modalBody.appendChild(card);
    });

    modalOverlay.classList.remove('hidden');
}

function closeModal() {
    modalOverlay.classList.add('hidden');
}

modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        closeModal();
    }
});

document.querySelectorAll('.part-item').forEach(item => {
    const btn = item.querySelector('.add-btn');
    const category = item.getAttribute('data-part');
    btn.addEventListener('click', () => {
        openModal(category);
    });
});
