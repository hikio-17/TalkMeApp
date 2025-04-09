import {
  generateLoaderAbsoluteTemplate,
  generateStoryItemTemplate,
  generateStoriesListEmptyTemplate,
  generateStoriesListErrorTemplate,
} from '../../templates';
import HomePresenter from './home-presenter';
import Map from '../../utils/map';
import * as StoryAPI from '../../data/api';

export default class HomePage {
  #presenter = null;
  #map = null;
  #page = 1;

  async render() {
    return `
      <section>
        <div class="stories-list__map__container">
          <div id="map" class="stories-list__map"></div>
          <div id="map-loading-container"></div>
        </div>
      </section>

      <section class="container">
        <h1 class="section-title">Daftar Story</h1>

        <div class="stories-list__container">
          <div id="stories-list"></div>
          <div id="stories-list-loading-container"></div>
        </div>
      </section>

      <section class="container container-pagination">
          <button id="btn-prev"><i class="fas fa-chevron-left"></i></button>
          <p id="page">${this.#page}</p>
          <button id="btn-next"><i class="fas fa-chevron-right"></i></button>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new HomePresenter({
      view: this,
      model: StoryAPI,
    });

    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const page = document.getElementById('page');

    btnPrev.addEventListener('click', async () => {
      this.#page -= 1;
      document.getElementById('stories-list').innerHTML = '';
      if (this.#page === 1) {
        this.disableBtnPrev();
      }
      page.innerText = this.#page;
      await this.#presenter.initialGalleryAndMap(this.#page);
    });
    btnNext.addEventListener('click', async () => {
      this.#page += 1;
      document.getElementById('stories-list').innerHTML = '';
      if (this.#page > 1) {
        btnPrev.disabled = false;
      }
      page.innerText = this.#page;
      await this.#presenter.initialGalleryAndMap(this.#page);
    });

    if (this.#page === 1) {
      this.disableBtnPrev();
    }
    await this.#presenter.initialGalleryAndMap(this.#page);
  }

  disableBtnNext() {
    document.getElementById('btn-next').disabled = true;
  }
  enableBtnNext() {
    document.getElementById('btn-next').disabled = false;
  }
  disableBtnPrev() {
    document.getElementById('btn-prev').disabled = true;
  }

  populateStoriesList(message, stories) {
    if (stories.length <= 0) {
      this.populateStoriesListEmpty();
      return;
    }

    const html = stories.reduce((accumulator, story) => {
      if (this.#map) {
        if (story.lat && story.lon) {
          const coordinate = [story.lat, story.lon];
          const markerOptions = { alt: story.name };
          const popupOptions = { content: story.name };

          this.#map.addMarker(coordinate, markerOptions, popupOptions);
        }
      }
      return accumulator.concat(
        generateStoryItemTemplate({
          ...story,
        }),
      );
    }, '');

    document.getElementById('stories-list').innerHTML = `
      <div class="stories-list">${html}</div>
    `;
  }

  populateStoriesListEmpty() {
    document.getElementById('stories-list').innerHTML = generateStoriesListEmptyTemplate();
  }

  populateStoriesListError(message) {
    document.getElementById('stories-list').innerHTML = generateStoriesListErrorTemplate(message);
  }

  async initialMap() {
    this.#map = await Map.build('#map', {
      zoom: 10,
      locate: true,
    });
  }

  showMapLoading() {
    document.getElementById('map-loading-container').innerHTML = generateLoaderAbsoluteTemplate();
  }

  hideMapLoading() {
    document.getElementById('map-loading-container').innerHTML = '';
  }

  showLoading() {
    document.getElementById('stories-list-loading-container').innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideLoading() {
    document.getElementById('stories-list-loading-container').innerHTML = '';
  }
}
