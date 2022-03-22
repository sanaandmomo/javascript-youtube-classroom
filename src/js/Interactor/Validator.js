import database from '../database/index.js';
import { ERROR_MESSAGE, DATABASE_VIDEO_KEY, MAX_DATABASE_CAPACITY } from '../constants/index.js';

const validator = {
  checkKeyword: (keyword) => {
    if (keyword.trim() === '') throw new Error(ERROR_MESSAGE.EMPTY_KEYWORD);
  },

  checkFullOfDatabase: () => {
    if (database.load(DATABASE_VIDEO_KEY) >= MAX_DATABASE_CAPACITY)
      throw new Error(ERROR_MESSAGE.FULL_OF_DATABASE);
  },
};

export default validator;
