const db = require("../config/connection");
const { User, Artist, Song, Album } = require("../models");
const artist_data = require("./data/artist-data");
const album_data = require("./data/album-data");
const song_data = require("./data/song-data");
const user_data = require("./data/user-data");

db.once("open", async () => {
  await Song.deleteMany();
  await Album.deleteMany();
  await Artist.deleteMany();
  await User.deleteMany();
  const createdUser = await User.create(user_data);

  const createdArtist = await Artist.create(artist_data);
  const idea = createdArtist[0]._id;

  async function updateArtistAndAlbum(id1, id2) {
    await Artist.updateOne({ _id: id1 }, { $push: { albums: id2 } });
    await Album.updateOne({ _id: id2 }, { $push: { artist: id1 } });
  }
  async function updateAlbumAndSong(id1, id2) {
    const pushToAlbum = await Album.updateOne(
      { _id: id1 },
      { $push: { songs: id2 } }
    );
  }
  async function updateArtistAndSong(id1, id2) {
    const pushToSong = await Song.updateOne(
      { _id: id2 },
      { $push: { artist: id1 } }
    );
  }

  // albumSeeding
  const matchArtistToAlbum = async (album) => {
    const artists = createdArtist.forEach((artist) => {
      const artistPair = artist.name;
      if (artistPair === album.artist_name) {
        updateArtistAndAlbum(artist._id, album._id);
        // Artist.updateOne({ _id: artist._id }, { $push: { albums: album._id } });
      } else {
        return;
      }
    });
  };
  let empty = [];
  for (let i = 0; i < album_data.length; i++) {
    const album_name = album_data[i].album_name;
    const artist_name = album_data[i].artist_name;
    const createdAlbum = await Album.create({ album_name, artist_name });
    empty.push(createdAlbum);
    matchArtistToAlbum(createdAlbum);
  }
  // song seeding
  const matchSongToAlbum = (song) => {
    const albums = empty.forEach((album) => {
      const albumPair = album.album_name;
      if (albumPair === song.album_name) {
        updateAlbumAndSong(album._id, song._id);
        // Artist.updateOne({ _id: artist._id }, { $push: { albums: album._id } });
      } else {
        return;
      }
    });
  };
  // song seeding
  const matchSongToArtist = (song) => {
    const artist = createdArtist.forEach((artist) => {
      console.log(song.artist_name, artist.name);
      const artistPair = song.artist_name;
      if (artistPair === artist.name) {
        updateArtistAndSong(artist._id, song._id);
        // Artist.updateOne({ _id: artist._id }, { $push: { albums: album._id } });
      } else {
        return;
      }
    });
  };
  for (let i = 0; i < song_data.length; i++) {
    const artist_name = song_data[i].artist_name;
    const album_name = song_data[i].album_name;
    const song_name = song_data[i].song_name;
    const progression = song_data[i].progression;
    const key = song_data[i].key;
    const tempo = song_data[i].tempo;
    const createdSong = await Song.create({
      artist_name,
      album_name,
      song_name,
      progression,
      key,
      tempo,
    });

    matchSongToAlbum(createdSong);
    matchSongToArtist(createdSong);
  }

  const lookUp = await Artist.find({ name: "Gunna" });
  console.log("Seeded complete");
  process.exit();
});
