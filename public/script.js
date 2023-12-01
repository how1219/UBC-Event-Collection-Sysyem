

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
            updateButton.onclick = function () { showUpdateModal(event.EventID); };
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

async function fetchEventDetails(eventId) {
    try {
        const response = await fetch(`/event/${eventId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch event details');
        }
        const eventDetails = await response.json();
        return eventDetails;
    } catch (error) {
        console.error('Error fetching event details:', error);
        throw error;
    }
}


async function showUpdateModal(eventId) {
    try {
        const eventDetails = await fetchEventDetails(eventId);

        // Convert the EventDate from ISO format to YYYY-MM-DD format
        const eventDate = new Date(eventDetails.EventDate).toISOString().split('T')[0];

        document.getElementById('update-event-id').value = eventDetails.EventID;
        document.getElementById('update-organizer-id').value = eventDetails.OrganizerID;
        document.getElementById('update-event-name').value = eventDetails.EventName;
        document.getElementById('update-event-date').value = eventDate;
        document.getElementById('update-event-time').value = eventDetails.EventTime;
        document.getElementById('update-expense').value = eventDetails.Expense;

        document.getElementById('update-event-modal').style.display = 'block';
    } catch (error) {
        console.error('Error showing update modal:', error);
    }
}

function closeModal() {
    document.getElementById('update-event-modal').style.display = 'none';
}


async function submitUpdateEvent(event) {
    event.preventDefault();

    const eventId = document.getElementById('update-event-id').value;
    const UpdateOrganizerID = document.getElementById('update-organizer-id').value;
    const UpdateEventName = document.getElementById('update-event-name').value;
    const UpdateEventDate = document.getElementById('update-event-date').value;
    const UpdateEventTime = document.getElementById('update-event-time').value;
    const UpdateExpense = document.getElementById('update-expense').value;

    try {
        const response = await fetch(`/event/${eventId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                EventName: UpdateEventName,
                EventDate: UpdateEventDate,
                EventTime: UpdateEventTime,
                OrganizerID: parseInt(UpdateOrganizerID, 10),
                Expense: parseFloat(UpdateExpense)
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


document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('.close-button').addEventListener('click', closeModal);
    document.getElementById('update-event-form').addEventListener('submit', submitUpdateEvent);
});




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

async function fetchEventCountOrganizer() {
    try {
        const response = await fetch('/organizers/total-events');
        const jsonResponse = await response.json();
        const organizers = jsonResponse.data;
        const organizerListContainer = document.getElementById('event-organizer-list');
        organizerListContainer.innerHTML = '';

        organizers.forEach(organizer => {
            const organizerListItem = document.createElement('li');

            organizerListItem.innerHTML = `
                <div><strong>Organizer ID:</strong> ${organizer.OrganizerID}</div>
                <div><strong>Organizer Name:</strong> ${organizer.OrganizerName}</div>
                <div><strong>Count:</strong> ${organizer.TotalEvents}</div>      
            `;
            organizerListContainer.appendChild(organizerListItem);
        });
    } catch (error) {
        console.error('Error fetching organizers:', error);
    }
}

async function fetchHighRatedEvents() {
    const selectedRating = document.getElementById('rating-threshold').value;
    try {
        const response = await fetch(`/event/high-rated-detailed/${selectedRating}`);
        const jsonResponse = await response.json();
        const events = jsonResponse.data;
        const eventsListContainer = document.getElementById('high-rated-events-list');
        eventsListContainer.innerHTML = '';

        events.forEach(event => {
            const eventListItem = document.createElement('li');
            eventListItem.innerHTML = `
                <div><strong>Event ID:</strong> ${event.EventID}</div>
                <div><strong>Event Name:</strong> ${event.EventName}</div>
                <div><strong>Average Rating:</strong> ${event.AverageRating}</div>
            `;
            eventsListContainer.appendChild(eventListItem);
        });
    } catch (error) {
        console.error('Error fetching high rated events:', error);
    }
}

async function fetchEventsByOrganizerAndName() {
    const organizerId = document.getElementById('organizer-id-input').value;
    const eventName = document.getElementById('event-name-input').value;
    try {
        const response = await fetch(`/event/search?organizerId=${organizerId}&eventName=${encodeURIComponent(eventName)}`);
        const jsonResponse = await response.json();
        const events = jsonResponse.data;
        const eventsListContainer = document.getElementById('searched-events-list');
        eventsListContainer.innerHTML = '';

        events.forEach(event => {
            const eventListItem = document.createElement('li');
            eventListItem.innerHTML = `
                <div><strong>Event ID:</strong> ${event.EventID}</div>
                <div><strong>Event Name:</strong> ${event.EventName}</div>
                <!-- Add other event details here -->
            `;
            eventsListContainer.appendChild(eventListItem);
        });
    } catch (error) {
        console.error('Error fetching events:', error);
    }
}

async function fetchTables() {
    try {
        const response = await fetch('/tables');
        const jsonResponse = await response.json();
        const tables = jsonResponse.data;
        const tableSelect = document.getElementById('table-select');
        tableSelect.innerHTML = '';
        tables.forEach(table => {
            const option = document.createElement('option');
            option.value = table;
            option.textContent = table;
            tableSelect.appendChild(option);
        });
        console.log('Tables populated in the dropdown.');
    } catch (error) {
        console.error('Error fetching tables:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchTables);


async function fetchAttributes() {
    const selectedTable = document.getElementById('table-select').value;
    try {
        const response = await fetch(`/tables/${selectedTable}/attributes`);
        const jsonResponse = await response.json();
        const attributes = jsonResponse.data;
        const attributeSelect = document.getElementById('attribute-select');
        attributeSelect.innerHTML = attributes.map(attr => `<option value="${attr}">${attr}</option>`).join('');
    } catch (error) {
        console.error('Error fetching attributes:', error);
    }
}

async function fetchCustomTable() {
    const selectedTable = document.getElementById('table-select').value;
    const selectedAttributes = Array.from(document.getElementById('attribute-select').selectedOptions).map(option => option.value).join(',');

    try {
        const response = await fetch(`/customized-table?tableName=${selectedTable}&selectedAttributes=${selectedAttributes}`);
        const jsonResponse = await response.json();
        const customTableData = jsonResponse.data;

        const tableBody = document.getElementById('custom-table-result');
        tableBody.innerHTML = '';

        customTableData.forEach(rowData => {
            const row = document.createElement('tr');
            Object.values(rowData).forEach(value => {
                const cell = document.createElement('td');
                cell.textContent = value;
                row.appendChild(cell);
            });
            tableBody.appendChild(row);
        });

        console.log('Custom table data loaded.');
    } catch (error) {
        console.error('Error fetching custom table:', error);
    }
}



document.addEventListener('DOMContentLoaded', function () {
    fetchEvents();
    document.getElementById('add-event-form').addEventListener('submit', insertEvent);
    document.getElementById('refresh-events').addEventListener('click', fetchEvents);
    document.getElementById('view-sponsors-button').addEventListener('click', fetchAllTypeSponsors);
    document.getElementById('calculate-high-avg-button').addEventListener('click', fetchHighestAverageRating);
    document.getElementById('calculate-event-organizer-button').addEventListener('click', fetchEventCountOrganizer);
    document.getElementById('find-high-rated-events-button').addEventListener('click', fetchHighRatedEvents);
    document.getElementById('search-events-button').addEventListener('click', fetchEventsByOrganizerAndName);
    document.getElementById('table-select').addEventListener('change', fetchAttributes);
    document.getElementById('view-custom-table-button').addEventListener('click', fetchCustomTable);
});
