const gemstoneList = document.getElementById('gemstones-list');
const searchBar = document.getElementById('find-gemstone');
const clearButton = document.getElementById('clear-search-bar');

const createGemstoneID = document.getElementById('create_id');
const createGemstoneName = document.getElementById('create_name');
const createGemstoneWeight = document.getElementById('create_weightInCarats');
const createGemstonePrice = document.getElementById('create_priceInUSD');

var editActive = false;

let gemstones = [
    {
        "id": 1,
        "name": "Diamond",
        "weightInCarats": 0.02,
        "priceInUSD": 1000 
    },
    {
        "id": 2,
        "name": "Ruby",
        "weightInCarats": 0.05,
        "priceInUSD": 5000 
    },
    {
        "id": 3,
        "name": "Nephrite",
        "weightInCarats": 0.07,
        "priceInUSD": 700 
    },
    {
        "id": 4,
        "name": "Diamond",
        "weightInCarats": 0.08,
        "priceInUSD": 6000 
    },
    {
        "id": 5,
        "name": "Ruby",
        "weightInCarats": 0.07,
        "priceInUSD": 6500 
    },
    {
        "id": 6,
        "name": "Emerald",
        "weightInCarats": 0.03,
        "priceInUSD": 2000 
    },
    {
        "id": 7,
        "name": "Perl",
        "weightInCarats": 0.1,
        "priceInUSD": 1000 
    }
]
let currentGemstones = gemstones;


searchBar.addEventListener('keyup', filterGemstones)
function filterGemstones(searchString){
    const searchFilterString = searchString.target.value.toLowerCase();
    const filteredGemstones = gemstones.filter(gemstone =>{
        return gemstone.name.toLowerCase().includes(searchFilterString);
    });
    console.log(filteredGemstones);
    currentGemstones = filteredGemstones;
    visualiseSortedGemstones();
}
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

// compare functions for sorting by specific value
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

function deleteRecord(element){
    console.log(element);
}

// function to show current gems
const displayGemstones = (gemstonesToShow) => {
    const htmlString = gemstonesToShow.map((gemstone)=>{
        return `
        <li class="gemstone">
            <div>            
                <h2 class="gem_id">${gemstone.id}</h2>
                <h2>${gemstone.name}</h2>
                <h3 class="weightInCarats">${gemstone.weightInCarats}</h3>
                <h3 class="priceInUSD">${gemstone.priceInUSD}</h3>
            </div>
            <form class="form__edit_gemstone" id="form__edit_gemstone">
                    <input id="edit_name" name="name" type="text" placeholder="Name">
                    <input id="edit_weightInCarats" name="weightInCarats" type="number" step=0.1 placeholder="Weight">
                    <input id="edit_priceInUSD" name="priceInUSD" type="number" placeholder="Price">
            </form>
            <div class= "control-buttons">
                <button class="edit-button" id="edit-button" onclick="editRecord(this)">Edit</button>
                <button class="delete-button" id="delete-button" onclick="deleteRecord(this)">Delete</button>
            </div>
        </li>
        `
    }).join('');

    gemstoneList.innerHTML = htmlString;
}
function deleteRecord(record){
    const list_to_delete = record.parentNode.parentNode;
    let gemstoneId = parseInt(list_to_delete.childNodes[1].childNodes[1].innerHTML);
    let indexToDeleteFromAll = gemstones.findIndex(obj => obj.id==gemstoneId);
    gemstones.splice(indexToDeleteFromAll, 1);
    if (searchBar.value != ''){
        let indexToDeleteFromCurrent = currentGemstones.findIndex(obj => obj.id==gemstoneId);
        console.log(indexToDeleteFromCurrent);
        currentGemstones.splice(indexToDeleteFromCurrent, 1);
    }
    visualiseSortedGemstones();
    console.log(gemstones, currentGemstones);
    return list_to_delete;
}
function editRecord(record){
    const nodeList = record.parentNode.parentNode.childNodes;
    const editBar = nodeList[3];
    const infoBar = nodeList[1];
    let gemstoneId = parseInt(infoBar.childNodes[1].innerHTML);
    let gemstoneName = infoBar.childNodes[3].innerHTML;
    let gemstoneWeight = parseFloat(infoBar.childNodes[5].innerHTML);
    let gemstonePrice = parseFloat(infoBar.childNodes[7].innerHTML);
    const editedGemstoneName = nodeList[3][0];
    const editedGemstoneWeight = nodeList[3][1];
    const editedGemstonePrice = nodeList[3][2];
    
    let indexToEdit = gemstones.findIndex(obj => obj.id==gemstoneId);
    if (editActive == false){
        editBar.classList.add('open');
        editBar.classList.remove('hide');
        infoBar.classList.add('hide');
        infoBar.classList.remove('open');
        editActive = true
    } else if (editActive == true){
        editBar.classList.add('hide');
        editBar.classList.remove('open');
        infoBar.classList.add('open');
        infoBar.classList.remove('hide');

        if (validateWeightAndPrice(editedGemstoneWeight.value, editedGemstonePrice.value) == false){
            editedGemstoneWeight.value = '';
            editedGemstonePrice.value = '';
            return;
        }

        if (editedGemstoneName.value != "") {
            gemstones[indexToEdit]["name"] = editedGemstoneName.value;
        } else {
            gemstones[indexToEdit]["name"] = gemstoneName;
        }
        if (editedGemstoneWeight.value != "") {
            gemstones[indexToEdit]["weightInCarats"] = parseFloat(editedGemstoneWeight.value);
        } else{
            gemstones[indexToEdit]["weightInCarats"] = gemstoneWeight;
        }
        if (editedGemstonePrice.value != "") {
            gemstones[indexToEdit]["priceInUSD"] =  parseFloat(editedGemstonePrice.value)
        } else{
            gemstones[indexToEdit]["priceInUSD"] =  gemstonePrice
        }
        
        editActive = false;
        visualiseSortedGemstones();
    }
}
function createGemstone(){
    if(validateFormRequirements(createGemstoneID.value, createGemstoneName.value, createGemstoneWeight.value, createGemstonePrice.value) == false){
        console.log('error');
        return;
    }
    if(validateWeightAndPrice(createGemstoneWeight.value, createGemstonePrice.value) == false){
        console.log('error');
        return;
    }
    let json = createJSON(createGemstoneID.value, createGemstoneName.value, createGemstoneWeight.value, createGemstonePrice.value);
    
    gemstones.push(json)

    visualiseSortedGemstones();
    return json;
}

function createJSON(id, name, weight, price){
    let createdGemstone = {
        "id": parseInt(id),
        "name": name,
        "weightInCarats": parseFloat(weight),
        "priceInUSD": parseFloat(price)
    }
    return createdGemstone;

}
function validateWeightAndPrice(weight, price){
    if (parseFloat(weight) <=0){
        alert('weight cannot be less then zero');
        return false;
    }
    if (parseFloat(price) <=0){
        alert('price cannot be less then zero');
        return false;
    }
    return true;
}
function validateFormRequirements(id, name, weight, price){
    if(id == ''){
        alert('id field is requiered')
        return false;
    }
    if(name == ''){
        alert('name field is requiered')
        return false;
    }
    if (weight == ''){
        alert('weight field is requiered');
        return false;
    }
    if (price == 0){
        alert('price  field is requiered');
        return false;
    }
    return true;
}


// show all gems at the load
displayGemstones(currentGemstones)