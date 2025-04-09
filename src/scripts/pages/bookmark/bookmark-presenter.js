import Map from '../../utils/map';

export default class BookmarkPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async showStoriesListMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error('showStoriesListMap: error:', error);
    } finally {
      this.#view.hideMapLoading();
    }
  }

  async initialGalleryAndMap() {
    this.#view.showStoriesListLoading();

    try {
      await this.showStoriesListMap();

      const listOfStories = await this.#model.getAllStories();
      const stories = await Promise.all(
        listOfStories.map(async (story) => {
          return {
            ...story,
            location: await Map.getPlaceNameByCoordinate(story.lat, story.lon),
          };
        }),
      );

      const message = 'Berhasil mendapatkan daftar laporan tersimpan.';
      this.#view.populateBookmarkedStories(message, stories);
    } catch (error) {
      console.error('initialGalleryAndMap: error:', error);
      this.#view.populateBookmarkedStoriesError(error.message);
    } finally {
      this.#view.hideStoriesListLoading();
    }
  }
}
