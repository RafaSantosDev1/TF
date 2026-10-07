import { api } from "./api";
import { Area } from "./types";

export async function getAllAreas(): Promise<Area[]> {
  const response = await api.get<string[]>("/areas");
  return response.data as Area[];
}