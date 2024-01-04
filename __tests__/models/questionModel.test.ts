// __tests__/models/questionModel.test.ts

import { Question } from "../../src/models/questionModel";

describe("Question Model", () => {
  test("should validate a question with required fields", () => {
    const question = new Question({
      title: "Test Question",
      content: "This is a test question content.",
      authorId: "author_id", // This should be a valid ObjectId
    });

    const validationError = question.validateSync();
    expect(validationError).toBeUndefined();
  });

  // Add more tests as needed for methods or virtuals
});
