## Event Booking API

The system allow users to create, find and reserve tickets for events, view and manage their reservations and to be notified before the event kickoff.

**Prerequisites**

- Docker installed on your system.

**Installation**

1. Navigate to the project directory:

```cd booking-app ```

2. create `.env` file in the project root directory with the following variables (replace placeholders with your actual values):
```
MONGO_URI=mongodb://mongodb:27017/booking_app
MONGO_TEST_URI=mongodb://mongodb:27017/test
MONGO_HOST=mongodb
MONGO_PORT=27017
MONGO_DATABASE=booking_app
SECRET_KEY=secretkey
EMAIL_HOST=
EMAIL_USER=
EMAIL_PASSWORD=
EMAIL_FROM=
```

3. run the docker container using the following command

```docker-compose up --build```

**Installation**

Run the following command:

```npm test```