// types.ts

export interface UserArgs {
    id: string;
}

export interface UsersArgs {
    page?: number;
    pageSize?: number;
}

export interface QuestionArgs {
    id: string;
}

export interface QuestionsArgs {
    page?: number;
    pageSize?: number;
}

export interface CreateUserArgs {
    name: string;
    email: string;
}

export interface UpdateUserArgs {
    id: string;
    name?: string;
    email?: string;
}

export interface CreateQuestionArgs {
    title: string;
    content: string;
    authorId: string;
}

export interface UpdateQuestionArgs {
    id: string;
    title?: string;
    content?: string;
    authorId?: string;
}
