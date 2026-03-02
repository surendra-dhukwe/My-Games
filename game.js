
function toggleMenu(){

let menu=document.getElementById("menu")

menu.classList.toggle("show")

}


/* CLICK OUTSIDE CLOSE */

window.onclick=function(event){

if(!event.target.matches('.dropbtn')){

let dropdown=document.getElementById("menu")

if(dropdown.classList.contains("show")){

dropdown.classList.remove("show")

}

}

}