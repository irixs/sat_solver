/**
 * This file should be placed at the node_modules sub-directory of the directory where you're
 * executing it.
 *
 * Written by Fernando Castor in November/2017.
 */

exports.solve = function(fileName) {
    let formula = readFormula(fileName);
    let result = doSolve(formula.clauses, formula.variables);
    return result; // two fields: isSat and satisfyingAssignment
};


//--------------- troca a sequencia de binario --------------------------
// Receives the current assignment and produces the next one
function nextAssignment(currentAssignment) {
    // implement here the code to produce the next assignment based on currentAssignment.
    let isLast = false;
    for (let l = 0; l < currentAssignment.length; l++) {
        if (currentAssignment[l] === 1) {
            currentAssignment[l] = 0;
            l = currentAssignment.length;
        }
        else {
            if (l === currentAssignment.length - 1) {
                isLast = true;
            }
            currentAssignment[l] = 1;
        }
    }
    return newAssignment;
}

function doSolve(clauses, assignment) {
    let isSat = false;
    while ((!isSat)) {

        let test = true;
        for (let t = 0; t < clauses.length && test; t++) {
            let test2 = true;
            for (let j = 0; j < clauses[t].length && test2; j++) {
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
    return result
}

//--------------- LER O ARQUIVO -------------------
function readFormula(fileName) {
    let fs = require('fs');
    let file = fs.readFileSync('simple.cnf', 'utf8');
    let text = file.split("\r\n"); // QUEBRA O TEXTO NUM ARRAY PRA CADA LINHA DO TEXTO DO ARQUIVO
    let clauses = readClauses(text);
    let pLine = readPLine(text);
    let variables = readVariables(clauses);
    let specOk = checkProblemSpecification(pLine, clauses, variables);

    let result = { 'clauses': [], 'variables': [] };
    if (specOk) {
        result.clauses = clauses;
        result.variables = variables;
    }
    return result;
}


//------------- LER APENAS AS CLAUSULAS E SALVAR UM ARRAY --------------
function readClauses(text) {
    let sat = text.filter(function(text){ // VAI PEGAR APENAS AS LINHAS QUE TEM AS CLAUSULAS
        return text[0] !== 'c' && text[0] !== 'p' && text[0] !==''
    });
    let sat1 = sat.join(''); // TRANSFORMA A ENTRADA NUMA UNICA LINHA DE STRING
    sat = sat1.split("0"); // DIVIDE AS CLAUSULAS CORRETAMENTE
    sat.pop();

    for (let n = 0; n < sat.length; n++) {
        sat[n] = sat[n].split(" ");
        sat[n].pop();
        for (let b = 0; b < sat[n].length; b++) {
            sat[n][b] = parseInt(sat[n][b]); // AS CLAUSULAS FORAM DIVIDIDAS EM OUTRO ARRAY SEPARANDO CADA VARIAVEL E CONVERTENDO ELA DE STRING PARA INTEIRO.
        }
    }
    return sat;
}


//------------- PEGAR A QNT DE CLAUSULAS E VARIAVEIS DESCRITAS NA LINHA P --------------
function readPLine(text) {

    let pLine = text.filter(function(text) { // LER APENAS A LINHA QUE INICIALIZA COM P PARA PEGAR A QNT DE VARIAVEIS E CLAUSULAS RESPECTIVAMENTE
        return text[0] === 'p';
    });
    let pLine2 = pLine.split(" "); // A LINHA P VIROU UM ARRAY ONDE A POSICAO [2] = VARIAVEIS E [3] = CLAUSULAS
    pLine = [pLine2[2], pLine2[3]];
    return pLine;
}


//------------ IDENTIFICA AS VARIAVEIS E SALVA SUA QUANTIDADE NUM ARRAY --------------
function readVariables(clauses) {
    let array = [];
    for (let y = 0; y < clauses.length; y++) {
        for (let u = 0; u < clauses[y].length; u++) {
            if (array[Math.abs(clauses[y][u]) - 1] !== 1) {
                array[Math.abs(clauses[y][u]) - 1] = 1 // SALVA UM ARRAY DO TAMANHO DA QUATIDADE DE VARIAVEIS PREENCHIDO COM 1
            }
        }
    }
    return array;
}


//--------------- CHECAR SE AS CLAUSULAS E AS VARIAVEIS CONFEREM -----------------
function checkProblemSpecification(pLine, clauses, variables) {
    return pLine[0] === clauses.length && pLine[1] === variables.length;
}