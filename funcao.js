
//joao victor
  document.addEventListener("DOMContentLoaded", function () {
    let banner = document.getElementById("cookieBanner"); 
    let acceptBtn = document.getElementById("acceptCookies"); 

    if (!localStorage.getItem("cookiesAccepted")) {
      banner.style.display = "flex"; 
    }    
    acceptBtn.addEventListener("click", function () {
      localStorage.setItem("cookiesAccepted", "true"); 
      banner.style.display = "none"; 
    });
  });









//Thiago








// Jefferson

