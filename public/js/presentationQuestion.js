/**
This is client side js
*/

function createQuestion() {
      //SocketIO
      //Upon connection
      io.on('connection', function(socket){
        console.log('a user connected');
        //join room
        const question = document.querySelector("inputMessage").value;
        //Upon disconnection
        socket.on('disconnect', function(){
          console.log('user disconnected');
        });
      });
          //end SocketIO
    });
}


document.addEventListener('DOMContentLoaded', createQuestion);
