$( document ).ready(function() {
  console.log( "ready!" );
  var stuf = false

while(stuf === false)
{
  $(loopLi);
}


var tid = setInterval(mycode, 5000);
function mycode() {
  $.ajax({
  type: "GET",
  dataType: "text",
  url: "https://magicrecognitionjavidiego.herokuapp.com/api/status",
  success: function(data){
  //alert(data);
  console.log(data)
  if (data !== "false" )
  {
  stuf = true

  $.ajax({
  type: "GET",
  dataType: "text",
  url: "https://magicrecognitionjavidiego.herokuapp.com/api/getFormula",
  success: function(data){
  //alert(data);
  console.log(data)
  $(".conversation").append("<P>"+data);


  }

  });





  abortTimer()




  }

  }

  });
  // do some stuff...
  // no need to recall the function (it's an interval, it'll loop forever)
}
function abortTimer() { // to be called when you want to stop the timer
  clearInterval(tid);
}


var myFunc01 = function() {
  var stuf = false
  while (stuf === false) {


      setTimeout(function() {

        $.ajax({
        type: "GET",
        dataType: "text",
        url: "https://magicrecognitionjavidiego.herokuapp.com/api/status",
        success: function(data){
        //alert(data);
        console.log(data)
        if (data !== "false" )
        {
        stuf = true
        }

        }

        });

      }, 5000 )

  }
};

myFunc01();


function loopLi() {
  setInterval(function() { // this code is executed every 500 milliseconds:

$.ajax({
type: "GET",
dataType: "text",
url: "https://magicrecognitionjavidiego.herokuapp.com/api/status",
success: function(data){
//alert(data);
console.log(data)
if (data !== "false" )
{
stuf = true
}

}

});

      if(stuf) {
        alert("data");

      }

  }, 5000);
}

}
