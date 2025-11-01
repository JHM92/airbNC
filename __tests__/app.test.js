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

    test("returns properties of specific property_type when passed optional property_type query", async () => {
      const { body: apartments } = await request(app).get(
        "/api/properties?property_type=Apartment"
      );
      const { body: houses } = await request(app).get("/api/properties?property_type=House");
      const { body: studios } = await request(app).get("/api/properties?property_type=Studio");
      expect(apartments.properties.length).toBe(4);
      expect(houses.properties.length).toBe(3);
      expect(studios.properties.length).toBe(4);
    });

    test("works when passed multiple values for property_type", async () => {
      const { body: housesAndStudios } = await request(app).get(
        "/api/properties?property_type=Studio&property_type=House"
      );
      expect(housesAndStudios.properties.length).toBe(7);
    });

    test("Respond with status 404 when passed a property_type that's not in the database", async () => {
      const { body } = await request(app)
        .get("/api/properties?property_type=not-in-database")
        .expect(404);
      expect(body.msg).toBe("Property type does not exist");
    });

    describe("optional query: sort/order by", () => {
      test("returned property objects are sorted by cost_per_night when passed as optional query", async () => {
        const { body } = await request(app).get("/api/properties?sort=cost_per_night");
        expect(body.properties).toBeSortedBy("price_per_night", { coerce: true });
      });

      test("returned property objects are sorted by popularity when passed as optional query", async () => {
        const { body } = await request(app).get("/api/properties?sort=popularity");
        expect(body.properties[0].property_name).toBe("Elegant City Apartment");
      });

      test("returned property objects can be sorted ascending and descending when passed optional query", async () => {
        const { body: popularityAscending } = await request(app).get(
          "/api/properties?sort=popularity&order=ascending"
        );
        const { body: popularityDescending } = await request(app).get(
          "/api/properties?sort=popularity&order=descending"
        );
        const { body: costAscending } = await request(app).get(
          "/api/properties?sort=cost_per_night&order=ascending"
        );
        const { body: costDescending } = await request(app).get(
          "/api/properties?sort=cost_per_night&order=descending"
        );

        expect(costAscending.properties).toBeSortedBy("price_per_night", { coerce: true });
        expect(costDescending.properties).toBeSortedBy("price_per_night", {
          descending: true,
          coerce: true,
        });

        expect(popularityAscending.properties[0].property_name).toBe("Elegant City Apartment");
        expect(popularityDescending.properties[0].property_name).toBe("Cosy Family House");
      });
    });

    describe("optional query: limit by price", () => {
      test("only returns properties  that cost less than or equal to the maxPrice if passed as optional query", async () => {
        const { body: testMaxPrice } = await request(app).get("/api/properties/?maxprice=95");
        expect(testMaxPrice.properties.length).toBe(3);
      });

      test("only returns properties that cost more than or equal to the maxPrice if passed as optional query", async () => {
        const { body: testMinPrice } = await request(app).get("/api/properties/?minprice=200");
        expect(testMinPrice.properties.length).toBe(2);
      });

      test("returns objects within price range when passed min and max price as optional queries", async () => {
        const { body: testPriceRange } = await request(app).get(
          "/api/properties/?minprice=100&maxprice=200"
        );
        expect(testPriceRange.properties.length).toBe(7);
      });

      test("price queries work when passed alongside property_type queries", async () => {
        const { body: testPriceRange } = await request(app).get(
          "/api/properties/?minprice=100&maxprice=200&property_type=House"
        );
        expect(testPriceRange.properties.length).toBe(3);
      });

      test("returns status 400 when passed an invalid min or max price", async () => {
        const { body: testInvalidMinPrice } = await request(app)
          .get("/api/properties/?minprice=invalid")
          .expect(400);
        const { body: testInvalidMaxPrice } = await request(app)
          .get("/api/properties/?maxprice=invalid")
          .expect(400);
        expect(testInvalidMinPrice.msg).toBe("Bad Request");
        expect(testInvalidMaxPrice.msg).toBe("Bad Request");
      });
    });

    test("returned property objects have image_url property", async () => {
      const { body } = await request(app).get("/api/properties");
      const testProperty = body.properties[0];
      expect(testProperty).toHaveProperty("image_url");
    });

    test("returned properties only contain one image_url", async () => {
      const { body } = await request(app).get("/api/properties");
      const testProperty = body.properties[9];
      expect(testProperty.image_url).toBe("https://example.com/images/modern_apartment_1.jpg");
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

    test("returned property object contains images property", async () => {
      const { body } = await request(app).get("/api/properties/1");
      const testProperty = body.property;
      expect(testProperty).toHaveProperty("images");
    });

    test("images property contains an array with all images associated with passed property_id", async () => {
      const { body: testPropertyId1 } = await request(app).get("/api/properties/1");
      const { body: testPropertyId2 } = await request(app).get("/api/properties/2");
      expect(testPropertyId1.property.images.length).toBe(3);
      expect(testPropertyId2.property.images.length).toBe(1);
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
      expect(testReview.created_at).toBe("2024-08-03T16:20:00.000Z");
      expect(testReview.guest).toBe("Frank White");
      expect(testReview.guest_avatar).toBe("https://example.com/images/frank.jpg");
    });

    test("returned reviews are ordered from most recent to oldest", async () => {
      const { body } = await request(app).get("/api/properties/1/reviews");
      expect(body.reviews).toBeSortedBy("created_at", { descending: true });
    });

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

  describe("POST /api/properties/:id/reviews", () => {
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

  describe("POST /api/properties/:id/favourite", () => {
    test("responds with status of 201", async () => {
      const testFavourite = { guest_id: 3 };
      const response = await request(app)
        .post("/api/properties/1/favourite")
        .send(testFavourite)
        .expect(201);
    });

    test("responds with success message and new favourite_id", async () => {
      const testFavourite = { guest_id: 3 };
      const { body } = await request(app).post("/api/properties/1/favourite").send(testFavourite);
      expect(body.msg).toBe("Property favourited successfully.");
      expect(body.favourite_id).toBe(17);
    });

    test("responds with status 403 if guest_id has already favourited the passed property_id", async () => {
      const testFavourite = { guest_id: 6 };
      const { body } = await request(app)
        .post("/api/properties/1/favourite")
        .send(testFavourite)
        .expect(403);
      expect(body.msg).toBe("Already favourited.");
    });

    test("Responds with status 400 and error message when guest_id is not provided", async () => {
      const { body } = await request(app).post("/api/properties/1/favourite").send().expect(400);

      expect(body.msg).toBe("Bad Request");
    });

    test("Responds with status 400 and error message when guest_id is invalid type", async () => {
      const testFavourite = { guest_id: "invalid-type" };
      const { body } = await request(app)
        .post("/api/properties/1/favourite")
        .send(testFavourite)
        .expect(400);

      expect(body.msg).toBe("Bad Request");
    });

    test("Responds with status 404 and error message when guest_id is valid but non-existent", async () => {
      const testFavourite = { guest_id: 10000000 };
      const { body } = await request(app)
        .post("/api/properties/1/favourite")
        .send(testFavourite)
        .expect(404);

      expect(body.msg).toBe("Guest not found");
    });

    test("Responds with status 400 and error message if property_id is invalid type", async () => {
      const testFavourite = { guest_id: 1 };
      const { body } = await request(app)
        .post("/api/properties/invalid-id/favourite")
        .send(testFavourite)
        .expect(400);

      expect(body.msg).toBe("Bad Request");
    });

    test("Responds with status 400 and error message if property_id is valid but non-existent", async () => {
      const testFavourite = { guest_id: 1 };
      const { body } = await request(app)
        .post("/api/properties/1000000/favourite")
        .send(testFavourite)
        .expect(404);

      expect(body.msg).toBe("Property not found");
    });
  });

  describe("DELETE /api/reviews/:id", () => {
    test("Responds with status of 204", async () => {
      const response = await request(app).delete("/api/reviews/4").expect(204);
    });

    test("Removes row of passed review_id from the reviews table", async () => {
      const {
        body: { reviews: reviewsBeforeDeletion },
      } = await request(app).get("/api/properties/4/reviews");

      expect(reviewsBeforeDeletion.length).toBe(1);

      await request(app).delete("/api/reviews/4").expect(204);

      const {
        body: { reviews: reviewsAfterDeletion },
      } = await request(app).get("/api/properties/4/reviews");
      expect(reviewsAfterDeletion.length).toBe(0);
    });

    test("Responds with status 400 when passed an invalid review_id", async () => {
      const { body } = await request(app).delete("/api/reviews/invalid-id").expect(400);
      expect(body.msg).toBe("Bad Request");
    });

    test("Responds with status 404 when passed a valid but non-existent review_id", async () => {
      const { body } = await request(app).delete("/api/reviews/100000").expect(404);
      expect(body.msg).toBe("Review not found");
    });
  });
});
