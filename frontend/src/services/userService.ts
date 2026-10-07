import { api } from "./api";
import {
  User,
  CreateUserRequest,
  UpdateUserRequest,
} from "./types";

export async function getAllUsers(): Promise<User[]> {
  const response = await api.get<User[]>("/users");
  return response.data;
}

export async function getUserById(id: string): Promise<User> {
  const response = await api.get<User>(`/users/${id}`);
  return response.data;
}

export async function createUser(data: CreateUserRequest): Promise<User> {
  const response = await api.post<User>("/users", data);
  return response.data;
}

export async function updateUser(
  id: string,
  data: UpdateUserRequest
): Promise<User> {
  const response = await api.put<User>(`/users/${id}`, data);
  return response.data;
}

export async function deleteUser(id: string): Promise<void> {
  await api.delete(`/users/${id}`);
}