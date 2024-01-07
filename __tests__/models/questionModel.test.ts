import { Question } from "../../src/models/questionModel";
import mongoose from "mongoose";

describe("Question Model", () => {
  test("should validate a question with required fields", () => {
    const question = new Question({
      title: "Test Question",
      content: "This is a test question content.",
      authorId: new mongoose.Types.ObjectId(), // Use a valid ObjectId
    });

    const validationError = question.validateSync();
    expect(validationError).toBeUndefined();
  });

  // Add more tests as needed for methods or virtuals
});
