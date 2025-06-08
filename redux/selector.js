
export const selectRecentlyPlayedSongs = (state, limit = 10) => {
  const { songs, history } = state.audio;
  if (!songs || !history) return [];
  const seen = new Set();
  const recentIds = [];
  for (let i = history.length - 1; i >= 0 && recentIds.length < limit; i--) {
    const id = history[i]?.id;
    if (id && !seen.has(id)) {
      seen.add(id);
      recentIds.push(id);
    }
  }
  return songs.filter(song => recentIds.includes(song.id));
};


export const selectMostPlayedSongs = (state, limit = 10) => {
  const { songs, playCounts } = state.audio;
  if (!songs || !playCounts) return [];
  const sortedIds = Object.entries(playCounts)
    .sort((a, b) => b - a)
    .map(([id]) => id)
    .slice(0, limit);
  return songs.filter(song => sortedIds.includes(song.id));
};