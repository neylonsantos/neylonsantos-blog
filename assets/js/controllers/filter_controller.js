import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["post", "count"];

  connect() {
    const current = document.documentElement.dataset.theme || "dev";
    this.filter(current);
    this._onThemeChanged = this.onThemeChanged.bind(this);
    document.addEventListener("theme:changed", this._onThemeChanged);
  }

  disconnect() {
    document.removeEventListener("theme:changed", this._onThemeChanged);
  }

  onThemeChanged(event) {
    this.filter(event.detail.mode);
  }

  filter(mode) {
    let visible = 0;
    this.postTargets.forEach(post => {
      const show = post.dataset.postMode === mode;
      post.classList.toggle("hidden", !show);
      if (show) visible++;
    });
    if (this.hasCountTarget) {
      this.countTarget.textContent = visible;
    }
  }
}
