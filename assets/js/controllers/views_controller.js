import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static values = { path: String }

  async connect() {
    const endpoint = "https://blog-neylon-dev.goatcounter.com/counter";
    const url = `${endpoint}/${encodeURIComponent(this.pathValue)}.json`;

    try {
      const res = await fetch(url);
      if (!res.ok) return;
      const { count } = await res.json();
      this.element.textContent = `* ${count} views`;
    } catch {
      // silencia erros de rede — fallback permanece no DOM
    }
  }
}
