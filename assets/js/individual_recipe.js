var debug = true
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
    console.log("Inicio de sesion con exito");
    if (userData.RETURNCODE == 0) {
      loggedUser = userData.RESULT
      console.log("Server-side userloggon detected, updated now to:");
      console.log(loggedUser);
      $("#navigationLoginButton").text("Cerrar Sesion")
    }

    if(userData.RETURNCODE == 1) {
      //TODO No puede reaccionar ni comentar
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





  }
  request()
}
