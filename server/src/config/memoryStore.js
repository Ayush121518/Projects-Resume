import bcrypt from 'bcryptjs';

class MemoryCollection {
  constructor(name) {
    this.name = name;
    this.items = [];
  }

  _clone(doc) {
    if (!doc) return null;
    return JSON.parse(JSON.stringify(doc));
  }

  _wrapDoc(doc) {
    if (!doc) return null;
    const cloned = this._clone(doc);
    const collection = this;

    const wrapped = {
      ...cloned,
      save: async function () {
        const idx = collection.items.findIndex((x) => String(x._id) === String(this._id));
        if (idx !== -1) {
          // Recalculate volume if workout
          if (this.exercises) {
            let vol = 0;
            this.exercises.forEach((ex) => {
              ex.sets?.forEach((s) => {
                if (s.completed) vol += (s.weight || 0) * (s.reps || 0);
              });
            });
            this.totalVolumeKg = Math.round(vol);
          }
          collection.items[idx] = { ...this, updatedAt: new Date() };
        }
        return collection._wrapDoc(this);
      },
      deleteOne: async function () {
        collection.items = collection.items.filter((x) => String(x._id) !== String(doc._id));
        return { acknowledged: true, deletedCount: 1 };
      },
      matchPassword: async function (candidatePassword) {
        return await bcrypt.compare(candidatePassword, doc.password);
      },
    };

    return wrapped;
  }

  find(query = {}) {
    const executeFind = () => {
      let results = this.items.filter((item) => {
        for (const [key, val] of Object.entries(query)) {
          if (key === '$or' && Array.isArray(val)) {
            const matchesAny = val.some((cond) => {
              for (const [cKey, cVal] of Object.entries(cond)) {
                if (String(item[cKey]) === String(cVal)) return true;
              }
              return false;
            });
            if (!matchesAny) return false;
          } else if (String(item[key]) !== String(val)) {
            return false;
          }
        }
        return true;
      });

      return results.map((d) => this._wrapDoc(d));
    };

    let sortSpec = null;
    let limitNum = null;
    let populateField = null;

    const chain = {
      sort(criteria) {
        sortSpec = criteria;
        return chain;
      },
      limit(n) {
        limitNum = n;
        return chain;
      },
      populate(field, selectFields) {
        populateField = field;
        return chain;
      },
      select(fields) {
        return chain;
      },
      async then(resolve, reject) {
        try {
          let list = executeFind();

          if (sortSpec) {
            if (typeof sortSpec === 'object') {
              const [field, order] = Object.entries(sortSpec)[0] || [];
              if (field) {
                list.sort((a, b) => {
                  const valA = new Date(a[field]).getTime() || a[field];
                  const valB = new Date(b[field]).getTime() || b[field];
                  if (valA < valB) return order === 1 ? -1 : 1;
                  if (valA > valB) return order === 1 ? 1 : -1;
                  return 0;
                });
              }
            } else if (typeof sortSpec === 'string') {
              const desc = sortSpec.startsWith('-');
              const field = desc ? sortSpec.substring(1) : sortSpec;
              list.sort((a, b) => {
                const valA = new Date(a[field]).getTime() || a[field];
                const valB = new Date(b[field]).getTime() || b[field];
                if (valA < valB) return desc ? 1 : -1;
                if (valA > valB) return desc ? -1 : 1;
                return 0;
              });
            }
          }

          if (limitNum) {
            list = list.slice(0, limitNum);
          }

          if (populateField === 'plan') {
            list = list.map((item) => {
              if (item.plan) {
                const p = memoryDb.plans.items.find((x) => String(x._id) === String(item.plan));
                if (p) {
                  item.plan = { _id: p._id, title: p.title, category: p.category };
                }
              }
              return item;
            });
          }

          return resolve(list);
        } catch (e) {
          if (reject) return reject(e);
          throw e;
        }
      },
    };

    return chain;
  }

  findOne(query = {}) {
    const self = this;
    const chain = {
      select(fields) {
        return chain;
      },
      populate(field) {
        return chain;
      },
      async then(resolve, reject) {
        try {
          const list = await self.find(query);
          const first = list[0] || null;
          return resolve(first);
        } catch (e) {
          if (reject) return reject(e);
          throw e;
        }
      },
    };

    return chain;
  }

  findById(id) {
    return this.findOne({ _id: id });
  }

  async findByIdAndUpdate(id, update, options = {}) {
    const idx = this.items.findIndex((item) => String(item._id) === String(id));
    if (idx === -1) return null;

    const payload = update.$set || update;
    this.items[idx] = { ...this.items[idx], ...payload, updatedAt: new Date() };
    return this._wrapDoc(this.items[idx]);
  }

  async create(data) {
    let doc = { ...data };
    if (!doc._id) {
      doc._id = 'mem_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    }
    doc.createdAt = doc.createdAt || new Date();
    doc.updatedAt = new Date();

    if (doc.password && !doc.password.startsWith('$2')) {
      const salt = await bcrypt.genSalt(10);
      doc.password = await bcrypt.hash(doc.password, salt);
    }

    if (doc.exercises) {
      let vol = 0;
      doc.exercises.forEach((ex) => {
        ex.sets?.forEach((s) => {
          if (s.completed) vol += (s.weight || 0) * (s.reps || 0);
        });
      });
      doc.totalVolumeKg = Math.round(vol);
    }

    this.items.push(doc);
    return this._wrapDoc(doc);
  }

  async countDocuments(query = {}) {
    const list = await this.find(query);
    return list.length;
  }
}

export const memoryDb = {
  users: new MemoryCollection('users'),
  plans: new MemoryCollection('plans'),
  workouts: new MemoryCollection('workouts'),
  measurements: new MemoryCollection('measurements'),
};
