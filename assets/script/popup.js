const body = document.querySelector("#body");
const showHashAlgo = document.querySelector("#showHashAlgo");
const passwordGenerator = document.querySelector("#passGen");
const nameInput = document.querySelector("#nameInput");
const outputHash = document.querySelector("#outputHash");
const copyImg = document.querySelector("#copy-to-clipboard");
const masterPassError = document.querySelector("#masterError");
const copyTooltip = document.querySelector("#tooltip-copy");
const darkMode = document.querySelector("#checkMode");
const modeSlider = document.querySelector(".mode-slider");
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

function setDarkThemeClasses(){
    body.classList.remove("light");
    body.classList.add("dark");
    outputHash.classList.remove("input-lightMode");
    outputHash.classList.add("input-darkMode");
    nameInput.classList.remove("input-lightMode");
    nameInput.classList.add("input-darkMode");
    passwordGenerator.classList.remove("btn-lightMode");
    passwordGenerator.classList.add("btn-darkMode");
    copyTooltip.classList.remove("tooltip-light");
    copyTooltip.classList.add("tooltip-dark");
}
function setLightThemeClasses(){
    body.classList.remove("dark");
    body.classList.add("light");
    outputHash.classList.remove("input-darkMode");
    outputHash.classList.add("input-lightMode");
    nameInput.classList.remove("input-darkMode");
    nameInput.classList.add("input-lightMode");
    passwordGenerator.classList.remove("btn-darkMode");
    passwordGenerator.classList.add("btn-lightMode");
    copyTooltip.classList.remove("tooltip-dark");
    copyTooltip.classList.add("tooltip-light");
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