export default class Artwork {
    static fromArtworkArray = (artworkArr, index) =>

        new Artwork({
            Full: artworkArr[0],
            Large: artworkArr[1],
            Medium: artworkArr[2],
            Small: artworkArr[3],
            Mini: artworkArr[4]
        });

    constructor({
                    Full,
                    Large,
                    Medium,
                    Small,
                    Mini
                }) {
        this.Full = Full;
        this.Large = Large;
        this.Medium = Medium;
        this.Small = Small;
        this.Mini = Mini;
    }

    equals(other) {
        if (!other) return false;
        return this.Full === other.Full &&
            this.Large === other.Large &&
            this.Medium === other.Medium &&
            this.Small === other.Small &&
            this.Mini === other.Mini;
    }
}