const gemstoneList = document.getElementById('gemstones-list');
const searchBar = document.getElementById('find-gemstone');
const clearButton = document.getElementById('clear-search-bar');


let gemstones = [
    {
        id: 1,
        name: "Diamond",
        weightInCarats: 0.02,
        priceInUSD: 1000 
    },
    {
        id: 2,
        name: "Ruby",
        weightInCarats: 0.05,
        priceInUSD: 5000 
    },
    {
        id: 3,
        name: "Nephrite",
        weightInCarats: 0.07,
        priceInUSD: 700 
    },
    {
        id: 4,
        name: "Diamond",
        weightInCarats: 0.08,
        priceInUSD: 6000 
    },
    {
        id: 5,
        name: "Ruby",
        weightInCarats: 0.07,
        priceInUSD: 6500 
    },
    {
        id: 6,
        name: "Emerald",
        weightInCarats: 0.03,
        priceInUSD: 2000 
    },
    {
        id: 7,
        name: "Perl",
        weightInCarats: 0.1,
        priceInUSD: 1000 
    }
]
let currentGemstones = gemstones;

searchBar.addEventListener('keyup', (searchString) => {
    const searchFilterString = searchString.target.value.toLowerCase();
    const filteredGemstones = gemstones.filter(gemstone =>{
        return gemstone.name.toLowerCase().includes(searchFilterString);
    });
    currentGemstones = filteredGemstones;
    visualiseSortedGemstones();
})

clearButton.addEventListener('click', ()=> {
    searchBar.value = '';
    currentGemstones = gemstones;
    visualiseSortedGemstones();
})

// function to calculate price of current displaying items
function calculatePrice(){
    var priceSum = 0;
    var totalPriceLabel = document.getElementById('total-price');
    currentGemstones.forEach(gemstone => priceSum += gemstone.priceInUSD);
    totalPriceLabel.textContent = 'Total price: ' + priceSum + '$';
}

// sort if needed and display items
function visualiseSortedGemstones(){
    var sortType = document.getElementById('sort-select').value;
    console.log(sortType);
    if (sortType == 'none'){
        displayGemstones(currentGemstones);
        return;
    } else if (sortType == 'name'){
        currentGemstones.sort(compareByName);
    } else if (sortType == 'weight'){
        currentGemstones.sort(compareByWeight);
    }
    else if (sortType == 'price'){
        currentGemstones.sort(compareByPrice);
    }
    displayGemstones(currentGemstones);
}

function compareByName(firstGemstone, secondGemstone){
    var firstGemstoneName = firstGemstone.name.toLowerCase();
    var secondGemstoneName = secondGemstone.name.toLowerCase();
    if (firstGemstoneName < secondGemstoneName) {
        return -1;
    }
    if (firstGemstoneName > secondGemstoneName) {
        return 1;
    }
    return 0;
}

function compareByWeight(firstGemstone, secondGemstone){
    return firstGemstone.weightInCarats - secondGemstone.weightInCarats;
}

function compareByPrice(firstGemstone, secondGemstone){
    return firstGemstone.priceInUSD - secondGemstone.priceInUSD;
}

// function to show current gems
const displayGemstones = (gemstonesToShow) => {
    const htmlString = gemstonesToShow.map((gemstone)=>{
        return `
        <li class="gemstone">
            <h2>${gemstone.name}</h2>
            <h3>⚖️: ${gemstone.weightInCarats} ct</h3>
            <h3>💰: ${gemstone.priceInUSD} $</h3>
            <div class= "control-buttons">
                <button class="edit-button" id="edit-button" onclick="editRecord(this)">Edit</button>
                <button class="delete-button" id="delete-button" onclick="deleteRecord(this)">Delete</button>
            </div>
        </li>
        `
    }).join('');

    gemstoneList.innerHTML = htmlString;
}

// show all gems at the load
displayGemstones(currentGemstones)