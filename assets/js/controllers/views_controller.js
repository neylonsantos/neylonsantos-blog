import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static values = { path: String }

  async connect() {
    const endpoint = "https://neylonsantos-blog.goatcounter.com/counter";
    const path = this.pathValue.replace(/\/$/, '');
    const url = `${endpoint}${path}.json`;

    try {
      const res = await fetch(url);
      const { count } = await res.json();
      this.element.textContent = `* ${count} views`;
    } catch {
      // silencia erros de rede — fallback permanece no DOM
    }
  }
}
