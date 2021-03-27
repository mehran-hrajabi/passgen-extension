const body = document.querySelector("body");
const showHashAlgo = document.querySelector("#showHashAlgo");
const passwordGenerator = document.querySelector("#passGen");
const masterSet = document.querySelector("#masterSet");
const masterInput = document.querySelector("#masterInput");
const savedPassFeedback = document.querySelector("#masterSuccess");
const nameInput = document.querySelector("#nameInput");
const outputHash = document.querySelector("#outputHash");
const copyImg = document.querySelector("#copy-to-clipboard");
const masterPassError = document.querySelector("#masterError");
const setHashAlgo = document.querySelector("#algoBtn");
const savedHashFeedback = document.querySelector("#hashSuccess");
const hashSelect = document.querySelector("#algo");
const copyTooltip = document.querySelector("#tooltip-copy");
const darkMode = document.querySelector("#checkMode");
const modeSlider = document.querySelector(".mode-slider");
const buttons = document.querySelectorAll(".popup-btns");
const successFeedbacks = document.querySelectorAll(".popup-success");
const inputs = document.querySelectorAll(".popup-inputs");
const menuItems = document.getElementsByClassName("accordion");
let algo, master;

//Get values in chrome storage and set default for the first time use
chrome.storage.sync.get(['master','algorithm','isDark'], function(vars){
    //Dark mode
    if(vars.isDark == undefined){
        chrome.storage.sync.set({'isDark': false});
    }
    if(vars.isDark){
        darkMode.checked = true;
        setDarkThemeClasses();
    }
    else if(!vars.isDark){
        setLightThemeClasses();
    }
    
    //Hashing algorithm and master password
    if(vars.algorithm == undefined){
        chrome.storage.sync.set({'algorithm': 'SHA-256'}, function(){
            showHashAlgo.textContent = 'SHA-256';
            algo = 'SHA-256';
        });
    }
    else {
        document.getElementById(vars.algorithm).selected = true;
        showHashAlgo.textContent = vars.algorithm;
        algo = vars.algorithm;
        master = vars.master;
    }
});

//Enable or disable dark mode
darkMode.addEventListener("change", function darkModeHandler(){
    chrome.storage.sync.set({'isDark': darkMode.checked});
    if(darkMode.checked){
        setDarkThemeClasses();
    }
    else if(!darkMode.checked){
        setLightThemeClasses();
    }
});

//Apply dark mode classes to elements
function setDarkThemeClasses(){
    body.classList.remove("light");
    body.classList.add("dark");
    for (i=0; i<menuItems.length; i++) {
        menuItems[i].classList.remove("lightMode-accordion");
        menuItems[i].classList.add("darkMode-accordion");
    }
    for (i=0; i<inputs.length; i++) {
        inputs[i].classList.remove("input-lightMode");
        inputs[i].classList.add("input-darkMode");
    }
    for (i=0; i<buttons.length; i++) {
        buttons[i].classList.remove("btn-lightMode");
        buttons[i].classList.add("btn-darkMode");
    }
    for (i=0; i<successFeedbacks.length; i++) {
        successFeedbacks[i].classList.remove("success-darkMode");
        successFeedbacks[i].classList.add("success-lightMode");
    }
    copyTooltip.classList.remove("tooltip-light");
    copyTooltip.classList.add("tooltip-dark");
    copyImg.src="./assets/images/copy-dark.png";
}
//Apply light mode classes to elements
function setLightThemeClasses(){
    body.classList.remove("dark");
    body.classList.add("light");
    for (i=0; i<menuItems.length; i++) {
        menuItems[i].classList.remove("darkMode-accordion");
        menuItems[i].classList.add("lightMode-accordion");
    }
    for (i=0; i<inputs.length; i++) {
        inputs[i].classList.remove("input-darkMode");
        inputs[i].classList.add("input-lightMode");
    }
    for (i=0; i<buttons.length; i++) {
        buttons[i].classList.remove("btn-darkMode");
        buttons[i].classList.add("btn-lightMode");
    }
    for (i=0; i<successFeedbacks.length; i++) {
        successFeedbacks[i].classList.remove("success-darkMode");
        successFeedbacks[i].classList.add("success-lightMode");
    }
    copyTooltip.classList.remove("tooltip-dark");
    copyTooltip.classList.add("tooltip-light");
    copyImg.src="./assets/images/copy-light.png";
}

//Accordion menu event listeners
for(i=0; i<menuItems.length; i++){
    menuItems[i].addEventListener("click", function(){
        let panel = this.nextElementSibling;
        this.classList.toggle("active");

        if(panel.style.maxHeight){
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
        }
    });
}

//Generate password
passwordGenerator.addEventListener("click",async function(){
    if(master == undefined){
        masterPassError.classList.remove("remove");
        masterPassError.classList.add("create");

        setTimeout(function(){
            masterPassError.classList.add("fade");
        },2000);

        setTimeout(function(){
            masterPassError.classList.remove("create");
            masterPassError.classList.add("remove");
            masterPassError.classList.remove("fade");
        },2500);
    }
    else{
        let concatStrings = master.concat(nameInput.value);
        const digestHex = await digestMessage(concatStrings);
        outputHash.value = digestHex;        
    }
});
async function digestMessage(message) {
    const msgUint8 = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest(algo, msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

//Copy to clipboard tooltip
copyImg.addEventListener("click",function copyToClipboard(){
    if(outputHash.value){
        outputHash.select();
        document.execCommand("copy");

        copyTooltip.classList.remove("remove");
        copyTooltip.classList.add("create");
        setTimeout(function(){
            copyTooltip.classList.add("remove");
            copyTooltip.classList.remove("create");
        },900);        
    }
});

//Set master password
masterSet.addEventListener("click",function(){
    if(masterInput.value){
        chrome.storage.sync.set({'master': masterInput.value});

        masterInput.value="";

        savedPassFeedback.classList.remove("remove");
        savedPassFeedback.classList.add("create");

        setTimeout(function(){
            savedPassFeedback.classList.add("fade");
        },1000);

        setTimeout(function(){
            savedPassFeedback.classList.remove("create");
            savedPassFeedback.classList.add("remove");
            savedPassFeedback.classList.remove("fade");
        },2500);
    }
});

//Set hashing algorithm
setHashAlgo.addEventListener("click",function(){
    if(hashSelect.value){
        chrome.storage.sync.set({'algorithm': hashSelect.value});
    }

    showHashAlgo.textContent = hashSelect.value;

    savedHashFeedback.classList.remove("remove");
    savedHashFeedback.classList.add("create");

    setTimeout(function(){
        savedHashFeedback.classList.add("fade");
    },1000);

    setTimeout(function(){
        savedHashFeedback.classList.remove("create");
        savedHashFeedback.classList.add("remove");
        savedHashFeedback.classList.remove("fade");
    },2500);
});