const storage = {
  save: (key, value) => {
    localStorage.setItem(key, JSON.stringify([...storage.load(key), value]));
  },

  overwrite: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },

  load: (key) => {
    return JSON.parse(localStorage.getItem(key)) || [];
  },
};

export default storage;
