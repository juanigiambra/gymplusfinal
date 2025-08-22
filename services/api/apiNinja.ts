// Servicio centralizado para la integración con API Ninja
import axios from 'axios';
import { API_NINJA_CONFIG } from '../../config';

const { API_URL, API_KEY } = API_NINJA_CONFIG;

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
