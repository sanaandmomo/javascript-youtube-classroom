import { $ } from '../utils/index.js';
import { SELECTOR } from '../constants/index.js';

export default class SwitchVideoView {
  #$app;

  #$switchButtons;

  constructor() {
    this.#$app = $(SELECTOR.APP);
    this.#$switchButtons = $(SELECTOR.SWITCH_BUTTONS);
  }

  bindSwitchScreen(handler) {
    this.#$switchButtons.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) return;

      handler(e.target.dataset.tab);
      this.#switchToScreen(e.target.dataset.tab);
    });
  }

  #switchToScreen(screen) {
    this.#$app.classList.remove('seen', 'unseen');
    this.#$app.classList.add(screen);
  }
}
