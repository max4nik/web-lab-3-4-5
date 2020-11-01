const gemstoneList = document.getElementById('gemstones-list');
const searchBar = document.getElementById('find-gemstone');
const clearButton = document.getElementById('clear-search-bar');

const createGemstoneID = document.getElementById('create_id');
const createGemstoneName = document.getElementById('create_name');
const createGemstoneWeight = document.getElementById('create_weightInCarats');
const createGemstonePrice = document.getElementById('create_priceInUSD');

let editActive = false;

const gems_url = 'http://localhost:5000/gemstone';

let gemstones = [];
function fetchData(url){
fetch(url)
.then(response => response.json())
.then(data => { 
    for (i = 0; i < data.length; i++){
        gemstones.push(data[i]);    
    }
    displayGemstones(gemstones);
  });
}

let currentGemstones = gemstones

searchBar.addEventListener('keyup', filterGemstones)
function filterGemstones(searchString){
    const searchFilterString = searchString.target.value.toLowerCase();
    const filteredGemstones = gemstones.filter(gemstone =>{
        return gemstone.name.toLowerCase().includes(searchFilterString);
    });
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
    currentGemstones.forEach(gemstone => priceSum += gemstone.price_in_usd_dollars);
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
    return firstGemstone.weight_in_carats - secondGemstone.weight_in_carats;
}
function compareByPrice(firstGemstone, secondGemstone){
    return firstGemstone.price_in_usd_dollars - secondGemstone.price_in_usd_dollars;
}

// function to show current gems
const displayGemstones = (gemstonesToShow) => {
    const htmlString = gemstonesToShow.map((gemstone)=>{
        return `
        <li class="gemstone">
            <div>            
                <h2 class="gem_id">${gemstone.id}</h2>
                <h2>${gemstone.name}</h2>
                <h3 class="weightInCarats">${gemstone.weight_in_carats}</h3>
                <h3 class="priceInUSD">${gemstone.price_in_usd_dollars}</h3>
            </div>
            <form class="form__edit_gemstone" id="form__edit_gemstone">
                    <input id="edit_name" name="name" type="text" placeholder="Name">
                    <input id="edit_weightInCarats" name="weightInCarats" type="number" step=0.1 placeholder="Weight">
                    <input id="edit_priceInUSD" name="priceInUSD" type="number" step=100 placeholder="Price">
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
    let indexToDeleteFromCurrent = currentGemstones.findIndex(obj => obj.id==gemstoneId);
    if (indexToDeleteFromCurrent != -1){
        currentGemstones.splice(indexToDeleteFromCurrent, 1);
    }
    deleteGemstone(gemstoneId);
    visualiseSortedGemstones();
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
        openEditBar(editBar, infoBar);
        editActive = true;
    } else if (editActive == true){
        closeEditBar(editBar, infoBar);
        if (validateWeightAndPrice(editedGemstoneWeight.value, editedGemstonePrice.value) == false){
            editedGemstoneWeight.value = '';
            editedGemstonePrice.value = '';
            editActive = false;
            return;
        }
        let finalName = gemstoneName;
        let finalWeight = gemstoneWeight;
        let finalPrice = gemstonePrice;
        if (editedGemstoneName.value == "" && editedGemstoneWeight.value == "" && editedGemstonePrice.value == ""){
            editActive = false;
            visualiseSortedGemstones();
            return
        }
        if (editedGemstoneName.value != "") {
            gemstones[indexToEdit]["name"] = editedGemstoneName.value;
            finalName = editedGemstoneName.value;
        } else {
            gemstones[indexToEdit]["name"] = gemstoneName;
        }
        if (editedGemstoneWeight.value != "") {
            gemstones[indexToEdit]["weight_in_carats"] = parseFloat(editedGemstoneWeight.value);
            finalWeight =  parseFloat(editedGemstoneWeight.value);
        } else{
            gemstones[indexToEdit]["weight_in_carats"] = gemstoneWeight;
        }
        if (editedGemstonePrice.value != "") {
            gemstones[indexToEdit]["price_in_usd_dollars"] =  parseFloat(editedGemstonePrice.value);
            finalPrice = parseFloat(editedGemstonePrice.value);
        } else{
            gemstones[indexToEdit]["price_in_usd_dollars"] = gemstonePrice;
        }

        if (searchBar.value != '' && editedGemstoneName.value != '' && editedGemstoneName.value.includes(searchBar.value) == false){
            let indexToDeleteFromCurrent = currentGemstones.findIndex(obj => obj.id==gemstoneId);
            currentGemstones.splice(indexToDeleteFromCurrent, 1);
        }

        const jsonGemstone = createJSON(finalName, finalWeight, finalPrice)
        editGemstone(gemstoneId, jsonGemstone)
        editActive = false;
        visualiseSortedGemstones();
    }
}

function openEditBar(editBar, infoBar){
    editBar.classList.add('open');
    editBar.classList.remove('hide');
    infoBar.classList.add('hide');
    infoBar.classList.remove('open');
}

function closeEditBar(editBar, infoBar){
    editBar.classList.add('hide');
    editBar.classList.remove('open');
    infoBar.classList.add('open');
    infoBar.classList.remove('hide');
}
async function createGemstone(){
    if(validateFormRequirements(createGemstoneName.value, createGemstoneWeight.value, createGemstonePrice.value) == false){
        return;
    }
    if(validateWeightAndPrice(createGemstoneWeight.value, createGemstonePrice.value) == false){
        return;
    }
    const jsonGemstone = createJSON(createGemstoneName.value, createGemstoneWeight.value, createGemstonePrice.value);
    await postGemstone(jsonGemstone);
    visualiseSortedGemstones();
    return jsonGemstone;
}
async function postGemstone(newGemstone) {    
    let response = await fetch(gems_url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(newGemstone)
  }).then(response => response.json())
  .then(data => gemstones.push(data))
  return response;
}

async function deleteGemstone(id){
    let response = await fetch(gems_url + '/' + id, {
    method: 'DELETE',
    })
    return response;
}
async function editGemstone(id, editedGemstone){
    fetch(gems_url + '/' + id, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
    body: JSON.stringify(editedGemstone)
    })
}
function createJSON(name, weight, price){
    let createdGemstone = {
        "name": name,
        "weight_in_carats": parseFloat(weight),
        "price_in_usd_dollars": parseFloat(price)
    }
    return createdGemstone;
}


// functions for validating data

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
function validateFormRequirements(name, weight, price){
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
fetchData(gems_url);
