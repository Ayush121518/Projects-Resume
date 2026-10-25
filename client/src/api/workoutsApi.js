import { request } from './client.js';

export const workoutsApi = {
  getWorkouts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/workouts${query ? `?${query}` : ''}`);
  },
  getWorkout: (id) => request(`/workouts/${id}`),
  logWorkout: (data) =>
    request('/workouts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateWorkout: (id, data) =>
    request(`/workouts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteWorkout: (id) =>
    request(`/workouts/${id}`, {
      method: 'DELETE',
    }),
  getStreakStats: () => request('/workouts/stats/streak'),
};
