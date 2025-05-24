const video = document.getElementById('expertiseVideo');
const playPauseBtn = document.getElementById('playPauseBtn');
const seekBar = document.getElementById('seekBar');
const volumeControl = document.getElementById('volumeControl');
const volumeIcon = document.getElementById('volumeIcon');

playPauseBtn.addEventListener('click', () => {
	if (video.paused) {
		video.play();
		playPauseBtn.innerHTML = '<i class="bi bi-pause-fill"></i>';
	} else {
		video.pause();
		playPauseBtn.innerHTML = '<i class="bi bi-play-fill"></i>';
	}
});

video.addEventListener('timeupdate', () => {
	const progress = (video.currentTime / video.duration) * 100;
	seekBar.value = progress;
});

seekBar.addEventListener('input', () => {
	video.currentTime = (seekBar.value / 100) * video.duration;
});

volumeControl.addEventListener('input', () => {
	video.volume = volumeControl.value;
});

volumeControl.addEventListener('input', () => {
	video.volume = volumeControl.value;

	if (video.volume === 0) {
		volumeIcon.className = 'bi bi-volume-mute-fill text-primary';
	} else if (video.volume <= 0.5) {
		volumeIcon.className = 'bi bi-volume-down-fill text-primary';
	} else {
		volumeIcon.className = 'bi bi-volume-up-fill text-primary';
	}
});
