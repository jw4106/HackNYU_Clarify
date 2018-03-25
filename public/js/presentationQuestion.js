/**
This is client side js
*/

const socketInstance = io();
document.addEventListener('DOMContentLoaded', init);

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function init(){
  socketInstance.on('questionSubmit', question);

  const submitButton = document.querySelector(".submitButton");

  const presentationID = getParameterByName("presentationID".trim());

  console.log("PresentationID Client: " + presentationID);

  submitButton.addEventListener('click', (evt) => {
    //this code only laucnhes for the sending user
    evt.preventDefault();

    const questionString = document.querySelector(".inputMessage").value;

    document.querySelector(".inputMessage").value = "";

    //create question object
    const questionData = {
      text: questionString
    }

    socketInstance.emit('questionSubmit', presentationID, questionData);
  });
}

function question(question) {
  //this code happens for every user!

  const questionElem = document.createElement("div");
  questionElem.className = "questionDiv";

  const textElem = document.createElement("p");
  textElem.className = "questionText";
  questionElem.append(textElem);

  const upvoteTextElem = document.createElement("p");
  upvoteTextElem.className = "upvoteText";
  questionElem.append(upvoteTextElem);

  const upvoteButtonElem = document.createElement("button");
  upvoteButtonElem.className = "upvoteButton";
  questionElem.append(upvoteTextElem);

  upvoteButtonElem.addEventListener("click", (evt) => {

    evt.preventDefault();
    //upvote or remove upvote

  });

  questionElem.append(document.createTextNode(question.text));

  document.getElementById("myList").appendChild(questionElem);
}




/////
/*
class Question {
  constructor(text, position){
    this.text = text;
    this.position = position;
    this.upvotes = 0;
  }

  upvote(){
    this.upvotes++;
  }

  removeUpvote(){
    this.upvotes--;
  }
}*/
