/**
This is client side js
*/

const socketInstance = io();
document.addEventListener('DOMContentLoaded', init);

//where do we get the presentation or ID from?

function init(){
  socketInstance.on('questionSubmit', question);

  const submitButton = document.querySelector(".submitButton");
  const presentationID = window.location.pathname.replace("presentation", "");

  console.log(presentationID);

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
