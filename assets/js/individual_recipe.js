var debug = false
var BACK_URL = 'https://proyecto2-backend.herokuapp.com/'
if (debug) {
  BACK_URL = "http://127.0.0.1:5000/"
}

var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);

var loggedUser;


$( document ).ready(function() {
  updateLoggedUserAndFillRecipeInfo()
});

function updateLoggedUserAndFillRecipeInfo() {
  console.log("Empezando inicio de sesion");
  var request = async() => {

    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    var userFetch = await fetch(BACK_URL + "get_logged_user/", requestOptions)

    var userData = await userFetch.json()

    console.log(userData);
    console.log("Inicio de sesion procesado con exito");
    if (userData.RETURNCODE == 0) {
      loggedUser = userData.RESULT
      console.log("Server-side userloggon detected, updated now to:");
      console.log(loggedUser);
      $("#navigationLoginButton").text("Cerrar Sesion")
    }

    if(userData.RETURNCODE == 1) {
      //TODO No puede reaccionar ni comentar
      $("#commentButton").prop('disabled', true);
    }

    var uid = urlParams.get('uid');
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({"uid":uid});
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    var recipeFetch = await fetch(BACK_URL + "getRecipeByUID/", requestOptions)
    var recipeData = await recipeFetch.json()
    console.log(recipeData);
    var recipeInfo = recipeData.RESULT[0]

    $(".avatar").css("background-image", "url(" + recipeInfo.image + ")");
    $("#title").text(recipeInfo.title)
    $("#abstract").text(recipeInfo.abstract)
    $("#author").html("Autor:<br>" + recipeInfo.author)
    $("#ingredients").html("Ingredientes:<br>" + recipeInfo.ingredients)
    $("#procedure").html("Procedimiento:<br>" + recipeInfo.procedure)
    $("#time").html("Tiempo:<br>" + recipeInfo.time)


    //*Comentarios
    for (var comment in recipeInfo.comments) { if (!recipeInfo.comments.hasOwnProperty(comment)) {continue}
      console.log("Sending to add html");
      console.log(recipeInfo.comments[comment]);
      addCommentToHTML(recipeInfo.comments[comment])
    }
  }
  request()
}

function addCommentToHTML(comment) {

  var template = $("#template-comment").html();
  var html = Mustache.render(template, comment);
  $("#commentsContainer").append(html)

}







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

function loginReturn(data, enteredUsername, enteredPassword) {

  console.log(data);
  console.log(enteredUsername);
  console.log(enteredPassword);

  switch(data.RETURNCODE) {
    case "-1":
      swal("Informacion incompleta", "Debes ingresar todos los datos requeridos", "warning");
      break;
    case "0":
      swal("Inicio de sesion exitoso", "Bienvenido," + enteredUsername, "success");
      $("#modalLRForm").modal("hide");
      $("#navigationLoginButton").text("Cerrar Sesion")
      $("#commentButton").prop('disabled', false);
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

  console.log(data.USERTYPE);
  if (data.USERTYPE == "admin") {
    var audio = new Audio('assets/mp3/soy_admin.mp3');
    audio.play();
  }
}
