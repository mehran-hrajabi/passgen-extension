const showHashAlgo = document.querySelector("#showHashAlgo");
const passwordGenerator = document.querySelector("#passGen");
const nameInput = document.querySelector("#nameInput");
const outputHash = document.querySelector("#outputHash");
const copyImg = document.querySelector("#copy-to-clipboard");
const masterPassError = document.querySelector("#masterError");
let algo, master;

chrome.storage.sync.get(['master','algorithm'], function(vars){
    if(vars.algorithm == undefined){
        chrome.storage.sync.set({'algorithm': 'SHA-256'}, function(callback){
            console.log("Default hashing algorithm set to SHA-256.");
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

copyImg.addEventListener("click",function copyToClipboard(){
    outputHash.select();
    document.execCommand("copy");
});