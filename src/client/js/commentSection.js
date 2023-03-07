const videoContainer = document.getElementById("videoContainer")
const form = document.getElementById("commentForm");
const deleteCommentBtn = document.getElementById("deleteCommentBtn");
const addComment = (text, id) => {
    //JS로 HTML에 추가하기
    const videoComments = document.querySelector(".video__comments ul");
    const newComment = document.createElement("li");
    newComment.dataset.id = id;
    newComment.className = "video__comment"
    const icon = document.createElement("i");
    icon.className = "fas fa-comment"
    const span = document.createElement("span");
    span.innerText = `${text}` //textarea에서 오는 그 text
    const span2 = document.createElement("span");
    span2.innerText = " ✖️";
    newComment.appendChild(icon);
    newComment.appendChild(span);
    newComment.appendChild(span2);
    videoComments.prepend(newComment); //element를 맨 위에 추가하는 방법
    //appendChild로 element를 다른 것 안에 넣음
}

const handleSubmit = async (event) => {
    event.preventDefault();
    const textarea = form.querySelector("textarea");
    const text = textarea.value; //댓글 내용
    const videoId = videoContainer.dataset.id; //댓글 단 비디오의 id
    if (text === "") return; //text가 비어있지 않을 때만 request
    const response = await fetch(`/api/videos/${videoId}/comment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
    });
    console.log(response)
    if (response.status == 201) {
        textarea.value = ""
        const { newCommentId } = await response.json();
        addComment(text, newCommentId);
    }
}
if (form) form.addEventListener("submit", handleSubmit);
//form이 항상 존재한다고 가정하지 않기 때문에 개선됨


// const handleDeleteComment = () => {
//     const commentID = deleteCommentBtn.dataset._id;
//     console.log(commentID);
// }
// deleteCommentBtn.addEventListener("click", handleDeleteComment);

