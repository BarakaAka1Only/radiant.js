if(typeof Radiant == "undefined") {
    Radiant = {fn: {}, Language: {}, Helpers: { Song: {selectors: {SongID: false, SongAlbumID: false, SongArtist: false, SongTitle: false, SongAlbum: false, SongAlbumBuyLink: false}}, SongAlbumArt: { Art: { }}, Share: { Types: {"F": false, "T": false}, Services: {Facebook:"",Twitter:""}}}, IMFL: {}};
}

if(typeof RadiantTools == "undefined") { RadiantTools = { SongID: false}; }

/**
 * Language for Not
 * @returns {string}
 * @constructor
 */
Radiant.Language.Not = function () {
    return "You either own this item or you're not playing the radio / an non-owned item";
};

/**
 * Language for No Song Playing
 * @returns {string}
 * @constructor
 */
Radiant.Language.NoSong = function () {
    return "No song is playing";
};

/**
 * Language for No Song ID
 * @returns {string}
 * @constructor
 */
Radiant.Language.NoSongID = function () {
    return "No song ID found";
};

/**
 * Language for No Youtube
 * @returns {string}
 * @constructor
 */
Radiant.Language.NoYouTube = function () {
    return "No YouTube video found";
};

/**
 * Add Elements to the DOM
 * @param Baraka
 * @returns {DocumentFragment}
 */
Radiant.fn.create = function(Baraka) {
    var radiant = document.createDocumentFragment(),
        temp = document.createElement('div');
    temp.innerHTML = Baraka;
    while (temp.firstChild) {
        radiant.appendChild(temp.firstChild);
    }
    return radiant;
};

/**
 * Replace a string with something else
 * @param s
 * @param f
 * @param r
 * @returns {*}
 * @constructor
 */
Radiant.fn.Replace = function(s, f, r) {
    if(s != null) {
        return s.replace(new RegExp(f, 'g'), r);
    } else{
        return false;
    }
};

/**
 * Check is element has a added / set class in element attribute
 * @param element
 * @param cls
 * @returns {boolean}
 */
Radiant.fn.hasClass = function(element, cls) {
    if(element !== null) {
        return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
    } else {
        return false;
    }
};

/**
 * Check if Object has KEY property as a match other wise it's false
 * @param obj
 * @param value
 * @returns {boolean}
 */
Radiant.fn.has = function(obj, value) {
    for(var id in obj) {
        if(obj[id] == value) {
            return true;
        }
    }
    return false;
};

/**
 * Emulate a Delay
 * @param isDone
 * @param next
 * @constructor
 */
Radiant.fn.Retry = function(isDone, next) {
    var currentTrial = 0,
        maxRetry = 50,
        interval = 10,
        isTimeout = false;
    var id = window.setInterval(
        function() {
            if (isDone()) {
                window.clearInterval(id);
                next(isTimeout);
            }
            if (currentTrial++ > maxRetry) {
                window.clearInterval(id);
                isTimeout = true;
                next(isTimeout);
            }
        },
        10
    );
};

/**
 * Simulate a mouse event
 * @param node
 * @param eventType
 */
Radiant.fn.trigger = function(node, eventType) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, true);
    node.dispatchEvent (clickEvent);
};

/**
 * Get ID by a url / string
 * @param s
 * @returns {*}
 */
Radiant.fn.getID = function(s) {
    var t = s.split(/[\\\/]/)[5].match(/\S[^?]*(?:\?+|$)/g)[0].slice(0, -1);
    return (t.match("t=")) ? Radiant.Language.NoSongID() : t;
}

/**
 * Send a FakeClick() trigger to the DOM to get data queue
 * @constructor
 */
Radiant.fn.FakeClick = function () {
    Radiant.fn.Retry(
        function isDone() {
            document.querySelector('[id="queue-overlay"]').style.opacity = 0;
            document.querySelector('[data-id="queue"]').click();
            document.querySelector('[id="queue-overlay"]').style.width = "0px";
            document.querySelector("#queue-overlay").close();
            return false;
        },
        function next(isTimeout) {
            if (isTimeout) {
                document.querySelector('[id="queue-overlay"]').style.width = null;
                document.querySelector('[id="queue-overlay"]').style.opacity = null;
                document.querySelector('body').click()
            }
        }
    );
};

/**
 * Send a FakeMenuClick() trigger to the DOM to get data song id / info
 * @constructor
 */
Radiant.fn.FakeMenuClick = function () {
    if((document.body.contains(document.querySelector('.song-menu')) && Radiant.Playing())) {
        document.querySelector('[data-id=\"now-playing-menu\"]').click();
        Radiant.fn.trigger(document.querySelector('[data-id=\"now-playing-menu\"]'), "mousedown");
        Radiant.fn.trigger(document.querySelector('[data-id=\"now-playing-menu\"]'), "mouseup");
        Radiant.fn.trigger(document.querySelector('.song-menu'), "mouseover");
        Radiant.fn.trigger(document.querySelector('.song-menu .goog-menuitem[id*=":f"]'), "mouseover");
        Radiant.fn.trigger(document.querySelector('.song-menu .goog-menuitem[id*=":f"]'), "mousedown");
        Radiant.fn.trigger(document.querySelector('.song-menu .goog-menuitem[id*=":f"]'), "mouseup");
        document.querySelector('[class*="get-link"]').style.opacity = 0;
        RadiantTools.SongID = Radiant.fn.getID(document.querySelector('[class*="get-link"] #labelAndInputContainer input').value);
        Radiant.fn.trigger(document.querySelector('body'), "mousedown");
        document.querySelector('[class*="get-link"]').parentNode.removeChild(document.querySelector('[class*="get-link"]'))
    }
};

/**
 * Check if Google Play Music is playing a song
 * @returns {*|boolean}
 * @constructor
 */
Radiant.Playing = function () {
    return Radiant.fn.hasClass(document.querySelector('[id="player-bar-play-pause"]'), "playing");
};

/**
 * Check what Region you are in
 * @type {{Region}}
 */
Radiant.Helpers.GEO = {
    Region: function () {
        if (window.gbar.hasOwnProperty("_CONFIG")) {
            return ((window.gbar._CONFIG[0][0][19]).length === 0) ? 'No Geo Data' : window.gbar._CONFIG[0][0][19];
        } else {
            return "_CONFIG Not found :("
        }
    }
};

/**
 * Get the current Volume on gpm
 * @returns {*}
 * @constructor
 */
Radiant.Volume = function() {
    return (Radiant.volume_state == null) ? 100 : gmusic.volume.getVolume();
};

/**
 * Set the song's progress to go back and forward in time by intervals or get player states
 * @type {{replayBack: Function, replayFor: Function}}
 */
Radiant.Helpers.Progress = {
    replayBack: function () {
        return gmusic.playback.rewindTen();
    },
    replayFor: function () {
        return gmusic.playback.forwardThirty();
    },
    getVolume: function () {
        return Radiant.Volume();
    }
};

/**
 * This provides information for items that are playing by getting :
 * @type {{selectors: {SongID: string, SongAlbumID: string, SongArtist: string, SongTitle: string, SongAlbum: string, SongAlbumBuyLink: string}, SongID: string, SongAlbumID: string, SongArtist: string, SongTitle: string, SongAlbum: string, SongAlbumBuyLink: string, SongYouTubeID: string}}
 T2f7kfchlqqc4rx2bugxcnm42ke == f68db999-5f6c-35b5-8fcd-b5b052e203b3 GUID / Hex ?
 */
Radiant.Helpers.Song = {
    selectors: {
        SongID: ".song-row.currently-playing",
        SongAlbumID: ".player-album",
        SongArtist: "player-artist",
        SongTitle: "currently-playing-title",
        SongAlbum: ".player-album",
        SongAlbumBuyLink: "buy-button-player",
        SongYouTubeID: "youtubeId",
        SongYouTubeSection: ".now-playing-actions",
    },
    /**
     * SongID
     * @return {string}
     */
    SongID: (Radiant.Playing()) ? RadiantTools.SongID : "",
    /**
     * SongAlbumID
     * @return {string}
     */
    SongAlbumID: (Radiant.Playing()) ? document.querySelector(Radiant.Helpers.Song.selectors.SongAlbumID).getAttribute('data-id').substring(0, document.querySelector(Radiant.Helpers.Song.selectors.SongAlbumID).getAttribute('data-id').indexOf('/')) : "",
    /**
     * SongArtist
     * @return {string}
     */
    SongArtist: (Radiant.Playing()) ? document.getElementById(Radiant.Helpers.Song.selectors.SongArtist).textContent : "",
    /**
     * SongTitle
     * @return {string}
     */
    SongTitle: (Radiant.Playing()) ? document.getElementById(Radiant.Helpers.Song.selectors.SongTitle).textContent : "",
    /**
     * SongAlbum
     * @return {string}
     */
    SongAlbum: (Radiant.Playing()) ? (document.querySelector(Radiant.Helpers.Song.selectors.SongAlbum) != null) ? document.querySelector(Radiant.Helpers.Song.selectors.SongAlbum).textContent : "" : "",
    /**
     * SongAlbumBuyLink
     * @return {string}
     */
    SongAlbumBuyLink: (Radiant.Playing()) ? document.getElementById(Radiant.Helpers.Song.selectors.SongAlbumBuyLink).querySelector("a").getAttribute("href").replace(/\s+/g, '') : Radiant.Language.Not(),
    /**
     * SongYouTubeID
     * @return {string}
     */
    SongYouTubeID: (Radiant.Playing()) ? document.querySelector(Radiant.Helpers.Song.selectors.SongID).dataset[SongYouTubeID] : Radiant.Language.NoYouTube()
};

/**
 * This provides information for Song Art items that are playing by getting
 * @type {{item: string, Art: {Full: *, Large: *, Medium: *, Small: *, Mini: string}}}
 */
Radiant.Helpers.SongAlbumArt = {
    item: 'playerBarArt',
    Art: {
        /**
         * Full
         * @return {string}
         */
        "Full": (Radiant.Playing()) ? Radiant.fn.Replace(document.getElementById('playerBarArt').getAttribute('src'), 's90', "s0") : "",
        /**
         * Large
         * @return {string}
         */
        "Large": (Radiant.Playing()) ? Radiant.fn.Replace(document.getElementById('playerBarArt').getAttribute('src'), 's90', "s800") : "",
        /**
         * Medium
         * @return {string}
         */
        "Medium": (Radiant.Playing()) ? Radiant.fn.Replace(document.getElementById('playerBarArt').getAttribute('src'), 's90', "s500") : "",
        /**
         * Small
         * @return {string}
         */
        "Small": (Radiant.Playing()) ? Radiant.fn.Replace(document.getElementById('playerBarArt').getAttribute('src'), 's90', "s300") : "",
        /**
         * Mini
         * @return {string}
         */
        "Mini": (Radiant.Playing()) ? document.getElementById('playerBarArt').getAttribute('src') : ""
    }
};

/**
 * Get Google Play Music Share links
 * @type {{Types, Services: {Assign}}}
 */
Radiant.Helpers.Share = {
    Types:(function(){
        return Radiant.Helpers.Share.Types;
    })(),
    Services: {
        Facebook: (Radiant.Playing()) ? "https://play.google.com/music/m/"+Radiant.Helpers.Song.SongID+"?utm_medium=organic_share&utm_source=facebook&redirect_uri=https://play.google.com/music/returnfromshare" : Radiant.Language.NoSong(),
        Twitter: (Radiant.Playing()) ? "https://play.google.com/music/m/"+Radiant.Helpers.Song.SongID+"?utm_medium=organic_share&utm_source=twitter" : Radiant.Language.NoSong(),
        Assign: (function(){
            Radiant.Helpers.Share.Types['F'] = "https://www.facebook.com/dialog/share?app_id=1618370355114238&display=popup&href="+encodeURIComponent(Radiant.Helpers.Share.Services.Facebook);
            Radiant.Helpers.Share.Types['T'] = "https://twitter.com/intent/tweet?url="+encodeURIComponent(Radiant.Helpers.Share.Services.Twitter);
            Radiant.Helpers.Share.Types['Normal'] = (Radiant.Playing()) ? "https://play.google.com/music/m/"+Radiant.Helpers.Song.SongID : Radiant.Language.NoSong();
        })()
    }
};

/**
 * Are you Feeling Lucky? Cause We are! Roll the Dice
 * @type {{Insert: Function, init: Function}}
 */
Radiant.IMFL = {
    Insert: function () {
        var lucky = Radiant.fn.create('<div class="material-card" data-type="imfl" style="display:none"></div>');

        var readyStateChecker = setInterval(function () {
            if (document.readyState == "complete") {

                document.body.insertBefore(lucky, document.body.childNodes[0]);
                clearInterval(readyStateChecker);
            }
        }, 10);
    },
    RollDice: function(){
        document.querySelector('[data-type=\"imfl\"]').click();
    },
    init: function () {
        this.Insert();
    }
};


/**
 * Get Radiant Helpers
 * @type {{Radiant.Helpers}}
 */
Radiant.getHelpers = function() {
    return Radiant.Helpers;
};

/**
 * Get Radiant Youtube ID
 * @type {{Radiant.Helpers.Song.SongYouTubeID}}
 */
Radiant.getYoutubeID = function() {
    return Radiant.Helpers.Song.SongYouTubeID;
};

/**
 * Determine if our player has any Youtube when playing
 * @returns {*|boolean}
 */
Radiant.hasYoutube = function () {
    return Radiant.fn.hasClass(document.querySelector(Radiant.Helpers.Song.selectors.SongYouTubeSection), "has-youtube");
}

Radiant.Observe = {
    ready: !1,
    CheckGMusic: function () {
        var check = setInterval(function () {
            if(typeof gmusic != "undefined") {
                Radiant.Observe.ready = !!1;
                clearInterval(check);
            }
        }, 10);
    },
    init: function () {
        this.CheckGMusic();
    }
}

/**
 * Load Radiant and make sure IMFL is placed so users or yourself can Roll the Dice including a check for GMusic initialization
 */
Radiant.load = function () {
    Radiant.IMFL.init();
    Radiant.Observe.init();
};

/**
 * Radiant init();
 */
Radiant.load();

/**
 * Wait for Dom and assign events only if Observe is ready on
 * @type ready
 */
Radiant.fn.Retry(
    function isDone() {
        return false;
    },
    function next(isTimeout) {
        if (isTimeout) {
            if(Radiant.Observe.ready) {

                Radiant.volume_state = gmusic.volume.getVolume();

                /**
                 * Check for playback changes in-order to get correct information
                 */
                gmusic.on('change:playback', function(RTP) {
                    Radiant.fn.FakeClick();
                    Radiant.fn.FakeMenuClick();

                    if(RTP === 2) {
                        var id = (document.querySelector(Radiant.Helpers.Song.selectors.SongAlbumID) != null) ? document.querySelector(Radiant.Helpers.Song.selectors.SongAlbumID).getAttribute('data-id'): "album/";
                        Radiant.Helpers.SongAlbumArt.Art.Full = Radiant.fn.Replace(document.getElementById('playerBarArt').getAttribute('src'), 's90', "s0");
                        Radiant.Helpers.SongAlbumArt.Art.Large = Radiant.fn.Replace(document.getElementById('playerBarArt').getAttribute('src'), 's90', "s800");
                        Radiant.Helpers.SongAlbumArt.Art.Medium = Radiant.fn.Replace(document.getElementById('playerBarArt').getAttribute('src'), 's90', "s500");
                        Radiant.Helpers.SongAlbumArt.Art.Small = Radiant.fn.Replace(document.getElementById('playerBarArt').getAttribute('src'), 's90', "s300");
                        Radiant.Helpers.SongAlbumArt.Art.Mini = document.getElementById('playerBarArt').getAttribute('src');
                        Radiant.Helpers.Song.SongID = RadiantTools.SongID;
                        Radiant.Helpers.Song.SongAlbumID = id.substring(0, id.indexOf('/'));
                        Radiant.Helpers.Song.SongArtist = document.getElementById(Radiant.Helpers.Song.selectors.SongArtist).textContent;
                        Radiant.Helpers.Song.SongTitle = document.getElementById(Radiant.Helpers.Song.selectors.SongTitle).textContent;
                        Radiant.Helpers.Song.SongAlbum = (document.querySelector(Radiant.Helpers.Song.selectors.SongAlbum) != null) ? document.querySelector(Radiant.Helpers.Song.selectors.SongAlbum).textContent: null;
                        Radiant.Helpers.Song.SongAlbumBuyLink = (document.getElementById(Radiant.Helpers.Song.selectors.SongAlbumBuyLink).querySelector("a").getAttribute("href") == " ") ? Radiant.Language.Not() : document.getElementById(Radiant.Helpers.Song.selectors.SongAlbumBuyLink).querySelector("a").getAttribute("href").replace(/\s+/g, '');
                        Radiant.Helpers.Song.SongYouTubeID = (document.querySelector(Radiant.Helpers.Song.selectors.SongID).dataset[Radiant.Helpers.Song.selectors.SongYouTubeID] == undefined) ? Radiant.Language.NoYouTube() : document.querySelector(Radiant.Helpers.Song.selectors.SongID).dataset[Radiant.Helpers.Song.selectors.SongYouTubeID];
                        Radiant.Helpers.Share.Services.Facebook = "https://play.google.com/music/m/"+Radiant.Helpers.Song.SongID+"?utm_medium=organic_share&utm_source=facebook&redirect_uri=https://play.google.com/music/returnfromshare";
                        Radiant.Helpers.Share.Services.Twitter = "https://play.google.com/music/m/"+Radiant.Helpers.Song.SongID+"?utm_medium=organic_share&utm_source=twitter";
                        Radiant.Helpers.Share.Types['F'] = "https://www.facebook.com/dialog/share?app_id=1618370355114238&display=popup&href="+encodeURIComponent(Radiant.Helpers.Share.Services.Facebook);
                        Radiant.Helpers.Share.Types['T'] = "https://twitter.com/intent/tweet?url="+encodeURIComponent(Radiant.Helpers.Share.Services.Twitter);
                        Radiant.Helpers.Share.Types['Normal'] = (Radiant.Playing()) ? "https://play.google.com/music/m/"+Radiant.Helpers.Song.SongID : Radiant.Language.NoSong();
                    }

                    if(RTP === 0) {
                        Radiant.Helpers.SongAlbumArt.Art.Full = null;
                        Radiant.Helpers.SongAlbumArt.Art.Large = null;
                        Radiant.Helpers.SongAlbumArt.Art.Medium = null;
                        Radiant.Helpers.SongAlbumArt.Art.Small = null;
                        Radiant.Helpers.SongAlbumArt.Art.Mini = null;
                        Radiant.Helpers.Song.SongID = null;
                        Radiant.Helpers.Song.SongAlbumID = null;
                        Radiant.Helpers.Song.SongArtist = null;
                        Radiant.Helpers.Song.SongTitle = null;
                        Radiant.Helpers.Song.SongAlbum = null;
                        Radiant.Helpers.Song.SongAlbumBuyLink = Radiant.Language.Not();
                        Radiant.Helpers.Song.SongYouTubeID = Radiant.Language.NoYouTube();
                        Radiant.Helpers.Share.Services.Facebook = null;
                        Radiant.Helpers.Share.Services.Twitter = null;
                        Radiant.Helpers.Share.Types['F'] = null;
                        Radiant.Helpers.Share.Types['T'] = null;
                        Radiant.Helpers.Share.Types['Normal'] = null;
                    }
                });

                /**
                 * Check for song changes in-order to get correct information
                 */

                gmusic.on('change:track', function(RTP) {

                    Radiant.fn.FakeClick();
                    Radiant.fn.FakeMenuClick();

                    if (!Radiant.fn.has(Radiant.Helpers.SongAlbumArt.Art.Full, document.getElementById('playerBarArt').getAttribute('src'))) {
                        Radiant.Helpers.SongAlbumArt.Art.Full = Radiant.fn.Replace(document.getElementById('playerBarArt').getAttribute('src'), 's90', "s0");
                    }

                    if (!Radiant.fn.has(Radiant.Helpers.SongAlbumArt.Art.Large, document.getElementById('playerBarArt').getAttribute('src'))) {
                        Radiant.Helpers.SongAlbumArt.Art.Large = Radiant.fn.Replace(document.getElementById('playerBarArt').getAttribute('src'), 's90', "s800");
                    }

                    if (!Radiant.fn.has(Radiant.Helpers.SongAlbumArt.Art.Medium, document.getElementById('playerBarArt').getAttribute('src'))) {
                        Radiant.Helpers.SongAlbumArt.Art.Medium = Radiant.fn.Replace(document.getElementById('playerBarArt').getAttribute('src'), 's90', "s500");
                    }

                    if (!Radiant.fn.has(Radiant.Helpers.SongAlbumArt.Art.Small, document.getElementById('playerBarArt').getAttribute('src'))) {
                        Radiant.Helpers.SongAlbumArt.Art.Small = Radiant.fn.Replace(document.getElementById('playerBarArt').getAttribute('src'), 's90', "s300");
                    }

                    if (!Radiant.fn.has(Radiant.Helpers.SongAlbumArt.Art.Mini, document.getElementById('playerBarArt').getAttribute('src'))) {
                        Radiant.Helpers.SongAlbumArt.Art.Mini = document.getElementById('playerBarArt').getAttribute('src');
                    }

                    if (!Radiant.fn.has(Radiant.Helpers.Song.SongID, RadiantTools.SongID)) {
                        Radiant.Helpers.Song.SongID = RadiantTools.SongID;
                    }

                    if (document.querySelector(Radiant.Helpers.Song.selectors.SongAlbumID) != null) {
                        if (!Radiant.fn.has(Radiant.Helpers.Song.SongAlbumID, document.querySelector(Radiant.Helpers.Song.selectors.SongAlbumID).getAttribute('data-id'))) {
                            var id = document.querySelector(Radiant.Helpers.Song.selectors.SongAlbumID).getAttribute('data-id');
                            Radiant.Helpers.Song.SongAlbumID = id.substring(0, id.indexOf('/'));
                        }
                    }

                    if (!Radiant.fn.has(Radiant.Helpers.Song.SongArtist, document.getElementById(Radiant.Helpers.Song.selectors.SongArtist).textContent)) {
                        Radiant.Helpers.Song.SongArtist = document.getElementById(Radiant.Helpers.Song.selectors.SongArtist).textContent;
                    }

                    if (!Radiant.fn.has(Radiant.Helpers.Song.SongTitle, document.getElementById(Radiant.Helpers.Song.selectors.SongTitle).textContent)) {
                        Radiant.Helpers.Song.SongTitle = document.getElementById(Radiant.Helpers.Song.selectors.SongTitle).textContent;
                    }


                    if (document.querySelector(Radiant.Helpers.Song.selectors.SongAlbum) != null) {
                        if (!Radiant.fn.has(Radiant.Helpers.Song.SongAlbum, document.querySelector(Radiant.Helpers.Song.selectors.SongAlbum).textContent)) {
                            Radiant.Helpers.Song.SongAlbum = document.querySelector(Radiant.Helpers.Song.selectors.SongAlbum).textContent;
                        }
                    }

                    if(document.querySelector(Radiant.Helpers.Song.selectors.SongID) == null){
                        Radiant.Helpers.Song.SongYouTubeID = Radiant.Language.NoYouTube();
                    } else {
                        if (!Radiant.fn.has(Radiant.Helpers.Song.SongYouTubeID, document.querySelector(Radiant.Helpers.Song.selectors.SongID).dataset[Radiant.Helpers.Song.selectors.SongYouTubeID])) {
                            Radiant.Helpers.Song.SongYouTubeID = document.querySelector(Radiant.Helpers.Song.selectors.SongID).dataset[Radiant.Helpers.Song.selectors.SongYouTubeID];
                        }
                    }

                    if (!Radiant.fn.has(Radiant.Helpers.Song.SongAlbumBuyLink, document.getElementById(Radiant.Helpers.Song.selectors.SongAlbumBuyLink).querySelector("a").getAttribute("href"))) {
                        Radiant.Helpers.Song.SongAlbumBuyLink = (document.getElementById(Radiant.Helpers.Song.selectors.SongAlbumBuyLink).querySelector("a").getAttribute("href") == " ") ? Radiant.Language.Not() : document.getElementById(Radiant.Helpers.Song.selectors.SongAlbumBuyLink).querySelector("a").getAttribute("href").replace(/\s+/g, '');
                    }

                    Radiant.Helpers.Share.Services.Facebook = "https://play.google.com/music/m/"+Radiant.Helpers.Song.SongID+"?utm_medium=organic_share&utm_source=facebook&redirect_uri=https://play.google.com/music/returnfromshare";
                    Radiant.Helpers.Share.Services.Twitter = "https://play.google.com/music/m/"+Radiant.Helpers.Song.SongID+"?utm_medium=organic_share&utm_source=twitter";
                    Radiant.Helpers.Share.Types['F'] = "https://www.facebook.com/dialog/share?app_id=1618370355114238&display=popup&href="+encodeURIComponent(Radiant.Helpers.Share.Services.Facebook);
                    Radiant.Helpers.Share.Types['T'] = "https://twitter.com/intent/tweet?url="+encodeURIComponent(Radiant.Helpers.Share.Services.Twitter);
                    Radiant.Helpers.Share.Types['Normal'] = (Radiant.Playing()) ? "https://play.google.com/music/m/"+Radiant.Helpers.Song.SongID : Radiant.Language.NoSong();
                });

                /* Wait for dom to push in things? */
                var readyStateChecker = setInterval(function () {
                    if (document.readyState == "complete") {
                        var forward = document.querySelector("[data-id='forward']").addEventListener("click", RadiantHandler, false);
                        var rewind = document.querySelector("[data-id='rewind']").addEventListener("click", RadiantHandler, false);
                        var play = document.querySelector("[data-id='play']").addEventListener("click", RadiantHandler, false);
                        var playMcard = document.querySelector(".material-card").addEventListener("mouseover", RadiantHandler("playMcard"), false);
                        clearInterval(readyStateChecker);
                    }
                }, 10);

                if((window.location.hash.indexOf("#/ap/auto-playlist") !== -1 || window.location.hash.indexOf("#/pl/") !== -1 || window.location.hash.indexOf("#/sr/") !== -1)) {
                    var songTable  = document.querySelector(".song-table").addEventListener("mouseover", RadiantHandler("playRow"), false);
                }

                if((window.location.hash.indexOf("#/album") !== -1 || window.location.hash == "#/wtc")) {
                    var playRow = document.querySelector(".song-table [data-id='play']").addEventListener("click", RadiantHandler, false);
                }

            }
        }
    }
);


/**
 * Listen to {forward} and {rewind} clicks and re-add correct re-time data with Retry
 * @param Baraka
 * @constructor
 */
function RadiantHandler(Baraka) {
    if(Baraka = "playRow") {
        if(document.querySelector(".song-row .column-content [data-id='play']") != null) {
            document.querySelector(".song-row .column-content [data-id='play']").addEventListener("click", RadiantHandler, false);
        }
    }
    if(Baraka = "playMcard") {
        if(document.querySelector(".material-card .play-button") != null) {
            document.querySelector(".material-card .play-button").addEventListener("click", RadiantHandler, false);
        }
    }

    Radiant.fn.Retry(
        function isDone() {
            Radiant.Helpers.SongAlbumArt.Art.Full = null;
            Radiant.Helpers.SongAlbumArt.Art.Large = null;
            Radiant.Helpers.SongAlbumArt.Art.Medium = null;
            Radiant.Helpers.SongAlbumArt.Art.Small = null;
            Radiant.Helpers.SongAlbumArt.Art.Mini = null;
            Radiant.Helpers.Song.SongID = Radiant.Language.NoSongID();
            Radiant.Helpers.Song.SongAlbumID = null;
            Radiant.Helpers.Song.SongArtist = null;
            Radiant.Helpers.Song.SongTitle = null;
            Radiant.Helpers.Song.SongAlbum = null;
            Radiant.Helpers.Song.SongAlbumBuyLink = Radiant.Language.Not();
            Radiant.Helpers.Song.SongYouTubeID = Radiant.Language.NoYouTube();
            Radiant.Helpers.Share.Types['F'] = Radiant.Language.NoSong();
            Radiant.Helpers.Share.Types['T'] = Radiant.Language.NoSong();
            Radiant.Helpers.Share.Types['Normal'] = Radiant.Language.NoSong();
            return false;
        },
        function next(isTimeout) {
            if (isTimeout) {
                if(Radiant.Playing()){
                    Radiant.fn.FakeClick();
                    Radiant.fn.FakeMenuClick();
                    var id = (document.querySelector(Radiant.Helpers.Song.selectors.SongAlbumID) != null) ? document.querySelector(Radiant.Helpers.Song.selectors.SongAlbumID).getAttribute('data-id'): "album/";
                    Radiant.Helpers.SongAlbumArt.Art.Full = Radiant.fn.Replace(document.getElementById('playerBarArt').getAttribute('src'), 's90', "s0");
                    Radiant.Helpers.SongAlbumArt.Art.Large = Radiant.fn.Replace(document.getElementById('playerBarArt').getAttribute('src'), 's90', "s800");
                    Radiant.Helpers.SongAlbumArt.Art.Medium = Radiant.fn.Replace(document.getElementById('playerBarArt').getAttribute('src'), 's90', "s500");
                    Radiant.Helpers.SongAlbumArt.Art.Small = Radiant.fn.Replace(document.getElementById('playerBarArt').getAttribute('src'), 's90', "s300");
                    Radiant.Helpers.SongAlbumArt.Art.Mini = document.getElementById('playerBarArt').getAttribute('src');
                    Radiant.Helpers.Song.SongID = RadiantTools.SongID;
                    Radiant.Helpers.Song.SongAlbumID = id.substring(0, id.indexOf('/'));
                    Radiant.Helpers.Song.SongArtist = document.getElementById(Radiant.Helpers.Song.selectors.SongArtist).textContent;
                    Radiant.Helpers.Song.SongTitle = document.getElementById(Radiant.Helpers.Song.selectors.SongTitle).textContent;
                    Radiant.Helpers.Song.SongAlbum = (document.querySelector(Radiant.Helpers.Song.selectors.SongAlbum) != null) ? document.querySelector(Radiant.Helpers.Song.selectors.SongAlbum).textContent: null;
                    Radiant.Helpers.Song.SongAlbumBuyLink = (document.getElementById(Radiant.Helpers.Song.selectors.SongAlbumBuyLink).querySelector("a").getAttribute("href") == " ") ? Radiant.Language.Not() : document.getElementById(Radiant.Helpers.Song.selectors.SongAlbumBuyLink).querySelector("a").getAttribute("href").replace(/\s+/g, '');
                    Radiant.Helpers.Song.SongYouTubeID = (document.querySelector(Radiant.Helpers.Song.selectors.SongID).dataset[Radiant.Helpers.Song.selectors.SongYouTubeID] == undefined) ? Radiant.Language.NoYouTube() : document.querySelector(Radiant.Helpers.Song.selectors.SongID).dataset[Radiant.Helpers.Song.selectors.SongYouTubeID];
                    Radiant.Helpers.Share.Services.Facebook = "https://play.google.com/music/m/"+Radiant.Helpers.Song.SongID+"?utm_medium=organic_share&utm_source=facebook&redirect_uri=https://play.google.com/music/returnfromshare";
                    Radiant.Helpers.Share.Services.Twitter = "https://play.google.com/music/m/"+Radiant.Helpers.Song.SongID+"?utm_medium=organic_share&utm_source=twitter";
                    Radiant.Helpers.Share.Types['F'] = "https://www.facebook.com/dialog/share?app_id=1618370355114238&display=popup&href="+encodeURIComponent(Radiant.Helpers.Share.Services.Facebook);
                    Radiant.Helpers.Share.Types['T'] = "https://twitter.com/intent/tweet?url="+encodeURIComponent(Radiant.Helpers.Share.Services.Twitter);
                    Radiant.Helpers.Share.Types['Normal'] = (Radiant.Playing()) ? "https://play.google.com/music/m/"+Radiant.Helpers.Song.SongID : Radiant.Language.NoSong();
                }
            }
        }
    )
}

/*
Radiant.fn.startObservable = function (domNode, event) {
    var targetNode = domNode;

    var observerConfig = {
        attributes: true,
        childList: true,
        characterData: true
    };

    return new Promise((resolve) => {
            var observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    console.log(mutation);
                    for(var i=0; i<mutations.length; ++i) {
                        for (var j = 0; j < mutations[i].addedNodes.length; ++j) {
                            if ((mutations[i].addedNodes[j].className === "ad-preroll-container" || mutations[i].addedNodes[j].className === "ad-preroll-container ad-preroll-container-hidden")) {
                                event.initEvent('change:ad', mutations[i].addedNodes[j].className, mutations[i].addedNodes[j].className);
                            }
                        }
                    }
                });
                resolve(mutations)
            });
    observer.observe(targetNode, observerConfig);
})
};

var event = document.createEvent('Event');


document.querySelector('body').addEventListener('change:ad', function (e) {
    console.log(e);
}, false);


//ee.addListener('change:ad', displayResponse);

function displayResponse(success) {
    console.log(success);
}

function* getMutation() {
    console.log("Starting");
    var mutations = yield Radiant.fn.startObservable(document.querySelector('body'), event);
    console.log("done");
};

Radiant.fn.runGenerator = function (g) {
    var it = g(), ret;
    (function iterate(val){
        ret = it.next( val );

        if (!ret.done) {
            if ("then" in ret.value) {
                // wait on the promise
                ret.value.then( iterate );
            }
            else {
                setTimeout( function(){
                    iterate( ret.value );
                }, 0 );
            }
        }
    })();
}

Radiant.fn.runGenerator(getMutation);

*/

console.log("RadiantTools has been loaded!!");