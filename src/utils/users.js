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



















