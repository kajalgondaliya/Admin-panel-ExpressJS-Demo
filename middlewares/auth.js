const jwt = require('jsonwebtoken');
const {ROLES} = require('../models/user');
const User = require('../models').User;

async function auth(req,res,next){
    //getting token form cookie
    const token = req.cookies.session;        
    
    //check if token exists or not
    if(token == undefined) return res.redirect('/');
    //Verify details and set user_id in req object where it can be used
    const verified = jwt.verify(token,process.env.SECRET);
    if(verified){
        const userRole = await User.findOne({where:{
            id:verified.id,
            role:ROLES.ADMIN_ROLE
        }});
        
        //check if token has admin as role then redirect to dashboard else clear token and send to login
        if(userRole){
            req.user_id = verified.id
            next();
        }
        else{
            res.clearCookie('session');
            res.redirect('/')
        }
    }else{
        res.redirect('/');
    }
}

module.exports = auth;