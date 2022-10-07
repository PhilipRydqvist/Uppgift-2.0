const eventList = document.querySelector('#eventList');
            
        
        //Skapa menu och events
         async function showMenu(menu){
             console.log(menu);
             for(i = 0; i < menu.length; i++){ 
                let event = menu[i]
                console.log(event);
                let li = document.createElement("li"); //Create ej synlig innan den kommer i HTML se nedan.
                
                li.classList.add('menu-item'); 

                li.innerHTML = 
                `
                <span class="event-artist">${event.artist}</span>
                <span class="event-date">${event.date}</span>
                <span class="event-place">${event.place}</span>
                <span class="event-time">${event.time}</span>                 
                <span class="event-price">${event.price}</span>                
                `;
                li.addEventListener("click", () => {  
                    createTicket(event); 
                })
                eventList.append(li);

             }
         }


         async function createTicket(event){
            window.location.href = `http://localhost:5000/ticket.html?id=${event.id}` 
        }

        //Get menu och events
         async function getMenu() {
            const response = await fetch('http://localhost:5000/api/getevent', {
                method: 'GET',
            });
            const data = await response.json();
            console.log(data);
        if (data){
            showMenu(data)
        }
        }

        getMenu();