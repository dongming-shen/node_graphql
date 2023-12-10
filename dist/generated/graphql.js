"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSdk = exports.CreateQuestionDocument = exports.GetQuestionsDocument = void 0;
const graphql_tag_1 = __importDefault(require("graphql-tag"));
exports.GetQuestionsDocument = (0, graphql_tag_1.default) `
    query GetQuestions {
  questions {
    id
    title
    content
    authorId
  }
}
    `;
exports.CreateQuestionDocument = (0, graphql_tag_1.default) `
    mutation CreateQuestion($input: QuestionInput) {
  createQuestion(input: $input) {
    id
    title
    content
    authorId
  }
}
    `;
const defaultWrapper = (action, _operationName, _operationType) => action();
function getSdk(client, withWrapper = defaultWrapper) {
    return {
        GetQuestions(variables, requestHeaders) {
            return withWrapper((wrappedRequestHeaders) => client.request(exports.GetQuestionsDocument, variables, Object.assign(Object.assign({}, requestHeaders), wrappedRequestHeaders)), 'GetQuestions', 'query');
        },
        CreateQuestion(variables, requestHeaders) {
            return withWrapper((wrappedRequestHeaders) => client.request(exports.CreateQuestionDocument, variables, Object.assign(Object.assign({}, requestHeaders), wrappedRequestHeaders)), 'CreateQuestion', 'mutation');
        }
    };
}
exports.getSdk = getSdk;
