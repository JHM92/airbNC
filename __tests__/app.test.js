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
});
