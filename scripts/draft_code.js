//CHECKPOINT20

// Implementation 1

var clickHandler = function () {
    var songNumber = parseInt($(this).attr('data-song-number'));
    if (currentlyPlayingSongNumber !== null) {
        // User started play at new song, so revert song-row icon to song number
        var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
        currentlyPlayingCell.html(currentlyPlayingSongNumber);
    }
    if (currentlyPlayingSongNumber !== songNumber) {
        // New song is playing
        $(this).html(pauseButtonTemplate);
        setSong(songNumber);
//--> Next line is correct!
        currentSoundFile.play();
        updatePlayerBarSong();
    } else if (currentlyPlayingSongNumber === songNumber) {
        // Switch from Pause -> Play button to pause currently playing song.
//--> Next block is correct! However, the example implementation sets play after the other lines
        if ( currentSoundFile.isPaused() ) {
            currentSoundFile.play();
            $(this).html(playButtonTemplate);
            $(".main-controls .play-pause").html(playerBarPlayButton);
//--> Next block is correct!
        } else {
            currentSoundFile.pause();
            $(this).html(playButtonTemplate);
            $(".main-controls .play-pause").html(playerBarPlayButton);
        }
        //currentlyPlayingSongNumber = null;
        //currentSongFromAlbum = null;
    }
};
