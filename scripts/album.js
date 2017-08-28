// CODE FOR CHECKPOINT19

var setSong = function(songNumberInput) {
    currentlyPlayingSongNumber = parseInt(songNumberInput);
    currentSongFromAlbum = currentAlbum.songs[songNumberInput -1];
};

var getSongNumberCell = function(number) {
    return $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
};

var createSongRow = function (songNumber, songName, songLength) {
    var template =
        '<tr class="album-view-song-item">'
// -> CHECK NEXT LINE, "" SEEMS OFF
    + '  <td class="song-item-number" data-song-number="'+ songNumber + '">' + songNumber + '</td>'
    + '  <td class="song-item-title">' + songName + '</td>'
    + '  <td class="song-item-duration">'+ songLength + '</td>'
    + '</tr>'
    ;
    var $row = $(template);

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
            updatePlayerBarSong();
        } else if (currentlyPlayingSongNumber === songNumber) {
            // Switch from Pause -> Play button to pause currently playing song.
            $(this).html(playButtonTemplate);
            $(".main-controls .play-pause").html(playerBarPlayButton);
            currentlyPlayingSongNumber = null;
            currentSongFromAlbum = null;
        }
    };

    var onHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));
        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(playButtonTemplate);
        }
    };
    var offHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));
        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(songNumber);
        }
        console.log("songNumber type is" + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);

    };

    // Next line finds the song number for whichever row triggers a click event
    $row.find('.song-item-number').click(clickHandler);
    // #2
    $row.hover(onHover, offHover);
    // Next line: returns a JQuery-related variable for the template
    return $row;
};

var setCurrentAlbum = function (album) {
    currentAlbum = album;
    //#1
    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');

    //#2
    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);

    //#3
    $albumSongList.empty();

    //#4
    for (var i = 0; i < album.songs.length; i++) {
        var $newRow = createSongRow(i+1, album.songs[i].title, album.songs[i].duration);
        $albumSongList.append($newRow);
    }
};

var trackIndex = function (album, song) {
    return album.songs.indexOf(song);
};

//Next block updates the control bar with information about current songNumber
var updatePlayerBarSong = function () {
// --> Check with Junior: Why do we have to include ".currently-playing" if there's only one ".song-name"? I tried it whithout it and the code does work
// --> Also: Why ".text" instead of ".html"?
     $('.currently-playing .song-name').text(currentSongFromAlbum.title);
     $('.currently-playing .artist-name').text(currentAlbum.artist);
     $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
// Same question here: if there's only one ".play-pause", why do we need ".main-controls"? It also works w/o the ".main-controls"
     $('.main-controls .play-pause').html(playerBarPauseButton);
};

// Next block creates a function to handle the nextSong button (of the bar panel)
var nextSong = function () {
    var currentSongIndex = trackIndex(currentAlbum,currentSongFromAlbum);
    currentSongIndex++;
    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }
    // Save last song's number before changing it
    var lastSongNumber = currentlyPlayingSongNumber;
    // Set a new current song
    setSong(currentSongIndex + 1);
    // Update player bar's information
    updatePlayerBarSong();
    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

// Next block creates a function to handle the previousSong button (of the bar panel)
var previousSong = function () {
    var currentSongIndex = trackIndex(currentAlbum,currentSongFromAlbum);
    currentSongIndex--;
    if (currentSongIndex <0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }
    // Save last song's number before changing it
    var lastSongNumber = currentlyPlayingSongNumber;
    // Set a new current song
    setSong(currentSongIndex+1);
    // Update player bar's information
    updatePlayerBarSong();
    $('main-controls .play-pause').html(playerBarPauseButton);
    var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

// Add template for play button
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
// Add template for pause button
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
// Add same things, for the player background-color
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';
// Create a variables IN THE GLOBAL SCOPE to track relevant information on the current album and song
var currentAlbum = null;
// Next line will hold the song number
var currentlyPlayingSongNumber = null;
// Next line will be used to hold the song's title and duration (obtained from "songs" array within album object)
var currentSongFromAlbum = null;
// Next lines hold JQuery selectors for next&previous buttons
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

// Add on-load functions (here, JQuery version)
$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
});
