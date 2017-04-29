import Emitter from 'events';

import LanguageNamespace from './namespaces/LanguageNamespace';
import FunctionsNamespace from './namespaces/FunctionsNamespace';
import HelpersNamespace from './namespaces/HelpersNamespace';

import { nowPlayingSelectors, songSelectors, playbackSelectors } from './constants/selectors';

const namespaces = {};

window.RadiantState = {
    ready: !1,
    volume_state: null,
    SongID: null,
    SongYouTubeID: null,
    Ads: null,
    Share: {
        Types: {
            "F": !1,
            "T": !1,
            "Normal": !1
        },
        Services: {
            Facebook:"",
            Twitter:""
        }
    }
};

class Radiant extends Emitter {

    static SELECTORS = { songSelectors, playbackSelectors, nowPlayingSelectors };

    constructor(props) {
        super(props);
        Object.keys(namespaces).forEach((namespaceName) => {
            const namespaceClasses = namespaces[namespaceName];
            namespaceClasses.forEach((NamespaceClass) => {
                const namespace = new NamespaceClass(this.emit.bind(this), this.on.bind(this));
                this[namespaceName] = Object.assign(this[namespaceName] || {}, namespace.getPrototype());
            });
        });
    }

    static addNamespace(namespaceName, namespaceClass) {
        namespaces[namespaceName] = namespaces[namespaceName] || [];
        namespaces[namespaceName].push(namespaceClass);
        Object.assign(Radiant, namespaceClass.ENUMS || {});
    }
}

Radiant.addNamespace('languages', LanguageNamespace);
Radiant.addNamespace('fn', FunctionsNamespace);
Radiant.addNamespace('Helpers', HelpersNamespace);

export default Radiant;