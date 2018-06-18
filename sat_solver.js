exports.solve = function(fileName) {
    let formula = readFormula(fileName);
    if (cont === 10) {
        let result = doSolve(formula.clauses, formula.variables);
        return result;
    }
    else
        return "As clausulas e as variaveis nao batem com a linha de problema.";
};
let isLast = false;
let cont = 9;
function nextAssignment(currentAssignment) {
    for (x = 0; x < currentAssignment.length; x++) {
        if (currentAssignment[x] === 1) {
            currentAssignment[x] = 0;
            x = currentAssignment.length;
        }
        else {
            if (x === currentAssignment.length - 1) {
                isLast = true;
            }
            currentAssignment[x] = 1;
        }
    }
    return currentAssignment;
}
function doSolve(clauses, assignment) {
    let isSat = false;
    while ((!isSat)) {
        let test = true;
        for ( t = 0; t < clauses.length && test; t++) {
            let test2 = true;
            for ( j = 0; j < clauses[t].length && test2; j++) {
                if (clauses[t][j] <= 0) {
                    if (!assignment[Math.abs(clauses[t][j]) - 1]) {
                        test2 = false;
                    }
                }
                else {
                    if (assignment[Math.abs(clauses[t][j]) - 1]) {
                        test2 = false;
                    }
                }
                if (j === clauses[t].length - 1 && test2) {
                    test = false;
                }
            }
            if (t === clauses.length - 1) {
                isSat = test;
            }
        }
        if (!isLast && !isSat) {
            assignment = nextAssignment(assignment);
        }
        else {
            break;
        }
    }
    let result = {'isSat': isSat, satisfyingAssignment: null};
    if (isSat) {
        result.satisfyingAssignment = assignment;
    }
    return result;
}
function readFormula(fileName) {
    var fs = require('fs');
    var file = fs.readFileSync(fileName).toString();
    let text = file.split('\r\n');
    let clauses = readClauses(text);
    let variables = readVariables(clauses);
    let specOk = checkProblemSpecification(text, clauses, variables);
    let result = { 'clauses': [], 'variables': [] };
    if (specOk) {
        result.clauses = clauses;
        result.variables = variables;
        cont = 10;
    }
    return result;
}
function readClauses(text) {
    let onlyClauses = "";
    for (w = 0; w <text.length; w++) {
        if (text[w].charAt(0) !== 'c' && text[w].charAt(0) !== 'p') {
            onlyClauses = onlyClauses +' '+text[w];
        }
    }
    let arrayClauses = [];
    let arrayAux = [];
    arrayClauses = onlyClauses.split(' 0');
    arrayClauses.pop();
    for (q = 0; q < arrayClauses.length; q++) {
        arrayAux = arrayClauses[q].split(' ');
        arrayAux.shift();
        for (h = 0; h < arrayAux.length; h++) {
            arrayAux[h] = parseInt(arrayAux[h]);
        }
        arrayClauses[q] = arrayAux;
    }
    return arrayClauses;
}
function readVariables(clauses) {
    let arrayVariables = [];
    for (y = 0; y < clauses.length; y++) {
        for (u = 0; u < clauses[y].length; u++) {
            if (arrayVariables[Math.abs(clauses[y][u]) - 1] !== 1) {
                arrayVariables[Math.abs(clauses[y][u]) - 1] = 1;
            }
        }
    }
    return arrayVariables;
}
function checkProblemSpecification(text, clauses, variables) {
    let pLine = "";
    for (j = 0; j <text.length; j++) {
        if (text[j].charAt(0) === 'p') {
            pLine = text[j];
            j = text.length;
        }
    }
    let pLineAux = [];
    pLineAux = pLine.split(' ');
    pLine = [parseInt(pLineAux[2]), parseInt(pLineAux[3])];
    return pLine[0] === variables.length && pLine[1] === clauses.length;
}