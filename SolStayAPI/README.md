# SolStayAPI

The backend of the SolStay Application built using NodeJS, ExpressJS, Sequelize, and MySql.

## Available API Calls by routes (Currently to localhost)

### /users
    - Post (new user)
        - "/"
    - Get (user)
        - "/:pubkey"
    - Put (user)
        - "/:pubkey"

### /properties
    - Post (new property)
        - "/"
    - Get (all properties)
        - "/"
    - Get (property details)
        - "/:id"
    - Get (user's properties)
        - "/:ownerId" 

### /reservations
    - Post (new reservation)
        - "/"
    - Get (user's active reservation)
        - "/active/:renterId" 
    - Get (all user's reservations)
        - "/:renterId"


## Future Features

- Transfer current database to a production server to allow for full testing
- Add additional API calls

## Languages, Frameworks and Database

- MySql
- Javascript
- ExpressJS
- NodeJS
- Sequelize