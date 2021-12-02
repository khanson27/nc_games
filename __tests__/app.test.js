const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app");
const endpoints = require("../endpoints.json");

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
        expect(response.body.categories).toHaveLength(4);
      });
  });
  test("404: path not found", () => {
    return request(app)
      .get("/api/categoriez")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("path not found");
      });
  });
});

describe("GET: /api/reviews/:review_id", () => {
  test("200: returns a review obj with properties of owner, title, review_id, review_body, designer, review_img_url, category, created_at, votes and a count of all comments with this review_id", () => {
    return request(app)
      .get("/api/reviews/3")
      .expect(200)
      .then((response) => {
        expect(response.body.review[0]).toEqual(
          expect.objectContaining({
            owner: expect.any(String),
            title: expect.any(String),
            review_id: expect.any(Number),
            review_body: expect.any(String),
            designer: expect.any(String),
            review_img_url: expect.any(String),
            category: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          })
        );
      });
  });
  test("404: id not found", () => {
    return request(app)
      .get("/api/reviews/40")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("no review for review id 40");
      });
  });
  test("400: bad request", () => {
    return request(app)
      .get("/api/reviews/bananas")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("bad request");
      });
  });
});

describe("PATCH /api/reviews/:reviewId", () => {
  test("200: response has increments vote count", () => {
    const updateVote = { inc_vote: 1 };
    return request(app)
      .patch("/api/reviews/3")
      .send(updateVote)
      .expect(200)
      .then((response) => {
        expect(response.body.review[0].votes).toBe(6);
      });
  });
  test("200: response decrements the current review", () => {
    const updateVote = { inc_vote: -1 };
    return request(app)
      .patch("/api/reviews/2")
      .send(updateVote)
      .expect(200)
      .then((response) => {
        expect(response.body.review[0].votes).toBe(4);
      });
  });
  test("404: review_id not found", () => {
    const updateVote = { inc_vote: 1 };
    return request(app)
      .patch("/api/reviews/40")
      .send(updateVote)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("no review for review id 40");
      });
  });
  test("400: incorrect syntax for review_id", () => {
    const updateVote = { inc_vote: 1 };
    return request(app)
      .patch("/api/reviews/bananas")
      .send(updateVote)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("bad request");
      });
  });
  test("400: bad request incorrect type for property", () => {
    const updateVote = { inc_vote: "banananas" };
    return request(app)
      .patch("/api/reviews/1")
      .send(updateVote)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("bad request");
      });
  });
  test("400: no body sent to patch review", () => {
    return request(app)
      .patch("/api/reviews/2")
      .send({})
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("bad request");
      });
  });
  test("200: ignores additional keys on request, only updates the votes", () => {
    const updateVote = { inc_vote: 1, name: "kat" };
    return request(app)
      .patch("/api/reviews/2")
      .send(updateVote)
      .expect(200)
      .then((response) => {
        expect(response.body.review[0].votes).toBe(6);
        expect(response.body.review[0]).not.toHaveProperty("name");
      });
  });
});

describe("GET /api/reviews", () => {
  test("200: returns a review array sorted by date in descending order", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((response) => {
        expect(response.body.reviews).toBeSortedBy("created_at", {
          descending: true,
        });
        expect(response.body.reviews[0]).toEqual(
          expect.objectContaining({
            owner: expect.any(String),
            title: expect.any(String),
            review_id: expect.any(Number),
            review_body: expect.any(String),
            designer: expect.any(String),
            review_img_url: expect.any(String),
            category: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          })
        );
      });
  });
  test("200: returns a sorted array by query input", () => {
    return request(app)
      .get("/api/reviews?sort_by=votes&order=ASC")
      .expect(200)
      .then((response) => {
        expect(response.body.reviews).toBeSorted("votes", { ascending: true });
      });
  });
  test("200: returns a sorted array which is filtered by the relevant category", () => {
    return request(app)
      .get("/api/reviews?category=dexterity")
      .expect(200)
      .then((response) => {
        expect(response.body.reviews).toBeSorted("created_at", {
          descending: true,
        });
        expect(response.body.reviews[0]).toEqual(
          expect.objectContaining({
            owner: expect.any(String),
            title: expect.any(String),
            review_id: expect.any(Number),
            review_body: expect.any(String),
            designer: expect.any(String),
            review_img_url: expect.any(String),
            category: "dexterity",
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          })
        );
      });
  });
  test("200: returns an array sorted by owner ascending which is filtered by the relevant category ", () => {
    return request(app)
      .get("/api/reviews?sort_by=owner&order=ASC&category=euro%20game")
      .expect(200)
      .then((response) => {
        expect(response.body.reviews).toBeSortedBy("owner", {
          ascending: true,
        });
        expect(response.body.reviews[0]).toEqual(
          expect.objectContaining({
            owner: expect.any(String),
            title: expect.any(String),
            review_id: expect.any(Number),
            review_body: expect.any(String),
            designer: expect.any(String),
            review_img_url: expect.any(String),
            category: "euro game",
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          })
        );
      });
  });
  test("404: uses a category that exists but no reviews associated with it", () => {
    return request(app)
      .get("/api/reviews?category=children''s%20games")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("no reviews found for this category");
      });
  });
  test("400: sortby column does not exist", () => {
    return request(app)
      .get("/api/reviews?sort_by=bananas")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("column does not exist");
      });
  });
  test("400: order is not ASC or DESC", () => {
    return request(app)
      .get("/api/reviews?order=bananas")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("bad request");
      });
  });
  test("404: category does not exist on the database", () => {
    return request(app)
      .get("/api/reviews?category=bananas")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("no reviews found for this category");
      });
  });
});

describe("GET /api/reviews/:review_id/comments", () => {
  test("200: responds with an array of comments for the given review id ", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments[0]).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
          })
        );
      });
  });
  test("404: review id not found", () => {
    return request(app)
      .get("/api/reviews/90/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("review_id not found");
      });
  });
  test("400: incorrect syntax for review id", () => {
    return request(app)
      .get("/api/reviews/bananas/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("bad request");
      });
  });
});

describe("POST /api/reviews/:review_id/comments", () => {
  test("201: returns the posted comment", () => {
    const commentInput = {
      username: "mallionaire",
      body: "Love this game so good!",
    };
    return request(app)
      .post("/api/reviews/1/comments")
      .send(commentInput)
      .expect(201)
      .then((response) => {
        console.log(response.body.comment[0]);
        expect(response.body.comment[0]).toEqual(
          expect.objectContaining({
            comment_id: 7,
            author: "mallionaire",
            review_id: 1,
            votes: 0,
            created_at: expect.any(String),
            body: "Love this game so good!",
          })
        );
      });
  });
  test("400: review id syntax incorrect", () => {
    const commentInput = {
      username: "mallionaire",
      body: "Love this game so good!",
    };
    return request(app)
      .post("/api/reviews/bananas/comments")
      .send(commentInput)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("bad request");
      });
  });
  test("400: review_id not on parent table", () => {
    const commentInput = {
      username: "mallionaire",
      body: "Love this game so good!",
    };
    return request(app)
      .post("/api/reviews/90/comments")
      .send(commentInput)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe(
          "this key does not exist on parent table"
        );
      });
  });
  test("400: body empty", () => {
    return request(app)
      .post("/api/reviews/2/comments")
      .send({})
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("bad request");
      });
  });
  test("400: bad request incorrect type for property", () => {
    const commentInput = {
      name: "mallionaire",
      text: "Love this game so good!",
    };
    return request(app)
      .post("/api/reviews/1/comments")
      .send(commentInput)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("bad request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: no content returned", () => {
    return request(app)
      .delete("/api/comments/2")
      .expect(204)
      .then((response) => {
        expect(response.body).toEqual({});
      });
  });
  test("404: comment to delete is not found", () => {
    return request(app)
      .delete("/api/comments/100")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("comment not found");
      });
  });
  test("400: comment id syntax is not the correct type", () => {
    return request(app)
      .delete("/api/comments/bananas")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("bad request");
      });
  });
});

describe("GET /api", () => {
  test("200: returns a JSON object which describes all available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({ endpoints_JSON: endpoints });
      });
  });
});
