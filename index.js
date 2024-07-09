import { Server } from "socket.io";
import fetch from 'node-fetch'
import express from 'express'
 
const io = new Server({});

const clients = {};

async function checkUser(headers = { token: '', user_id: '', socket }) {
    try {
        // TODO отпраивть запрос для проверки корректности токена и соответствия user_id тому, что указан в токене
        const res = await fetch(`https://jsonplaceholder.typicode.com/users/${headers.user_id}?token=${headers.token}`).then(e => e.json())
        clients[headers.user_id] = headers.socket;
    } catch (e) {
        console.error(`Не удалось проверить корерктность токена`, e);
    }
}

io.on("connection", (socket) => {
//   console.log(socket);
  checkUser({
    token: socket.client.request.headers['token'],
    socket: socket,
    user_id: socket.client.request.headers['user_id'],
  })

  socket.on('event1', (event) => {
    console.log(event);
  })

  socket.on("disconnect", (reason) => {
    
  });

});

io.listen(3000);




const app = express()
const port = 3030

app.use(express.json());

app.post('/', function(request, response){

    if (request.body.userId) {
        clients[request.body.userId].emit('re-send', request.body)
    }

    console.log(request.body);      // your JSON
    response.send(request.body);    // echo the result back
});
  

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})