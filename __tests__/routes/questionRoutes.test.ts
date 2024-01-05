import request from "supertest";
import express, { json } from "express";
import questionRoutes from "../../src/routes/questionRoutes";
import { Question } from "../../src/models/questionModel";

jest.mock("../../src/models/questionModel", () => ({
  Question: {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

const app = express();
app.use(json());
app.use("/questions", questionRoutes);

describe("Question Routes", () => {
  test("POST /questions should create a new question", async () => {
    const mockQuestion = {
      _id: "question_id",
      title: "New Question",
      content: "Content of the new question",
      authorId: "author_id",
    };

    (Question.create as jest.Mock).mockResolvedValue(mockQuestion);

    const response = await request(app).post("/questions").send({
      title: "New Question",
      content: "Content of the new question",
      authorId: "author_id",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toMatchObject(mockQuestion);
  });

  test("GET /questions should list all questions", async () => {
    const mockQuestions = [
      {
        _id: "1",
        title: "First Question",
        content: "Content",
        authorId: "author_id_1",
      },
      {
        _id: "2",
        title: "Second Question",
        content: "Content",
        authorId: "author_id_2",
      },
    ];

    // Question.find.mockResolvedValue(mockQuestions);

    const response = await request(app).get("/questions");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockQuestions);
  });

  test("GET /questions/:id should retrieve a question by id", async () => {
    const mockQuestion = {
      _id: "question_id",
      title: "Existing Question",
      content: "Content of the existing question",
      authorId: "author_id",
    };

    (Question.findById as jest.Mock).mockResolvedValue(mockQuestion);

    const response = await request(app).get(`/questions/${mockQuestion._id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject(mockQuestion);
  });

  // Additional tests for PUT /questions/:id and DELETE /questions/:id as needed
});

afterEach(() => {
  jest.clearAllMocks();
});
