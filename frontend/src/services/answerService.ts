import { api } from "./api";
import {
  Answer,
  CreateAnswerRequest,
  UpdateAnswerRequest,
  LikeResponse,
} from "./types";

export async function getAnswerById(id: string): Promise<Answer> {
  const response = await api.get<Answer>(`/answers/${id}`);
  return response.data;
}

export async function getAnswersByQuestion(
  questionId: string
): Promise<Answer[]> {
  const response = await api.get<Answer[]>(
    `/answers/question/${questionId}`
  );
  return response.data;
}

export async function createAnswer(
  data: CreateAnswerRequest
): Promise<Answer> {
  const response = await api.post<Answer>("/answers", data);
  return response.data;
}

export async function updateAnswer(
  id: string,
  data: UpdateAnswerRequest
): Promise<Answer> {
  const response = await api.put<Answer>(`/answers/${id}`, data);
  return response.data;
}

export async function deleteAnswer(id: string): Promise<void> {
  await api.delete(`/answers/${id}`);
}

export async function likeAnswer(
  answerId: string,
  userId: string
): Promise<LikeResponse> {
  const response = await api.post<LikeResponse>(
    `/answers/${answerId}/like?userId=${userId}`
  );
  return response.data;
}

export async function unlikeAnswer(
  answerId: string,
  userId: string
): Promise<LikeResponse> {
  const response = await api.delete<LikeResponse>(
    `/answers/${answerId}/like?userId=${userId}`
  );
  return response.data;
}