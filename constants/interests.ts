export interface Interest {
  id: string;
  name: string;
  iconName: string;
}

export const INTERESTS_DATA: Interest[] = [
   { id: 'technology', name: 'Technology', iconName: 'hardware-chip-outline' },
  { id: 'design', name: 'Design', iconName: 'brush-outline' },
  { id: 'business', name: 'Business', iconName: 'business-outline' },
  { id: 'marketing', name: 'Marketing', iconName: 'trending-up-outline' },
  { id: 'sports', name: 'Sports', iconName: 'football-outline' },
  { id: 'music', name: 'Music', iconName: 'musical-notes-outline' },
  { id: 'travel', name: 'Travel', iconName: 'airplane-outline' },
  { id: 'movies', name: 'Movies', iconName: 'film-outline' },
  { id: 'gaming', name: 'Gaming', iconName: 'game-controller-outline' },
  { id: 'food', name: 'Food', iconName: 'restaurant-outline' },
  { id: 'fashion', name: 'Fashion', iconName: 'shirt-outline' },
  { id: 'art', name: 'Art', iconName: 'color-palette-outline' },
  { id: 'photography', name: 'Photography', iconName: 'camera-outline' },
  { id: 'reading', name: 'Reading', iconName: 'book-outline' },
  { id: 'cooking', name: 'Cooking', iconName: 'fast-food-outline' },
  { id: 'fitness', name: 'Fitness', iconName: 'barbell-outline' },
  { id: 'yoga', name: 'Yoga', iconName: 'body-outline' },
  { id: 'dancing', name: 'Dancing', iconName: 'musical-notes-outline' },
  { id: 'writing', name: 'Writing', iconName: 'create-outline' },
  { id: 'podcasts', name: 'Podcasts', iconName: 'mic-outline' },
];

export const getInterestWithIcon = (name: string): Interest => {
  const interest = INTERESTS_DATA.find((interest) => interest.name === name);
  if (!interest) throw new Error(`Interest with name ${name} not found`);
  return interest
}