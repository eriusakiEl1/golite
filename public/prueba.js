const fs = require('fs');

class Automata {
    constructor(matriz) {
        this.matriz = matriz;
        this.cadena = "";
        this.currentSt = 0;
        this.varCarac = 0;
    }
    getValorCarac(carac) {
        switch (carac) {
            case 'A': return 1;
            case 'F': return 2;
            case 'I': return 3;
            case 'N': return 4;
            case 'P': return 5;
            case 'T': return 6;
            case 'U': return 7;
            case 'Z': return 8;
            case '0': return 9;
            case '1': return 10;
            case '2': return 11;
            case '3': return 12;
            case '4': return 13;
            case '5': return 14;
            case '6': return 15;
            case '7': return 16;
            case '8': return 17;
            case '9': return 18;
            case '.': return 19;
            case ';': return 20;
            case '*': return 21;
            case '+': return 22;
            case '<': return 23;
            case '>': return 24;
            case '&': return 25;
            case '=': return 26;
            case '(': return 27;
            case ')': return 28;
            case '{': return 29;
            case '}': return 30;
            case 'Ñ': return 31;
            case ']': return 30;
            case ' ': return 32;
            default: return 3141592;
        }
    }
    procesarCaracter(carac) {
        if (this.currentSt === 0)
            this.cadena = "";
        this.cadena += carac;
        carac = carac.toUpperCase();
        this.varCarac = this.getValorCarac(carac);

        if (this.varCarac < 50) {
            this.currentSt = this.matriz[this.currentSt + 1][this.varCarac];
            this.varCarac = 0;
        }
        this.realizarAccion();
    }

    realizarAccion() {
        switch (this.currentSt) {
            case 4:
                console.log(this.cadena + "Constante Númerica");
                this.currentSt = 0;
                break;
            case 6:
                console.log(this.cadena + "Cadena numérica NO válida");
                this.currentSt = 0;
                break;
            case 8:
                console.log(this.cadena + "Cadena inválida");
                this.currentSt = 0;
                break;
            case 14:
                console.log(this.cadena + "Token");
                this.currentSt = 0;
                break;
            case 18:
                console.log(this.cadena + "Identificador");
                this.currentSt = 0;
                break;
        }
    }
}
function leerArchivo(ruta) {
    return new Promise((resolve, reject) => {
        fs.readFile(ruta, 'utf8', (error, datos) => {
            if (error)
                reject(error);
            else
                resolve(datos);
        });
    });
}

async function ejecutarAutomata() {
    try {
        const datosMatriz = await leerArchivo('matriz.txt');
        const lineas = datosMatriz.split('\n');
        const matriz = lineas.map(linea => linea.split('\t').map(Number));
        const datosPrueba = await leerArchivo('prueba.txt');
        const automata = new Automata(matriz);
        for (let meter = 0; meter < datosPrueba.length; meter++)
            automata.procesarCaracter(datosPrueba[meter]);
    } catch (error) {console.error("Error:", error);}
}

ejecutarAutomata();