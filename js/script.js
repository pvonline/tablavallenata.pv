
/* ------ Inicio Reloj Digital ------*/

const $tiempo = document.querySelector('.tiempo'),
$fecha = document.querySelector('.fecha');

function digitalClock(){
    let f = new Date(),
    dia = f.getDate(),
    mes = f.getMonth() + 1,
    anio = f.getFullYear(),
    diaSemana = f.getDay();

    dia = ('0' + dia).slice(-2);
    mes = ('0' + mes).slice(-2)

    let timeString = f.toLocaleTimeString();
    $tiempo.innerHTML = timeString;

    let semana = ['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'];
    let showSemana = (semana[diaSemana]);
    $fecha.innerHTML = `${showSemana}  ${dia}-${mes}-${anio}`
}
setInterval(() => {
    digitalClock()
}, 1000);
/* ------ Final Reloj Digital -------*/




/*----- inicio Reproductor webSim.AI -------*/

document.addEventListener('DOMContentLoaded', function() {
    const audio = document.getElementById('audio');
    const playPause = document.getElementById('playPause');
    const volumeControl = document.getElementById('volume');
    const metadata = document.getElementById('metadata');

    // Initialize audio
    audio.volume = 0.7;

    // Enhanced autoplay function with multiple fallbacks
    const attemptAutoplay = async () => {
        try {
            // Create new audio context for better autoplay support
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            if (audioContext.state === 'suspended') {
                await audioContext.resume();
            }
            
            // Force load the audio
            audio.load();
            
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    playPause.innerHTML = '<div class="pause-icon"></div>';
                    metadata.textContent = 'Emisora - En Vivo';
                }).catch(error => {
                    console.log("Autoplay prevented:", error);
                    playPause.innerHTML = '<div class="play-icon"></div>';
                    metadata.textContent = 'Click para reproducir';
                    // Try alternative autoplay
                    setTimeout(attemptAutoplay, 1000);
                });
            }
        } catch (error) {
            console.error('Playback error:', error);
            metadata.textContent = 'Error de reproducción';
            // Retry on error
            setTimeout(attemptAutoplay, 2000);
        }
    };

    // Try autoplay immediately on load
    attemptAutoplay();

    // Function to fetch and update metadata
    function updateMetadata() {
        fetch('https://pub1.zeno.fm/v5ecixm4fvduv')
            .then(response => response.json())
            .then(data => {
                if (data && data.now_playing && data.now_playing.title) {
                    metadata.textContent = "♫ " + data.now_playing.title;
                } else if (data && data.now_playing && data.now_playing.song) {
                    metadata.textContent = "♫ " + data.now_playing.song;
                } else if (data && data.now_playing && data.now_playing.track) {
                    metadata.textContent = "♫ " + data.now_playing.track;
                } else {
                    metadata.textContent = "♫ Reproduciendo...";
                }
            })
            .catch(error => {
                console.error('Error fetching metadata:', error);
                metadata.textContent = "♫ Reproduciendo...";
            });
    }

    // Update metadata more frequently - every 5 seconds
    setInterval(updateMetadata, 5000);
    updateMetadata(); // Initial metadata fetch

    // Play/Pause functionality
    playPause.addEventListener('click', async function() {
        try {
            if (audio.paused) {
                audio.play();
                playPause.innerHTML = '<div class="pause-icon"></div>';
                metadata.textContent = 'Emisora - En Vivo';
            } else {
                audio.pause();
                playPause.innerHTML = '<div class="play-icon"></div>';
                metadata.textContent = 'Paused';
            }
        } catch (error) {
            console.error('Playback error:', error);
            metadata.textContent = 'Error de reproducción';
        }
    });

    // Volume control
    volumeControl.addEventListener('input', function(e) {
        audio.volume = e.target.value;
        volumeControl.style.background = `linear-gradient(90deg, #0066cc ${e.target.value * 100}%, #333 ${e.target.value * 100}%)`;
    });

    // Error handling
    audio.addEventListener('error', function(e) {
        console.error('Error loading audio:', e);
        metadata.textContent = 'Error loading stream';

        // Try alternative source
        if (audio.src.includes('stream-160')) {
            audio.src = 'https://stream.zeno.fm/v5ecixm4fvduv';
        } else {
            audio.src = 'https://stream-160.zeno.fm/v5ecixm4fvduv';
        }

        audio.load();
    });

    // Handle network issues
    window.addEventListener('online', function() {
        audio.load();
    });

    // Initialize volume slider position
    volumeControl.style.background = `linear-gradient(90deg, #0066cc 70%, #333 70%)`;
});


/*----- final Reproductor webSim.AI -------*/

