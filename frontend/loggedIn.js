const inputElem = document.querySelector('#number');
const buttonElem = document.querySelector('#searchButton');


// Get server från backend
async function getMenu() {
    const token = sessionStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/event/menu', { 
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }); 
    const data = response.json();
    console.log(data);

    }

    async function verify(){
        const ticket = inputElem.value;
        const token = sessionStorage.getItem('token');
        let response = await fetch("http://localhost:5000/api/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ticket: ticket,
            }),
          });
        const data = await response.json();
            console.log(data);
            if(data.success == true){
                alert('Verified ticket!')
            }
            else{
                alert('Did not match ticket or ticket already used!')
            }
    }

    buttonElem.addEventListener('click', () => {
        verify();
    });


    const redirect = () => {
        const token = sessionStorage.getItem('token');

        if(!token){
            window.location.href = 'http://127.0.0.1:5500/frontend/login.html';
            alert ("You have to login")
        }
    }

    redirect();


