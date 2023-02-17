import mongoose from "mongoose";

//데이터의 shape 설명. 데이터 작성은 아님!!
const videoSchema = new mongoose.Schema({
    title: String,
    description: String,
    createdAt: Date,
    hashtags: [{ type: String }],
    meta: {
        views: Number,
        rating: Number
    },
})

const Video = mongoose.model("Video", videoSchema);
export default Video;
// export 했으니 다른 곳에서도 import vid from "Video" 가능
// Video model을 미리 import해서, 모두가 사용할 수 있게 하면
// 모두가 바로 사용 가능!