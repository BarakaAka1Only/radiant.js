import RadiantNamespace from '../RadiantNamespace';

import LanguageNamespace from './LanguageNamespace';

export default class FunctionsNamespace extends RadiantNamespace {

    constructor(...args) {
        super(...args);

        this.addMethods([
            'create', 'Replace', 'hasClass', 'has', 'Retry', 'trigger', 'getID', 'FakeClick', 'FakeMenuClick', 'Playing', 'Volume', 'IMFL', 'getYoutubeID',
            'RollDice', 'Observe', '_textContent'
        ]);

        this.language = new LanguageNamespace;
    }

    /**
     * Add Elements to the DOM
     * @param Baraka
     * @returns {DocumentFragment}
     */
    create(Baraka) {
        const radiant = document.createDocumentFragment();
        const temp = document.createElement('div');
        temp.innerHTML = Baraka;
        while (temp.firstChild) {
            radiant.appendChild(temp.firstChild);
        }
        return radiant;
    }
    /**
     * Replace a string with something else
     * @param s
     * @param f
     * @param r
     * @returns {*}
     * @constructor
     */
    Replace(s, f, r) {
        if(s === null) {
            return false;
        } else {
            return s.replace(new RegExp(f, 'g'), r);
        }
    }
    /**
     * Check is element has a added / set class in element attribute
     * @param element
     * @param cls
     * @returns {boolean}
     */
    hasClass(element, cls) {
        if(element !== null) {
            return ` ${element.className} `.includes(` ${cls} `);
        } else {
            return false;
        }
    }
    /**
     * Check if Object has KEY property as a match other wise it's false
     * @param obj
     * @param value
     * @returns {boolean}
     */
    has(obj, value) {
        for(const id in obj) {
            if(obj[id] === value) {
                return true;
            }
        }
        return false;
    }
    /**
     * Emulate a Delay
     * @param isDone
     * @param next
     * @constructor
     */
    Retry(isDone, next) {
        let currentTrial = 0;
        const maxRetry = 50;
        const interval = 10;
        let isTimeout = false;
        const id = window.setInterval(
            () => {
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
    }

    /**
     * Simulate a mouse event
     * @param node
     * @param eventType
     */
    trigger(node, eventType) {
        const clickEvent = document.createEvent ('MouseEvents');
        clickEvent.initEvent (eventType, true, true);
        node.dispatchEvent (clickEvent);
    }

    /**
     * Get ID by a url / string
     * @param s
     * @returns {*}
     */
    getID(s){
        const t = s.split(/[\\\/]/)[5].match(/\S[^?]*(?:\?+|$)/g)[0].slice(0, -1);
        return (t.match("t=")) ? this.language.NoSongID() : t;
    }

    /**
     * Send a FakeClick() trigger to the DOM to get data queue
     * @constructor
     */
    FakeClick() {
       this.Retry(
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
    }

    /**
     * Send a FakeMenuClick() trigger to the DOM to get data song id / info
     * @constructor
     */
    FakeMenuClick(){
        if((document.body.contains(document.querySelector('.song-menu')) && this.Playing())) {
            if(document.querySelector('[data-id=\"now-playing-menu\"]') !== null) {
                document.querySelector('[data-id=\"now-playing-menu\"]').click();
                this.trigger(document.querySelector('[data-id=\"now-playing-menu\"]'), "mousedown");
                this.trigger(document.querySelector('[data-id=\"now-playing-menu\"]'), "mouseup");
                this.trigger(document.querySelector('.song-menu'), "mouseover");
                this.trigger(document.querySelector('.song-menu .goog-menuitem[id*=":f"]'), "mouseover");
                this.trigger(document.querySelector('.song-menu .goog-menuitem[id*=":f"]'), "mousedown");
                this.trigger(document.querySelector('.song-menu .goog-menuitem[id*=":f"]'), "mouseup");
                document.querySelector('[class*="get-link"]').style.opacity = 0;
                window.RadiantState.SongID = this.getID(document.querySelector('[class*="get-link"] #labelAndInputContainer input').value);
                this.trigger(document.querySelector('body'), "mousedown");
                document.querySelector('[class*="get-link"]').parentNode.removeChild(document.querySelector('[class*="get-link"]'));
            }
        }
    }

    /**
     * Check if Google Play Music is playing a song
     * @returns {*|boolean}
     * @constructor
     */
    Playing() {
        return this.hasClass(document.querySelector('[id="player-bar-play-pause"]'), "playing");
    }

    /**
     * Get the current Volume on gpm
     * @returns {*}
     * @constructor
     */
    Volume() {
        return (window.RadiantState.volume_state === null) ? 100 : gmusic.volume.getVolume();
    }

    /**
     * Are you Feeling Lucky? Cause We are! Roll the Dice
     * @constructor
     */
    IMFL() {
        const lucky = this.create('<div class="material-card" data-type="imfl" style="display:none"></div><div class="ad-preroll-container ad-preroll-container-hidden" style="display:none"><div class=ad-preroll-video-container><div style=position:absolute><iframe allowfullscreen src=https://imasdk.googleapis.com/js/core/bridge3.166.0_en.html#goog_855622984 style=border:0;opacity:0;margin:0;padding:0;position:relative></iframe></div></div><div class=ad-preroll-message-container><div class=ad-preroll-message-text>Subscribe for all of the music on-demand and offline with none of the ads</div><div><paper-button animated=""aria-disabled=false class="paper-button-0 upsell-button x-scope"data-id=upgrade elevation=0 role=button tabindex=0>SUBSCRIBE</paper-button></div></div><div class=ad-preroll-companion-container></div></div>');

        const readyStateChecker = setInterval(() => {
            if (document.readyState === "complete") {
                document.body.insertBefore(lucky, document.body.childNodes[0]);
                clearInterval(readyStateChecker);
            }
        }, 10);
    }

    /**
     * Get the current song's YouTube id if any
     * @returns {string | null}
     */
    getYoutubeID() {
        return window.RadiantState.SongYouTubeID;
    }

    /**
     * IMFL has been inserted so lets Roll the Dice!!
     * @constructor
     */
    RollDice() {
        document.querySelector('[data-type=\"imfl\"]').click();
    }

    /**
     * Check and wait to see that GMusic initialization was defined
     * @constructor
     */
    Observe(){
        const check = setInterval(() => {
            if(typeof gmusic !== "undefined") {
                window.RadiantState.ready = !!1;
                clearInterval(check);
            }
        }, 10);
    }

    _textContent(el, defaultText) {
        return el ? el.textContent || defaultText : defaultText;
    }
}