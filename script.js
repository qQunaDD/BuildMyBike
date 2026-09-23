const componentsCatalog = {
    frames: [
        { id: 'frame-1', name: 'Dartmoor Hornet Pro', price: 35000, color: '#1e1e1e', image: 'assets/dartmoor_hornet_pro.png', wheelSize: 27.5 },
        { id: 'frame-2', name: 'Dartmoor Thunderbird', price: 85000, color: '#457b9d', image: 'assets/dartmoor_thunderbird.png', wheelSize: 29 },
    ],
    forks: [
        {id: 'fork-1', name: 'RockShox Lyrik', price: 36000, color: '#682add', image: 'assets/rockshox_lyrik_select.png', travelSize: 160 },
        {id: 'fork-2', name: 'RockShox Zeb Ultimate', price: 62000, color: '#c75427', image: 'assets/rockshox_zeb_ultimate_red.png', travelSize: 180 },
    ],
    wheels: [
        {id: 'wheel-1', name: 'DT Swiss EX1700', price: 40000, color: '#16d2d8', image: 'assets/dt_swiss_ex1700.png', wheelSize: [27.5, 29] },
    ],
    drivetrain: [
        {id: 'drivetrain-1', name: 'SHIMANO Deore M8100', price: 17500, color: '#17d52d', image: 'assets/shimano_deore-xt_m8100_51t-groupset.png', gears: 12 }
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

function renderCatalog() {
    const container = document.getElementById('catalog-container');
    container.innerHTML = ' ';

    for (let category in componentsCatalog) {
        const categoryTitle = document.createElement('h2');
        categoryTitle.innerText = category.toUpperCase();
        container.appendChild(categoryTitle);

        componentsCatalog[category].forEach(item => {
            const card = document.createElement('div');
            card.className = 'component-card'; 

        card.innerHTML = `
            <h3>${item.name}</h3>
            <p>Цена: ${item.price} руб.</p>
            <button onclick="selectComponent('${category}', '${item.id}')">Добавить в сборку</button>
        `;
        container.appendChild(card);
        });
    }
}

renderCatalog();