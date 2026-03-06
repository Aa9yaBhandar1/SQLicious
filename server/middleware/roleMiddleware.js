const authorize = (role) => {
    return(req, res,next) => {
        if(req.user.role !== role){
            return res.status(403).json({error: "access denied"})
        }
        next();
    };
};

module.exports = authorize;