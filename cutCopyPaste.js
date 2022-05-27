let ctrlKey;
document.addEventListener("keydown", (e) => {
    ctrlKey = e.ctrlKey;
})

document.addEventListener("keyup", (e) => {
    ctrlKey = e.ctrlKey;
})

for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        handleSelectedCells(cell);
    }
}

let copybtn = document.querySelector(".copy");
let cutbtn = document.querySelector(".cut");
let pastebtn = document.querySelector(".paste");


let rangeStorage = [];
function handleSelectedCells(cell) {
    cell.addEventListener("click", (e) => {
        //select cells range work
        if (!ctrlKey) return;

        if (rangeStorage.length >= 2) {
            defaultSelectedCellsUI();
            rangeStorage = [];
        }

        cell.style.border = "3px solid #218c74"

        let rid = Number(cell.getAttribute("rid"));
        let cid = Number(cell.getAttribute("cid"));
        rangeStorage.push([rid, cid]);
        console.log(rangeStorage);
    })
}

function defaultSelectedCellsUI() {
    for (let i = 0; i < rangeStorage.length; i++) {
        let cell = document.querySelector(`.cell[rid="${rangeStorage[i][0]}"][cid="${rangeStorage[i][1]}"]`);
        cell.style.border = "1px solid lightgrey";

    }
}
let copyData = [];
copybtn.addEventListener("click", (e) => {
    if(rangeStorage.length<2){
        return;
    }
    copyData = [];
    let [strow,stcol,endrow,endcol] = [ rangeStorage[0][0], rangeStorage[0][1], rangeStorage[1][0], rangeStorage[1][1]];
    for (let i = strow; i <= endrow; i++) {
        let copyRow = [];
        for (let j = stcol; j <= endcol; j++) {
            let cellProp = sheetDB[i][j];
            copyRow.push(cellProp);
        }
        copyData.push(copyRow);
    }

    defaultSelectedCellsUI();
})

cutbtn.addEventListener("click",(e)=>{
    if(rangeStorage.length<2){
        return;
    }

    
    let [strow,stcol,endrow,endcol] = [ rangeStorage[0][0], rangeStorage[0][1], rangeStorage[1][0], rangeStorage[1][1]];
    for (let i = strow; i <= endrow; i++) {
        
        for (let j = stcol; j <= endcol; j++) {
            let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
            // Db
            let cellProp = sheetDB[i][j];
            cellProp.value = "";
            cellProp.bold = false;
            cellProp.italic = false;
            cellProp.underline = false;
            cellProp.alignment = "left";
            cellProp.fontFamily = "monospace";
            cellProp.fontSize = "14";
            cellProp.fontColor = "#000000";
            cellProp.BGcolor = "#000000";

            //UI
            
            cell.click();
        }
        
    }
    defaultSelectedCellsUI();
    
})

pastebtn.addEventListener("click", (e) => {
    // paste cells data
    if(rangeStorage.length<2){
        return;
    }

    let rowdiff = Math.abs(rangeStorage[0][0] - rangeStorage[1][0]);
    let coldiff = Math.abs(rangeStorage[1][1] - rangeStorage[0][1]);

    //Target
    let address = addressBar.value;
    let [strow, stcol] = decodeRIDCIDFromAddress(address);
    //r -> refers copydata row
    //c -> refers copydata col
    for (let i = strow, r = 0; i <= strow + rowdiff; i++, r++) {
        for (let j = stcol, c = 0; j <= stcol + coldiff; j++, c++) {
            let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
            if (!cell) continue;
            //DB
            let data = copyData[r][c];
            let cellProp = sheetDB[i][j];
            cellProp.value = data.value;
            cellProp.bold = data.bold,
            cellProp.italic = data.italic,
            cellProp.underline = data.underline,
            cellProp.alignment = data.alignment,
            cellProp.fontFamily = data.fontFamily,
            cellProp.fontSize = data.fontSize,
            cellProp.fontColor = data.fontColor,
            cellProp.BGcolor = data.BGcolor, //Just for indication purpose

            

            //UI
            cell.click();


        }
    }

})