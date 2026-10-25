import { request } from './client.js';

export const analyticsApi = {
  getDashboardAnalytics: () => request('/analytics/dashboard'),
};
