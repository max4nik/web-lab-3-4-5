const openCreateGemstoneButton = document.getElementById('create_gemstone_open_button');
const create_gemstone_section = document.getElementById('create_gemstone');
const close_cross = document.getElementById('cross');

openCreateGemstoneButton.addEventListener('click', ()=>{
    create_gemstone_section.classList.add('show');
})

close_cross.addEventListener('click', ()=>{
    create_gemstone_section.classList.remove('show');
})