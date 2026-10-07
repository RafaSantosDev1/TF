import { api } from "./api";
import {
  Question,
  CreateQuestionRequest,
  UpdateQuestionRequest,
  Area,
} from "./types";

export async function getAllQuestions(): Promise<Question[]> {
  const response = await api.get<Question[]>("/questions");
  return response.data;
}

export async function getQuestionById(id: string): Promise<Question> {
  const response = await api.get<Question>(`/questions/${id}`);
  return response.data;
}

export async function getQuestionsByArea(
  area: Area
): Promise<Question[]> {
  const response = await api.get<Question[]>(
    `/questions/area/${area}`
  );
  return response.data;
}

export async function createQuestion(
  data: CreateQuestionRequest
): Promise<Question> {
  const response = await api.post<Question>("/questions", data);
  return response.data;
}

export async function updateQuestion(
  id: string,
  data: UpdateQuestionRequest
): Promise<Question> {
  const response = await api.put<Question>(`/questions/${id}`, data);
  return response.data;
}

export async function deleteQuestion(id: string): Promise<void> {
  await api.delete(`/questions/${id}`);
}

export async function markAcceptedAnswer(
  questionId: string,
  answerId: string
): Promise<Question> {
  const response = await api.put<Question>(
    `/questions/${questionId}/accepted-answer/${answerId}`
  );
  return response.data;
}