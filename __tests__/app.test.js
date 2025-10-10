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
  // await seed(propertyTypesData, usersData, propertiesData, reviewsData, imagesData, favouritesData);
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
});
