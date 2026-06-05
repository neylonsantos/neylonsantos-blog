import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["label"];

  connect() {
    const saved = localStorage.getItem("theme") || "dev";
    this.apply(saved);
  }

  toggle() {
    const current = document.documentElement.dataset.theme || "dev";
    const next = current === "dev" ? "human" : "dev";
    this.apply(next);
    localStorage.setItem("theme", next);
    document.dispatchEvent(new CustomEvent("theme:changed", { detail: { mode: next } }));
  }

  apply(theme) {
    document.documentElement.dataset.theme = theme;
    this.labelTargets.forEach(label => {
      label.textContent = theme === "dev" ? "modo humano" : "modo dev";
    });
  }
}
