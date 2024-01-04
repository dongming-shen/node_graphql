import request from "supertest";
import express, { json } from "express";
import questionRoutes from "../../src/routes/questionRoutes";
import { Question } from "../../src/models/questionModel";

jest.mock("../../src/models/questionModel"); // Mock the Question model

const app = express();
app.use(json());
app.use("/questions", questionRoutes); // Assuming your routes start with /questions

describe("Question Routes", () => {
  test("POST /questions should create a new question", async () => {
    const mockQuestion = {
      title: "New Question",
      content: "Content of the new question",
      authorId: "author_id", // Replace with a mock valid ObjectId
    };

    Question.create.mockResolvedValue(mockQuestion); // Mock the Mongoose create method

    const response = await request(app).post("/questions").send(mockQuestion);

    expect(response.statusCode).toBe(201);
    expect(response.body).toMatchObject(mockQuestion); // Check if the response body matches the mock question
  });

  test("GET /questions should list all questions", async () => {
    const mockQuestions = [
      {
        title: "First Question",
        content: "Content of the first question",
        authorId: "author_id",
      },
      {
        title: "Second Question",
        content: "Content of the second question",
        authorId: "author_id",
      },
    ];

    Question.find.mockResolvedValue(mockQuestions); // Mock the Mongoose find method

    const response = await request(app).get("/questions");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockQuestions); // Check if the response body is an array of questions
  });

  test("GET /questions/:id should retrieve a question by id", async () => {
    const mockQuestion = {
      _id: "question_id",
      title: "Existing Question",
      content: "Content of the existing question",
      authorId: "author_id",
    };

    Question.findById.mockResolvedValue(mockQuestion); // Mock the Mongoose findById method

    const response = await request(app).get(`/questions/${mockQuestion._id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject(mockQuestion); // Check if the response body matches the mock question
  });

  // More test cases for PUT /questions/:id and DELETE /questions/:id
});

afterEach(() => {
  jest.clearAllMocks(); // Reset mocks after each test
});
