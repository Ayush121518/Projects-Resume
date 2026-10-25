import MongooseUser from './User.js';
import MongooseWorkoutPlan from './WorkoutPlan.js';
import MongooseWorkoutLog from './WorkoutLog.js';
import MongooseMeasurement from './Measurement.js';
import { memoryDb } from '../config/memoryStore.js';

function createModelProxy(MongooseModel, memoryCollection) {
  const handler = {
    get(target, prop) {
      if (global.USE_MEMORY_STORE) {
        if (prop in memoryCollection) {
          return memoryCollection[prop].bind(memoryCollection);
        }
      }
      return target[prop];
    },
    construct(target, args) {
      if (global.USE_MEMORY_STORE) {
        const data = args[0] || {};
        return {
          ...data,
          save: async function () {
            return await memoryCollection.create(this);
          },
        };
      }
      return new target(...args);
    },
  };

  return new Proxy(MongooseModel, handler);
}

export const User = createModelProxy(MongooseUser, memoryDb.users);
export const WorkoutPlan = createModelProxy(MongooseWorkoutPlan, memoryDb.plans);
export const WorkoutLog = createModelProxy(MongooseWorkoutLog, memoryDb.workouts);
export const Measurement = createModelProxy(MongooseMeasurement, memoryDb.measurements);
