var slideIndex = 0;
showSlides();

function showSlides() {
  var i;
  var slides = document.getElementsByClassName("fade");
  var dots = document.getElementsByClassName("slide-dot");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}    
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active-slide", "");
  }
  slides[slideIndex-1].style.display = "block";  
  dots[slideIndex-1].className += " active-slide";
  setTimeout(showSlides, 2000); // Change image every 2 seconds
}

function addedCart() {
  alert("Item successfully added to the cart");
}


function disableBtn(btn1, btn2){
  var button1 = document.getElementById(btn1);
  alert(button1)
  /* var button2 = document.getElementById(btn2);

  var clickBtn = document.getElementById(btn1)[0];
  clickBtn.addEventListener('click', function(event) {
    button1.hidden = !button1.hidden;
    button2.hidden = !button2.hidden;
  }); */
}