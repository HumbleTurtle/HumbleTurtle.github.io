// Module 4 Assignment

window.helloSpeaker = (function(){

  var speakWord = "Hello";

  function speak(name) {
    console.log(speakWord + " " + name);
  }

  return  {
    speak : speak
  };

})();