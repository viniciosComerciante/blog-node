function adminAuth(req, res, next){
    if(req.session.user != undefined){
        next();
    }else{
        console.log("usuario não autorizado");
        res.redirect('/login');
    }
}

module.exports = adminAuth;