showMasterPass = document.querySelector("#masterPass");

chrome.storage.sync.get('master', function(pass){
    showMasterPass.textContent = pass.master;
});