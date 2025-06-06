export const sortSongs = (songs, sortBy) => {
  const sorted = [...songs];
  
  switch (sortBy) {
    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'artist':
      return sorted.sort((a, b) => a.artist.localeCompare(b.artist));
    case 'duration':
      return sorted.sort((a, b) => a.duration - b.duration);
    case 'creationTime':
      return sorted.sort((a, b) => new Date(b.creationTime) - new Date(a.creationTime));
    default:
      return sorted;
  }
};

export const sortPlaylists = (playlists, sortBy) => {
  const sorted = [...playlists];
  
  switch (sortBy) {
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'date':
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    case 'songCount':
      return sorted.sort((a, b) => b.songs.length - a.songs.length);
    default:
      return sorted;
  }
};