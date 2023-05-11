//middleware to check if logged in user visits login page redirect to home page
function guest(req,res,next){
    const token = req.cookies.session;
    if(token){
        return res.redirect('/admin/dashboard');
    }else{
        next();
    }
}
module.exports = guest;