const path = require('path');
const http = require('http')
const Filter = require('bad-words')
const express = require('express') // load express library
const socketio = require('socket.io') //load library
const{generateMessage}=require('./utils/messages')
const{generateLocation}=require('./utils/messages')
const{addUser,getUser, getUsersInRoom, removeUser}=require('./utils/users')


const app = express()//call and run express aplication
const server = http.createServer(app) // create new web server
const io = socketio(server) // callsocket funcition
const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath)) // serve images, CSS files, and JavaScript files in a directory named public:

io.on('connection', (socket)=> {// eserver side connection

    //join room listening
    socket.on('join', ({username, room}, callback)=> {
    const {error, user} = addUser({id:socket.id, username, room})
    if (error) {
        return callback({error})
    }
    socket.join(user.room)
    //send message to all user except sender
    socket.broadcast.to(user.room).emit("messageToClients",generateMessage("ADMIN", `${user.username} has joined`) )
    socket.emit('messageToClients', generateMessage('ADMIN', 'Welcome') )
    callback(user)
            //send data to client for room and users
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
            const users = (getUsersInRoom(user.room))
            console.log(users[0].username)
            // receive message from client and sendback message and callback 
            socket.on("sendMessage", (messageInputFromClient, callback) => {
                const filter = new Filter()
                if (filter.isProfane(messageInputFromClient)) {//check for bad words
                    return  callback({responseToCallback:'Word is not profine'})//return error callback message to client
                }
                io.to(user.room).emit('messageToClients',generateMessage(user.username, messageInputFromClient ) )//send message to all client in room
                callback({responseToCallback:'Message delivered'})//return callback message to client
            })              
            //receive latitude and longitude from client
            socket.on("geoLocation", (coords)=> {
                const urlLocation = `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
                //send back location link to every user in a room
                io.to(user.room).emit('locationToClients', generateMessage(user.username, urlLocation ))
            })

            //disconnect
            socket.on('disconnect', () => { // disconect user
                const user = removeUser(socket.id)
                //send leaving message to every user in a room
                io.to(user.room).emit('messageToClients', generateMessage('ADMIN', `${user.username} has left`)) 
                //update sidebar when user is left
                io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
            })
    })
}) 
server.listen(port, () => { // listening for given event to occure(connection) 
    console.log('Server is running on port ' + port)
}) //server up