# BCN WALLS

## PUBLIC ENDPOINTS

### POST

- /users/login
- 200
- check the user's credentials and if they are correct retrieve a valid token.

- /users/register
- 201
- create a new user with an encrypted passwrod.

### GET

- /graffiti
- 200
- returns a list with all the graffitiCard from database

- /graffiti?theme=characters
- 200
- filters by subject "characters" and returns a list with all the matching graffitiCards

## TOKEN ENDPOINTS

### GET

- /graffiti/mywall
- 200
- returns the list of graffitiCard that you have created

### POST

- /graffiti/create
- 201
- create a new graffitiCard

### DELETE

- /graffiti/:id
- 200
- delete a graffitiCard

### PATCH

- /graffiti/:id
- 201
- modify a graffitiCard
