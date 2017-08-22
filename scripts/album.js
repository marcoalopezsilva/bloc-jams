// Next block is just an example album
var albumPicasso = {
    title: 'The Colors',
    artist: 'Pablo Picasso',
    label: 'Cubism',
    year: '1881',
    albumArtUrl: 'assets/images/album_covers/01.png',
    songs: [
        {title: 'Blue', duration: '4:26'},
        {title: 'Green', duration: '3:14'},
        {title: 'Red', duration: '5:01'},
        {title: 'Pink', duration: '3:21'},
        {title: 'Magenta', duration: '2:15'}
    ]
};

// Another Example Album
var albumMarconi = {
    title: 'The Telephone',
    artist: 'Guglielmo Marconi',
    label: 'EM',
    year: '1909',
    albumArtUrl: 'assets/images/album_covers/20.png',
    songs: [
        { title: 'Hello, Operator?', duration: '1:01' },
        { title: 'Ring, ring, ring', duration: '5:01' },
        { title: 'Fits in your pocket', duration: '3:21'},
        { title: 'Can you hear me now?', duration: '3:14' },
        { title: 'Wrong phone number', duration: '2:15'}
    ]
};

var createSongRow = function (songNumber, songName, songLength) {
    var template =
        '<tr class="album-view-song-item">'
    + '  <td class="song-item-number" data-song-number="'+ songNumber + '">' + songNumber + '</td>'
    + '  <td class="song-item-title">' + songName + '</td>'
    + '  <td class="song-item-duration">'+ songLength + '</td>'
    + '</tr>'
    ;
    return $(template);
};

var setCurrentAlbum = function (album) {
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

// Find the parent class of an element
var findParentByClassName = function (element, targetClass) {
    if (element) {
        var currentParent = element.parentElement;
        while (currentParent.className !== targetClass && currentParent.className !== null) {
            currentParent = currentParent.parentElement;
        }
        return currentParent;
    }
};

//Function which returns the song item
// Note: I added breaks because I think they are missing from Bloc's code, but they don't seem to matter...
var getSongItem = function (element) {
    switch (element.className) {
        case 'album-song-button':
        case 'ion-play':
        case 'ion-pause':
            return findParentByClassName(element, 'song-item-number');
        case 'album-view-song-item':
            return element.querySelector('.song-item-number');
        case 'song-item-title':
        case 'song-item-duration':
            // Note to self: WATCH FOR PERIODS WHEN USING querySelector!!!
            return findParentByClassName(element, 'album-view-song-item').querySelector('.song-item-number');
        case 'song-item-number':
            return element;
        default:
            return;
    }
};

// This function determines what happens to the icon when the user clicks some song
var clickHandler = function(targetElement) {
    var songItem = getSongItem(targetElement);
    if (currentlyPlayingSong === null) {
        songItem.innerHTML = pauseButtonTemplate;
        currentlyPlayingSong = songItem.getAttribute('data-song-number');
    } else if (currentlyPlayingSong === songItem.getAttribute('data-song-number')) {
        songItem.innerHTML = playButtonTemplate;
        currentlyPlayingSong = null;
    } else if (currentlyPlayingSong !== songItem.getAttribute('data-song-number')) {
        var currentlyPlayingSongElement = document.querySelector('[data-song-number= "' + currentlyPlayingSong + '"]');
        currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
        songItem.innerHTML = pauseButtonTemplate;
        currentlyPlayingSong = songItem.getAttribute('data-song-number');
    }
};

//Create variables we can use for detecting when the user hovers over the song list
var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
var songRows = document.getElementsByClassName('album-view-song-item');

// Add template for play button
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
// Add template for pause button
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

// We set the current song to null so that none is asigned until we click on a song
var currentlyPlayingSong = null;

// Add on-load functions
window.onload = function () {
        setCurrentAlbum(albumPicasso);

      // Listen for the user hovering over the playlist, so we can change icons

        // Register when the user hovers mouse over the song list container
        songListContainer.addEventListener('mouseover', function (event) {
            // Target only the line (song row) that the user is hovering on
            if (event.target.parentElement.className === 'album-view-song-item') {
                    var songItem = getSongItem(event.target);
                    if (songItem.getAttribute('data-song-number') !== currentlyPlayingSong) {
                        songItem.innerHTML = playButtonTemplate;
                    }
            }
        });

        // Listen for the user LEAVING the song row. Needs to be a for loop because each album has different number of songs!
        for (var i = 0; i < songRows.length; i++) {
            songRows[i].addEventListener('mouseleave', function (event) {
                // #1
                var songItem = getSongItem(event.target);
                var songItemNumber = songItem.getAttribute('data-song-number');
                // #2
                if (songItemNumber !== currentlyPlayingSong) {
                    songItem.innerHTML = songItemNumber;
                }
            });

            // This next line registers a click that changes the value of currentlyPlayingSong
            songRows[i].addEventListener('click', function (event) {
                //Event handler call next
                clickHandler(event.target);
            });
        }
};
