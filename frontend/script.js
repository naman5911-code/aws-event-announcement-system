// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Event Announcement System loaded');
    loadEvents();
});

function createEvent() {
    console.log('Create event button clicked');
    
    const name = document.getElementById('eventName').value.trim();
    const date = document.getElementById('eventDate').value;
    const messageElement = document.getElementById('eventMessage');

    console.log('Input values:', { name, date });

    // Clear previous messages
    messageElement.textContent = '';
    messageElement.className = 'message';

    // Input validation
    if (!name || !date) {
        console.log('Validation failed: missing fields');
        showMessage(messageElement, 'Please fill in all fields.', 'error');
        return;
    }

    // Validate date is in the future
    const selectedDate = new Date(date);
    const now = new Date();
    
    if (selectedDate <= now) {
        console.log('Validation failed: date not in future');
        showMessage(messageElement, 'Please select a future date.', 'error');
        return;
    }

    console.log('Validation passed - creating event');

    try {
        // Create event
        const events = JSON.parse(localStorage.getItem('events')) || [];
        events.push({ 
            name: name, 
            date: date,
            id: Date.now() // Simple unique ID
        });
        localStorage.setItem('events', JSON.stringify(events));
        
        console.log('Event saved to localStorage:', events);
        
        // Clear input fields
        document.getElementById('eventName').value = '';
        document.getElementById('eventDate').value = '';
        
        // Show success message
        showMessage(messageElement, `Event "${name}" created successfully!`, 'success');
        
        // Reload events list
        loadEvents();
        
    } catch (error) {
        console.error('Error saving event:', error);
        showMessage(messageElement, 'Error saving event. Please try again.', 'error');
    }
}

function loadEvents() {
    console.log('Loading events from localStorage');
    const eventsList = document.getElementById('events');
    const loadingElement = document.getElementById('loadingEvents');
    
    // Show loading briefly for better UX
    loadingElement.classList.remove('hidden');
    eventsList.innerHTML = '';
    
    setTimeout(() => {
        try {
            const events = JSON.parse(localStorage.getItem('events')) || [];
            console.log('Found events:', events);
            
            loadingElement.classList.add('hidden');
            
            if (events.length === 0) {
                eventsList.innerHTML = '<li class="no-events">No upcoming events. Create your first event!</li>';
                return;
            }
            
            // Sort events by date (soonest first)
            events.sort((a, b) => new Date(a.date) - new Date(b.date));
            
            // Display events
            events.forEach(event => {
                const eventItem = document.createElement('li');
                const eventDate = new Date(event.date);
                const now = new Date();
                
                // Add urgency styling for events happening soon
                const timeDiff = eventDate - now;
                const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
                
                if (daysDiff <= 1) {
                    eventItem.style.borderLeftColor = '#dc3545'; // Red for urgent
                } else if (daysDiff <= 7) {
                    eventItem.style.borderLeftColor = '#ffc107'; // Yellow for soon
                }
                
                eventItem.innerHTML = `
                    <strong>${event.name}</strong>
                    <div>${eventDate.toLocaleString()}</div>
                    <small>${getTimeRemaining(eventDate)}</small>
                `;
                eventsList.appendChild(eventItem);
            });
            
            console.log('Events displayed:', events.length);
            
        } catch (error) {
            console.error('Error loading events:', error);
            eventsList.innerHTML = '<li class="no-events">Error loading events</li>';
            loadingElement.classList.add('hidden');
        }
    }, 300);
}

function handleSubscription(action) {
    const email = document.getElementById('subscriberEmail').value.trim();
    const messageElement = document.getElementById('subscriptionMessage');

    // Clear previous messages
    messageElement.textContent = '';
    messageElement.className = 'message';

    // Email validation
    if (!isValidEmail(email)) {
        showMessage(messageElement, 'Please enter a valid email address.', 'error');
        return;
    }

    // Simulate subscription process (replace with actual API call later)
    showMessage(messageElement, `${action === 'subscribe' ? 'Subscribing' : 'Unsubscribing'}...`, 'info');
    
    setTimeout(() => {
        // Store subscription in localStorage (for demo purposes)
        const subscriptions = JSON.parse(localStorage.getItem('subscriptions')) || [];
        
        if (action === 'subscribe') {
            if (!subscriptions.includes(email)) {
                subscriptions.push(email);
                localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
                showMessage(messageElement, `Successfully subscribed ${email} to notifications!`, 'success');
            } else {
                showMessage(messageElement, 'This email is already subscribed.', 'info');
            }
        } else {
            // Unsubscribe
            const index = subscriptions.indexOf(email);
            if (index > -1) {
                subscriptions.splice(index, 1);
                localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
                showMessage(messageElement, `Successfully unsubscribed ${email} from notifications.`, 'success');
            } else {
                showMessage(messageElement, 'This email is not subscribed.', 'info');
            }
        }
        
        document.getElementById('subscriberEmail').value = '';
        
    }, 1000);
}

// Utility Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showMessage(element, message, type) {
    element.textContent = message;
    element.className = `message ${type}`;
}

function getTimeRemaining(eventDate) {
    const now = new Date();
    const diff = eventDate - now;
    
    if (diff < 0) {
        return 'Event has passed';
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
        return `${days} day${days !== 1 ? 's' : ''} and ${hours} hour${hours !== 1 ? 's' : ''} from now`;
    } else if (hours > 0) {
        return `${hours} hour${hours !== 1 ? 's' : ''} from now`;
    } else {
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${minutes} minute${minutes !== 1 ? 's' : ''} from now`;
    }
}

// Debug function to clear all events
function clearAllEvents() {
    if (confirm('Are you sure you want to clear all events?')) {
        localStorage.removeItem('events');
        localStorage.removeItem('subscriptions');
        loadEvents();
        console.log('All events and subscriptions cleared');
        alert('All events and subscriptions have been cleared.');
    }
}

// Add sample data for first-time users
function addSampleData() {
    const events = JSON.parse(localStorage.getItem('events'));
    if (!events || events.length === 0) {
        const sampleEvents = [
            { 
                name: "Team Meeting", 
                date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
                id: 1
            },
            { 
                name: "Product Launch", 
                date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
                id: 2
            },
            { 
                name: "Company Workshop", 
                date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
                id: 3
            }
        ];
        
        localStorage.setItem('events', JSON.stringify(sampleEvents));
        loadEvents();
        console.log('Sample events added');
    }
}

// Uncomment the line below to add sample data automatically for first-time users
// addSampleData();