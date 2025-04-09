import Map from '../../utils/map';

export default class HomePresenter {
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

  async initialGalleryAndMap(page) {
    this.#view.showLoading();
    try {
      await this.showStoriesListMap();

      let response = await this.#model.getAllStories(page);

      if (response.listStory.length === 0) {
        this.#view.disableBtnNext();
      } else {
        this.#view.enableBtnNext();
      }
      response.listStory = await Promise.all(
        response.listStory.map(async (story) => {
          return {
            ...story,
            location: await Map.getPlaceNameByCoordinate(story.lat, story.lon),
          };
        }),
      );

      if (!response.ok) {
        console.error('initialGalleryAndMap: response:', response);
        this.#view.populateStoriesListError(response.message);
        return;
      }

      this.#view.populateStoriesList(response.message, response.listStory);
    } catch (error) {
      console.error('initialGalleryAndMap: error:', error);
      this.#view.populateStoriesListError(error.message);
    } finally {
      this.#view.hideLoading();
    }
  }
}
