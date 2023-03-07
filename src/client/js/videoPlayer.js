const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline")
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls")

let controlsTimeout = null; //timeout 공유하기 위해 global 변수로 설정
let controlsMovementTimeout = null; //나중에 숫자가 됨/ timeout 취소하면 다시 null
let volumeValue = 0.5;
video.volume = volumeValue;
const handlePlayClick = (e) => {
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
    playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

const handleMuteClick = (e) => {
    video.muted = !video.muted
    muteBtnIcon.classList = video.muted
        ? "fas fa-volume-mute"
        : "fas fa-volume-up";
    volumeRange.value = video.muted ? 0 : volumeValue;

};

const handleVolumeChange = (event) => {
    const {
        target: { value },
    } = event;
    if (video.muted) {
        video.muted = false;
        muteBtn.innerText = "Mute";
    }
    volumeValue = value;
    video.volume = value;
    //음소거를 해제했을 때 이전의 볼륨 값(volumeValue)로 돌아갈 수 있도록
}
const formatTime = (seconds) => {
    return new Date(seconds * 1000).toISOString().substring(14, 19);
}

const handleLoadedMetadata = () => {
    // 이 function이 호출해서 비디오의 길이를 알 수 있다
    //해당 function이 실행되기 전까지는 비디오의 총 시간을 알 수 없음
    totalTime.innerText = formatTime(Math.floor(video.duration));
    timeline.max = Math.floor(video.duration);
}

const handleTimeUpdate = () => {
    currentTime.innerText = formatTime(Math.floor(video.currentTime));
    timeline.value = video.currentTime;
}
const handleTimelineChange = (event) => {
    const {
        target: { value }
    } = event;
    video.currentTime = value;
}
const handleFullScreenClick = () => {
    const fullScreen = document.fullscreenElement;
    if (fullScreen) {
        document.exitFullscreen(); //document에서 불려져야 함
        fullScreenIcon.classList = "fas fa-expand";
    }
    else {
        videoContainer.requestFullscreen(); //element에서 불려져야 함
        fullScreenIcon.classList = "fas fa-expand";
    }
}
const hideControls = () => {
    videoControls.classList.remove("showing");
}
const handleMouseMove = () => {
    if (controlsTimeout) {
        clearTimeout(controlsTimeout); //해당 id를 가진 timeout이 취소됨
        controlsTimeout = null;
    }
    if (controlsMovementTimeout) { //null이 아니고 숫자일때, 즉 id를 받았을 때
        clearTimeout(controlsMovementTimeout)
        controlsMovementTimeout = null;
    }
    videoControls.classList.add("showing");
    controlsMovementTimeout = setTimeout(hideControls, 3000)
    //매번 마우스를 움직일 때마다, timeout 생성
}

//스페이스바로 재생/멈춤 실행하기
document.addEventListener("keyup", (event) => {
    if (event.code === "Space") handlePlayClick();
});
//m 버튼으로 mute 사용하기
document.addEventListener("keyup", (event) => {
    if (event.keyCode === 77) {
        handleMuteClick();
    }
})

const handleEnded = () => {
    //id 정보를 모르니까 템플릿을 렌더링하는 pug에게 비디오에 대한 정보를 남기라고 해야 함
    const { id } = videoContainer.dataset;
    fetch(`/api/videos/${id}/view`, {
        method: "POST",
    });
    //비디오 시청이 끝나면 이 URL에 요청을 보냄
    //그냥 fetch하면 GET 요청을 보내게 되는 것이므로 method: "POST" 필수!
}

video.addEventListener("click", handlePlayClick)
playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange)
video.addEventListener("loadeddata", handleLoadedMetadata)
video.addEventListener("timeupdate", handleTimeUpdate)
video.addEventListener("ended", handleEnded)
videoContainer.addEventListener("mousemove", handleMouseMove)
// video.addEventListener("mouseleave", handleMouseLeave)
timeline.addEventListener("input", handleTimelineChange)
fullScreenBtn.addEventListener("click", handleFullScreenClick)

if (video.readyState >= 2) {
    getmetadata();
}

function getmetadata() {
    handleLoadedMetadata();
}
