// Module 4 Assignment

window.byeSpeaker = (function(){

  var speakWord = "Good Bye";

  function speak(name) {
    console.log(speakWord + " " + name);
  }

  return  {
    speak : speak
  };

})();