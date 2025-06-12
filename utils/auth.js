import jwt from "jsonwebtoken"

export const generatetoken=async(req,res)=>{
    const user=req.user;
    const token= jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn :"3d"});
    return res.status(200).json({token, message:"success"})
}

export const verify=async(req,res)=>{
    const token=req.token;
    const ok=jwt.verify( token,process.env.JWT_SECRET)
    if(!ok){
        return res.status(400).json({message:"Nah!!"})
    }
    return res.status(200).json({ message:"success"})
}

