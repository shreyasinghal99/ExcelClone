for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        cell.addEventListener("blur", (e) => {
            let address = addressBar.value;
            let [activeCell, cellProp] = getCellAndCellProp(address);
            let enteredData = activeCell.innerText;
            if(enteredData === cellProp.value){
                return;
            }
            cellProp.value = enteredData;

            //if data directly modified in cell :-> reset formula, remove parent child relation and update the values in children;
            removeChildFromParent(cellProp.formula);
            cellProp.formula = "";
            updateChildrenCells(address);
            
        })
    }
}

let formulaBar = document.querySelector(".formula-bar");

formulaBar.addEventListener("keydown", async (e) => {
    let inputFormula = formulaBar.value;
    if (e.key === "Enter" && inputFormula) {
        
        //if change in formula is made,break old relation and  add new relation
        let address = addressBar.value;
        let [cell, cellProp] = getCellAndCellProp(address);
        if (inputFormula != cellProp.formula) {
            removeChildFromParent(cellProp.formula)
        }

        addChildToGraphComponent(inputFormula,address);
        //check formula is cyclic or not then only evaluate
        let cycleResponse = isGraphCyclic(graphComponentMatrix);
         if(cycleResponse){
           //alert("Your formula is cyclic");
           let response = confirm("Your formula is cyclic. Do you want to trace you path?")
           while(response === true){
               //Keep on color tracking the cycle until user is satisfied
               await isGraphCyclicTracePath(graphComponentMatrix,cycleResponse);// i want to complete full iteration of color tracking so attack wait here also
               response = confirm("Your formula is cyclic. Do you want to trace you path?")
           }
           removeChildFromGraphComponent(inputFormula,address);
           return;
         }
        
        let evaluatedValue = evaluateFormula(inputFormula);
        //to update Ui and db
        setCellUiAndCellProp(evaluatedValue, inputFormula, address);
        addChildtoParent(inputFormula,address);
        console.log(sheetDB);
        updateChildrenCells(address);
    }
})

function addChildToGraphComponent(formula,childAddress){
    let [crid,ccid]= decodeRIDCIDFromAddress(childAddress);
    let encodedFormula = formula.split(" ");
    for(let i=0;i< encodedFormula.length;i++){
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue>=65 && asciiValue<=90){
            let [prid,pcid] = decodeRIDCIDFromAddress(encodedFormula[i]);
            graphComponentMatrix[prid][pcid].push([crid,ccid]);
        }
    }
    
}

function removeChildFromGraphComponent(formula,childAddress){
    let [crid,ccid]= decodeRIDCIDFromAddress(childAddress);
    let encodedFormula = formula.split(" ");
    for(let i=0;i< encodedFormula.length;i++){
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue>=65 && asciiValue<=90){
            let [prid,pcid] = decodeRIDCIDFromAddress(encodedFormula[i]);
            graphComponentMatrix[prid][pcid].pop([crid,ccid]);
        }
    } 
}

function updateChildrenCells(parentAddress) {
    console.log("update called");
    let [ParentCell, ParentCellProp] = getCellAndCellProp(parentAddress);
    let children = ParentCellProp.children;
    for (let i = 0; i < children.length; i++) {
        let childAddress = children[i];
        let [childCell, childCellProp] = getCellAndCellProp(childAddress);
        let childFormula = childCellProp.formula;
        let evaluatedValue = evaluateFormula(childFormula);
        setCellUiAndCellProp(evaluatedValue, childFormula, childAddress);
        //console.log("evaluated value of ",childAddress);
        updateChildrenCells(childAddress);
    }


}

function addChildtoParent(formula,address) {
    let childAddress = address;
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [ParentCell, ParentCellProp] = getCellAndCellProp(encodedFormula[i]);
            ParentCellProp.children.push(childAddress);
        }

    }

}

function removeChildFromParent(formula) {
    let childAddress = addressBar.value;
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [ParentCell, ParentCellProp] = getCellAndCellProp(encodedFormula[i]);
            let idx = ParentCellProp.children.indexOf(childAddress);
            ParentCellProp.children.splice(idx, 1);
        }

    }



}

function evaluateFormula(formula) {
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [cell, cellProp] = getCellAndCellProp(encodedFormula[i]);
            encodedFormula[i] = cellProp.value;
        }
    }
    let decodedFormula = encodedFormula.join(" ");
    return eval(decodedFormula);
}

function setCellUiAndCellProp(evaluatedValue, formula, address) {
    
    let [cell, cellProp] = getCellAndCellProp(address);
    cell.innerText = evaluatedValue;
    cellProp.value = evaluatedValue;
    cellProp.formula = formula;
    

}

//Establish parent child relation between cells

