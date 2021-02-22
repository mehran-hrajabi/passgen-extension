const setMasterBtn = document.querySelector("#master-btn");
const savedPassFeedback = document.querySelector("#master-success");
const setHashAlgo = document.querySelector("#algo-btn");
const savedHashFeedback = document.querySelector("#hash-success");
const masterInput = document.querySelector("#master-input");
const hashSelect = document.querySelector("#algo");

setMasterBtn.addEventListener("click",function(){
    chrome.storage.sync.get(['master','algorithm'], function(vars){
        if(vars.algorithm == undefined){
            console.log("y");
        }
        console.log(vars.master);
        console.log(vars.algorithm);
    });
    if(masterInput.value){
        chrome.storage.sync.set({'master': masterInput.value}, function(pass){
            console.log("Master password has been set.");
        });

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

setHashAlgo.addEventListener("click",function(){
    if(hashSelect.value){
        chrome.storage.sync.set({'algorithm': hashSelect.value}, function(pass){
            console.log("Hashing algorithm has been set!");
        });
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