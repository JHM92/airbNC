const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seed");
const {
  propertyTypesData,
  usersData,
  propertiesData,
  reviewsData,
  imagesData,
  favouritesData,
} = require("../db/data/test");

beforeEach(async () => {
  await seed(propertyTypesData, usersData, propertiesData, reviewsData, imagesData, favouritesData);
});

afterAll(() => {
  db.end();
});

describe("app", () => {
  test("404 - path not found", async () => {
    const { body } = await request(app).get("/api/invalid/path").expect(404);
    expect(body.msg).toBe("Path not found");
  });

  describe("GET /api/properties", () => {
    test("Responds with status of 200", async () => {
      const response = await request(app).get("/api/properties").expect(200);
    });

    test("Responds with an array on the key of properties", async () => {
      const { body } = await request(app).get("/api/properties");
      expect(Array.isArray(body.properties)).toBe(true);
    });

    test("array on properties key has a length of 11", async () => {
      const { body } = await request(app).get("/api/properties");
      expect(body.properties.length).toBe(11);
    });

    test("returned property object contains properties of property_id, property_name, location, price_per_night, host", async () => {
      const { body } = await request(app).get("/api/properties");
      const testProperty = body.properties[0];
      expect(testProperty).toHaveProperty("property_id");
      expect(testProperty).toHaveProperty("property_name");
      expect(testProperty).toHaveProperty("location");
      expect(testProperty).toHaveProperty("price_per_night");
      expect(testProperty).toHaveProperty("host");
    });

    test("returned properties are ordered by most favourited to least favourited", async () => {
      const { body } = await request(app).get("/api/properties");
      expect(body.properties[0].property_name).toBe("Cosy Family House");
    });
  });

  describe("GET /api/properties/:id", () => {
    test("Responds with a status of 200", async () => {
      const response = await request(app).get("/api/properties/1").expect(200);
    });

    test("Responds with an object on key of property", async () => {
      const { body } = await request(app).get("/api/properties/1");
      expect(typeof body.property).toBe("object");
      expect(Array.isArray(body.property)).toBe(false);
    });

    test("property object contains property_id, property_name, location, price_per_night, description, host, host_avatar, favourite_count", async () => {
      const { body } = await request(app).get("/api/properties/1");
      const testProperty = body.property;
      expect(testProperty).toHaveProperty("property_id");
      expect(testProperty).toHaveProperty("property_name");
      expect(testProperty).toHaveProperty("location");
      expect(testProperty).toHaveProperty("price_per_night");
      expect(testProperty).toHaveProperty("host");
      expect(testProperty).toHaveProperty("host_avatar");
      expect(testProperty).toHaveProperty("favourite_count");
    });

    test("returns property data of the property_id passed in the url", async () => {
      const { body } = await request(app).get("/api/properties/2");
      const testProperty = body.property;
      expect(testProperty.property_id).toBe(2);
      expect(testProperty.property_name).toBe("Cosy Family House");
      expect(testProperty.location).toBe("Manchester, UK");
      expect(testProperty.price_per_night).toBe("150");
      expect(testProperty.host).toBe("Alice Johnson");
      expect(testProperty.host_avatar).toBe("https://example.com/images/alice.jpg");
      expect(testProperty.favourite_count).toBe("4");
    });

    test("accepts optional query user_id which adds favourited property to the property object", async () => {
      const { body: testUserId1 } = await request(app).get("/api/properties/1?user_id=1");
      expect(testUserId1.property.favourited).toBe(false);

      const { body: testUserId6 } = await request(app).get("/api/properties/1?user_id=6");
      expect(testUserId6.property.favourited).toBe(true);
    });

    test("returns status 400 when passed an invalid property id", async () => {
      const { body } = await request(app).get("/api/properties/invalid-id").expect(400);
      expect(body.msg).toBe("Bad Request");
    });

    test("returns status 404 when passed a valid but non-existant property id", async () => {
      const { body } = await request(app).get("/api/properties/1000000").expect(404);
      expect(body.msg).toBe("Property not found");
    });

    test("returns status 400 when passed an invalid user id", async () => {
      const { body } = await request(app).get("/api/properties/1?user_id=invalid-id").expect(400);
      expect(body.msg).toBe("Bad Request");
    });

    test("returns status 404 when passed a valid but non-existant user id", async () => {
      const { body } = await request(app).get("/api/properties/1?user_id=10000000").expect(404);
      expect(body.msg).toBe("User not found");
    });
  });

  describe("GET /api/users/:id", () => {
    test("Responds with a status of 200", async () => {
      const response = await request(app).get("/api/users/1").expect(200);
    });

    test("Responds with an object on key of user", async () => {
      const { body } = await request(app).get("/api/users/1");
      expect(typeof body.user).toBe("object");
      expect(Array.isArray(body.user)).toBe(false);
    });

    test("user object contains user_id, first_name, surname, email, phone_number, avatar, created_at", async () => {
      const { body } = await request(app).get("/api/users/1");
      const testUser = body.user;
      expect(testUser).toHaveProperty("user_id");
      expect(testUser).toHaveProperty("first_name");
      expect(testUser).toHaveProperty("surname");
      expect(testUser).toHaveProperty("email");
      expect(testUser).toHaveProperty("phone_number");
      expect(testUser).toHaveProperty("avatar");
      expect(testUser).toHaveProperty("created_at");
    });

    test("returns user data of the user passed in the url", async () => {
      const { body } = await request(app).get("/api/users/2");
      const testUser = body.user;
      expect(testUser.user_id).toBe(2);
      expect(testUser.first_name).toBe("Bob");
      expect(testUser.surname).toBe("Smith");
      expect(testUser.email).toBe("bob@example.com");
      expect(testUser.phone_number).toBe("+44 7000 222222");
      expect(testUser.avatar).toBe("https://example.com/images/bob.jpg");
    });

    test("returns status 400 when passed an invalid user id", async () => {
      const { body } = await request(app).get("/api/users/invalid-id").expect(400);
      expect(body.msg).toBe("Bad Request");
    });

    test("returns status 404 when passed a valid but non-existant user id", async () => {
      const { body } = await request(app).get("/api/users/1000000").expect(404);
      expect(body.msg).toBe("User not found");
    });
  });

  describe("GET /api/properties/:id/reviews", () => {
    test("Responds with a status of 200", async () => {
      const response = await request(app).get("/api/properties/1/reviews").expect(200);
    });

    test("Responds with an object containing an array on the key of reviews and has a key of average_rating", async () => {
      const { body } = await request(app).get("/api/properties/1/reviews");
      expect(Array.isArray(body.reviews)).toBe(true);
      expect(body).toHaveProperty("average_rating");
    });

    test("Review object contains review_id, comment, rating, created_at, guest, guest_avatar", async () => {
      const { body } = await request(app).get("/api/properties/1/reviews");
      const testReview = body.reviews[0];
      expect(testReview).toHaveProperty("review_id");
      expect(testReview).toHaveProperty("comment");
      expect(testReview).toHaveProperty("rating");
      expect(testReview).toHaveProperty("created_at");
      expect(testReview).toHaveProperty("guest");
      expect(testReview).toHaveProperty("guest_avatar");
    });

    test("returns review data for the property_id passed in the url", async () => {
      const { body } = await request(app).get("/api/properties/4/reviews");
      const testReview = body.reviews[0];
      expect(testReview.review_id).toBe(4);
      expect(testReview.comment).toBe("Comment about Elegant City Apartment");
      expect(testReview.rating).toBe(2);
      // expect(testReview.created_at).toBe("2024-08-03T16:20:00Z");
      expect(testReview.guest).toBe("Frank White");
      expect(testReview.guest_avatar).toBe("https://example.com/images/frank.jpg");
    });

    test.todo("returned reviews are ordered from most recent to oldest");

    test("average_rating returns the average of all review ratings of a property", async () => {
      const { body } = await request(app).get("/api/properties/5/reviews");
      expect(body.average_rating).toBe(4.5);
    });

    test("returns status 400 when passed an invalid property id", async () => {
      const { body } = await request(app).get("/api/properties/invalid-id/reviews").expect(400);
      expect(body.msg).toBe("Bad Request");
    });

    test("returns status 404 when passed a valid but non-existant property id", async () => {
      const { body } = await request(app).get("/api/properties/10000000/reviews").expect(404);
      expect(body.msg).toBe("Property not found");
    });
  });

  describe.only("POST /api/properties/:id/reviews", () => {
    test("Repsonds with status of 201", async () => {
      const testReview = { guest_id: 1, rating: 5, comment: "test comment" };
      const response = await request(app)
        .post("/api/properties/1/reviews")
        .send(testReview)
        .expect(201);
    });

    test("Responds with newly inserted review plus review_id, property_id and created_at", async () => {
      const testReview = { guest_id: 1, rating: 5, comment: "test comment" };
      const { body: inserttedReview } = await request(app)
        .post("/api/properties/1/reviews")
        .send(testReview);

      expect(inserttedReview.guest_id).toBe(1);
      expect(inserttedReview.rating).toBe(5);
      expect(inserttedReview.comment).toBe("test comment");
      expect(inserttedReview.review_id).toBe(17);
      expect(inserttedReview.property_id).toBe(1);
      expect(inserttedReview).toHaveProperty("created_at");
    });

    test("Responds with status 400 and error message when guest_id is not provided", async () => {
      const testReview = { rating: 5, comment: "test comment" };
      const { body } = await request(app)
        .post("/api/properties/1/reviews")
        .send(testReview)
        .expect(400);

      expect(body.msg).toBe("Bad Request");
    });

    test("Responds with status 400 and error message when guest_id is not provided", async () => {
      const testReview = { rating: 5, comment: "test comment" };
      const { body } = await request(app)
        .post("/api/properties/1/reviews")
        .send(testReview)
        .expect(400);

      expect(body.msg).toBe("Bad Request");
    });

    test("Responds with status 400 and error message when rating is not provided", async () => {
      const testReview = { guest_id: 1, comment: "test comment" };
      const { body } = await request(app)
        .post("/api/properties/1/reviews")
        .send(testReview)
        .expect(400);

      expect(body.msg).toBe("Bad Request");
    });

    test("Responds with status 201 when comment is not provided", async () => {
      const testReview = { guest_id: 1, rating: 5 };
      const { body: inserttedReview } = await request(app)
        .post("/api/properties/1/reviews")
        .send(testReview)
        .expect(201);

      expect(inserttedReview.comment).toBe(null);
    });

    test("Responds with status 400 and error message if guest_id is not an integer", async () => {
      const testReview = { guest_id: "invalid-type", rating: 5, comment: "test comment" };
      const { body } = await request(app)
        .post("/api/properties/1/reviews")
        .send(testReview)
        .expect(400);

      expect(body.msg).toBe("Bad Request");
    });

    test("Responds with status 400 and error message if rating is not an integer", async () => {
      const testReview = { guest_id: 1, rating: "invalid-type", comment: "test comment" };
      const { body } = await request(app)
        .post("/api/properties/1/reviews")
        .send(testReview)
        .expect(400);

      expect(body.msg).toBe("Bad Request");
    });

    test("Responds with status 400 and error message if property_id is invalid type", async () => {
      const testReview = { guest_id: 1, rating: 5, comment: "test comment" };
      const { body } = await request(app)
        .post("/api/properties/invalid-id/reviews")
        .send(testReview)
        .expect(400);

      expect(body.msg).toBe("Bad Request");
    });

    test("Responds with status 400 and error message if property_id is valid but non-existent", async () => {
      const testReview = { guest_id: 1, rating: 5, comment: "test comment" };
      const { body } = await request(app)
        .post("/api/properties/1000000/reviews")
        .send(testReview)
        .expect(404);

      expect(body.msg).toBe("Property not found");
    });
  });
});
