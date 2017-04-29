export default class Song {
    static fromSongArray = (songArr, index) =>

        new Song({
            SongID: songArr[0],
            SongAlbumID: songArr[1],
            SongTitle: songArr[2],
            SongArtist: songArr[3],
            SongAlbum: songArr[4],
            SongAlbumBuyLink: songArr[5],
            SongYouTubeID: songArr[6]
        });

    constructor({
                    SongID,
                    SongAlbumID,
                    SongTitle,
                    SongArtist,
                    SongAlbum,
                    SongAlbumBuyLink,
                    SongYouTubeID
                }) {
        this.SongID = SongID;
        this.SongAlbumID = SongAlbumID;
        this.SongTitle = SongTitle;
        this.SongArtist = SongArtist;
        this.SongAlbum = SongAlbum;
        this.SongAlbumBuyLink = SongAlbumBuyLink;
        this.SongYouTubeID = SongYouTubeID;
    }

    equals(other) {
        if (!other) return false;
        return this.SongID === other.SongID &&
            this.SongAlbumID === other.SongAlbumID &&
            this.SongTitle === other.SongTitle &&
            this.SongArtist === other.SongArtist &&
            this.SongAlbum === other.SongAlbum &&
            this.SongAlbumBuyLink === other.SongAlbumBuyLink &&
            this.SongYouTubeID === other.SongYouTubeID;
    }
}