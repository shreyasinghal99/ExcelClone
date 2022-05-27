let activeSheetColor = "#ced6e0"
addSheetBtn = document.querySelector(".sheet-add-icon");
let sheetsFolderCont = document.querySelector(".sheets-folder-cont");
addSheetBtn.addEventListener("click", (e) => {
    let sheet = document.createElement("div");
    sheet.setAttribute("class", "sheet-folder");
    let allSheetsFolders = document.querySelectorAll(".sheet-folder");
    sheet.setAttribute("id", allSheetsFolders.length);

    sheet.innerHTML = `<div class="sheet-content">Sheet ${allSheetsFolders.length + 1}</div> `
    
    sheetsFolderCont.appendChild(sheet);
    sheet.scrollIntoView();
    createSheetDB();
    createGraphComponent();
    handleSheetActiveness(sheet);
    handleSheetRemoval(sheet);
    sheet.click();
})


function handleSheetDB(sheetIdx) {
    sheetDB = collectedSheetDB[sheetIdx];
    graphComponentMatrix = collectedGraphComponent[sheetIdx];
}

function handleSheetProperties() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
            cell.click();
        }
    }
    let firstCell = document.querySelector(".cell");
    firstCell.click();
}

function handleSheetUi(sheet) {

    let allSheetsFolders = document.querySelectorAll(".sheet-folder");
    for (let i = 0; i < allSheetsFolders.length; i++) {
        allSheetsFolders[i].style.backgroundColor = "transparent";
    }

    sheet.style.backgroundColor = activeSheetColor;

}

function handleSheetActiveness(sheet) {
    sheet.addEventListener("click", (e) => {
        let sheetIdx = Number(sheet.getAttribute("id"));
        handleSheetDB(sheetIdx);
        handleSheetProperties();
        handleSheetUi(sheet);
    })

}

function createSheetDB() {
    let sheetDB = [];

    for (let i = 0; i < rows; i++) {
        let sheetRow = [];
        for (let j = 0; j < cols; j++) {
            let cellProp = {
                bold: false,
                italic: false,
                underline: false,
                alignment: "left",
                fontFamily: "monospace",
                fontSize: "14",
                fontColor: "#000000",
                BGcolor: "#000000", //Just for indication purpose
                value: "",
                formula: "",
                children: [],

            }
            sheetRow.push(cellProp);
        }
        sheetDB.push(sheetRow);
    }
    collectedSheetDB.push(sheetDB)
}

function createGraphComponent() {
    let graphComponentMatrix = [];

    for (let i = 0; i < rows; i++) {
        let row = [];
        for (let j = 0; j < cols; j++) {
            // Arrays to store multiple children for each address
            row.push([]);
        }
        graphComponentMatrix.push(row);
    }
    collectedGraphComponent.push(graphComponentMatrix);

}

function handleSheetRemoval(sheet){
    sheet.addEventListener("mousedown",(e)=>{
       if(e.button !== 2) return;   //e.button  ==0 -> left  1-> scroll  2-> right click
       let allSheetsFolder = document.querySelectorAll(".sheet-folder");
        if(allSheetsFolder.length===1){
            alert("You need to have atleast one sheet!!");
            return;
        }
        let response = confirm("Your sheet will be removed permanently. Do you want to continue?");
        if(response){
        let sheetIdx = Number(sheet.getAttribute("id"));
        // Db removal
        collectedSheetDB.splice(sheetIdx,1);
        collectedGraphComponent.splice(sheetIdx,1);
        //UI remove
        handleSheetUIRemoval(sheet);

        //By default set sheet 1 to active
        sheetDB = collectedSheetDB[0];
        graphComponentMatrix = collectedGraphComponent[0];
        handleSheetProperties();
        }
        else return;
    })
}

function handleSheetUIRemoval(sheet){
    sheet.remove();
    let allSheetsFolder = document.querySelectorAll(".sheet-folder");
    for(let i =0;i<allSheetsFolder.length;i++){
        allSheetsFolder[i].setAttribute("id",i);
        let sheetCont = allSheetsFolder[i].querySelector(".sheet-content");
        sheetCont.innerText = `Sheet ${i+1}`
        allSheetsFolder[i].style.backgroundColor = "transparent";
    }
    allSheetsFolder[0].style.backgroundColor = activeSheetColor;
}