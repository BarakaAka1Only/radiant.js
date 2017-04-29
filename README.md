# radiant.js 
Browser-side JS library Extending GMusic.js For Radiant Player.

[Google Music]: https://play.google.com/music/

This is an extension based fully on `gmusic.js` which requires `gmusic.js`

`radiant.js` is not created by, affiliated with, or supported by Google Inc.

[google-music-webkit]: https://github.com/twolfson/google-music-webkit
[node-webkit]: https://github.com/rogerwang/node-webkit
[radiant-player-mac@v1.3.1]: https://github.com/kbhomes/radiant-player-mac/tree/v1.3.1
[Sajid Anwar]: https://github.com/kbhomes/
[James Fator]: http://jamesfator.com/
[GPMDP]: https://github.com/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-
[Radiant Player]: https://github.com/radiant-player/radiant-player-mac


## Getting Started
Install the module with: `npm install radiant.js`

```js
// Load and initialize Radiant
import Radiant from 'radiant.js';

const radiant = new Radiant(window);
window.Radiant = radiant;

// Access volume
window.Radiant.Helpers.getVolume(); // based on gmusic.volume.getVolume()
```

## Documentation
`radiant.js` exposes a constructor, `Radiant` as its `module.exports` (`window.Radiant` for `bower`/vanilla).

### `new Radiant()`
Constructor for a new API extension for GMusic

### Helpers
`Radiant.Helpers` exposes interfaces to provide additional tools that `gmusic.js` does not have and plays apart in Radiant Player 2.0

#### `Helpers.replayBack()`
Set back the track 10 seconds // based on gmusic.playback.rewindTen()

#### `Helpers.replayFor()`
Set back the track 30 seconds // based on gmusic.playback.forwardThirty()

#### `Helpers.Region()`
Obtain the Region you are in which will return `USA` if you are usa etc, if a region isn't dectected then `No Geo Data` is returned

#### `Helpers.SongAlbumArt()`

This provides information for Song Art items that are playing. This is set in 5 options that gives you a resized image
 
 - Full => Max size
 - Large => 800px
 - Medium => 500px
 - Small => 300px
 - Mini => about 50px

#### `Helpers.Song()`
This provides information for items that are playing by getting for song data. This is set in 7 options that gives available song data following:

 - SongID => Gets the current song id i.e T2f7kfchlqqc4rx2bugxcnm42ke normal added songs that are not bought will contain ids like f68db999-5f6c-35b5-8fcd-b5b052e203b3 GUID but with `Helpers.Song.SongID` that is no longer the case
 - SongAlbumID => Gets the current song album id 
 - SongTitle => Gets the current song title
 - SongArtist => Gets the current song artist
 - SongAlbum => about Gets the current song album 
 - SongAlbumBuyLink => Gets the current song album buy link (this will only contain a link if you're playing the Radio) Default return `You either own this item or you're not playing the radio / an non-owned item`
 - SongYouTubeID => Gets the current Youtube ID. Only available if GPM has that data otherwise default return is `No YouTube video found`


### `Helpers.getPlaybackState()`
Get a playing state, this function was adopted from `gmusic.js`

#### `Helpers.adState()`
Retrieve the current state when a video ad emits on GPM 


#### `Helpers.Share()`
Get Google Play Music Share links. This is set in 5 options that gives available share link data following:
  - Types => `F` meaning Facebook and `T` meaning Twitter. Both are GPM links as a utm_source source link
  - Facebook => Full share link to Facebook buy current SongID from `Helpers.Song.SongID`
  - Twitter => Full share link to Twitter buy current SongID from `Helpers.Song.SongID`
  - Normal => Full share link to Google Play Music Store buy current SongID from `Helpers.Song.SongID`

#### `Helpers.hasYoutube()`
Determine if our player has any Youtube when playing

#### `Helpers.RadiantHandler()`
Listens to {forward} and {rewind} clicks on GPM player bar and re-adds correct data by `window.RadiantState`


#### Languages
A namespace that sets text returns based on `window.Radiant` events 


#### Functions
`window.Radiant` main functions that assembles `radiant.js` to properly adapt to GPM

#### `fn.create()`
Add Elements to the DOM *parameter required

#### `fn.Replace()`
Replace a string with something else i.e how `Helpers.SongAlbumArt` works *parameter required

#### `fn.hasClass()`
Check is element has a added / set class in element attribute *parameter required

#### `fn.has()`
Check if Object has KEY property as a match other wise it's false *parameter required

#### `fn.Retry()`
Emulates a Delay

#### `fn.trigger()`
Simulates a mouse event *parameter required

#### `fn.getID()`
Get ID by a url / string meant only for `Helpers.Song.SongID` *parameter required


#### `fn.FakeClick()`
Send a FakeClick() trigger to the DOM to get data from GPM player queue

#### `fn.FakeMenuClick()`
Send a FakeMenuClick() trigger to the DOM to get data song id / info

#### `fn.Playing()`
Check if Google Play Music is playing a song

#### `fn.Volume()` 
Get the current Volume on gpm by `window.RadiantState` or `gmusic.volume.getVolume()`

#### `fn.IMFL()`
Adds I'm Feeling Lucky to GPM dom on a global bases

### `fn.getYoutubeID()`
Get the current song's YouTube id if any

#### `fn.RollDice()`
When IMFL has been inserted in the dom, this allows you to Roll the Dice!!

#### `fn.Observe()`
Check and wait to see that GMusic initialization was defined
 
#### `fn._textContent`
This function was adopted from `gmusic.js`


### Hooks
Hooks are currently bound via `.on` and other corresponding methods for [node's EventEmitter][EventEmitter]

[EventEmitter]: http://nodejs.org/api/events.html

```js
Radiant.on('change:ad', function (ad) {
});
```

#### `.on('change:ad')`
Triggers when a video ad is playing

```js
Radiant.on('change:radiant-playback', function (playback) {
});
```
#### `.on('change:radiant-playback')`
- Triggers when playback states change from pause, playing and stopped.  Adopted from `gmusic.js`

```js
Radiant.on('change:radiant', function (mode) {
});
```
#### `.on('change:radiant')`
Triggers when song is changed following `Helpers.Song()`


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint via `npm run lint` and test via `npm test`.

## License

Same as `gmusic.js` again this is an extension based from `gmusic.js`

[LICENSE-MIT]: LICENSE-MIT

[UNLICENSE]: UNLICENSE

##Notes
This also includes an OOP version which can be found in the `OOP` folder named `radiantOOPVersion.js`