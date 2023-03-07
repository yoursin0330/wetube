import multer from "multer";
export const localsMiddleware = (req, res, next) => {
    //setting some locals...
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.siteName = "wetube";
    res.locals.loggedInUser = req.session.user || {};
    next()
}

export const protectorMiddleware = (req, res, next) => {
    if (req.session.loggedIn) {
        //user가 loggedIn 돼 있으면 next() 함수를 호출
        return next()
    } else {
        //로그인 되어 있지 않으면 멈추게 함
        req.flash("error", "Log in first.");
        return res.redirect("/login")
    }
}

//로그인 되어 있으면 멈추게 함
export const publicOnlyMiddleware = (req, res, next) => {
    if (!req.session.loggedIn) {
        return next()
    } else {
        req.flash("error", "Not authorized")
        return res.redirect("/")
    }

}

export const avatarUpload = multer({
    dest: "uploads/avatars/", limits: {
        fileSize: 3000000,
    }
})

export const videoUpload = multer({
    dest: "uploads/videos/", limits: {
        fileSize: 10000000,
    }
})