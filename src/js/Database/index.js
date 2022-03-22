const database = {
  save: (key, value) => {
    localStorage.setItem(key, JSON.stringify([...database.load(key), value]));
  },

  overwrite: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },

  load: (key) => {
    return JSON.parse(localStorage.getItem(key)) || [];
  },
};

export default database;
