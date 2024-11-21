import { Editor } from '@monaco-editor/react';
import { useState, useRef } from 'react';
import QuantumFlare from './components/components.js';
import { Modal, IconButton, Button, Grid, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tab, Tabs} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import InfoIcon from '@mui/icons-material/Info';
import { green } from '@mui/material/colors';

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

// Función para cargar los datos de la matriz
async function leerMatriz(ruta) {
    const response = await fetch(ruta);
    if (!response.ok) {
        throw new Error(`Error al cargar el archivo: ${ruta}`);
    }
    return await response.text();
}

function FileUploadButton({ onFileUpload }) {
    // Manejador para el evento de cambio al seleccionar un archivo
    const handleFileChange = (event) => {
        const file = event.target.files[0]; // Obtén el archivo seleccionado
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const fileContent = e.target.result; // Contenido del archivo leído
                onFileUpload(fileContent); // Pasamos el contenido al componente principal
            };
            reader.readAsText(file); // Lee el archivo como texto
        }
    };

    return (
        <div>
            {/* El botón para subir archivos */}
            <Button
                component="label"
                variant="outlined"
                sx={{
                    color: green[500],
                    borderColor: green[500],
                    '&:hover': { backgroundColor: green[50] },
                }}
            >
                <AddCircleIcon sx={{ color: green[500], marginRight: 1 }} />
                Subir archivo
                <input
                    type="file"
                    accept=".txt" // Acepta solo archivos de texto
                    hidden
                    onChange={handleFileChange}
                />
            </Button>
        </div>
    );
}


function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [contentMarkdown, setContentMarkdown] = useState('');
    const [errors, setErrors] = useState([]); // Lista de errores
    const [resultado, setResultado] = useState(''); // Estado para el resultado
    const editorRef = useRef(null);
    const [isLexicoDone, setIsLexicoDone] = useState(false); // Estado para habilitar análisis sintáctico
    const [isSintacticoDone, setIsSintacticoDone] = useState(false); // Estado para habilitar análisis semántico

    const [tabIndex, setTabIndex] = useState(0); // Estado para manejar las pestañas

    {/* Tabla de símbolos */}
    const [symbolTable, setSymbolTable] = useState([]);

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;
    };
    const handleFileUpload = (fileContent) => {
        setContentMarkdown(fileContent); // Actualiza el contenido del editor con el contenido del archivo
    };

    {/* Modal */}
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    async function ejecutarAutomata(code) {
        try {
            const datosMatriz = await leerMatriz('/matriz.txt');
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
        setIsLexicoDone(true); // Habilitar el botón de análisis sintáctico
        const generatedTable = generateSymbolTable(code); // Generar la tabla de símbolos
        setSymbolTable(generatedTable);
    };

    const clearErrors = () => {
        setErrors([]);
        setResultado("");
    };

    const handleTabChange = (event, newIndex) => {
        setTabIndex(newIndex);
    };

    {/*Botones */}


const handleSintactico = () => {
    // Lógica del análisis sintáctico
    console.log("Análisis Sintáctico realizado");
    setIsSintacticoDone(true); // Habilitar el botón de análisis semántico
};

const handleSemantico = () => {
    // Lógica del análisis semántico
    console.log("Análisis Semántico realizado");
};
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#3f555d', color: '#fff' }}>
            {/* Header */}
            <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', backgroundColor: '#2c4343', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                <div style={{ backgroundColor: '#8bb3bf', padding: '10px', display: 'inline-block', borderRadius: '8px' }}>
                    <img src="/logo-tec.png" alt="logo tecnm en Celaya" width="200" />
                </div>    

                <div>
                {/* El botón para subir archivos */}
                    <FileUploadButton onFileUpload={handleFileUpload} />
                </div>            
                <div>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleLexico}
                    style={{ marginRight: '10px' }}
                >
                    Análisis Léxico
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleSintactico}
                    disabled={!isLexicoDone} // Deshabilitado hasta que se haga clic en Análisis Léxico
                    style={{ marginRight: '10px' }}
                >
                    Análisis Sintáctico
                </Button>
                <Button
                    variant="contained"
                    color="success"
                    onClick={handleSemantico}
                    disabled={!isSintacticoDone} // Deshabilitado hasta que se haga clic en Análisis Sintáctico
                >
                    Análisis Semántico
                </Button>
                    <IconButton onClick={handleOpenModal} style={{ color: '#fff' }}>
                        <InfoIcon />
                    </IconButton>
                </div>
                <img src='/logo-tec2.png' alt='logo tecnm en celaya' width='100' />
            </header>
            {/* Modal para información de los integrantes */}
            <Modal open={isModalOpen} onClose={handleCloseModal}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: '#5a7a84',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                        color: '#fff',
                    }}
                >
                    <Typography variant="h6" component="h2" gutterBottom>
                        Fundadores de GoLite
                    </Typography>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item>
                            <Box
                                sx={{
                                    width: 50,
                                    height: 50,
                                    overflow: 'hidden',
                                    borderRadius: '50%',
                                    border: '2px solid #fff',
                                }}
                            >
                                <img
                                    src="/img_integrantes/robert.jpeg"
                                    alt="Andrade Ramírez Roberto Carlos"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </Box>
                        </Grid>
                        <Grid item>
                            <Typography variant="body1" gutterBottom>
                                Andrade Ramírez Roberto Carlos
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid container spacing={2} alignItems="center">
                        <Grid item>
                            <Box
                                sx={{
                                    width: 50,
                                    height: 50,
                                    overflow: 'hidden',
                                    borderRadius: '50%',
                                    border: '2px solid #fff',
                                }}
                            >
                                <img
                                    src="/img_integrantes/lalo.jpeg"
                                    alt="Moya Zamarripa Lalo"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </Box>
                        </Grid>
                        <Grid item>
                            <Typography variant="body1" gutterBottom>
                                Moya Zamarripa Lalo
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid container spacing={2} alignItems="center">
                        <Grid item>
                            <Box
                                sx={{
                                    width: 50,
                                    height: 50,
                                    overflow: 'hidden',
                                    borderRadius: '50%',
                                    border: '2px solid #fff',
                                }}
                            >
                                <img
                                    src="/img_integrantes/dylan.jpeg"
                                    alt="Ruelas Aguirre Dylan"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </Box>
                        </Grid>
                        <Grid item>
                            <Typography variant="body1" gutterBottom>
                                Ruelas Aguirre Dylan
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid container spacing={2} alignItems="center">
                        <Grid item>
                            <Box
                                sx={{
                                    width: 50,
                                    height: 50,
                                    overflow: 'hidden',
                                    borderRadius: '50%',
                                    border: '2px solid #fff',
                                }}
                            >
                                <img
                                    src="/img_integrantes/sergio.jpeg"
                                    alt="Urbina Zarate Sergio"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </Box>
                        </Grid>
                        <Grid item>
                            <Typography variant="body1" gutterBottom>
                                Urbina Zarate Sergio
                            </Typography>
                        </Grid>
                    </Grid>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCloseModal}
                        sx={{ mt: 2 }}
                    >
                        Cerrar
                    </Button>
                </Box>
            </Modal>
            {/* Main Content */}
            <Grid container spacing={3} sx={{ flex: 1 }}>
                {/* Editor */}
                <Grid item xs={12} md={8}>
                    <Box sx={{ padding: 2 }}>
                        <Editor
                            height="60vh"
                            theme="vs-dark"
                            defaultLanguage="go"
                            onChange={(value) => setContentMarkdown(value)}
                            onMount={handleEditorDidMount}
                            value={contentMarkdown} 
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
                                        <TableCell sx={{ color: '#fff' }}><strong>Tipo de Token</strong></TableCell>
                                        <TableCell sx={{ color: '#fff' }}><strong>Lexema</strong></TableCell>
                                        <TableCell sx={{ color: '#fff' }}><strong>Tipo de Símbolo</strong></TableCell>
                                        <TableCell sx={{ color: '#fff' }}><strong>Posición</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {symbolTable.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{row.Componente}</TableCell>
                                            <TableCell>{row.Lexema}</TableCell>
                                            <TableCell>{row.Tipo}</TableCell>
                                            <TableCell>{row.Posicion}</TableCell>
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
function generateSymbolTable(code) {
    try {
      const tokens = QuantumFlare.construct(code);
      const validTokens = tokens.filter(token => token !== null);
  
      // Formatear los datos para la tabla
      return validTokens.map(token => ({
        Componente: token.Componente,
        Lexema: token.Lexema,
        Tipo: token.Tipo || "-", // Algunos tokens no tienen "Tipo"
        Posicion: `[${token.Posicion.start.line}, ${token.Posicion.start.column}]`
      }));
    } catch (error) {
      console.error("Error durante el análisis:", error.message);
      return [];
    }
  }
  const exampleCode = `
    var x: int;
    if (x == 5) {
      x = x + 1;
    }
  `;
  
  const symbolTable = generateSymbolTable(exampleCode);
  console.log(symbolTable);
  
export default App;