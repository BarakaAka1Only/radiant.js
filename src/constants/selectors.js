export const songSelectors = {
    SongID: ".song-row.currently-playing",
    SongAlbumID: ".player-album",
    SongArtist: "player-artist",
    SongTitle: "currently-playing-title",
    SongAlbum: ".player-album",
    SongAlbumBuyLink: "buy-button-player",
    SongYouTubeID: "youtubeId",
    SongYouTubeSection: ".now-playing-actions",
    playPause: '[data-id="play-pause"]',
};

export const controlsSelectors = {
    playPause: '[data-id="play-pause"]',
    repeat: '[data-id="repeat"]',
    rewind: '[data-id="rewind"]',
    forward: '[data-id="forward"]',
    play: '[data-id="play"]',
    materialcard: '.material-card',
};

export const playbackSelectors = {
    progress: '#material-player-progress',
};

export const nowPlayingSelectors = {
    albumArt: '#playerBarArt',
    albumName: '.player-album',
    artistName: '#player-artist',
    nowPlayingContainer: '#playerSongInfo',
    infoWrapper: '.now-playing-info-wrapper',
    title: '#currently-playing-title',
};