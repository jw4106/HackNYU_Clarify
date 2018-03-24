/**
This is client side js
*/

const socketInstance = io();
document.addEventListener('DOMContentLoaded', init);

function init(){
  console.log("INited");
  socketInstance.on('questionSubmit', question);

  const submitButton = document.querySelector(".submitButton");

  submitButton.addEventListener('click', (evt) => {
    evt.preventDefault();

    const questionString = document.querySelector(".inputMessage").value;

    socketInstance.emit('questionSubmit', questionString);
  });
}

function question(questionString) {
  console.log("Questioned");

  const questionElem = document.createElement("p");

  questionElem.append(document.createTextNode(questionString));

  document.getElementById("myList").appendChild(questionElem);
}
