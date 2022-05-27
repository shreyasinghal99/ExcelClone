let collectedGraphComponent = [];
let graphComponentMatrix = [];

for (let i = 0; i < rows; i++) {
    let row = [];
    for (let j = 0; j < cols; j++) {
        // Arrays to store multiple children for each address
        row.push([]);
    }
    graphComponentMatrix.push(row);
}
//true -> cycle
function isGraphCyclic(graphComponentMatrix) {
    //dependency -  visited & dfsvisited( 2d array)
    let visited = [];
    let dfsVisited = []; // stack tracing

    for (let i = 0; i < rows; i++) {
        let visitedRow = [];
        let dfsVisitedRow = [];
        for (let j = 0; j < cols; j++) {

            visitedRow.push(false);
            dfsVisitedRow.push(false);
        }
        visited.push(visitedRow);
        dfsVisited.push(dfsVisitedRow);
    }

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (visited[i][j] == false){
            let response = dfsCycleDetection(graphComponentMatrix, i, j, visited, dfsVisited);
            if (response === true) return [i,j];}
        }
    }
    return null;
}

// start - visited = true dfsVisited = true
//End - dfsVisited = false;
//is visited[i][j] = true ;continue;
//cycle detection conditon - > visited[i][j] === true && dfsvisited[i][j] === true
function dfsCycleDetection(graphComponentMatrix, srcr, srcc, visited, dfsVisited) {

    visited[srcr][srcc] = true;
    dfsVisited[srcr][srcc] = true;
    //a1 
    for (let children = 0; children < graphComponentMatrix[srcr][srcc].length; children++) {
        let [nbrr, nbrc] = graphComponentMatrix[srcr][srcc][children];
        if (visited[nbrr][nbrc] === false) {
            let response = dfsCycleDetection(graphComponentMatrix, nbrr, nbrc, visited, dfsVisited);
            if (response) return true; // return immediately when cycle detected
        }
        else if (visited[nbrr][nbrc] === true && dfsVisited[nbrr][nbrc] === true) {
            return true;
        }
    }

    dfsVisited[srcr][srcc] = false;
    return false;
}