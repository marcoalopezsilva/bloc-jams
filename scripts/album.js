// CODE FOR CHECKPOINT21

var setSong = function(songNumberInput) {
    // Next line stops the current playback if the user starts a new song, to prevent concurrent playback of different songs
    if (currentSoundFile) {
        currentSoundFile.stop();
    }
    currentlyPlayingSongNumber = parseInt(songNumberInput);
    currentSongFromAlbum = currentAlbum.songs[songNumberInput -1];
    // Store the sound object in currentSoundFile
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
        formats: ['mp3'],
        // Next line: load the audio files as soon as page loads
        preload: true
    });
    setVolumeNow(currentVolume);
};

// This next song enables the user to use the seekbar to fwd/rwd a song
// FOR CHECKPOINT21: I changed the method here to setPercent (I thought this was easier)
var seek = function(targetTime) {
        if (currentSoundFile) {
            currentSoundFile.setPercent(targetTime);
        }
};

// '.setvolume' is a Buzz method. So, I named the function 'setVolumeNow' (to avoid confusion)
var setVolumeNow = function(volume) {
    if (currentSoundFile) {
        currentSoundFile.setVolume(volume);
    }
};

var getSongNumberCell = function(number) {
    return $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
};

var createSongRow = function (songNumber, songName, songLength) {
    var template =
        '<tr class="album-view-song-item">'
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
            currentSoundFile.play();
            updateSeekBarWhileSongPlays();
            updatePlayerBarSong();
        } else if (currentlyPlayingSongNumber === songNumber) {
            // Switch from Pause -> Play button to pause currently playing song.
            if (currentSoundFile.isPaused()) {
                currentSoundFile.play();
                updateSeekBarWhileSongPlays();
                $(this).html(pauseButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPauseButton);
            } else {
                currentSoundFile.pause();
                $(this).html(playButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPlayButton);
            }
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

// Next block feeds the seekbar the information for the song which is playing. getTime and getDuration are Buzz methods
var updateSeekBarWhileSongPlays = function () {
        if (currentSoundFile) {
            currentSoundFile.bind('timeupdate', function(event) {
                var seekBarFillRatio = this.getTime() / this.getDuration();
                var $seekBar = $('.seek-control .seek-bar');
                updateSeekPercentage($seekBar, seekBarFillRatio);
            });
        }
};

// This function works for both the duration seekbar, and the volume seekbar. It expresses the ratio in terms CSS can interpret
var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
        var offsetXPercent = seekBarFillRatio * 100;
        // #1
        offsetXPercent = Math.max(0, offsetXPercent);
        offsetXPercent = Math.min(100, offsetXPercent);
        // #2
        var percentageString = offsetXPercent + '%';
        $seekBar.find('.fill').width(percentageString);
        $seekBar.find('.thumb').css({left: percentageString});
};

// This function works for both the duration seekbar, and the volume seekbar
var setupSeekBars = function() {
        // Next line: creates JQuery object for elements with '.player-bar .seek-bar'
        var $seekBars = $('.player-bar .seek-bar');
        // Defines an event for when the user clicks on the seek bars
        $seekBars.click(function(event) {
            // Next line calculates how far right (from the start of the seek bar) the user clicked. pageX holds the X coordinate at which the event ocurred
            var offsetX = event.pageX - $(this).offset().left;
            // Next line: calculates the width of the seekbar
            var barWidth = $(this).width();
            // Then we determine how far right the user clicked, as a percentage of width
            var seekBarFillRatio = offsetX / barWidth;
            // Finally, we update the percentage by calling our function and passing the calculated ratio (and the specific seekbar in which it ocurred)
            updateSeekPercentage($(this), seekBarFillRatio);
// FOR CHECKPOINT21: Next block identifies the bar which was clicked and either changes the volume, or sets a point in the song
            var identifySeekBar = $(this).parent().attr('class');
            console.log(identifySeekBar);
            console.log(typeof identifySeekBar);
            if (identifySeekBar == 'control-group volume') {
                console.log("Click on volume seekbar");
                var offsetXPercent = seekBarFillRatio * 100;
                offsetXPercent = Math.max(0, offsetXPercent);
                offsetXPercent = Math.min(100, offsetXPercent);
                setVolumeNow(offsetXPercent);
                console.log("Volume now at " + offsetXPercent + " %" + "\n" + "---------");
            } else if (identifySeekBar == 'seek-control') {
                console.log("Click on song seekbar");
                var offsetXPercent = seekBarFillRatio * 100;
                offsetXPercent = Math.max(0, offsetXPercent);
                offsetXPercent = Math.min(100, offsetXPercent);
                console.log("Target position: " + offsetXPercent);
                console.log(typeof offsetXPercent);
                seek(offsetXPercent);
                console.log("Song was set at position " + currentSoundFile.getPercent() + " %"  );
                console.log(typeof currentSoundFile.getPercent() + "\n" + "---------");
            }

        });
        // Here we detect when the user holds the mouse click on one of the seek bars (by listening on elements with class 'thumb')
        $seekBars.find('.thumb').mousedown(function(event) {
            // We determine which of the seekbars triggered the event ('.parent').
            var $seekBar = $(this).parent();
            // #9
            $(document).bind('mousemove.thumb', function(event) {
                var offsetX = event.pageX - $seekBar.offset().left;
                var barWidth = $seekBar.width();
                var seekBarFillRatio = offsetX / barWidth;
                updateSeekPercentage($seekBar, seekBarFillRatio);
            });
            // #10
            $(document).bind('mouseup.thumb', function () {
                $(document).unbind('mousemove.thumb');
                $(document).unbind('mouseup.thumb');
            });
        });
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
    currentSoundFile.play();
    // Update player bar's information
    updateSeekBarWhileSongPlays();
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
    currentSoundFile.play();
    // Update player bar's information
    updateSeekBarWhileSongPlays();
    updatePlayerBarSong();
    $('main-controls .play-pause').html(playerBarPauseButton);
    var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

//Next block implements toggling Play/Pause button at the Player bar
var togglePlayfromPlayerBar = function () {
    // Note for Junior: I added next conditional to handle the case where no song has been selected at the song list and the user hits play at the player bar
    if (!currentSoundFile) {
        setSong(1);
    }
    if (currentSoundFile.isPaused()) {
        var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
        currentlyPlayingCell.html(pauseButtonTemplate);
        //$(this).html(pauseButtonTemplate);
        $('.main-controls .play-pause').html(playerBarPauseButton);
        currentSoundFile.play();
        updateSeekBarWhileSongPlays();
    } else if (currentSoundFile) {
        var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
        currentlyPlayingCell.html(playButtonTemplate);
        //$(this).html(playButtonTemplate);
        $('.main-controls .play-pause').html(playerBarPlayButton);
        currentSoundFile.pause();
    }
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
// Create a global variable to use with Buzz API (variable will hold the sound object)
var currentSoundFile = null;
// Set volume
var currentVolume = 80;
// Next lines hold JQuery selectors for next, previous and play/pause buttons
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $playPauseButton = $('.main-controls .play-pause');

// Add on-load functions (here, JQuery version)
$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    setupSeekBars();
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
    $playPauseButton.click(togglePlayfromPlayerBar);
});
