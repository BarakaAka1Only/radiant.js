import RadiantNamespace from '../RadiantNamespace';

import Artwork from '../structs/Artwork';

import Song from '../structs/Song';

import Share from '../structs/Share';

import FunctionsNamespace from './FunctionsNamespace';

import LanguageNamespace from './LanguageNamespace';

import { nowPlayingSelectors, songSelectors, playbackSelectors, controlsSelectors } from '../constants/selectors';

export default class HelpersNamespace extends RadiantNamespace {

    static ENUMS = {
        PlaybackStatus: {
            STOPPED: 0,
            PAUSED: 1,
            PLAYING: 2,
        },
        AdsStatus: {
            STOPPED: 0,
            PLAYING: 2,
        }
    };

    constructor(...args) {
        super(...args);

        this.language = new LanguageNamespace;
        this.fn = new FunctionsNamespace;

        this.startUp(this.fn);

        this._mapSelectors(playbackSelectors);

        this.addMethods([
            'replayBack', 'replayFor', 'getVolume', 'Region', 'SongAlbumArt', 'Song', 'hasYoutube', 'Share', 'getPlaybackState', 'adState', 'RadiantHandler'
        ]);



        this._hookEvents();
    }

    /**
     * Set the song's progress to go back and forward in time by intervals or get player states
     * @type {{replayBack: Function, replayFor: Function, getVolume: Function}}
     */
    replayBack() {
        return gmusic.playback.rewindTen();
    }

    replayFor() {
        return gmusic.playback.forwardThirty();
    }

    /**
     * Helper function to get the Volume
     * @returns int
     */
    getVolume() {
        return this.fn.Volume();
    }

    /**
     * Check what Region you are in
     * @type {{Region}}
     */
    Region() {
        if (window.gbar.hasOwnProperty("_CONFIG")) {
            return ((window.gbar._CONFIG[0][0][19]).length === 0) ? this.language.NoGeo() : window.gbar._CONFIG[0][0][19];
        } else {
            return this.language.NoConfig();
        }
    }

    /**
     * This provides information for Song Art items that are playing by getting
     * @type {{Artwork: {Full: *, Large: *, Medium: *, Small: *, Mini: string}}}
     */
    SongAlbumArt() {
        const artwork = new Artwork({
            Full: this.fn.Replace(document.querySelector(nowPlayingSelectors.albumArt).getAttribute('src'), 's90', "s0"),
            Large: this.fn.Replace(document.querySelector(nowPlayingSelectors.albumArt).getAttribute('src'), 's90', "s800"),
            Medium: this.fn.Replace(document.querySelector(nowPlayingSelectors.albumArt).getAttribute('src'), 's90', "s500"),
            Small: this.fn.Replace(document.querySelector(nowPlayingSelectors.albumArt).getAttribute('src'), 's90', "s300"),
            Mini: document.querySelector(nowPlayingSelectors.albumArt).getAttribute('src'),
        });

        window.RadiantState.Artwork = artwork;

        return artwork;
    }

    /**
     * This provides information for items that are playing by getting :
     * {SongID: string, SongAlbumID: string, SongArtist: string, SongTitle: string, SongAlbum: string, SongAlbumBuyLink: string}, SongID: string, SongAlbumID: string, SongArtist: string, SongTitle: string, SongAlbum: string, SongAlbumBuyLink: string, SongYouTubeID: string}
     * T2f7kfchlqqc4rx2bugxcnm42ke == f68db999-5f6c-35b5-8fcd-b5b052e203b3 GUID / Hex ?
     * @returns {Song}
     * @constructor
     */
    Song() {
        const nowPlayingContainer = document.querySelector(nowPlayingSelectors.nowPlayingContainer);

        let id = (document.querySelector(songSelectors.SongAlbumID) !== null) ? document.querySelector(songSelectors.SongAlbumID).getAttribute('data-id'): "album/";

        this.fn.FakeClick();
        this.fn.FakeMenuClick();

        const song = new Song({
            SongID: window.RadiantState.SongID,
            SongAlbumID: (document.querySelector(songSelectors.SongAlbumID) !== null) ? document.querySelector(songSelectors.SongAlbumID).getAttribute('data-id').substring(0, id.indexOf('/')) : 'Unknown Album ID',
            SongTitle: this.fn._textContent(nowPlayingContainer.querySelector(nowPlayingSelectors.title), 'Unknown Title'),
            SongArtist: this.fn._textContent(nowPlayingContainer.querySelector(nowPlayingSelectors.artistName), 'Unknown Artist'),
            SongAlbum: (document.querySelector(songSelectors.SongAlbum) !== null) ? this.fn._textContent(nowPlayingContainer.querySelector(nowPlayingSelectors.albumName), 'Unknown Album') : 'Unknown Album',
            SongAlbumBuyLink: (document.querySelector(songSelectors.SongAlbumBuyLink) !== null) ? this.fn._textContent(document.querySelector(songSelectors.SongAlbumBuyLink).querySelector("a").getAttribute("href").replace(/\s+/g, ''), this.language.Not()) : this.language.Not(),
            SongYouTubeID: (this.hasYoutube()) ? (document.querySelector(songSelectors.SongID) !== null) ? document.querySelector(songSelectors.SongID).dataset[songSelectors.SongYouTubeID] : this.language.NoYouTube() : this.language.NoYouTube(),
        });

        window.RadiantState.Song = song;
        window.RadiantState.SongYouTubeID = song.SongYouTubeID;
        window.RadiantState.volume_state = this.fn.Volume();

        return song;
    }

    /**
     * Get a playing state, this function was adopted from GMusic
     * @returns {number}
     */
    getPlaybackState() {
        const playButton = document.querySelector(controlsSelectors.playPause);

        if (playButton.classList.contains('playing')) {
            return HelpersNamespace.ENUMS.PlaybackStatus.PLAYING;
        }

        if (!playButton.disabled) {
            if (playButton.__data__.icon === 'av:pause-circle-filled') {
                return HelpersNamespace.ENUMS.PlaybackStatus.PLAYING;
            }
            return HelpersNamespace.ENUMS.PlaybackStatus.PAUSED;
        }
        return HelpersNamespace.ENUMS.PlaybackStatus.STOPPED;
    }

    /**
     * Get a playing state of Ads
     * @returns {number}
     */
    adState(){

        const ad = (document.querySelector(".ad-preroll-container") !== null) ? document.querySelector(".ad-preroll-container") : null;
        if(ad !== null) {
            if (ad.className === 'ad-preroll-container') {
                return HelpersNamespace.ENUMS.AdsStatus.PLAYING;
            }

            if (ad.className === 'ad-preroll-container ad-preroll-container-hidden') {
                return HelpersNamespace.ENUMS.AdsStatus.STOPPED;
            }
        }

        return HelpersNamespace.ENUMS.AdsStatus.STOPPED;
    }

    /**
     * Get Google Play Music Share links
     * @type {{Types, Services: {Assign}}}
     */
    Share() {

        let Facebook_type = "https://play.google.com/music/m/"+window.RadiantState.SongID+"?utm_medium=organic_share&utm_source=facebook&redirect_uri=https://play.google.com/music/returnfromshare";
        let Twitter_type = "https://play.google.com/music/m/"+window.RadiantState.SongID+"?utm_medium=organic_share&utm_source=twitter";

        let Facebook = "https://www.facebook.com/dialog/share?app_id=1618370355114238&display=popup&href="+encodeURIComponent(Facebook);
        let Twitter = "https://twitter.com/intent/tweet?url="+encodeURIComponent(Twitter);
        let Normal = "https://play.google.com/music/m/"+window.RadiantState.SongID;

        const share = new Share({
            Facebook_type,
            Twitter_type,
            Facebook,
            Twitter,
            Normal
        });

        window.RadiantState.Share.Types.F = Facebook_type;
        window.RadiantState.Share.Types.T = Twitter_type;

        window.RadiantState.Share.Services.Normal = "https://play.google.com/music/m/"+window.RadiantState.SongID;
        window.RadiantState.Share.Services.Facebook = "https://www.facebook.com/dialog/share?app_id=1618370355114238&display=popup&href="+encodeURIComponent(Facebook);
        window.RadiantState.Share.Services.Twitter = "https://twitter.com/intent/tweet?url="+encodeURIComponent(Twitter);


        return share;
    }

    /**
     * Determine if our player has any Youtube when playing
     * @returns {*|boolean}
     */
    hasYoutube() {
        return this.fn.hasClass(document.querySelector(songSelectors.SongYouTubeSection), "has-youtube");
    }

    /**
     * Listen to {forward} and {rewind} clicks and re-add correct re-time data with Retry
     * @param Baraka
     * @constructor
     */

    RadiantHandler(currentTrack, currentArt, currentShare, lan, Baraka) {
        if(Baraka === "playRow") {
            if(document.querySelector(".song-row .column-content [data-id='play']") !== null) {
                document.querySelector(".song-row .column-content [data-id='play']").addEventListener("click", this.RadiantHandler(currentTrack, currentArt, currentShare, lan, ""), false);
            }
        }
        if(Baraka === "playMcard") {
            if(document.querySelector(".material-card .play-button") !== null) {
                document.querySelector(".material-card .play-button").addEventListener("click", this.RadiantHandler(currentTrack, currentArt, currentShare, lan, ""), false);
            }
        }

        const Playing = document.querySelector("[data-id='play-pause']").classList.contains('playing');
        const Language = lan;
        const fn = this.fn;

        this.fn.Retry(
            function isDone() {
               /* window.RadiantState.SongYouTubeID = Language.NoYouTube();
                window.RadiantState.SongID = Language.NoSong();
                window.RadiantState.Song = Language.NoSong();
                window.RadiantState.Artwork = Language.NoSong();
                window.RadiantState.Ads = Language.NoAds();
                window.RadiantState.volume_state = fn.Volume();

                window.RadiantState.Share.Services.Facebook = null;
                window.RadiantState.Share.Services.Twitter = null;
                window.RadiantState.Share.Services.Normal = null;
                window.RadiantState.Share.Types['F'] = null;
                window.RadiantState.Share.Types['T'] = null;
                window.RadiantState.Share.Types['Normal'] = null;*/
                return false;
            },
            function next(isTimeout) {
                if (isTimeout) {
                    if(Playing){
                        currentTrack;
                        currentArt;
                        currentShare;
                    }
                }
            }
        )
    }

    /**
     * Emit our events on the dom
     * @private
     */
    _hookEvents() {
        // Change Track Event

        let lastTrack;
        let lastArt;
        let lastShare;

        new MutationObserver((mutations) => {
            mutations.forEach((m) => {
                for (let i = 0; i < m.addedNodes.length; i++) {
                    // DEV: We can encounter a text node, verify we have a `classList` to assert against
                    const target = m.addedNodes[i];
                    if (target.classList && target.classList.contains('now-playing-info-wrapper')) {
                        const currentTrack = this.Song();
                        const currentArt = this.SongAlbumArt();
                        const currentShare = this.Share();
                        // Make sure that this is the first of the notifications for the
                        // insertion of the song information elements.
                        if (!currentTrack.equals(lastTrack)) {
                            this.emit('change:radiant', {song: currentTrack, art: currentArt, share: currentShare});
                            lastTrack = currentTrack;
                            lastArt = currentArt;
                            lastShare = currentShare;

                            let forward = document.querySelector(controlsSelectors.forward).addEventListener("click", this.RadiantHandler(currentTrack, currentArt, currentShare, this.language, ""), false);
                            let rewind = document.querySelector(controlsSelectors.rewind).addEventListener("click", this.RadiantHandler(currentTrack, currentArt, currentShare, this.language, ""), false);
                            let play = document.querySelector(controlsSelectors.play).addEventListener("click", this.RadiantHandler(currentTrack, currentArt, currentShare, this.language, ""), false);

                            if(document.querySelector(controlsSelectors.materialcard) !== null) {
                                let playMcard = document.querySelector(controlsSelectors.materialcard).addEventListener("mouseover", this.RadiantHandler(currentTrack, currentArt, currentShare, this.language, "playMcard"), false);
                            }
                        }
                    }
                }
            });

        }).observe(document.querySelector(nowPlayingSelectors.nowPlayingContainer), {
            childList: true,
            subtree: true,
        });

        // Play/Pause Event
        let lastMode;
        new MutationObserver((mutations) => {
            mutations.forEach((m) => {
                if (m.target.dataset.id === 'play-pause') {
                    const currentMode = this.getPlaybackState();

                    // If the mode has changed, then update it
                    if (currentMode !== lastMode) {
                        this.emit('change:radiant-playback', currentMode);

                        if(currentMode === 0) {
                            window.RadiantState.SongYouTubeID = this.language.NoYouTube();
                            window.RadiantState.SongID = this.language.NoSong();
                            window.RadiantState.Song = this.language.NoSong();
                            window.RadiantState.Artwork = this.language.NoSong();
                            window.RadiantState.Ads = this.language.NoAds();

                            window.RadiantState.Share.Services.Facebook = null;
                            window.RadiantState.Share.Services.Twitter = null;
                            window.RadiantState.Share.Services.Normal = null;
                            window.RadiantState.Share.Types['F'] = null;
                            window.RadiantState.Share.Types['T'] = null;
                            window.RadiantState.Share.Types['Normal'] = null;
                        }

                        if((currentMode === 2 || currentMode === 1)) {
                            this.Song();
                            this.SongAlbumArt();
                            this.Share();
                            window.RadiantState.volume_state = this.fn.Volume();
                        }

                        lastMode = currentMode;
                    }
                }
            });
        }).observe(document.querySelector(controlsSelectors.playPause), {
            attributes: true,
        });


        const readyStateChecker = setInterval(() => {
            if (document.readyState === "complete") {

                /* Ad Playing Event */
                let lastAdMode;
                new MutationObserver((mutations) => {
                    mutations.forEach((m) => {
                        let currentAdMode = this.adState();
                        if (m.target.className === 'ad-preroll-container ad-preroll-container-hidden') {
                            if (currentAdMode !== lastAdMode) {
                                if (currentAdMode === 0) {
                                    this.emit('change:ad', this.language.NoAds());
                                    window.RadiantState.Ads = this.language.NoAds();
                                }

                                if (currentAdMode === 2) {
                                    this.emit('change:ad', this.language.AdPlaying());
                                    window.RadiantState.Ads = this.language.AdPlaying();
                                }

                                lastAdMode = currentAdMode;
                            }
                        } else {
                            if (currentAdMode !== lastAdMode) {
                                if (currentAdMode === 0) {
                                    this.emit('change:ad', this.language.NoAds());
                                    window.RadiantState.Ads = this.language.NoAds();
                                }

                                if (currentAdMode === 2) {
                                    this.emit('change:ad', this.language.AdPlaying());
                                    window.RadiantState.Ads = this.language.AdPlaying();
                                }

                                lastAdMode = currentAdMode;
                            }
                        }
                    });
                }).observe(document.querySelector(".ad-preroll-container"), {
                    childList: true,
                    subtree: true,
                    attributes: true
                });
                clearInterval(readyStateChecker);
            }
        }, 10);

        this.fn.Retry(
            function isDone() {
                return false;
            },
            function next(isTimeout) {
                if (isTimeout) {
                    if(window.RadiantState.ready) {
                        //window.RadiantState.volume_state = gmusic.volume.getVolume();
                    }
                }
            }
        );

    }

    /**
     * Load Radiant and make sure IMFL is placed so users or yourself can Roll the Dice including a check for GMusic initialization
     */
    startUp(fn){
        fn.Observe();
        fn.IMFL();
        window.RadiantState.volume_state = fn.Volume();
        // All should have passed!
        console.log("RadiantTools has been loaded!!");
    }
}