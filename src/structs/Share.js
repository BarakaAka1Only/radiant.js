export default class Share {
    static fromShareArray = (shareArr, index) =>

        new Share({
            Facebook_type: shareArr[0],
            Twitter_type: shareArr[1],
            Facebook: shareArr[2],
            Twitter: shareArr[3],
            Normal: shareArr[4]
        });

    constructor({
                    Facebook_type,
                    Twitter_type,
                    Facebook,
                    Twitter,
                    Normal
                }) {
        this.Facebook_type = Facebook_type;
        this.Twitter_type = Twitter_type;
        this.Facebook = Facebook;
        this.Twitter = Twitter;
        this.Normal = Normal;
    }

    equals(other) {
        if (!other) return false;
        return this.Facebook_type === other.Facebook_type &&
            this.Twitter_type === other.Twitter_type &&
            this.Facebook === other.Facebook &&
            this.Twitter === other.Twitter &&
            this.Normal === other.Normal;
    }
}