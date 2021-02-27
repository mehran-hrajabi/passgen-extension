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
        body.classList.remove("light");
        body.classList.add("dark");
        darkMode.checked = true;
    }
    else if(!vars.isDark){
        body.classList.remove("dark");
        body.classList.add("light");
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
    if(darkMode.checked){
        chrome.storage.sync.set({'isDark': false}, function(){
            body.classList.remove("light");
            body.classList.add("dark");
        });
    }
    else if(!darkMode.checked){
        chrome.storage.sync.set({'isDark': true}, function(){
            body.classList.remove("dark");
            body.classList.add("light");
        });
    }
    chrome.storage.sync.set({'isDark': darkMode.checked});
});

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