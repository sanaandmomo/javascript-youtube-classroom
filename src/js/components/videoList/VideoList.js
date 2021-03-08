import Component from '../../core/Component.js';
import Video from '../../model/Video.js';
import {
  $,
  $$,
  localStorageGetItem,
  localStorageSetItem,
  createElement,
} from '../../utils/utils.js';
import { LOCALSTORAGE_KEYS } from '../../constants/constants.js';

export default class VideoList extends Component {
  setup() {
    this.savedVideos = localStorageGetItem(LOCALSTORAGE_KEYS.VIDEOS);
    this.filter = 'watchLater';
  }

  initRender() {
    if (this.savedVideos) {
      const fragment = document.createDocumentFragment();
      Object.keys(this.savedVideos).forEach((videoId) => {
        fragment.appendChild(
          new Video({
            videoId,
            videoTitle: this.savedVideos[videoId].videoTitle,
            channelTitle: this.savedVideos[videoId].channelTitle,
            channelId: this.savedVideos[videoId].channelId,
            publishedAt: this.savedVideos[videoId].publishedAt,
            thumbnailURL: this.savedVideos[videoId].thumbnailURL,
            watched: this.savedVideos[videoId].watched,
          }).createTemplate('management')
        );
      });
      const snackBar = createElement({ tag: 'div' });
      snackBar.id = 'snackbar';

      this.$target.appendChild(fragment);
      this.$target.appendChild(snackBar);
    } else {
      console.log('저장된 동영상 없음');
    }
  }

  selectDOM() {
    this.$snackbar = $('#snackbar');
  }

  setFilter(filter) {
    if (this.filter !== filter) {
      this.render();
    }
    this.filter = filter ?? 'watchLater';
  }

  render() {
    $$('.clip', this.$target).forEach(($clip) => {
      $clip.classList.toggle('d-none');
    });
  }

  onClickWatchedButton(event) {
    const clip = event.target.closest('.clip');

    this.savedVideos[clip.dataset.videoId].watched = !this.savedVideos[
      clip.dataset.videoId
    ].watched;
    localStorageSetItem(LOCALSTORAGE_KEYS.VIDEOS, this.savedVideos);

    clip.classList.toggle('d-none');
  }

  onClickDeleteButton(event) {
    const clip = event.target.closest('.clip');

    if (
      !(
        confirm('정말로 삭제하시겠습니까?') &&
        this.savedVideos[clip.dataset.videoId]
      )
    ) {
      throw new Error('삭제에 실패했습니다.');
    }
    delete this.savedVideos[clip.dataset.videoId];
    localStorageSetItem(LOCALSTORAGE_KEYS.VIDEOS, this.savedVideos);

    clip.remove();
  }

  showSnackBar(text) {
    console.log(text);
    this.$snackbar.textContent = text;
    this.$snackbar.classList.toggle('show');
    setTimeout(() => {
      this.$snackbar.classList.toggle('show');
      this.$snackbar.textContent = '';
    }, 3000);
  }

  // TODO: 좀 더 Object literal로 바꾸기
  bindEvent() {
    this.$target.addEventListener('click', (event) => {
      try {
        if (event.target.classList.contains('watched-button')) {
          this.onClickWatchedButton(event);
          this.showSnackBar('설정이 완료되었습니다.');
        } else if (event.target.classList.contains('delete-button')) {
          this.onClickDeleteButton(event);
          this.showSnackBar('정상적으로 삭제되었습니다.');
        }
      } catch (error) {
        this.showSnackBar(error.message);
      }
    });
  }
}