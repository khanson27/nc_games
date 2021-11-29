const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/categories", () => {
  test("200: returned with an array of objects", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((response) => {
        expect(response.body.categories[0]).toEqual(
          expect.objectContaining({
            slug: expect.any(String),
            description: expect.any(String),
          })
        );
        expect(Array.isArray(response.body.categories)).toBe(true);
      });
  });
});

describe('GET: /api/reviews/:review_id', () => {
  test('200: returns a review obj with properties of owner, title, review_id, review_body, designer, review_img_url, category, created_at, votes and a count of all comments with this review_id', ()=>{
    return request(app).get('/api/reviews/1').expect(200).then((response)=>{
      expect(response.body.review).toEqual(expect.objectContaining({
        owner: expect.any(String),
        title: expect.any(String),
        review_id: expect.any(Number),
        review_body: expect.any(String),
        designer: expect.any(String),
        review_img_url: expect.any(String),
        category: expect.any(String),
        created_at: expect.any(Number),
        votes: expect.any(Number),
        comment_count: expect.any(Number);
      }))
    })
  })
});