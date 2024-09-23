// Data for airlines, fleets, etc. stored in localStorage
let airlines = JSON.parse(localStorage.getItem("airlines")) || [];
let currentAirline = null;
let currentUserRole = 'Owner'; // Role for demonstration, normally determined by login

// Load airlines to main menu
function loadAirlines() {
    const airlineList = document.getElementById('airline-list');
    airlineList.innerHTML = '';
    airlines.forEach((airline, index) => {
        const div = document.createElement('div');
        div.classList.add('airline-item');
        div.textContent = airline.name;
        div.onclick = () => openAirline(index);
        airlineList.appendChild(div);
    });
}

// Create a new airline
document.getElementById('create-airline-btn').addEventListener('click', () => {
    const name = prompt('Enter the name of the airline:');
    if (name) {
        const airline = {
            name: name,
            currency: 1000000, // Start with 1 million
            fleet: [],
            history: [],
            members: [{ name: 'You', role: 'Owner' }], // Owner is the creator
            contracts: [],
            created: new Date().toLocaleDateString(),
        };
        airlines.push(airline);
        localStorage.setItem('airlines', JSON.stringify(airlines));
        loadAirlines();
    }
});

// Open an airline
function openAirline(index) {
    currentAirline = airlines[index];
    document.getElementById('currency').textContent = `Bank: $${currentAirline.currency}`;
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('airline-screen').classList.remove('hidden');
    loadFleet();
    loadFlightHistory();
    loadContracts();
    loadAirlineInfo();
    loadMembers();
}

// Exit an airline
document.getElementById('exit-airline-btn').addEventListener('click', () => {
    document.getElementById('menu').classList.remove('hidden');
    document.getElementById('airline-screen').classList.add('hidden');
    currentAirline = null;
});

// Load fleet into the fleet section
function loadFleet() {
    const fleetList = document.getElementById('fleet-list');
    fleetList.innerHTML = '';
    currentAirline.fleet.forEach(aircraft => {
        const li = document.createElement('li');
        li.textContent = `${aircraft.type}, Max PAX: ${aircraft.maxPAX}, Max Distance: ${aircraft.maxDistance} km`;
        fleetList.appendChild(li);
    });
}

// Add fleet ordering functionality
document.getElementById('order-aircraft-btn').addEventListener('click', () => {
    document.getElementById('order-aircraft-modal').classList.toggle('hidden');
});

document.getElementById('buy-aircraft-btn').addEventListener('click', () => {
    const aircraftType = document.getElementById('aircraft-type').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    const airport = document.getElementById('airport').value;
    
    if (!airport || quantity < 1) return alert('Invalid input');

    // Simple price calculation (for demonstration purposes)
    const pricePerAircraft = 100000; // Set default price per aircraft
    const totalCost = pricePerAircraft * quantity;
    if (currentAirline.currency < totalCost) {
        alert('Insufficient funds');
        return;
    }

    currentAirline.currency -= totalCost;
    document.getElementById('currency').textContent = `Bank: $${currentAirline.currency}`;
    
    for (let i = 0; i < quantity; i++) {
        currentAirline.fleet.push({ type: aircraftType, maxPAX: 180, maxDistance: 6000, airport });
    }
    
    localStorage.setItem('airlines', JSON.stringify(airlines));
    loadFleet();
    document.getElementById('order-aircraft-modal').classList.add('hidden');
});

// Load flight history into the history section
function loadFlightHistory() {
    const flightHistoryList = document.getElementById('flight-history-list');
    flightHistoryList.innerHTML = '';
    currentAirline.history.forEach(flight => {
        const li = document.createElement('li');
        li.textContent = `${flight.pilot}, Aircraft: ${flight.aircraft}, Date: ${flight.date}`;
        flightHistoryList.appendChild(li);
    });
}

// Load contracts into the contracts section
function loadContracts() {
    const contractList = document.getElementById('contract-list');
    contractList.innerHTML = '';
    currentAirline.contracts.forEach(contract => {
        const li = document.createElement('li');
        li.textContent = `${contract.type}, Airport: ${contract.airport}`;
        contractList.appendChild(li);
    });
}

// Load airline information
function loadAirlineInfo() {
    document.getElementById('info-name').textContent = currentAirline.name;
    document.getElementById('info-created').textContent = currentAirline.created;
    document.getElementById('info-bank').textContent = `$${currentAirline.currency}`;
    document.getElementById('info-members').textContent = currentAirline.members.length;
}

// Load members into the members section
function loadMembers() {
    const membersList = document.getElementById('members-list');
    membersList.innerHTML = '';
    currentAirline.members.forEach(member => {
        const li = document.createElement('li');
        li.textContent = `${member.name} - ${member.role}`;
        li.onclick = () => {
            if (currentUserRole === 'Owner' || currentUserRole === 'Manager') {
                assignRole(member);
            }
        };
        membersList.appendChild(li);
    });
}

// Role assignment functionality
function assignRole(member) {
    document.getElementById('assign-role-modal').classList.remove('hidden');
    document.getElementById('assign-role-btn').onclick = () => {
        const role = document.getElementById('member-role').value;
        member.role = role;
        localStorage.setItem('airlines', JSON.stringify(airlines));
        loadMembers();
        document.getElementById('assign-role-modal').classList.add('hidden');
    };
}

// Button navigation
document.getElementById('main-screen-btn').addEventListener('click', () => navigateTo('main-screen'));
document.getElementById('fleet-btn').addEventListener('click', () => navigateTo('fleet-screen'));
document.getElementById('contracts-btn').addEventListener('click', () => navigateTo('contracts-screen'));
document.getElementById('history-btn').addEventListener('click', () => navigateTo('history-screen'));
document.getElementById('info-btn').addEventListener('click', () => navigateTo('info-screen'));
document.getElementById('members-btn').addEventListener('click', () => navigateTo('members-screen'));

function navigateTo(sectionId) {
    document.querySelectorAll('.content-section').forEach(section => section.classList.add('hidden'));
    document.getElementById(sectionId).classList.remove('hidden');
}

// Initial load
loadAirlines();
