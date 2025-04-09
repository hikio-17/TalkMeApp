export default class NotFoundPage {
  async render() {
    return `
      <div class="not-found__container">
        <h1>404 - Halaman tidak ditemukan</h1>
        <p>URL yang kamu tuju tidak tersedia.</p>
        <a href="#/">Kembali ke Home</a>
      </div>
    `;
  }

  async afterRender() {}
}
