# AWS Lambda Functions

## Event Creation Handler
**File:** `create-event.js`
**Purpose:** Processes new event creation and triggers notifications

### Function Flow:
1. Receives event data from API Gateway
2. Validates event information
3. Triggers SNS notification to all subscribers
4. Returns success response

### Key Features:
- Input validation for event name and date
- SNS integration for email notifications
- Error handling for malformed requests

## Subscription Handler  
**File:** `subscribe.js`
**Purpose:** Manages email subscriptions via SNS

### Function Flow:
1. Receives email address from frontend
2. Adds/removes email from SNS topic
3. Returns subscription status

### Key Features:
- Email validation
- SNS topic management
- Subscription confirmation

## API Gateway Endpoints

### POST /events
- Creates new events
- Triggers notifications
- Requires: eventName, eventDate

### POST /subscribe  
- Manages email subscriptions
- Action: subscribe/unsubscribe
- Requires: email, action

### GET /events
- Retrieves list of events
- Returns: JSON array of events
