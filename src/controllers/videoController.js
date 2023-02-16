let videos=[
    {
        title: "First Video",
        rating: 5,
        comments:2,
        createdAt: "2 minutes ago",
        views: 59,
        id: 1,
    },
    {
        title: "Second Video",
        rating: 5,
        comments:2,
        createdAt: "2 minutes ago",
        views: 1,
        id: 2,
    },
    {
        title: "Third Video",
        rating: 5,
        comments:2,
        createdAt: "2 minutes ago",
        views: 59,
        id: 3,
    }
];

//global
export const trending =(req,res)=>{
    // const videos=[1,2,3,4,5,6,7,8,9,10]
    
    return res.render("home",{pageTitle: "Home", videos});
}
export const search=(req,res)=>res.send("Search")
export const upload=(req,res)=>{
    res.render("upload",{pageTitle:"Upload Video"})
}
//video
export const watch =(req,res)=>{
    const {id} = req.params;
    const video = videos[id-1];
    return res.render("watch",{pageTitle:`Watching: ${video.title}`,video})
}
export const getEdit = (req,res)=>{
    const {id} =req.params;
    const video = videos[id-1];
    return res.render("edit",{pageTitle: `Editing: ${video.title}`, video})
}
export const postEdit=(req,res)=>{
    const {id} =req.params;
    const {title} =req.body;
    videos[id-1].title = title;
    return res.redirect(`/videos/${id}`);
}
export const deleteVideo = (req,res) =>{
    console.log(req.params)
    console.log(req.body)
    return res.send("Delete Video")
}
export const getUpload=(req,res)=>{
    return res.render("upload")
}
export const postUpload=(req,res)=>{
    const newVideo={
        title: req.body.title,
        rating: 0,
        comments:0,
        createdAt: "now",
        views: 0,
        id: videos.length+1,
    }
    videos.push(newVideo)
    return res.redirect("/")
}