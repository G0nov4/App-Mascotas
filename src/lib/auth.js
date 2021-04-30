module.exports = {
    isLogged(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }else{
            return res.redirect('/signin');
        }
    },
    isNotLogged(req,res,next){
        if(!req.isAuthenticated()){
            return next();
        }else{
            return res.redirect('/profile');
        }
    }
}