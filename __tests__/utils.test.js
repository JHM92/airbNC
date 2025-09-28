const {
  createUserRef,
  createPropertyRef,
  formatProperties,
  formatReviews,
  formatImages,
} = require("../db/utils");

let singlePropertyArray = [];
let multiplePropertyArray = [];
let usernameRef = [];
let propertyRef = [];
let singleReviewArray = [];
let multipleReviewArray = [];
let singleImageArray = [];
let multipleImageArray = [];
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
    { user_id: 3, first_name: "Frank", surname: "White" },
  ]);

  propertyRef = createPropertyRef([
    { property_id: 1, name: "Modern Apartment in City Center" },
    { property_id: 2, name: "Cosy Family House" },
    { property_id: 3, name: "Chic Studio Near the Beach" },
  ]);

  singleReviewArray = [
    {
      guest_name: "Frank White",
      property_name: "Chic Studio Near the Beach",
      rating: 4,
      comment: "Comment about Chic Studio Near the Beach",
      created_at: "2024-03-28T10:15:00Z",
    },
  ];

  multipleReviewArray = [
    {
      guest_name: "Frank White",
      property_name: "Chic Studio Near the Beach",
      rating: 4,
      comment: "Comment about Chic Studio Near the Beach",
      created_at: "2024-03-28T10:15:00Z",
    },
    {
      guest_name: "Bob Smith",
      property_name: "Modern Apartment in City Center",
      rating: 2,
      comment: "Comment about Modern Apartment in City Center",
      created_at: "2024-04-12T14:45:00Z",
    },
  ];

  singleImageArray = [
    {
      property_name: "Modern Apartment in City Center",
      image_url: "https://example.com/images/modern_apartment_1.jpg",
      alt_tag: "Alt tag for Modern Apartment in City Center",
    },
  ];

  multipleImageArray = [
    {
      property_name: "Modern Apartment in City Center",
      image_url: "https://example.com/images/modern_apartment_1.jpg",
      alt_tag: "Alt tag for Modern Apartment in City Center",
    },
    {
      property_name: "Modern Apartment in City Center",
      image_url: "https://example.com/images/modern_apartment_3.jpg",
      alt_tag: "Alt tag for Modern Apartment in City Center 2",
    },
    {
      property_name: "Modern Apartment in City Center",
      image_url: "https://example.com/images/modern_apartment_3.jpg",
      alt_tag: "Alt tag for Modern Apartment in City Center 3",
    },
    {
      property_name: "Cosy Family House",
      image_url: "https://example.com/images/cosy_family_house_1.jpg",
      alt_tag: "Alt tag for Cosy Family House",
    },
  ];
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
    expect(formatProperties([])).toEqual([]);
  });

  test("when passed an array of property objects, returns an array of arrays", () => {
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

describe("createPropertyRef function", () => {
  test("Returns empty object when passed empty array", () => {
    expect(createPropertyRef([])).toEqual({});
  });

  test("assigns property's name as key on ref object", () => {
    const properties = [{ property_id: 1, name: "Modern Apartment in City Center" }];
    const ref = createPropertyRef(properties);
    expect(Object.keys(ref)).toEqual(["Modern Apartment in City Center"]);
  });

  test("assigns property_id as the value on the property's name key", () => {
    const properties = [{ property_id: 1, name: "Modern Apartment in City Center" }];
    const ref = createPropertyRef(properties);
    expect(ref["Modern Apartment in City Center"]).toBe(1);
  });

  test("function works with arrays of multiple elements", () => {
    const properties = [
      { property_id: 1, name: "Modern Apartment in City Center" },
      { property_id: 2, name: "Cosy Family House" },
    ];
    const ref = createPropertyRef(properties);
    expect(ref).toEqual({ "Modern Apartment in City Center": 1, "Cosy Family House": 2 });
  });
});

describe("formatReviews function", () => {
  test("returns an empty array when passed an empty array", () => {
    expect(formatReviews([])).toEqual([]);
  });

  test("when passed an array of property objects, returns an array of arrays", () => {
    expect(Array.isArray(formatReviews(singleReviewArray, usernameRef, propertyRef)[0])).toBe(true);
  });

  test("returned review arrays contain property_id (int) instead of property_name (str) as the first element", () => {
    const formattedReviews = formatReviews(singleReviewArray, usernameRef, propertyRef);
    expect(formattedReviews[0][0]).toBe(3);
  });

  test("returned review arrays contain guest_id (int) instead of guest_name (str) as the second element", () => {
    const formattedReviews = formatReviews(singleReviewArray, usernameRef, propertyRef);
    expect(formattedReviews[0][1]).toBe(3);
  });

  test("third element of returned review array equals the value on the rating key of the passed object", () => {
    const formattedReviews = formatReviews(singleReviewArray, usernameRef, propertyRef);
    expect(formattedReviews[0][2]).toBe(singleReviewArray[0].rating);
  });

  test("fourth element of returned review array equals the value on the comment key of the passed object", () => {
    const formattedReviews = formatReviews(singleReviewArray, usernameRef, propertyRef);
    expect(formattedReviews[0][3]).toBe(singleReviewArray[0].comment);
  });

  test("fifth element of returned review array equals the value on the created_at key of the passed object", () => {
    const formattedReviews = formatReviews(singleReviewArray, usernameRef, propertyRef);
    expect(formattedReviews[0][4]).toBe(singleReviewArray[0].created_at);
  });

  test("function works when passed arrays containing multiple review objects", () => {
    const formattedReviews = formatReviews(multipleReviewArray, usernameRef, propertyRef);
    expect(formattedReviews[1][0]).toBe(1);
    expect(formattedReviews[1][1]).toBe(2);
    expect(formattedReviews[1][2]).toBe(multipleReviewArray[1].rating);
    expect(formattedReviews[1][3]).toBe(multipleReviewArray[1].comment);
    expect(formattedReviews[1][4]).toBe(multipleReviewArray[1].created_at);
  });
});

describe("formatImages function", () => {
  test("returns an empty array when passed an empty array", () => {
    expect(formatImages([])).toEqual([]);
  });

  test("when passed an array of property objects, returns an array of arrays", () => {
    expect(Array.isArray(formatImages(singleReviewArray, propertyRef)[0])).toBe(true);
  });

  test("returned image arrays contain image_id instead of image name as the first element", () => {
    const formattedImages = formatImages(singleImageArray, propertyRef);
    expect(formattedImages[0][0]).toBe(1);
  });

  test("second element of returned array equals the value on the image_url key of the passed object", () => {
    const formattedImages = formatImages(singleImageArray, propertyRef);
    expect(formattedImages[0][1]).toBe(singleImageArray[0].image_url);
  });

  test("third element of returned array equals the value on the alt_tag key of the passed object", () => {
    const formattedImages = formatImages(singleImageArray, propertyRef);
    expect(formattedImages[0][2]).toBe(singleImageArray[0].alt_tag);
  });

  test("function works when passed arrays containing multiple image objects", () => {
    const formattedImages = formatImages(multipleImageArray, propertyRef);
    expect(formattedImages[3][0]).toBe(2);
    expect(formattedImages[3][1]).toBe(multipleImageArray[3].image_url);
    expect(formattedImages[3][2]).toBe(multipleImageArray[3].alt_tag);
  });
});
