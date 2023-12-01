

async function fetchEvents() {
    try {
        const response = await fetch('/eventSummaries');
        const jsonResponse = await response.json();
        const events = jsonResponse.data;
        const eventListContainer = document.getElementById('event-list-ul');
        eventListContainer.innerHTML = '';

        events.forEach(event => {

            const listItem = document.createElement('li');
            const eventDate = new Date(event.EventDate);
            // Format the date and time
            const formattedDate = eventDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            const formattedTime = event.EventTime;

            listItem.innerHTML = `
                <div><strong>ID:</strong> ${event.EventID}</div>
                <div><strong>Name:</strong> ${event.EventName}</div>
                <div><strong>Date:</strong> ${formattedDate}</div>
                <div><strong>Time:</strong> ${formattedTime}</div>
                <div><strong>Average Rating:</strong> ${event.AverageRating}</div>
                <div><strong>Organizer Name:</strong> ${event.OrganizerName}</div>          
            `;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-button');
            deleteButton.onclick = function () { deleteEvent(event.EventID); };
            listItem.appendChild(deleteButton);

            const updateButton = document.createElement('button');
            updateButton.textContent = 'Update';
            updateButton.classList.add('update-button');
            updateButton.onclick = function () { showUpdateModal(event); };
            listItem.appendChild(updateButton);

            eventListContainer.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error fetching events:', error);
    }
}



// Inserts new event into the event list.
async function insertEvent(event) {
    event.preventDefault();

    const eventId = document.getElementById('event-id').value;
    const organizerId = document.getElementById('organizer-id').value;
    const eventDate = document.getElementById('event-date').value;
    const eventTime = document.getElementById('event-time').value;
    const expense = document.getElementById('expense').value;
    const eventName = document.getElementById('event-name').value;

    const response = await fetch('/event', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            EventID: parseInt(eventId, 10),
            OrganizerID: parseInt(organizerId, 10),
            EventDate: eventDate,
            EventTime: eventTime,
            Expense: parseFloat(expense),
            EventName: eventName
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertResultMsg');

    if (response.ok && responseData.message === "Event created successfully.") {
        messageElement.textContent = "Event created successfully!";
        fetchEvents();
    } else {
        messageElement.textContent = "Error creating event: " + (responseData.error || "Unknown error");
    }
}


async function deleteEvent(eventId) {
    if (!confirm('Are you sure you want to delete this event?')) {
        return;
    }
    try {
        const response = await fetch(`/event/${eventId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            fetchEvents();
        } else {
            console.error('Failed to delete event:', response.status);
        }
    } catch (error) {
        console.error('Error deleting event:', error);
    }
}


function showUpdateModal(event) {
    console.log("showUpdateModal called for event ID: ", event.EventID);
    document.getElementById('update-event-id').value = event.EventID;
    document.getElementById('update-organizer-id').value = event.OrganizerID;
    document.getElementById('update-event-name').value = event.EventName;
    document.getElementById('update-event-date').value = event.EventDate;
    document.getElementById('update-event-time').value = event.EventTime;
    document.getElementById('update-expense').value = event.Expense;

    document.getElementById('update-event-modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('update-event-modal').style.display = 'none';
}


async function submitUpdateEvent() {
    const eventId = document.getElementById('update-event-id').value;
    const UpdateOrganizerID = document.getElementById('update-organizer-id').value;
    const UpdateEventName = document.getElementById('update-event-name').value;
    const UpdateEventDate = document.getElementById('update-event-date').value;
    const UpdateEventTime = document.getElementById('update-event-time').value;
    const UpdateExpense = document.getElementById('update-expense').value



    try {
        const response = await fetch(`/event/${eventId}`, {
            method: 'PUT', // or 'PATCH' depending on your API
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                EventName: UpdateEventName,
                EventDate: UpdateEventDate,
                EventTime: UpdateEventTime,
                OrganizerID: UpdateOrganizerID,
                Expense: UpdateExpense
            })
        });

        if (response.ok) {
            closeModal();
            fetchEvents();
        } else {
            console.error('Failed to update event:', response.status);
        }
    } catch (error) {
        console.error('Error updating event:', error);
    }
}

async function fetchAllTypeSponsors() {
    try {
        const response = await fetch('/sponsors/all-types-supported');
        const jsonResponse = await response.json();
        const sponsors = jsonResponse;
        const sponsorListContainer = document.getElementById('sponsor-list');
        sponsorListContainer.innerHTML = '';

        sponsors.forEach(sponsor => {
            const sponsorListItem = document.createElement('li');
            sponsorListItem.textContent = sponsor.SponsorName;
            sponsorListContainer.appendChild(sponsorListItem);
        });
    } catch (error) {
        console.error('Error fetching sponsors:', error);
    }
}

async function fetchHighestAverageRating() {
    try {
        const response = await fetch('/organizers/highest-average-rating');
        const jsonResponse = await response.json();
        const highestAvgRating = jsonResponse.highestAverageRating;

        document.getElementById('highest-avg-rating').textContent = highestAvgRating.toFixed(2);
    } catch (error) {
        console.error('Error fetching highest average rating:', error);
        document.getElementById('highest-avg-rating').textContent = 'Error fetching data';
    }
}


document.addEventListener('DOMContentLoaded', function () {
    fetchEvents();
    document.getElementById('add-event-form').addEventListener('submit', insertEvent);
    document.getElementById('refresh-events').addEventListener('click', fetchEvents);
    document.getElementById('view-sponsors-button').addEventListener('click', fetchAllTypeSponsors);
    document.getElementById('calculate-high-avg-button').addEventListener('click', fetchHighestAverageRating);

    document.querySelector('.close-button').addEventListener('click', closeModal);
    document.getElementById('update-event-form').addEventListener('submit', function (e) {
        e.preventDefault();
        submitUpdateEvent();
    });
});