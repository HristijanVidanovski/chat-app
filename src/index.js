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









// server-side

// fjata ke povikana za sekoj klient so ke se povrzi
/*
io.on('connection', (socket) => { // socket is object and coantains infomrtin about connection 
    console.log('New Websocket connection')
  
   //socket.on('join', ({username, room}, callback) => {
   socket.on('join', ({username, room}, callback) => {
       const {error, user} = addUser({id: socket.id, username, room})
       if (error) { // ako  ima error ja povikuva callback fja da ja izvrsi so argument error
           return callback(error)
       }
       

socket.join(user.room)//praka event do site user vo room
socket.emit('message', generateMessage('Admin', 'Welcome')) //praka na konekcija(user) koj se povrzva  
socket.broadcast.to(user.room).emit('Admin', 'message', generateMessage(`${user.username} has joined`))//praka na site useri osven na toj so se povrzva 
//.to(praka do site vo room osven do toj so praka)
io.to(user.room).emit('roomData', {
room: user.room,
users: getUsersInRoom(user.room)
})
callback() // ako nema greski ja izvrsva callback fjata bez argument
//vo chat.js
   })
   
    socket.on('sendMessage', (message, callback ) => {// callback, define call backreceive dagta from client/when receive data do fucntion  
       const filter = new Filter()
       if (filter.isProfane(message)) {
           return callback('message is not profane')//stop if there is bad words, if not send message
       }

       const user=getUser(socket.id)
       //console.log(user)
       if (!user) {
           return callback(error)
       }

        io.to(user.room).emit('message', generateMessage(user.username, message) ) //praka data update na site klienti   
       callback()//call callbackfunction(set by client ) after message is emit to all clients.

    })




    socket.on('disconnect', () => { // disconect user
        const user = removeUser(socket.id)
        if (user) { 
            io.to(user.room).emit('message', generateMessage(user.username, `${user.username} has left`)) //send to all users
            //send message for remove user if users exist
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
                })
       
       
       
        }

    })


    socket.on('sendLocation', (coords, callback) => {// receive dagta from client/when receive data do fucntion  
        
        const user=getUser(socket.id)
        io.to(user.room).emit('locationMessage',generateLocation(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)) 
       //io.emit('locationMessage', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
        callback('Location was sent')
    
    })

})



//primise

//promise 1

function cleanRoom () {
    
    return new Promise((resolve, reject) => {
        setTimeout(function(){ resolve('Room is clean')}, 2000)
        
    })
}

function garbageRoom () {
    return new Promise((resolve, reject) => {
        setTimeout(function(){ resolve('garbage throwing')}, 2000)
        
    })
}


function free () {
    return new Promise((resolve, reject) => {
        setTimeout(function(){ resolve('I am free')}, 6000)
        
    })
}

async function homeWork() {
    try {
        console.log(await free())  
        console.log(await cleanRoom())
        console.log(await garbageRoom())
        
      
        console.log('i am out')
    } catch (e)  {
console.log(e)
    }
    
    
}
homeWork()


//Promise.all([cleanRoom(), garbageRoom(), free()]).then(()=>{console.log('all is finished')}).catch(()=>{console.log('not done all')})

/*
cleanRoom().then((backfromfunction1) => {
    console.log(backfromfunction1)
     return garbageRoom(backfromfunction1) }).then
((backfromfunction2)=>{
    console.log(backfromfunction2)
    return free(backfromfunction2)}).then(
    (backfromfunction3)=> {console.log(backfromfunction3)}
).catch((error)=> {console.log(error)})
    */



//test callback

/*
const userleft = true
const userWatchingCatgame= false
 //promise
 function watchTutorialPromise() {
                return new Promise((resolve, reject) => {
                    if (userleft) {
                        reject({name: 'User left', message: ';)'})
                    } else if(userWatchingCatgame) {
                        reject({name: 'User watching cat game', message: ';)'}) 
                    } else {
                        resolve('subcribe')
                    }
                })
 }


   watchTutorialPromise().then((message) => {console.log(message)}).then((message) => {console.log(message)})
   .catch((error)=>{console.log(error.name)})

  */




/* callback
function watchTutorialCallBack(callback, errorCallback) {
    if (userleft) {
        errorCallback({name: 'User left', message: ';)'})
    } else if(userWatchingCatgame) {
        errorCallback({name: 'User watching cat game', message: ';)'}) 
    } else {
        callback('subcribe')
    }
}

watchTutorialCallBack((message) => {console.log(message)}, (error)=>{console.log(error.name)})



//watchTutorialCallBack((message) => {console.log(message)}, (error)=>{console.log(error.name)})


/*const callF = () => {
    console.log('callf')

}

const mainF = (a, callback) => {
        callback()
   console.log(a) 
   
   
}

mainF('main fucniton', callF)*/

/**/




































server.listen(port, () => { // listening for given event to occure(connection) 
    console.log('Server is running on port ' + port)
}) //server up