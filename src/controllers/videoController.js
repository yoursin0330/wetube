import Video from "../models/Video";
import User from "../models/User";
import Comment from "../models/Comment";

export const home = async (req, res) => {
    const videos = await Video.find({})
        .sort({ createdAt: "desc" })
        .populate("owner");
    return res.render("videos/home", { pageTitle: "Home", videos });
}

export const watch = async (req, res) => {
    const { id } = req.params; //router가 주는 express 의 기능!
    const video = await Video.findById(id).populate("owner").populate("comments");
    if (!video) return res.status(404).render("404", { pageTitle: "Video not found" })
    return res.render("videos/watch", { pageTitle: `Watching: ${video.title}`, video })
}
export const getEdit = async (req, res) => {
    const { id } = req.params;
    const { user: { _id } } = req.session;
    const video = await Video.findById(id);
    if (!video) { return res.status(404).render("404", { pageTitle: "Video not found" }) }
    if (String(video.owner) !== String(_id)) { //하나는 object, 하나는 string이라 그냥 비교하면 불일치
        req.flash("error", "You are not the owner of the video.")
        return res.status(403).redirect("/");
    }
    req.flash("success", "Changes saved")
    return res.render("videos/edit", { pageTitle: `Edit: ${video.title}`, video })

}
export const postEdit = async (req, res) => {
    const {
        user: { _id }
    } = req.session;
    const { id } = req.params;
    const { title, description, hashtags } = req.body;
    const video = await Video.findById(id);
    if (!video) { return res.status(404).render("404", { pageTitle: "Video not found" }) }
    if (String(video.owner) !== String(_id)) { //하나는 object, 하나는 string이라 그냥 비교하면 불일치
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndUpdate(id, { //update 할 것들
        title, description,
        hashtags: Video.formatHashtags(hashtags),
    })
    return res.redirect(`/videos/${id}`);
}
export const getUpload = (req, res) => {
    return res.render("videos/upload", { pageTitle: "Upload Video" })
}
export const postUpload = async (req, res) => {
    const { user: { _id } } = req.session;
    const { video, thumb } = req.files;
    const { title, description, hashtags } = req.body;
    try {
        const newVideo = await Video.create({
            title,
            description,
            fileUrl: video[0].path,
            thumbUrl: thumb[0].path,
            owner: _id,
            hashtags: Video.formatHashtags(hashtags),
        });
        const user = await User.findById(_id);
        user.videos.push(newVideo._id);
        user.save();
        return res.redirect("/")
    } catch (error) {
        return res.render("videos/upload", { pageTitle: "Upload Video", errorMessage: error._message })
    }
}

export const deleteVideo = async (req, res) => {
    const { id } = req.params;
    const {
        user: { _id },
    } = req.session;
    const video = await Video.findById(id);
    const user = await User.findById(_id);
    if (!video) {
        return res.status(404).render("404", { pageTitle: "Video not found." });
    }
    if (String(video.owner) !== String(_id)) {
        req.flash("error", "You are not the owner of the video");
        return res.status(403).redirect("/");
    }

    await Video.findByIdAndDelete(id);
    user.videos.splice(user.videos.indexOf(id), 1);
    user.save();
    return res.redirect("/");
}

export const search = async (req, res) => {
    const { keyword } = req.query;
    let videos = [];
    if (keyword) { //실제 search일때만 값이 있고, 아니면 undefined라 실행x
        videos = await Video.find({
            title: {
                $regex: new RegExp(`^${keyword}`, "i")
            }
        }).populate("owner");
    }
    return res.render("videos/search", { pageTitle: "Search", videos })
}

export const registerView = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) return res.sendStatus(404);

    //비디오가 있다면 비디오를 업데이트
    video.meta.views = video.meta.views + 1;
    await video.save();
    return res.sendStatus(200);
}

export const createComment = async (req, res) => {
    const {
        session: { user },
        body: { text },
        params: { id },
    } = req;

    const video = await Video.findById(id);
    if (!video) return res.sendStatus(404)

    const comment = await Comment.create({
        text: text,
        owner: user._id,
        video: id,
    });
    video.comments.push(comment._id);
    video.save();
    return res.status(201).json({ newCommentId: comment._id });
    //status code 말고도 새로 생성한 fake commenet의 Id 값을 frontend에 되돌려 보내줌


}