# AirBNC

Back end API for a short term property rental booking system. With endpoints to search and filter properties. Fetch, post and delete reviews. Add and remove properties from favourites and update a user's details.

---

### To Run locally

-To create the database use:
npm run create-db

-To create database connection pool add a .env file containing:
PGDATABASE=airbnc

-To run seed function use:
npm run seed

---

### Or use the hosted service

https://airbnc-cm8h.onrender.com

---

# API Endpoints

### GET /api/properties | Retrieve a list of all properties

Property objects are returned in an array on the key of properties

```
{
  "properties":[
    {
      "property_id": <id>
      "property_name": <name>
      "location": <location>
      "price_per_night": <price>
      "host": <host name>
      "image": <image_url>
    }
  ]
}
```

optional queries:

- ?property_type= | filter for specific property types

- ?maxprice= | limit results by maximum price

- ?maxprice= | limit results by minimum price

- ?sort= "cost_per_night" / "popularity" | sort results by price or popularity

- ?order="ascending" / "descending" | order results ascending or descending

- ?host= | only returns properties belonging to the passed host_id

(note: results are ordered from most favourited to least by default)

---

### GET /api/properties/:id | Retrieve more information for a single property

Property object is returned on the key of property

```
{
  "property": {
    "property_id": <id>,
    "property_name": <name>,
    "location": <location>,
    "price_per_night": <price>,
    "description": <description>,
    "host_id": <host id>,
    "host": <host name>,
    "host_avatar" <image_url>,
    "favourite_count": <count>,
    "images": [<img_url>, ...]
  }
}
```

optional query:

- ?user_id= | returned property object includes a key for "favourited" indicating if the passed user_id has favourited the returned property.

---

### GET /api/users/:id | Retrieve information for a user

User object is returned on the key of user

```
{
  "user":  {
      "user_id": <id>,
      "first_name": <name>,
      "surname": <name>,
      "email": <email>,
      "phone_number": <phone number>,
      "avatar": <image url>
      "created_at": <data>
      }
}
```

---

### GET /api/properties/:id/reviews | Retrieve a list of all reviews for a property

Review objects are returned in an array on the key of Reviews.
Average rating is returned on the key of average_rating

```
{
  "reviews": [
    {
      "review_id": <id>,
      "comment": <name>,
      "rating": <location>,
      "created_at": <date>,
      "guest_id": <guest id>,
      "guest": <guest name>,
      "guest_avatar" <img_url>
    },
    ...
  ],
  "average_rating": <avg of ratings>
}
```

---

### POST /api/properties/:id/reviews | Post a review for a property

Expects the following payload:

```
{
    "guest_id": <id>,
    "rating": <rating>,
    "comment": <comment>
}
```

- guest_id must be an integer for an existing user
- rating must be an integer between 1-5

If successfully posted, responds with 201 Status Code and the following object

```
{
    "review_id": <id>,
    "property_id": <id>,
    "guest_id": <id>,
    "rating": <rating>,
    "comment": <comment>,
    "created_at": <date>
}
```

---

### POST /api/properties/:id/favourite | Adds a property to user's favourites

Expects the following payload:

```
{
    "guest_id": <id>
}
```

If successful, responds with 201 Status Code and the following object:

```
{
    "msg": "Property favourited successfully.",
    "favorite_id": <id>
}
```

---

### DELETE /api/reviews/:id | Deletes a property review

If successful responds with Status Code 204, no object is returned.

---

### DELETE /api/properties/:id/users/id:/favourite | Removews a property from user's favourites

If successful responds with Status Code 204, no object is returned.

---

### PATCH /api/users/:id | Update a user's details

Expects a payload with any combination of the following properties:

```
{
    "first_name": <name>,
    "surname": <name>,
    "email": <email>,
    "phone": <number>,
    "avatar": <image_url>
}
```

If successful responds with Status Code 200 and the following object:

```
{
    "first_name": <name>,
    "surname": <name>,
    "email": <email>,
    "phone": <number>,
    "avatar": <image_url>
}
```
