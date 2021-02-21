const setMasterBtn = document.querySelector("#master-button");
const savedFeedback = document.querySelector("#master-success");

setMasterBtn.addEventListener("click",function(){
    let masterInput = document.querySelector("#master-input");

    if(masterInput.value){
        chrome.storage.sync.set({'master': masterInput.value}, function(pass){
            console.log("Master password has been set.");
        });

        masterInput.value="";

        savedFeedback.classList.remove("hide");
        savedFeedback.classList.add("show");

        setTimeout(function(){
            savedFeedback.classList.add("fade");
        },1000);

        setTimeout(function(){
            savedFeedback.classList.remove("show");
            savedFeedback.classList.add("hide");
        },2500);
    }
});