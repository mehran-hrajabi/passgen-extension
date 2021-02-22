const showMasterPass = document.querySelector("#masterPass");
const showHashAlgo = document.querySelector("#showHashAlgo");
const passwordGenerator = document.querySelector("#passGen");
const nameInput = document.querySelector("#nameInput");
const outputHash = document.querySelector("#outputHash");
const copyImg = document.querySelector("#copy-to-clipboard");
let algo;

chrome.storage.sync.get(['master','algorithm'], function(vars){
    showMasterPass.textContent = vars.master;
    showHashAlgo.textContent = vars.algorithm;
    algo = vars.algorithm;
});

passwordGenerator.addEventListener("click",async function(){
    let concatStrings = showMasterPass.textContent.concat(nameInput.value);
    const digestHex = await digestMessage(concatStrings);
    outputHash.value = digestHex;
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