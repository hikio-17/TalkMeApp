import Map from '../utils/map';

export async function storyMapper(story) {
  const latitude = story?.lat ?? null;
  const longitude = story?.lon ?? null;
  return {
    ...story,
    location: latitude && longitude && (await Map.getPlaceNameByCoordinate(latitude, longitude)),
  };
}
