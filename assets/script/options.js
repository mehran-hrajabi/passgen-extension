const setMasterBtn = document.querySelector("#master-btn");
const savedPassFeedback = document.querySelector("#master-success");
const setHashAlgo = document.querySelector("#algo-btn");
const savedHashFeedback = document.querySelector("#hash-success");
const masterInput = document.querySelector("#master-input");
const hashSelect = document.querySelector("#algo");

//Show default algorithm in dropdown menu
chrome.storage.sync.get('algorithm', function(vars){
    document.getElementById(vars.algorithm).selected = true;
});

//Set master password button
setMasterBtn.addEventListener("click",function(){
    if(masterInput.value){
        chrome.storage.sync.set({'master': masterInput.value});

        masterInput.value="";

        savedPassFeedback.classList.remove("hide");
        savedPassFeedback.classList.add("show");

        setTimeout(function(){
            savedPassFeedback.classList.add("fade");
        },1000);

        setTimeout(function(){
            savedPassFeedback.classList.remove("show");
            savedPassFeedback.classList.add("hide");
            savedPassFeedback.classList.remove("fade");
        },2500);
    }
});

//Set hashing algorithm
setHashAlgo.addEventListener("click",function(){
    if(hashSelect.value){
        chrome.storage.sync.set({'algorithm': hashSelect.value});
    }

    savedHashFeedback.classList.remove("hide");
    savedHashFeedback.classList.add("show");

    setTimeout(function(){
        savedHashFeedback.classList.add("fade");
    },1000);

    setTimeout(function(){
        savedHashFeedback.classList.remove("show");
        savedHashFeedback.classList.add("hide");
        savedHashFeedback.classList.remove("fade");
    },2500);
});