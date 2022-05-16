const users = []

//add new user in chat
const addUser = ({id, username, room})=>{
    //console.log(username)
    username = username.trim().toLowerCase()//Lower case
    room = room.trim().toLowerCase() 

    //check for input data
    if (!username || !room) { //check for input data
        return {error: 'Please enter username and room name'}//return error if no input data
    }
    //check for existing user
    const existinguser = users.find((name)=>{//check for existing user
        return name.username === username
    })
    //return error if username already exist
    if (existinguser) {                            
        return {error: 'Username already exist'}//return error
    }

    const user = {id, username, room} 
    users.push(user)//add user to users array
    return {user} //return user

}
//remove user
const removeUser = (id)=> {
//find index for id item
const index = users.findIndex((user) => { //vraka index ako ima matching na id. ako nema matcing vraka -1
return  user.id === id
})
    //if index is found, remove that user(item) from users array
    if (index !== -1) {
        return users.splice(index, 1)[0] // trga object od array po daden index. 1 e kolku items da izbrisi ako ima poke isti
        // [0 znaci da go vrati prviot item od novo dobienata array so index 0]
    }
}
//found user
const getUser = (id) => {
    //find user
    const findExistingUser=users.find((user) => {
        return user.room === room && user.username===username
        })
        //return error if user is found
        if (!findExistingUser) {
            return {error: 'User not found'}
        }
        return findExistingUser   
 }

//user in a room
const getUsersInRoom = (room) => {
    //get all user in a room
    const usersInRoom=users.filter((user) => {
        return user.room === room
        }) 
        return usersInRoom
}



module.exports ={
    addUser,
    getUser,
    getUsersInRoom,
    removeUser
}





















/*
const addUser = ({id, username, room}) => { // id se zema od konekcijata na socket
//clean the data
//username=username.trim().toLowerCase()// brisi praznomesto i golemi bukvi
//room=room
//username=username
username=username.trim().toLowerCase()// brisi praznomesto i golemi bukvi
room=room.trim().toLowerCase()

//validate daata
if (!username || !room) {
    return {
        error: 'Username and room are required'
    }
}
//check for existing user

const existingUser=users.find((user) => {
return user.room === room && user.username===username
})
//validate existing user
if (existingUser) {
    return {
        error: 'Username is in use'
    }


}

 //store user
 const user = {id, username, room}
 users.push(user)
 return {user}


}
*/
/*
const removeUser = (id) => {
const index = users.findIndex((user) => { //prvo se noga array index na user od id
 
return user.id === id//ako id od user e isto so id od users array vrati index na toj item

})

if (index !== -1) {//ako item index ne e minus 
    //console.log(users.splice(index, 1))
    return users.splice(index, 1)[0]//vraka users array so ibrisan item so index 0 go vrakam item a ne arraycd
    // splice remove elemnt in array by index 1-remove one item
}
}
*/
/*
const getUser = (id) => {
    
    const findExistingUser=users.find((user) => {
        return user.room === room && user.username===username
        })

       

        if (!findExistingUser) {
return {error: 'User not found'}
        }
     
        return findExistingUser 
        
 }
*/
/** */
/*
const getUsersInRoom = (room) => {
    const usersInRoom=users.filter((user) => {
        return user.room === room
        }) 
        return usersInRoom
}*/

