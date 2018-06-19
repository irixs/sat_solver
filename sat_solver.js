exports.solver = function(fileName) {
    let formula = readFormula(fileName);
    if (cont === 10) {
        let result = doSolve(formula.clauses, formula.variables);
        return result;
    }
    else
        return "As clausulas e as variaveis nao batem com a linha de problema.";
};
//------------------------ Variaveis Globais ------------------------
let isLast = false; // usado para avisar ao programa que é a ultima combinação possivel.
let cont = 9; // contador do specOk.

//---------------- Gerar Nova Atribuição de Valores -----------------
function nextAssignment(currentAssignment) {
    for (x = 0; x < currentAssignment.length; x++) {
        if (currentAssignment[x] === 1) { // se a variavel vale 1, substitui por 0, e retorna o novo array.
            currentAssignment[x] = 0;
            x = currentAssignment.length;
        }
        else {
            if (x === currentAssignment.length - 1) { // se chega a ultima variavel do problema,
                isLast = true;						  // significa que é a ultima combinação possível, e isLast é true.
            }
            currentAssignment[x] = 1; // atribui 1 à variavel quando ela vale 0.
        }
    }
    return currentAssignment;
}
//------------------ Retornar Resultado para o SAT ------------------
function doSolve(clauses, assignment) {
    let isSat = false;
    while ((!isSat)) {
        let allClauses = true;
        for ( t = 0; t < clauses.length && allClauses; t++) {
            let clauseLine = true;
            for ( j = 0; j < clauses[t].length && clauseLine; j++) { // analisa cada linha de clausulas.
                if (clauses[t][j] <= 0) { // para variaveis negadas.
                    if (!assignment[Math.abs(clauses[t][j]) - 1]) { // se a variavel (já com a negação) é true a clausula já está correta
                        clauseLine = false;                         // e o programa sai do for e entra na proxima linha de clausulas.
                    }
                }
                else { // variavel sem negação.
                    if (assignment[Math.abs(clauses[t][j]) - 1]) { // se true vai pra proxima linha de clausula.
                        clauseLine = false;
                    }
                }
                if (j === clauses[t].length - 1 && clauseLine) { // se chegou na ultima variavel da linha de clausula
                	                                             // e a linha inteira ainda é falsa, o assignment não é
                    allClauses = false;						     // satisfatível, e precisa de nova combinação de valores.
                }
            }
            if (t === clauses.length - 1 && allClauses) { // se chegou a ultima linha de clausula e allClauses
                isSat = allClauses;			              // é true, seu valor é repassado para o isSat.
            }
        }
        if (!isLast && !isSat) { // se não isSat e ainda não é a ultima combinação possível, vai gerar um novo assignment.
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
//-------------------------- Ler o Arquivo --------------------------
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
//--------------------- Criar Array de Clausulas --------------------
function readClauses(text) {
    let onlyClauses = ""; // variavel que vai receber as clausulas como uma unica string.
    for (w = 0; w <text.length; w++) {
        if (text[w].charAt(0) !== 'c' && text[w].charAt(0) !== 'p') {
            onlyClauses = onlyClauses +' '+text[w]; // adicionando as clausulas a string.
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
        arrayClauses[q] = arrayAux; // o arrayClauses recebe um array bidimensional 
    }								// com todas as clausulas e todas as variáveis num array próprio.
    return arrayClauses;
}
//----------------- Criar Array da Qnt de Variaveis -----------------
function readVariables(clauses) {
    let arrayVariables = [];
    for (y = 0; y < clauses.length; y++) {
        for (u = 0; u < clauses[y].length; u++) {
            if (arrayVariables[Math.abs(clauses[y][u]) - 1] !== 1) {
                arrayVariables[Math.abs(clauses[y][u]) - 1] = 1; // salva um array do tamanho da quantidade de variáveis com o valor 1.
            }
        }
    }
    return arrayVariables;
}
//------------------ Verificar Clauses e Variables ------------------
function checkProblemSpecification(text, clauses, variables) {
    let pLine = "";
    for (j = 0; j <text.length; j++) {
        if (text[j].charAt(0) === 'p') {
            pLine = text[j]; // se a linha se inicia por p, a string é salva no pLine.
            j = text.length;
        }
    }
    let pLineAux = [];
    pLineAux = pLine.split(' '); 
    pLine = [parseInt(pLineAux[2]), parseInt(pLineAux[3])]; // salva apenas os valores referentes a qnt de variáveis e de clausulas, respectivamente.
    return pLine[0] === variables.length && pLine[1] === clauses.length;
}