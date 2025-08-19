// Servicio centralizado para la integración con API Ninja
import axios from 'axios';

const API_URL = 'https://api.api-ninjas.com/v1/exercises';
const API_KEY = 'Rnqn7lBWtFYmw6dhVxdImmPmj9ZtvqllcHW0ubki';

export interface Exercise {
  name: string;
  type: string;
  muscle: string;
  equipment: string;
  difficulty: string;
  instructions: string;
}

export async function fetchExercises(params?: Record<string, string>): Promise<Exercise[]> {
  try {
    const response = await axios.get(API_URL, {
      headers: { 'X-Api-Key': API_KEY },
      params,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching exercises:', error);
    return [];
  }
}
