//! public/js/home.js

const video = document.getElementById('expertiseVideo');
const bigPlayOverlay = document.getElementById('bigPlayOverlay');
const playPauseBtn = document.getElementById('playPauseBtn');
const seekBar = document.getElementById('seekBar');
const volumeControl = document.getElementById('volumeControl');
const volumeIcon = document.getElementById('volumeIcon');

//* Hero
if (video && bigPlayOverlay && playPauseBtn && seekBar && volumeControl && volumeIcon) {

    let firstInteraction = true;

    // ---------------------------------------------------------
    // 🔧 Helpers
    // ---------------------------------------------------------
    const setPlayIcon = () => {
        playPauseBtn.innerHTML = '<i class="bi bi-play-fill"></i>';
    };

    const setPauseIcon = () => {
        playPauseBtn.innerHTML = '<i class="bi bi-pause-fill"></i>';
    };

    const updateVolumeIcon = (v) => {
        if (v === 0) {
            volumeIcon.className = 'bi bi-volume-mute-fill text-primary';
        } else if (v <= 0.5) {
            volumeIcon.className = 'bi bi-volume-down-fill text-primary';
        } else {
            volumeIcon.className = 'bi bi-volume-up-fill text-primary';
        }
    };

    // ---------------------------------------------------------
    // 🟢 Autoplay (Muted)
    // ---------------------------------------------------------
    video.volume = 0;
    updateVolumeIcon(0);
    setPauseIcon(); // because video is autoplaying

    // ---------------------------------------------------------
    // ▶️ Big Play Overlay (first unmute)
    // ---------------------------------------------------------
    bigPlayOverlay.addEventListener('click', async () => {
        try {
            firstInteraction = false;

            video.muted = false;
            video.volume = 1;
            volumeControl.value = 1;
            updateVolumeIcon(1);

            await video.play();

            bigPlayOverlay.classList.add('hidden');
            setPauseIcon();
        } catch (err) {
            console.warn('Autoplay/tap-to-unmute failed:', err);
        }
    });

    // ---------------------------------------------------------
    // ▶️ Play / Pause Button
    // ---------------------------------------------------------
    playPauseBtn.addEventListener('click', async () => {

        if (firstInteraction) {
            firstInteraction = false;
            video.muted = false;
            video.volume = 1;
            volumeControl.value = 1;
            updateVolumeIcon(1);
        }

        if (video.paused) {
            await video.play();
            bigPlayOverlay.classList.add('hidden');
            setPauseIcon();
        } else {
            video.pause();
            setPlayIcon();
        }
    });

    // ---------------------------------------------------------
    // ⏩ Seek Bar
    // ---------------------------------------------------------
    video.addEventListener('timeupdate', () => {
        if (video.duration > 0) {
            seekBar.value = (video.currentTime / video.duration) * 100;
        }
    });

    seekBar.addEventListener('input', () => {
        if (video.duration > 0) {
            video.currentTime = (seekBar.value / 100) * video.duration;
        }
    });

    // ---------------------------------------------------------
    // 🔊 Volume
    // ---------------------------------------------------------
    volumeControl.addEventListener('input', () => {
        const vol = parseFloat(volumeControl.value);
        video.volume = vol;

        if (firstInteraction && vol > 0) {
            firstInteraction = false;
            video.muted = false;
        }

        updateVolumeIcon(vol);
    });

    // ---------------------------------------------------------
    // 🔁 Video End → Reset + Show Poster + Show Overlay
    // ---------------------------------------------------------
    video.addEventListener('ended', () => {
        video.pause();
        video.currentTime = 0;

        seekBar.value = 0;
        setPlayIcon();
        bigPlayOverlay.classList.remove('hidden');
    });
}
