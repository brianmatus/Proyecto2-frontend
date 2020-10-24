var debug = true
var BACK_URL = 'https://proyecto2-backend.herokuapp.com/'
if (debug) {
  BACK_URL = "http://127.0.0.1:5000/"
}

var loggedUser

$( document ).ready(function() {
    updateLoggedUser();
});


$("#navigationLoginButton").click( function(e) {
  e.preventDefault();

  if (loggedUser == null) {
    $("#modalLRForm").modal("show");
  }
  else {
    fetch(BACK_URL + "logout/", {
      method: "POST",
      body: ""
    }).then(response => response.json())
    .then(data => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
    loggedUser = null
    $("#navigationLoginButton").text("Iniciar Sesion")
  }

} );


$("#loginButton").click( function(e) {
  e.preventDefault();
  var username = $("#modalLRInput10").val();
  var password = $("#modalLRInput11").val();

  if (username.length == 0) {
    swal("Usuario no brindado", "Debes ingresar un usario para iniciar sesion", "warning");
    return;
  }

  if (password.length == 0 ) {
    swal("Contraseña no brindada", "Debes ingresar una contraseña para iniciar sesion", "warning");
    return;
  }

  let data = {username: username, password: password}
  fetch(BACK_URL + "login/", {
    method: "POST",
    body: JSON.stringify(data)
  }).then(response => response.json())
  .then(data => {
    console.log('Success:', data);
    loginReturn(data, username, password)
    loggedUser = data.RESULT
  })
  .catch((error) => {
    console.error('Error:', error);
  });
});


function updateLoggedUser() {
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };

  fetch(BACK_URL + "get_logged_user/", requestOptions)
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
    if (data.RETURNCODE == 0) {
      loggedUser = data.RESULT
      console.log(data);
      console.log("Server-side userloggon detected, updated now to:");
      console.log(loggedUser);
      $("#navigationLoginButton").text("Cerrar Sesion")

    }
  })
  .catch(error => console.log('error', error));
}

function loginReturn(data, enteredUsername, enteredPassword) {

  console.log(data);
  console.log(enteredUsername);
  console.log(enteredPassword);

  switch(data.RETURNCODE) {
    case "0":
      swal("Inicio de sesion exitoso", "Bienvenido," + enteredUsername, "success");
      $("#modalLRForm").modal("hide");
      $("#navigationLoginButton").text("Cerrar Sesion")
      break;
    case "1":
      swal("Usuario no encontrado", "No se encontro ningun usuario con username " + enteredUsername, "warning");
      break;
    case "2":
    swal("Contraseña invalida", "La Contraseña ingresada (" + enteredPassword + ") no coincide con la del usuario", "error");
      break;
    case "3":
      swal("Good job!", "You clicked the button!", "success");
      break;
    case "4":
      swal("Good job!", "You clicked the button!", "success");
      break;
    default:
  }

}

$("#registerButton").click( function(e) {

  var username = $("#modalLRInput12").val()
  var name = $("#modalLRInput13").val()
  var lastname = $("#modalLRInput14").val()
  var password = $("#modalLRInput15").val()
  var passwordRepeat = $("#modalLRInput16").val()

  var list = [username,name,lastname,password,passwordRepeat]
  for (var i = 0; i < list.length; i++) {
    if (list[i].length == 0) {
      swal("Informacion incompleta", "Debes rellenar toda la informacion para registrarte", "warning");
      return;
    }
  }







  console.log(username);
  console.log(name);
  console.log(lastname);
  console.log(password);
  console.log(passwordRepeat);
});


$("#forgotPassword").click(function (e) {

  var username = prompt('Ingrese el usuario a recuperar');

  if (!username || username.length == 0) {
    return
  }

  let data = {username: username}
  fetch(BACK_URL + "recover_password/", {
    method: "POST",
    body: JSON.stringify(data)
  }).then(response => response.json())
  .then(data => {
    console.log('Success:', data);
    swal("La contraseña es: " + data.RESULT)
  })
  .catch((error) => {
    console.error('Error:', error);
  });


})


$("#alreadyHaveAccount").click(function (e) {
  $('[href="#panel7"]').tab('show');
});
