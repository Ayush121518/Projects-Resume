import { request } from './client.js';

export const plansApi = {
  getPlans: () => request('/workout-plans'),
  getPlan: (id) => request(`/workout-plans/${id}`),
  createPlan: (data) =>
    request('/workout-plans', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updatePlan: (id, data) =>
    request(`/workout-plans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deletePlan: (id) =>
    request(`/workout-plans/${id}`, {
      method: 'DELETE',
    }),
  duplicatePlan: (id) =>
    request(`/workout-plans/${id}/duplicate`, {
      method: 'POST',
    }),
};
