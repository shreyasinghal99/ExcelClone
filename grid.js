let rows = 100;
let cols = 26;

let addressColCont = document.querySelector(".address-col-cont");
for(let i =0;i<rows;i++){
    let addressCol = document.createElement("div");
    addressCol.innerText = i+1;
    addressCol.setAttribute("class","address-col")
    addressColCont.appendChild(addressCol);
}

let rowColCont = document.querySelector(".address-row-cont")

for(let i=0;i<cols;i++){
    let addressRow = document.createElement("div");
    addressRow.innerText = String.fromCharCode(65+i) ;
    addressRow.setAttribute("class","address-row");
    rowColCont.appendChild(addressRow);
}

let gridCont = document.querySelector(".cells-cont");
for(let i=0;i<rows;i++){
    let rowCont = document.createElement("div");
    for(let j = 0;j<cols;j++){
        let cell = document.createElement("div");
        cell.setAttribute("class","cell");
        cell.setAttribute("contenteditable","true")
        cell.setAttribute("spellcheck","false");
        //Attributes for storage identification
        cell.setAttribute("rid",i);
        cell.setAttribute("cid",j);
        rowCont.appendChild(cell);
        

        addListenerForAddressBarDisplay(cell,i,j);

    }
    rowCont.setAttribute("class","row-cont");
    gridCont.appendChild(rowCont);
}

//Show value into the address bar on click
let addressBar = document.querySelector(".address-bar")
function addListenerForAddressBarDisplay(cell,i,j){
    
    cell.addEventListener("click",(e)=>{
     let row = i+1;
     let col = String.fromCharCode(65 + j);
     
     addressBar.value = `${col}${row}`;
     

    })
}

//By defult select frst cell

