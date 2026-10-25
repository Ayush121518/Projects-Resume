import { request } from './client.js';

export const measurementsApi = {
  getMeasurements: () => request('/measurements'),
  getSummary: () => request('/measurements/summary'),
  addMeasurement: (data) =>
    request('/measurements', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateMeasurement: (id, data) =>
    request(`/measurements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteMeasurement: (id) =>
    request(`/measurements/${id}`, {
      method: 'DELETE',
    }),
};
