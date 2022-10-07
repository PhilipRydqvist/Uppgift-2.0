const artistElem = document.querySelector('#artist'); 
const dateElem = document.querySelector('#date'); 
const priceElem = document.querySelector('#price'); 
const timeElem = document.querySelector('#time'); 
const placeElem = document.querySelector('#place'); 
const numberElem = document.querySelector('#ticketNumber'); 

//Get vald biljett från databasen
async function getTicket(){
    const response = await fetch('http://localhost:5000/api/ticket', {
                method: 'GET',
            });
            const data = await response.json();
            console.log(data);
        if (data){
            showTicket(data)
        }
}

//Skriva ut resultat från getTicket och skicka till HTML 
async function showTicket(ticket){
    console.log(ticket);
    artistElem.innerHTML = ticket.event.artist;
    dateElem.innerHTML = ticket.event.date;
    priceElem.innerHTML = ticket.event.price;
    timeElem.innerHTML = ticket.event.time;
    placeElem.innerHTML = ticket.event.place;
    numberElem.innerHTML = ticket.ticket;

}

async function createTicket() { 
    urlId = new URLSearchParams(window.location.search).get("id");
     const response = await fetch("http://localhost:5000/api/createTicket/" + urlId); 
   /*   const response = await fetch('http://localhost:5000/api/createTicket', {
         method: 'POST',
         body: JSON.stringify(ticket),
         headers: {
         'Content-Type': 'application/json'
        }
     }); */
    
    
    
    
    const data = await response.json();
        console.log(data);
       if (data) {
           showTicket(data);
       }

 }


createTicket();