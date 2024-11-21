start
  = tokens*

tokens
  = keyword
  / identifier
  / number
  / string
  / arithmeticOperator
  / comparisonOperator
  / assignmentOperator
  / delimiter
  / whitespace

keyword
  = key:("var" / "int" / "float" / "string" / "bool" / "func" / "if" / "else" / "for" / "print" / "return" / "main") {
      return { Componente: "Palabra reservada", Lexema: key, Posicion: location() };
    }

identifier
  = id:([a-zA-Z_][a-zA-Z0-9_]*) {
      return { Componente: "Identificador", Lexema: id.join(""), Posicion: location() };
    }

number
  = float
  / integer

float
  = num:([0-9]+ "." [0-9]+) {
      return { Componente: "Número Flotante", Lexema: num.join(""), Posicion: location() };
    }

integer
  = num:([0-9]+) {
      return { Componente: "Número Entero", Lexema: num.join(""), Posicion: location() };
    }

string
  = str:("\"" [^"\\"]* "\"") {
      return { Componente: "Cadena", Lexema: str.join(""), Posicion: location() };
    }

arithmeticOperator
  = op:("+" / "-" / "*" / "/") {
      return { Componente: "Operador Aritmético", Lexema: op, Posicion: location() };
    }

comparisonOperator
  = op:("==" / "!=" / "<=" / ">=" / "<" / ">") {
      return { Componente: "Operador de Comparación", Lexema: op, Posicion: location() };
    }

assignmentOperator
  = op:"=" {
      return { Componente: "Operador de Asignación", Lexema: op, Posicion: location() };
    }

delimiter
  = punc:("{" / "}" / "(" / ")" / ";" / ":") {
      const simbolo = {
        "{": "Apertura de bloque",
        "}": "Cierre de bloque",
        "(": "Paréntesis de apertura",
        ")": "Paréntesis de cierre",
        ";": "Fin de línea",
        ":": "Dos puntos"
      };
      return { Componente: "Delimitador", Lexema: punc, Tipo: simbolo[punc], Posicion: location() };
    }

whitespace
  = ws:[ \t\n\r]+ {
      // Ignorar espacios en blanco
      return null;
    }
