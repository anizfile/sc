$(document).ready(function () {
    // Initialize variables
    var audioList = [];
    var currentAudioIndex = 0;
    var audioPlayer = new Audio();
    var isPlaying = false;
    var audioTimer;

    // Load audio list
    loadAudioList();

    // Play/pause button click event
    $('#play-pause-btn').click(function () {
        if (isPlaying) {
            pauseAudio();
        } else {
            playAudio();
        }
    });

    // Previous button click event
    $('#prev-btn').click(function () {
        if (currentAudioIndex > 0) {
            currentAudioIndex--;
            loadAudio();
        }
    });

    // Next button click event
    $('#next-btn').click(function () {
        if (currentAudioIndex < audioList.length - 1) {
            currentAudioIndex++;
            loadAudio();
        }
    });

    // Mute button click event
    $('#mute-btn').click(function () {
        if (audioPlayer.muted) {
            audioPlayer.muted = false;
            $('#mute-btn i').removeClass('fas fa-volume-off').addClass('fas fa-volume-up');
        } else {
            audioPlayer.muted = true;
            $('#mute-btn i').removeClass('fas fa-volume-up').addClass('fas fa-volume-off');
        }
    });

    // Volume range input event
    $('#volume-range').on('input', function () {
        var volume = $(this).val() / 100;
        audioPlayer.volume = volume;
    });

    // Load audio list
    function loadAudioList() {
        // Fetch data from API
        fetch('https://de1.api.radio-browser.info/json/stations/bycountryexact/indonesia')
            .then(response => response.json())
            .then(data => {
                // Hitung skor untuk setiap stasiun radio
                var scoredData = data.map(station => {
                    var score = station.votes ? station.votes : 0;
                    return {
                        name: station.name,
                        url_resolved: station.url_resolved,
                        score: score
                    };
                });

                // Urutkan stasiun radio berdasarkan skor tertinggi
                var sortedData = scoredData.sort((a, b) => b.score - a.score);

                // Loop melalui stasiun radio yang sudah diurutkan
                for (const station of sortedData) {
                    // Tambahkan stasiun radio ke audio list
                    audioList.push({
                        title: station.name,
                        file: station.url_resolved
                    });

                    // Buat list item
                    var item = $('<li></li>');
                    item.addClass('audio-list-item');
                    item.append('<span>' + station.name + '</span>');

                    // Tambahkan event onClick untuk memutar audio
                    item.click(function () {
                        currentAudioIndex = $(this).index();
                        loadAudio();
                    });

                    // Tambahkan list item ke audio list 
                    $('#audio-list').append(item);
                }

                // Load first audio
                loadAudio();
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    // Load audio
    function loadAudio() {
        // Reset audio player
        audioPlayer.pause();
        audioPlayer.currentTime = 0;

        // Set audio source
        audioPlayer.src = audioList[currentAudioIndex].file;

        // Set audio title
        $('.music-player-title').text(audioList[currentAudioIndex].title);

        // Select audio list item
        $('.audio-list-item').removeClass('selected');
        $('.audio-list-item:eq(' + currentAudioIndex + ')').addClass('selected');

        // Play audio
        playAudio();
    }

    // Play audio
    function playAudio() {
        audioPlayer.play();
        isPlaying = true;

        // Start audio timer
        clearInterval(audioTimer);
        audioTimer = setInterval(function () {
            updateAudioTime();
        }, 1000);

        // Change play/pause button icon
        $('#play-pause-btn i').removeClass('fas fa-play').addClass('fas fa-pause');
    }

    // Pause audio
    function pauseAudio() {
        audioPlayer.pause();
        isPlaying = false;

        // Stop audio timer
        clearInterval(audioTimer);

        // Change play/pause button icon
        $('#play-pause-btn i').removeClass('fas fa-pause').addClass('fas fa-play');
    }

    // Update audio time
    function updateAudioTime() {
        var current = audioPlayer.currentTime;
        var duration = audioPlayer.duration;
        var percent = (current / duration) * 100;

        // Update audio progress bar
        $('#audio-progress-bar').css('width', percent + '%');

        // Update audio time
        var minutes = Math.floor(current / 60);
        var seconds = Math.floor(current) - (minutes * 60);
        var totalTime = minutes + ':' + ('0' + seconds).slice(-2);
        $('.current-time').text(totalTime);

        // Update audio duration time
        var minutes = Math.floor(duration / 60);
        var seconds = Math.floor(duration) - (minutes * 60);
        var totalTime = minutes + ':' + ('0' + seconds).slice(-2);
        $('.duration-time').text(totalTime);
    }
});
