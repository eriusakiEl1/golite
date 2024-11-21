import { Editor } from '@monaco-editor/react';
import { useState, useRef } from 'react';
import { Button, Grid, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tab, Tabs} from '@mui/material';

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

    const [tabIndex, setTabIndex] = useState(0); // Estado para manejar las pestañas

    {/* Tabla de símbolos */}
    const [symbolTable, setSymbolTable] = useState([]);

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

    const handleTabChange = (event, newIndex) => {
        setTabIndex(newIndex);
    };


    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#3f555d', color: '#fff' }}>
            {/* Header */}
            <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', backgroundColor: '#2c4343', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                <img src='/logo-tec.png' alt='logo tecnm en celaya' width='200' />
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

            {/* Main Content */}
            <Grid container spacing={3} sx={{ flex: 1 }}>
                {/* Editor */}
                <Grid item xs={12} md={8}>
                    <Box sx={{ padding: 2 }}>
                        <Editor
                            height="60vh"  // Ajuste de tamaño
                            theme="vs-dark"  // Modo oscuro
                            defaultLanguage="go"
                            onChange={(value) => setContentMarkdown(value)}
                            onMount={handleEditorDidMount}
                            value='//Hello, Welcome to GoLite'
                        />
                    </Box>
                </Grid>

                {/* Symbol Table */}
                <Grid item xs={12} md={4}>
                    <Box sx={{ backgroundColor: '#4a646a', color: 'white', padding: 2, height: '80vh', borderRadius: 1 }}>
                        <Typography variant="h6" sx={{ marginBottom: 2 }}>Tabla de Símbolos</Typography>
                        <TableContainer component={Paper} sx={{ backgroundColor: '#3f555d', color: 'white' }}>
                            <Table sx={{ minWidth: 650 }} aria-label="symbol table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ color: '#fff' }}><strong>Nombre</strong></TableCell>
                                        <TableCell sx={{ color: '#fff' }}><strong>Tipo de Token</strong></TableCell>
                                        <TableCell sx={{ color: '#fff' }}><strong>Tipo de Símbolo</strong></TableCell>
                                        <TableCell sx={{ color: '#fff' }}><strong>Tipo de Dato</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {symbolTable.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{row.token}</TableCell>
                                            <TableCell>{row.type}</TableCell>
                                            <TableCell>{row.description}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Grid>
            </Grid>

            {/* Footer */}
            <footer style={{
                backgroundColor: '#2c4343',
                padding: '20px',
                borderTop: '1px solid #ccc',
                position: 'relative',
                width: '100%',
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 10,
                color: '#fff'
            }}>
                <Grid container spacing={2} sx={{ width: '100%' }}>
                    <Grid item xs={12}>
                        <Box sx={{
                            padding: 2,
                            borderRadius: 1,
                            backgroundColor: '#4a646a', // Fondo gris oscuro
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)', // Sombra suave
                            width: '100%' // Asegura que ocupe todo el ancho
                        }}>
                            <Tabs value={tabIndex} onChange={handleTabChange} aria-label="result and error tabs" variant="fullWidth">
                                <Tab label="Resultado" />
                                <Tab label="Errores" />
                            </Tabs>

                            {tabIndex === 0 && (
                                <Box sx={{ backgroundColor: '#2c4343', color: '#fff', borderRadius: 1, padding: 2, overflowY: 'auto' }}>
                                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                                        {resultado || "No se ha generado ningún resultado aún."}
                                    </Typography>
                                </Box>
                            )}

                            {tabIndex === 1 && (
                                <Box sx={{ backgroundColor: '#2c4343', color: '#fff', borderRadius: 1, padding: 2, overflowY: 'auto' }}>
                                    {errors.length === 0 ? (
                                        <Typography variant="body1" color="textSecondary">No se han detectado errores.</Typography>
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
                            )}

                            <Button variant="outlined" color="secondary" onClick={clearErrors} sx={{ marginTop: 2 }}>
                                Limpiar
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </footer>
        </div>
    );
}

export default App;