const showMasterPass = document.querySelector("#masterPass");
const showHashAlgo = document.querySelector("#showHashAlgo");
const passwordGenerator = document.querySelector("#passGen");
const nameInput = document.querySelector("#nameInput");
const outputHash = document.querySelector("#outputHash");
const copyImg = document.querySelector("#copy-to-clipboard");
const masterPassError = document.querySelector("#masterError");
const hashAlgoError = document.querySelector("#hashError");
const doubleError = document.querySelector("#twoErrors");
let algo, master;

chrome.storage.sync.get(['master','algorithm'], function(vars){
    showMasterPass.textContent = vars.master;
    showHashAlgo.textContent = vars.algorithm;
    algo = vars.algorithm;
    master = vars.master;
});

passwordGenerator.addEventListener("click",async function(){
    if(master == undefined && algo != undefined){
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
    else if(algo == undefined && master != undefined){
        hashAlgoError.classList.remove("remove");
        hashAlgoError.classList.add("create");

        setTimeout(function(){
            hashAlgoError.classList.add("fade");
        },2000);

        setTimeout(function(){
            hashAlgoError.classList.remove("create");
            hashAlgoError.classList.add("remove");
            hashAlgoError.classList.remove("fade");
        },2500);
    }
    else if(algo == undefined && master == undefined){
        doubleError.classList.remove("remove");
        doubleError.classList.add("create");

        setTimeout(function(){
            doubleError.classList.add("fade");
        },3500);

        setTimeout(function(){
            doubleError.classList.remove("create");
            doubleError.classList.add("remove");
            doubleError.classList.remove("fade");
        },5000);
    }
    else{
        let concatStrings = showMasterPass.textContent.concat(nameInput.value);
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