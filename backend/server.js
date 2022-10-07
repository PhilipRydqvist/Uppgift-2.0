const { request, response } = require('express');
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const cors = require('cors');


//Get den exporterade funktionen från operations.js
const { getAccountByUsername, saveAccount, saveMenu, getMenu, saveTicket, createTicket, getTicket, getEvent, createAdmin, setTicket } = require('./database/operations');

//Importera hashing password från bcrypt.js
const { hashPassword, comparePassword } = require('./utils/bcrypt');

app.use(cors({ origin: '*' }));
app.use(express.static('../frontend'));
app.use(express.json());

saveMenu();

//saveMenu(); // Spara events i databasen när servern startas

app.get('/api/ticket', async(request, response) => {
    const ticket = await getTicket();
    response.json(ticket);
})



app.post('/api/auth/create', async(request, response) => {
    const credentials = request.body;
    //{username: 'ada', password: 'pwd123}
    const resObj = {
            success: true,
            usernameExists: false

        }
        //console.log(credentials);

    //Get en array som är ett konto eller tom.
    const usernameExists = await getAccountByUsername(credentials.username);

    // Skapa user. Om den får tillbaka större än 0 är det namnet upptaget om ej se nedan.
    if (usernameExists.length > 0) {
        resObj.usernameExists = true;
        resObj.success = false;
    }

    //Skapa user..
    if (resObj.usernameExists == false) {
        const hashedPassword = await hashPassword(credentials.password); //Skicka lösenordet credentials och får tillbaka det hashade password.  
        credentials.password = hashedPassword; // Password blir hashade password. 

        saveAccount(credentials);
    }

    response.json(resObj);
})


//Hämtar ticket number från databasen och jämför med inskickad ticket.
app.post('/api/verify', async(request, response) => {
    const ticketNr = String(request.body.ticket);
    const tickets = await getTicket(); //Get från operation.js tickets är alla våra tickets i databasen. 

    console.log(ticketNr, 'ticket-number');

    for (i = 0; i < tickets.length; i++) {

        if (tickets[i].ticket != undefined) {
            const match = await comparePassword(ticketNr, tickets[i].ticket)

            if (match == true && tickets[i].verified == false) {
                setTicket(tickets[i].ticket)
                response.json({ success: true })
                return;
            }
        }

    }

    response.json({ success: false })
});



app.get('/api/createTicket/:id', async(request, response) => {
    const id = parseInt(request.params.id)
    console.log(id);
    const event = await getEvent(id);

    const ticket = await createTicket(id);
    response.json({ ticket: ticket, event: event })

})

app.get('/api/getevent', async(request, response) => {
    const menu = await getMenu();
    menu.sort((a, b) => a.id - b.id);
    response.send(menu);

})

//Endpoint till login

app.post('/api/auth/login', async(request, response) => {
    const credentials = request.body;


    const resObj = {
        success: false,
        token: ''
    }


    //Verifiera om konto finns. Finns ej konto, resultat: en tom array.
    const account = await getAccountByUsername(credentials.username);
    console.log(account);


    // Konto hittas sedan jämför löserord. Token kopplas till avändare och går ut om ex antal sekunder.  
    if (account.length > 0) {
        const correctPassword = await comparePassword(credentials.password, account[0].password);
        console.log(correctPassword);
        if (correctPassword) {
            resObj.success = true;

            const token = jwt.sign({ username: account[0].username }, 'a1b1c1', {
                expiresIn: 600
            });



            resObj.token = token;

        }
    }

    response.json(resObj);

})


app.get('/api/event/menu', async(request, response) => {
    const token = request.headers.authorization.replace('Bearer', '');
    console.log(request);
    const resObj = {
        success: false

    }

    try {
        const data = jwt.verify(token, 'a1b1c1');




        resObj.success = true;
    } catch (error) {
        resObj.errorMessage = 'Token invalid';
    }

    response.json(resObj);

});


app.listen(5000, () => {
    console.log('server started on port 5000');
});