const { createUserRef, formatProperties } = require("../db/utils");

let singlePropertyArray = [];
let multiplePropertyArray = [];
let usernameRef = [];
beforeEach(() => {
  singlePropertyArray = [
    {
      name: "Modern Apartment in City Center",
      property_type: "Apartment",
      location: "London, UK",
      price_per_night: 120.0,
      description:
        "Description of Modern Apartment in City Center. A sleek apartment with all modern amenities.",
      host_name: "Alice Johnson",
      amenities: ["WiFi", "TV", "Kitchen", "Washing Machine"],
    },
  ];

  multiplePropertyArray = [
    {
      name: "Modern Apartment in City Center",
      property_type: "Apartment",
      location: "London, UK",
      price_per_night: 120.0,
      description:
        "Description of Modern Apartment in City Center. A sleek apartment with all modern amenities.",
      host_name: "Alice Johnson",
      amenities: ["WiFi", "TV", "Kitchen", "Washing Machine"],
    },
    {
      name: "Cosy Family House",
      property_type: "House",
      location: "Manchester, UK",
      price_per_night: 150.0,
      description: "A spacious home perfect for families looking to explore the city.",
      host_name: "Alice Johnson",
      amenities: ["WiFi", "TV", "Kitchen", "Parking", "Iron"],
    },
  ];

  usernameRef = createUserRef([
    { user_id: 1, first_name: "Alice", surname: "Johnson" },
    { user_id: 2, first_name: "Bob", surname: "Smith" },
  ]);
});

describe("createUserRef function", () => {
  test("Returns empty object when passed empty array", () => {
    expect(createUserRef([])).toEqual({});
  });

  test("assigns user's full name as key on ref object", () => {
    const users = [{ user_id: 1, first_name: "Alice", surname: "Johnson" }];
    const ref = createUserRef(users);
    expect(Object.keys(ref)).toEqual(["Alice Johnson"]);
  });

  test("assigns user_id as the value on the user's name key", () => {
    const users = [{ user_id: 1, first_name: "Alice", surname: "Johnson" }];
    const ref = createUserRef(users);
    expect(ref["Alice Johnson"]).toBe(1);
  });

  test("function works with arrays of multiple elements", () => {
    const users = [
      { user_id: 1, first_name: "Alice", surname: "Johnson" },
      { user_id: 2, first_name: "Bob", surname: "Smith" },
    ];
    const ref = createUserRef(users);
    expect(ref).toEqual({ "Alice Johnson": 1, "Bob Smith": 2 });
  });
});

describe("formatProperties function", () => {
  test("returns an empty array when passed empty array", () => {
    expect(formatProperties()).toEqual([]);
  });

  test("when passed an array of property objects, returns an array of arrays", () => {
    //console.log(formatProperties(singlePropertyArray));
    expect(Array.isArray(formatProperties(singlePropertyArray, usernameRef)[0])).toBe(true);
  });

  test("returned property arrays contain host_id (int) instead of host_name (str) as the first element", () => {
    const formattedProperies = formatProperties(singlePropertyArray, usernameRef);
    expect(formattedProperies[0][0]).toBe(1);
  });

  test("second element of returned property array equals the value on the name key of the passed object", () => {
    const formattedProperies = formatProperties(singlePropertyArray, usernameRef);

    expect(formattedProperies[0][1]).toBe(singlePropertyArray[0].name);
  });

  test("third element of returned property array equals the value on the location key of the passed object", () => {
    const formattedProperies = formatProperties(singlePropertyArray, usernameRef);

    expect(formattedProperies[0][2]).toBe(singlePropertyArray[0].location);
  });

  test("fourth element of returned property array equals the value on the property_type key of the passed object", () => {
    const formattedProperies = formatProperties(singlePropertyArray, usernameRef);

    expect(formattedProperies[0][3]).toBe(singlePropertyArray[0].property_type);
  });

  test("fifth element of returned property array equals the value on the price_per_night key of the passed object", () => {
    const formattedProperies = formatProperties(singlePropertyArray, usernameRef);

    expect(formattedProperies[0][4]).toBe(singlePropertyArray[0].price_per_night);
  });

  test("sixth element of returned property array equals the value on the description key of the passed object", () => {
    const formattedProperies = formatProperties(singlePropertyArray, usernameRef);

    expect(formattedProperies[0][5]).toBe(singlePropertyArray[0].description);
  });

  test("function work when passed arrays containing multiple property objects", () => {
    const formattedProperties = formatProperties(multiplePropertyArray, usernameRef);
    expect(formattedProperties[1][0]).toBe(1);
    expect(formattedProperties[1][1]).toBe(multiplePropertyArray[1].name);
    expect(formattedProperties[1][2]).toBe(multiplePropertyArray[1].location);
    expect(formattedProperties[1][3]).toBe(multiplePropertyArray[1].property_type);
    expect(formattedProperties[1][4]).toBe(multiplePropertyArray[1].price_per_night);
    expect(formattedProperties[1][5]).toBe(multiplePropertyArray[1].description);
  });
});
