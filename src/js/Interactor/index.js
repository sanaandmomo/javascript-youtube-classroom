import validator from './validator.js';
import helper from './helper.js';

import KeywordInputView from '../Views/KeywordInputView.js';
import VideoView from '../Views/VideoView.js';
import SearchModalView from '../Views/SearchModalView.js';
import SwitchVideoView from '../Views/SwitchVideoView.js';
import UnseenVideoListView from '../Views/UnseenVideoListView.js';
import SeenVideoListView from '../Views/SeenVideoListView.js';

import { _ } from '../utils/fx.js';

const keywordInputView = new KeywordInputView();
const searchModalView = new SearchModalView();
const videoView = new VideoView(helper.fetchVideo);
const switchVideoView = new SwitchVideoView();
const unseenVideoListView = new UnseenVideoListView();
const seenVideoListView = new SeenVideoListView();

const handleKeywordInputSubmit = (keyword) => {
  try {
    validator.checkKeyword(keyword);

    videoView.refreshVideoScreen();
    videoView.onSkeleton();
    _.go(keyword, helper.searchVideo, (videos) => {
      videoView.renderScreenByVideos(videos);
      videoView.offSkeleton();
    });
  } catch ({ message }) {
    alert(message);
  }
};

const handleSearchModalButtonClick = () => {
  keywordInputView.refreshInput();
  videoView.refreshVideoScreen();
};

const handleSwitchUnseenButtonClick = _.pipe(
  helper.loadVideo,
  _.filter(({ checked }) => !checked),
  unseenVideoListView.renderScreenByVideos.bind(unseenVideoListView),
);

const handleSwitchSeenButtonClick = _.pipe(
  helper.loadVideo,
  _.filter(({ checked }) => checked),
  seenVideoListView.renderScreenByVideos.bind(seenVideoListView),
);

const handleSaveVideoButtonClick = (video) => {
  try {
    validator.checkFullOfDatabase();

    helper.saveVideo(video);
    handleSwitchUnseenButtonClick();
  } catch ({ message }) {
    alert(message);
  }
};

const handleUnseenCheckButtonClick = (id) => {
  const videos = helper.loadVideo();

  helper.findVideoById(id, videos).checked = true;
  helper.overwriteVideos(videos);
  handleSwitchUnseenButtonClick();
};

const handleVideoDeleteButtonClick = _.curry((render, id) => {
  const videos = helper.loadVideo();

  videos.splice(helper.findVideoIndexById(id), 1);
  helper.overwriteVideos(videos);
  render();
});

const runApp = () => {
  keywordInputView.bindSubmitKeyword(handleKeywordInputSubmit);
  searchModalView.bindShowModal(handleSearchModalButtonClick);
  searchModalView.bindCloseModal();
  videoView.bindSaveVideo(handleSaveVideoButtonClick);
  switchVideoView.bindSwitchToSeenScreen(handleSwitchSeenButtonClick);
  switchVideoView.bindSwitchToUnseenScreen(handleSwitchUnseenButtonClick);
  unseenVideoListView.bindClickButtons(
    handleUnseenCheckButtonClick,
    handleVideoDeleteButtonClick(handleSwitchUnseenButtonClick),
  );
  seenVideoListView.bindClickButtons(
    _.noop,
    handleVideoDeleteButtonClick(handleSwitchSeenButtonClick),
  );
  handleSwitchUnseenButtonClick();
};

export default runApp;
