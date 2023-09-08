var interval;
var mainans
const main_days = document.getElementById("mn_days");
const main_hours = document.getElementById("mn_hours");
const main_minutes = document.getElementById("mn_minutes");
const main_seconds = document.getElementById("mn_seconds");


function parseDate(dateString) {
    const dateParts = dateString.split('-').map(part => parseInt(part, 10));
    
    if (dateParts.length === 3) {
        return new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
    } else {
        throw new Error('Invalid date format');
    }
}

function setAllTimer() {
    fetch('/upcoming-events')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            try {
                // Check if the API response is an array and has at least one element
                if (Array.isArray(data) && data.length > 0) {
                    // Access the event_date property of the first element
                    var datenx = new Date(data[0].event_date);
                    var currentDate = new Date();
                    
                    var timeDifference = datenx - currentDate;
                    if (timeDifference > 0) {
                        var seconds = Math.floor((timeDifference / 1000) % 60);
                        var minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
                        var hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
                        var days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                        
                        console.log("Days: " + days);
                        console.log("Hours: " + hours);
                        console.log("Minutes: " + minutes);
                        console.log("Seconds: " + seconds);
                        
                        mainans = days * 86400 + hours * 3600 + minutes * 60 + seconds * 1;
                        console.log(mainans);
                    } else {
                        console.log("Event has already started or is in the past.");
                    }
                } else {
                    console.error('Invalid or empty API response');
                }
            } catch (error) {
                console.error('Error parsing date:', error);
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
        setStartResume();
}



function setAdditionalTimers() {
    console.log("called sAdditionlTimers...");

    if(mainans>=0){
    main_days.value = Math.floor(mainans / 86400);
    main_hours.value = Math.floor(mainans % (86400) / 3600);
    main_minutes.value = Math.floor(mainans % (3600) / (60));
    main_seconds.value = Math.floor((mainans % (60)) / 1);
    console.log(main_days.value);
    console.log(main_hours.value);
    console.log(main_minutes.value);
    console.log(main_seconds.value);
    }
    else{
        return;
    }

}
function setStartResume() {
   interval=setInterval(() => {
        console.log(mainans);
        if (mainans > 0) {
            mainans -= 1;
            setAdditionalTimers();
        }
        else {
            return;
        }
    }, 1000);
}
setAllTimer();

// ... Previous code ...

// Fetch event data from the correct endpoint (replace '/uea' with the correct URL)
fetch('/upcoming-events-all')
    .then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then((data) => {
        console.log(data); // Log the fetched data
        const upcomingEventsDiv = document.getElementById('divx');

        data.forEach((event) => {
            const eventDiv = document.createElement('span');
            eventDiv.className = 'eventnames';
            eventDiv.innerHTML = `
                <div class="eventhead">${event.event_name}</div>
                <div>${event.event_date}</div>
                <div>${event.event_time}</div>
            `;

            upcomingEventsDiv.appendChild(eventDiv);
        });
    })
    .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
    });

// ... Rest of your code ...
