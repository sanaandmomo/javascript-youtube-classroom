import { YOUTUBE_API_KEY } from '../../../env.js';

export const api = {
  fetchVideoItems: ({ query, nextPageToken = '', max = 10 }) => {
    return fetch(
      `https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&pageToken=${nextPageToken}&q=${query}&max_results=${max}&regionCode=kr&type=video&chart=mostPopular&videoEmbeddable=true&part=snippet`,
      // `https://www.googleapis.com/youtube/v3/search?q=${query}&key=${YOUTUBE_API_KEY}&pageToken=${nextPageToken}&max_results=${max}&type=video&videoEmbeddable=true&part=snippet`,
      {
        method: 'GET',
      }
    )
      .then(response => response.ok && response.json())
      .catch(error => {
        // TODO : 에러처리 - if response.ok 이용해서
        console.log(error);
      });
  },
};
