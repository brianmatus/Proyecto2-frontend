debug = true

PYTHON_ADDRESS = "https://proyecto2-backend.herokuapp.com/"

if (debug) {
	PYTHON_ADDRESS ="http://127.0.0.1:5000/"
}


function obtenerReceta() {
	var nombre = "hola" //TODO Esto se tiene que cargar desde un textbox
	console.log("Boton presionado")
	var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            recetaObtenida(xmlHttp.responseText);
        }
				else {
					//console.log("STATUS:" + xmlHttp.readyState + ":" + xmlHttp.responseText)
				}
    }
    xmlHttp.open("GET", PYTHON_ADDRESS+"getreceta/?nombre=" + nombre, true); // true for asynchronous
    xmlHttp.send(null);
}

function recetaObtenida(respuesta) {
	console.log(respuesta)
}
