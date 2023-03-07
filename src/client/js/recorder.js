import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const actionBtn = document.getElementById("actionBtn")
const video = document.getElementById("preview");

//funtion은 외부에 있는 variable을 받을 수는 없음
let stream; //비어 있는 let 변수 생성
let recorder;
let videoFile;

const files = {
    input: "recording.webm",
    output: "output.mp4",
    thumb: "thumbnail.jpg",
};

const downloadFile = (fileUrl, fileName) => {
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
};

const handleDownload = async () => {
    actionBtn.removeEventListener("click", handleDownload);

    actionBtn.innerText = "Transcoding..."
    actionBtn.disabled = true;

    const ffmpeg = createFFmpeg({
        // mainName: 'main',
        // corePath: 'https://unpkg.com/@ffmpeg/core-st@0.11.0/dist/ffmpeg-core.js',
        log: true,
    }); //ffmpeg 세계에서 파일 생성
    await ffmpeg.load();

    ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile))
    //업로드를 하면 uploads 폴더에 아바파 파일이 생기는 것처럼 프론트엔드에도 이런 폴더 생성됨!
    //실존하진 않아도 프론트엔드에 파일이 생긴 것
    //브라우저가 아닌 컴퓨터에서 작업하는 것처럼 하고 있다~

    await ffmpeg.run("-i", files.input, "-r", "60", files.output)

    await ffmpeg.run("-i", files.input, "-ss", "00:00:01", "-frames:v", "1", files.thumb)

    const mp4File = ffmpeg.FS("readFile", files.output)
    const thumbFile = ffmpeg.FS("readFile", files.thumb)

    const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" })
    //자바스크립트에게 이게 video/mp4 type의 파일이라고 알려줌
    const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });

    //blob url은 url을 통해서 파일에 접근하는 방법
    const mp4Url = URL.createObjectURL(mp4Blob)
    const thumbUrl = URL.createObjectURL(thumbBlob)

    downloadFile(mp4Url, "MyRecording.mp4");
    downloadFile(thumbUrl, "MyThumbnail.jpg");

    //파일의 링크를 해제하여 속도 조금 빠르게 - 파일 계속 들고있어서 느려지는 것 해결
    ffmpeg.FS("unlink", files.input)
    ffmpeg.FS("unlink", files.output)
    ffmpeg.FS("unlink", files.thumb)
    //생성한 두 파일을 삭제하고, 소스파일인 files.input 삭제함

    URL.revokeObjectURL(mp4Url);
    URL.revokeObjectURL(thumbUrl);
    URL.revokeObjectURL(videoFile);

    actionBtn.disabled = true;
    actionBtn.innerHTML = "Record Again";
    actionBtn.addEventListener("click", handleDownload);
    init();
    //누군가 actionBtn을 누르면 handleStart를 호출하도록
};

const handleStart = () => {
    actionBtn.innerText = "Recording";
    actionBtn.disabled = true;
    actionBtn.removeEventListener("click", handleStart);
    recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    recorder.ondataavailable = (event) => {
        console.log(event.data)
        videoFile = URL.createObjectURL(event.data);
        //브라우저가 파일을 보여주는 방법. 비디오는 메모리에 있고 보려면 URL 필요
        video.srcObject = null;
        video.src = videoFile;
        video.loop = true;
        video.play();
        actionBtn.innerText = "Download";
        actionBtn.disabled = false;
        actionBtn.addEventListener("click", handleDownload);
    }
    recorder.start();
    setTimeout(() => { //5초만 녹화하기
        recorder.stop();
    }, 5000);
}

const init = async () => {
    //카메라, 마이크 사용 여부 물어봐야 돼서 시간이 좀 걸리니 await 사용하기
    stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
            width: 1024,
            height: 576,
        },
    });
    //src라는 객체임 파일x
    video.srcObject = stream;
    video.play(); //preview 기능
}
init(); //preview 가져오는 초기 설정 함수
actionBtn.addEventListener("click", handleStart)
//버튼 하나로 하기 위해서 이런 고생을 합니다