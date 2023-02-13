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
        views: 59,
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
    
    
    res.render("home",{pageTitle: "Home", videos});
}
export const search=(req,res)=>res.send("Search")

//video
export const see =(req,res)=>{
    const {id} = req.params;
    const video = videos[id-1];
    return res.render("watch",{pageTitle:`Watching ${video.title}`})
}
export const edit = (req,res)=>res.send("Edit")
export const deleteVideo = (req,res) =>{
    console.log(req.params)
    return res.send("Delete Video")
}
export const upload = (req,res) =>res.send("Upload") 