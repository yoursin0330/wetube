//global
export const trending =(req,res)=>res.send("Home Page Videos")
export const search=(req,res)=>res.send("Search")

//video
export const see =(req,res)=>{
    return res.send(`Watch Videos #${req.params.id}`)
}
export const edit = (req,res)=>res.send("Edit")
export const deleteVideo = (req,res) =>{
    console.log(req.params)
    return res.send("Delete Video")
}
export const upload = (req,res) =>res.send("Upload") 