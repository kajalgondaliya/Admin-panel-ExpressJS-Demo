const User = require('../models').User;
const {ROLES} = require('../models/user')
const {adminValidation} = require('../validations/adminValidation');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

//Show admin profile details api
module.exports.showProfile = async function(req,res){
    
    const user = await User.findOne({where:{id:req.user_id,role:ROLES.ADMIN_ROLE},attributes:{exclude:['password']}});
    res.render('profile',{data:req,title:"Profile",user})
}

//Update admin details api
module.exports.updateProfile = async function(req,res){
    
    try {
        //Used Joi validation 
        const result = adminValidation(req.body);
        if(result.error){
            return res.status(422).json({status:false,error:result.error.message});
        }
        const id = req.user_id;
        
        //Destructuring and make dataset for updateing details
        var {
            name,
            image,
            password
        } = req.body
        
        var data = {
            id,
            name,
        }
        
        //Check if image is uploaded or not
        if(image != 'undefined' && image != ''){

            //Check for image directory,create if not exists
            var dir = './storage/images/users'
            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir);
            }  
            
            //Image Upload
            if(image != undefined && image != ''){
                //Getting file extension from image uploaded
                var imageType = image.substring(
                    image.indexOf("/") + 1, 
                    image.lastIndexOf(";")
                    );
                    
                    if(imageType != "png" && imageType != "jpeg" && imageType != "jpg" && imageType != "gif"){
                        return res.status(422).json({status:true,error:'Image format not supported!'});
                    }
                    //Image name
                    var imageName = Date.now().toString()+"."+imageType;
                    
                    //Converting base64 to image and uploading it
                    var base64Data = req.body.image.replace(/^data:image\/[a-z]+;base64,/, "");
                    await fs.writeFile(path.join(__dirname,'../storage/images/users',imageName), base64Data, 'base64', function(err) {
                        console.log(err,'image');
                    });
                    data.image = imageName;
                }
                
                //remove existing image code
                if(id != '' && image != undefined && image != ''){
                    const getUserImage = await User.findOne({where:{id},
                        attributes:['id','image'],
                        raw:true
                    });
                    console.log(getUserImage.image);
                    if(getUserImage.image != null){
                        fs.unlinkSync(process.cwd()+"/storage/images/users/"+getUserImage.image);
                        await User.update({image:null},{where:{id}});
                    }
                }
            }
            
            //Check if password is set for updated or not
            if(password != "undefined" && password != ''){
                const salt = await bcrypt.genSalt(10);
                const hashPassword = await bcrypt.hash(password,salt);
                data.password = hashPassword;
            }
            
            //Update admin details
            const updateUser = await User.update(data,{where:{id}});
            return res.status(200).json({status:true,message:"Profile updated successfully!"});
            
        } catch (error) {
            return res.status(400).json({status:false,error:error.message});    
        }
    }