import RadiantNamespace from '../RadiantNamespace';

export default class LanguageNamespace extends RadiantNamespace {
    constructor(...args) {
        super(...args);

        this.addMethods(['Not', 'NoSong', 'NoSongID', 'NoYouTube', 'NoAds', 'AdPlaying', 'NoConfig', 'NoGeo']);
    }

    /**
     * Language for Not
     * @returns {string}
     * @constructor
     */
    Not() {
        return "You either own this item or you're not playing the radio / an non-owned item";
    }
    /**
     * Language for No Song Playing
     * @returns {string}
     * @constructor
     */
    NoSong() {
        return "No song is playing";
    }
    /**
     * Language for No Song ID
     * @returns {string}
     * @constructor
     */
    NoSongID() {
        return "No song ID found";
    }
    /**
     * Language for No Youtube
     * @returns {string}
     * @constructor
     */
    NoYouTube() {
        return "No YouTube video found";
    }
    /**
     * Language for No Ads
     * @returns {string}
     * @constructor
     */
    NoAds() {
        return "No Ads Playing";
    }
    /**
     * Language for Ad Playing
     * @returns {string}
     * @constructor
     */
    AdPlaying() {
        return "Ad is playing";
    }
    /**
     * Language for No Config
     * @returns {string}
     * @constructor
     */
    NoConfig() {
        return "_CONFIG Not found :(";
    }
    /**
     * Language for No Geo
     * @returns {string}
     * @constructor
     */
    NoGeo() {
        return "No Geo Data";
    }
}