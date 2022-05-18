const socket = io () // client side connection
//input form and submit message
$messageForm = document.querySelector('#form-message')
$messageFormButton = $messageForm.querySelector('#submit')
$sendLocationButton = document.querySelector('#locationButton') //connect to send location button
//Send message input and send button
$messageForm.addEventListener('submit', (e) => {//when button is selected do something
    e.preventDefault() //no page refresh
    $messageFormButton.setAttribute('disabled', 'disabled')//disable button when getting for data
    const message = document.querySelector('input').value//take value from input
    console.log(message)
    socket.emit('sendMessage', message, (responseFromCallback) => {//sent message to server and receive callback for message
     document.querySelector('input').value=''
    })
})
//templates
///sets or return html content of elemenent(message-template script)
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sideBarTemplate = document.querySelector('#sidebar-template').innerHTML
//Selector for message printing
$messages = document.querySelector('#messages')
//Get username and room from browser query
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true})
//join room by entering username and room
socket.emit('join',{username, room}, (responseFromCallBack)=>{
    //if error from server(listening),alert on client and return index page
    if (responseFromCallBack.error) {
        location.href ='/'
        alert(responseFromCallBack.error)         
    }
})
//receive room data from server
socket.on('roomData', ({room, users})=>{
    //expanding tags in a template 
    const html = Mustache.render(sideBarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
    })
//receive message from server
socket.on('messageToClients', (messageFromServer)=> {
    //expanding tags in a template 
    const html = Mustache.render(messageTemplate, {
        username: messageFromServer.username,
        message: messageFromServer.text,
        createdAt: moment(messageFromServer.createdAt).format('H:mm a')
    })
    //insert temlate in a div for printing messages
    $messages.insertAdjacentHTML('beforeend', html)
    $messageFormButton.removeAttribute('disabled')
    })
//receive location from server
socket.on('locationToClients', (locationFromServer)=> {
    const html = Mustache.render(locationTemplate, {
        username: locationFromServer.username,
        locationLink: locationFromServer.text,
        createdAt: moment(locationFromServer.createdAt).format('H:mm a')
     })
    $messages.insertAdjacentHTML('beforeend', html)
    $sendLocationButton.removeAttribute('disabled')
    })
//send location button
$sendLocationButton.addEventListener('click', () => {
    //check for navigator
    if (!navigator.geolocation) {
        console.log('Geo Location is not supported by your browser')
    }
    //get current posstion and send it to server
    navigator.geolocation.getCurrentPosition((pos)=> {
    const latitude = pos.coords.latitude
    const longitude = pos.coords.longitude
    socket.emit('geoLocation', {latitude, longitude})
    $sendLocationButton.setAttribute('disabled', 'disabled')//disable button when getting for data
    })          
})       
const $newMessage = $messages.lastElementChild

//height of the new message
const $newMessageStyles = getComputedStyle($newMessage )
const newMessageMargin = parseInt($newMessageStyles.marginBottom)
const newMessageHeight = $newMessage.offsetHeight + newMessageMargin
//visible height
const visibleHeight = $messages.offsetHeight
//height of message container
const containerHeight = $messages.scrolHeight
//how far i have scroled
const scrollOffset = $messages.scrolTop + visibleHeight
if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrolTop = $messages.scrolHeight
}
}
socket.on('message', (message) => {
   console.log(message)
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('H:mm a')
    })// html to be rendered//mustache pravi render na template od js na html
    $messages.insertAdjacentHTML('beforeend', html)//insert html in a div element
    autoscroll()
})

socket.on('locationMessage', (message) => {
    console.log(message.location)
    const html = Mustache.render(locationTemplate, {
        username:message.username,
        location: message.location,
        createdAt: moment(location.createdAt).format('H:mm a')
    })
   
    // html to be rendered//mustache pravi render na template od js na html
    $messages.insertAdjacentHTML('beforeend', html)//insert html in a div element
    autoscroll()
})

//listen for data from server for roomdata
socket.on('roomData', ({room, users}) => {
    const html = Mustache.render(sideBarTemplate, {
        room,
        users
    })// html to be rendered//mustache pravi render na template od js na html
    $sidebar.insertAdjacentHTML('beforeend', html)//insert html in a div element
})
$messageForm.addEventListener('submit', (e) => {//when button is selected do something
   e.preventDefault() //no page refresh
   const message = document.querySelector('input').value
   if (!message) {
       return alert('Please enter message')
   }
   $messageFormButton.setAttribute('disabled', 'disabled')//disable button when getting for data
    
    socket.emit('sendMessage', message, (error) => { // function after ackknowledge//client set callback function
        $messageFormButton.removeAttribute('disabled')// enable button after getting data
        $messageFormInput.value = '' // empty input after submit
        $messageFormInput.focus()//
        if (error) {
           //return console.log(error)
           alert(error)
        }
        console.log('Message was delivered')
    })
})
$locationFormButton.addEventListener('click', () => {//when button is selected do something
    
     const message = document.querySelector('input').value
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser')
    }
    $locationFormButton.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude
   
}, (locationMessageCallback) => {
console.log(locationMessageCallback)
$locationFormButton.removeAttribute('disabled')
})
    })
 })


