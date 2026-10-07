export type Area = "Voz" | "Linguagem" | "Fala" | "Fluencia";

export interface User {
  id: string;
  name: string;
  profileImage: string | null;
  bio: string | null;
  areas: Area[];
}

export interface CreateUserRequest {
  name: string;
  profileImage?: string | null;
  bio?: string | null;
  areas: Area[];
}

export interface UpdateUserRequest {
  name: string;
  profileImage?: string | null;
  bio?: string | null;
  areas: Area[];
}

export interface Question {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  authorId: string;
  authorName: string;
  area: Area;
  acceptedAnswerId: string | null;
  answersCount: number;

  // NOVO
  likesCount: number;

  answers: Answer[];
}

export interface CreateQuestionRequest {
  title: string;
  content: string;
  authorId: string;
  area: Area;
}

export interface UpdateQuestionRequest {
  title: string;
  content: string;
}

export interface Answer {
  id: string;
  content: string;
  createdAt: string;
  authorId: string;
  authorName: string;
  questionId: string;
  likesCount: number;
}

export interface CreateAnswerRequest {
  content: string;
  authorId: string;
  questionId: string;
}

export interface UpdateAnswerRequest {
  content: string;
}

export interface LikeResponse {
  likesCount: number;
}