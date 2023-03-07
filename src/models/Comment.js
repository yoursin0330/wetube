import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    text: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    video: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Video" }, //comment는 비디오에 생성됨
    createdAt: { type: Date, required: true, default: Date.now },
})

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;

//모델 생성