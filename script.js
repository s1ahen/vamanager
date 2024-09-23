// Data for airlines, fleets, etc. stored in localStorage
let airlines = JSON.parse(localStorage.getItem("airlines")) || [];
let currentAirline = null;
let currentUserRole = 'Owner'; // Role for demonstration, normally determined by login

// Array of available aircraft for easy addition
const availableAircraft = [
    { name: "Boeing 737", maxPAX: 180, maxDistance: 5000, price: 100000000 },
    { name: "Airbus A320", maxPAX: 160, maxDistance: 6100, price: 90000000 },
    { name: "Boeing 787", maxPAX: 250, maxDistance: 13800, price: 230000000 },
    { name: "Airbus A350", maxPAX: 300, maxDistance: 14800, price: 280000000 }
];

// Generate a unique airline code
function generateAirlineCode() {
    return Math.random().toString(36).substr(2, 6).toUpperCase(); // 6 character random code
}

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
            code: generateAirlineCode() // Generate and assign the airline code
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
    const aircraftTypeSelect = document.getElementById('aircraft-type');
    aircraftTypeSelect.innerHTML = ''; // Clear the dropdown

    availableAircraft.forEach(aircraft => {
        const option = document.createElement('option');
        option.value = aircraft.name;
        option.textContent = `${aircraft.name} - $${aircraft.price.toLocaleString()}`;
        aircraftTypeSelect.appendChild(option);
    });

    document.getElementById('order-aircraft-modal').classList.toggle('hidden');
});

document.getElementById('buy-aircraft-btn').addEventListener('click', () => {
    const selectedAircraftName = document.getElementById('aircraft-type').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    const airport = document.getElementById('airport').value;

    if (!airport || quantity < 1) return alert('Invalid input');

    const selectedAircraft = availableAircraft.find(ac => ac.name === selectedAircraftName);
    const totalCost = selectedAircraft.price * quantity;

    if (currentAirline.currency < totalCost) {
        return alert('Not enough money to buy the aircraft!');
    }

    currentAirline.currency -= totalCost;
    for (let i = 0; i < quantity; i++) {
        currentAirline.fleet.push({
            type: selectedAircraft.name,
            maxPAX: selectedAircraft.maxPAX,
            maxDistance: selectedAircraft.maxDistance,
            boughtOn: new Date().toLocaleDateString(),
            stationedAt: airport
        });
    }

    localStorage.setItem('airlines', JSON.stringify(airlines));
    loadFleet();
    loadAirlineInfo();
    document.getElementById('order-aircraft-modal').classList.add('hidden');
});

// Load airline information (including airline code)
function loadAirlineInfo() {
    document.getElementById('info-name').textContent = currentAirline.name;
    document.getElementById('info-created').textContent = `Created: ${currentAirline.created}`;
    document.getElementById('info-bank').textContent = `Bank Balance: $${currentAirline.currency}`;
    document.getElementById('info-members').textContent = `Members: ${currentAirline.members.length}`;
    document.getElementById('info-code').textContent = `Airline Code: ${currentAirline.code}`;
}

// Load flight history into the history section
function loadFlightHistory() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    currentAirline.history.forEach(flight => {
        const li = document.createElement('li');
        li.textContent = `${flight.pilot} flew from ${flight.departure} to ${flight.arrival} using ${flight.aircraft}`;
        historyList.appendChild(li);
    });
}

// Load contracts into the contracts section
function loadContracts() {
    const contractList = document.getElementById('contract-list');
    contractList.innerHTML = '';
    currentAirline.contracts.forEach(contract => {
        const li = document.createElement('li');
        li.textContent = `Contract for ${contract.aircraft} at ${contract.airport}`;
        contractList.appendChild(li);
    });
}

// Load members into the members section
function loadMembers() {
    const memberList = document.getElementById('member-list');
    memberList.innerHTML = '';
    currentAirline.members.forEach(member => {
        const li = document.createElement('li');
        li.textContent = `${member.name} - ${member.role}`;
        memberList.appendChild(li);
    });
}

// Button navigation between sections
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
