import database from '../database/index.js';
import youtubeAPI from '../youtubeAPI/index.js';
import { formatDate } from '../utils/index.js';
import { REDIRECT_SERVER_HOST, DATABASE_VIDEO_KEY } from '../constants/index.js';
import { _ } from '../utils/fx.js';

const helper = {
  findVideoById: (id, videos = database.load(DATABASE_VIDEO_KEY)) =>
    _.find(({ videoId }) => videoId === id, videos),

  findVideoIndexById: (id, videos = database.load(DATABASE_VIDEO_KEY)) =>
    videos.findIndex(({ videoId }) => videoId === id),

  convertVideoToItem: ({ id, snippet }) => ({
    id: id.videoId,
    thumbnail: snippet.thumbnails.default.url,
    title: snippet.title,
    channelTitle: snippet.channelTitle,
    date: formatDate(snippet.publishTime),
    saved: helper.findVideoById(id.videoId) !== undefined,
  }),

  fetchVideo: (host = REDIRECT_SERVER_HOST.REAL) =>
    _.go(youtubeAPI.getVideos(host), _.map(helper.convertVideoToItem)).catch(() =>
      helper.fetchVideo(REDIRECT_SERVER_HOST.DUMMY),
    ),

  searchVideo: (keyword) => {
    youtubeAPI.readyToFetch(keyword);

    return helper.fetchVideo();
  },

  saveVideo: (video) => database.save(DATABASE_VIDEO_KEY, { ...video, checked: false }),

  loadVideo: () => database.load(DATABASE_VIDEO_KEY),

  overiteVideos: (videos) => database.overwrite(DATABASE_VIDEO_KEY, videos),
};

export default helper;