import REDIRECT_SERVER_HOST from './constants.js';
import { YOUTUBE_API_REQUEST_COUNT } from '../constants/index.js';

export default class YoutubeAPI {
  #nextPageToken;

  #keyword;

  #makeURL() {
    const url = new URL(REDIRECT_SERVER_HOST);
    const parameters = new URLSearchParams({
      part: 'snippet',
      type: 'video',
      maxResults: YOUTUBE_API_REQUEST_COUNT,
      regionCode: 'kr',
      safeSearch: 'strict',
      pageToken: this.#nextPageToken || '',
      q: this.#keyword,
    });
    url.search = parameters.toString();
    return url;
  }

  #refresh(keyword) {
    this.#nextPageToken = '';
    this.#keyword = keyword;
  }

  #checkEndPage() {
    return this.#nextPageToken === undefined;
  }

  async getVideos() {
    if (this.#checkEndPage()) return [];

    const response = await fetch(this.#makeURL(), { method: 'GET' });
    const body = await response.json();

    if (!response.ok) throw new Error(body.error.message);

    this.#nextPageToken = body.nextPageToken;
    return body.items;
  }

  async search(keyword) {
    this.#refresh(keyword);
    const result = await this.getVideos();

    return result;
  }
}
