// FILE FOR DRAFT code

// Own-implementation 1
var clickHandler = function () {
    var songNumber = $(this).attr('data-song-number');
    if (currentlyPlayingSongNumber !== null) {
        // User started play at new song, so revert song-row icon to song number
        var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
        currentlyPlayingCell.html(currentlyPlayingSongNumber);
    }
    if (currentlyPlayingSongNumber !== songNumber) {
        // New song is playing
        $(this).html(pauseButtonTemplate);
        currentlyPlayingSongNumber = songNumber;
// --> I missed the next line:
        currentSongFromAlbum = currentAlbum.songs[songNumber -1];
    } else if (currentlyPlayingSongNumber === songNumber) {
        // Switch from Pause -> Play button to pause currently playing song.
        $(this).html(playButtonTemplate);
        currentlyPlayingSongNumber = null;
//--> Also missed next line:
        currentSongFromAlbum = null;
    }

    var onHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = songNumberCell.attr('data-song-number');
        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(playButtonTemplate);
        }
    };
    var offHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = songNumberCell.attr('data-song-number');
        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(songNumber);
        }
    };

// Own-implementation 2
var updatePlayerBarSong = function () {
    $(".song-name").html(currentSongFromAlbum.title);
    $(".artist-name").html(currentAlbum.artist);
    $(".artist-song-mobile").html(currentSongFromAlbum.title + " - " + currentAlbum.artist);
}

// Own-implementation 3 (Next song) - I didn't do it

// Own-implementation 4 (previous song):
// Next block creates a function to handle the previousSong button (of the bar panel)
var previousSong = function () {
    var currentSongIndex = trackIndex(currentAlbum,currentSongFromAlbum);
    currentSongIndex--;
    if (currentSongIndex <0) {
// --> I missed the -1 here!
        currentSongIndex = currentAlbum.songs.length;
    }
    // Save last song's number before changing it
    var lastSongNumber = currentlyPlayingSongNumber;
    // Set a new current song
    currentlyPlayingSongNumber = currentSongIndex + 1;
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
    // Update player bar's information
    updatePlayerBarSong();
// --> I missed updating the hmtl here
    var $previousSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};
