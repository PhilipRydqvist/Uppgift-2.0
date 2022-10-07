/// Läsa in databasen
const nedb = require('nedb-promise');
const { hashPassword } = require('../utils/bcrypt');
//Skapa en ny databas. Autoload true = automatisk uppdatering
const database = new nedb ({ filename: 'accounts.db', autoload: true });


 const menu = {
     "type": "event-menu", 
     "menu": [
        
         {
             "id":1,
             "artist":"Lasse-Stefanz",
             "date":"21 Mar",
             "time":"19:00 - 21.00",
            "price":"350 sek",
             "place":"Kjell Härnqvistsalen"  

        },
         {
             "id":2,
             "artist":"Pelle Trubadur",
             "date":"29 Mar",
             "time":"22.00 - 00:00",
             "price":"110 sek",
             "place":"Pubbelipubben"
         },
         {
             "id":3,
             "artist":"Kajsas kör",
             "date":"10 Apr",
             "time":"15:00 - 16:00",
             "price":"99 SEK",
             "place":"Göteplatsen"
         },
         {
             "id":4,
             "artist":"Klubb Untz",
             "date":"17 Apr",
             "time":"22:00 - du tröttnar",
             "price":"150 SEK",
             "place":"Din favoritkällare"
         },
        
     ]
 }

//Find function för att söka efter användarnamn i databasen
async function getAccountByUsername(username){
    const account = await database.find({ username: username });
    return account;
}


//Insert account i databasen
function saveAccount(account) {
    database.insert(account);
}

//Lägg in eventet ovan i databasen
async function saveMenu(){
    const db = await database.find({});
    if (db == 0) database.insert(menu.menu);
    
}

function saveTicket(ticket){
    database.insert(ticket);
    console.log(ticket);
}

async function setTicket(id) {
database.update({
    ticket: id
}, {
    $set: {
        verified: true
    }
});
}

async function getMenu(){
    const menu = await database.find({
        artist: {$exists: true}})
    return menu;
}

async function createAdmin(){
    const account = {username: "Organizer1337", password: await hashPassword("pwd123")}
    saveAccount(account)
} 
createAdmin(); //skapa konto

//Get ticket och skicka till server.js 
async function getTicket(){
    let ticket = await database.find({}) 
    console.log('getting tickets');
    return ticket;
    
}

async function getEvent(id){
   console.log(id); return await database.findOne({id:parseInt(id)})

}


async function createTicket(id){
        const ticketNumber = Math.floor(Math.random()*10) 
        const ticket = {
            ticket: await hashPassword(String(ticketNumber)), 
            eventId: id, 
            verified: false } // Hashing password
            
        saveTicket(ticket) // Spara i databasen
        return ticketNumber;  
     } 

//exportera funktioner och importera i server.js 
module.exports = { getAccountByUsername, saveAccount, saveMenu, getMenu, createAdmin, saveTicket, createTicket, getTicket, getEvent, setTicket}

/* ... */

// function saveAccount () {
//     const account = {
//         username: "organizer1337",
//         password: "pwd123"
//     }
//     database.insert(account); 
// }

