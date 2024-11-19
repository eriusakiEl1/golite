import { Editor } from '@monaco-editor/react';
import { useState, useRef } from 'react';
import { Button, Grid, Box, Typography } from '@mui/material';

// Clase Automata
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
        if (this.currentSt === 0) this.cadena = "";
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
                console.log(this.cadena + " Constante Númerica");
                this.currentSt = 0;
                break;
            case 6:
                console.log(this.cadena + " Cadena numérica NO válida");
                this.currentSt = 0;
                break;
            case 8:
                console.log(this.cadena + " Cadena inválida");
                this.currentSt = 0;
                break;
            case 14:
                console.log(this.cadena + " Token");
                this.currentSt = 0;
                break;
            case 18:
                console.log(this.cadena + " Identificador");
                this.currentSt = 0;
                break;
        }
    }
}

// Función para cargar datos desde un recurso estático
async function leerArchivo(ruta) {
    const response = await fetch(ruta);
    if (!response.ok) {
        throw new Error(`Error al cargar el archivo: ${ruta}`);
    }
    return await response.text();
}

function App() {
    const [contentMarkdown, setContentMarkdown] = useState('');
    const [errors, setErrors] = useState([]); // Lista de errores
    const [resultado, setResultado] = useState(''); // Estado para el resultado
    const editorRef = useRef(null);

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;
    };

    async function ejecutarAutomata(code) {
        try {
            const datosMatriz = await leerArchivo('/matriz.txt');
            const lineas = datosMatriz.split('\n');
            const matriz = lineas.map(linea => linea.split('\t').map(Number));

            const automata = new Automata(matriz);
            let erroresDetectados = [];
            let resultadoAutomata = "";

            for (let meter = 0; meter < code.length; meter++) {
                try {
                    automata.procesarCaracter(code[meter]);
                    const tipo =
                        automata.currentSt === 4
                            ? "Constante Númerica"
                            : automata.currentSt === 6
                            ? "Cadena numérica NO válida"
                            : automata.currentSt === 8
                            ? "Cadena inválida"
                            : automata.currentSt === 14
                            ? "Token"
                            : automata.currentSt === 18
                            ? "Identificador"
                            : "";

                    if (tipo) {
                        resultadoAutomata += `${automata.cadena.padEnd(15)} ${tipo}\n`;
                    }
                } catch (e) {
                    erroresDetectados.push({
                        type: "Léxico",
                        message: `Error en el carácter '${code[meter]}' en posición ${meter + 1}`,
                    });
                }
            }

            console.log("Resultado Automata:", resultadoAutomata); // Depuración
            setResultado(resultadoAutomata.trim());
            setErrors(erroresDetectados);
        } catch (error) {
            console.error("Error al ejecutar el autómata:", error);
            setErrors([{ type: "General", message: error.message }]);
        }
    }

    const handleLexico = () => {
        const code = editorRef.current.getValue();
        ejecutarAutomata(code);
    };

    const clearErrors = () => {
        setErrors([]);
        setResultado("");
    };

    return (
        <div>
            <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px' }}>
                <img src='/logo-tec.png' alt='logo tecnm en celaya' width='300' />
                <div>
                    <Button variant="contained" color="primary" onClick={handleLexico} style={{ marginRight: '10px' }}>
                        Análisis Léxico
                    </Button>
                    <Button variant="contained" color="secondary" style={{ marginRight: '10px' }}>
                        Análisis Sintáctico
                    </Button>
                    <Button variant="contained" color="success">
                        Análisis Semántico
                    </Button>
                </div>
                <img src='/logo-tec2.png' alt='logo tecnm en celaya' width='100' />
            </header>

            <Grid container>
                <Grid item xs={12} md={8}>
                    <Box sx={{ padding: 2 }}>
                        <Editor
                            height="80vh"
                            theme="vs-light"
                            defaultLanguage="go"
                            onChange={(value) => setContentMarkdown(value)}
                            onMount={handleEditorDidMount}
                            value='//Hello, Welcome to GoLite'
                        />
                    </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Box
                        sx={{
                            backgroundColor: 'primary.light',
                            color: 'white',
                            padding: 2,
                            height: '80vh',
                            borderRadius: 1,
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Typography variant="h6" sx={{ marginBottom: 2 }}>
                            Resultado
                        </Typography>
                        <Box
                            id="Resultado"
                            sx={{
                                flex: 1,
                                backgroundColor: '#ffffff',
                                color: '#000000',
                                borderRadius: 1,
                                padding: 2,
                                overflowY: 'auto',
                                height: '100%',
                                whiteSpace: 'pre-wrap',
                                wordWrap: 'break-word',
                                boxShadow: '0px 2px 5px rgba(0,0,0,0.1)',
                            }}
                        >
                            <pre>{resultado || "No se ha generado ningún resultado aún."}</pre>
                        </Box>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={clearErrors}
                            sx={{ marginTop: 2 }}
                        >
                            Limpiar Resultado
                        </Button>
                    </Box>
                </Grid>
            </Grid>

            <footer style={{ backgroundColor: '#f4f4f4', padding: '10px', borderTop: '1px solid #ccc' }}>
                <Typography variant="h6">Errores Detectados</Typography>
                <Box
                    sx={{
                        maxHeight: '150px',
                        overflowY: 'auto',
                        backgroundColor: '#fff',
                        padding: 2,
                        borderRadius: 1,
                        boxShadow: '0px 2px 5px rgba(0,0,0,0.1)',
                    }}
                >
                    {errors.length === 0 ? (
                        <Typography variant="body1" color="textSecondary">
                            No se han detectado errores.
                        </Typography>
                    ) : (
                        <ul>
                            {errors.map((error, index) => (
                                <li key={index}>
                                    <Typography variant="body2" color="error">
                                        <strong>{error.type}:</strong> {error.message}
                                    </Typography>
                                </li>
                            ))}
                        </ul>
                    )}
                </Box>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={clearErrors}
                    sx={{ marginTop: 1 }}
                >
                    Limpiar Errores
                </Button>
            </footer>
        </div>
    );
}

export default App;