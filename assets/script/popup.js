showMasterPass = document.querySelector("#masterPass");
passwordGenerator = document.querySelector("#passGen");
nameInput = document.querySelector("#nameInput");
outputHash = document.querySelector("#outputHash");
copyImg = document.querySelector("#copy-to-clipboard");

chrome.storage.sync.get('master', function(pass){
    showMasterPass.textContent = pass.master;
});

passwordGenerator.addEventListener("click",async function(){
    let concatStrings = showMasterPass.textContent.concat(nameInput.value);
    const digestHex = await digestMessage(concatStrings);
    outputHash.value = digestHex;
});

async function digestMessage(message) {
    const msgUint8 = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

copyImg.addEventListener("click",function copyToClipboard(){
    outputHash.select();
    document.execCommand("copy");
});