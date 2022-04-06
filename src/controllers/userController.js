const UserModel = require('../models/userModel')
const jwt=require ('jsonwebtoken')

const isValid = function (value) {
    if (typeof (value) == "undefined" || typeof (value) == "null") { 
        return false 
    }
    if (typeof (value) == "string" && value.trim().length == 0) { 
        return false 
    }
    return true
}

const createUser = async function (req, res) {
    try {
         const data = req.body
         if(Object.keys(data) == 0) { return res.status(400).send({status : false, message : 'data  is missing'})}

        let { name,password} = data
     
        const req0 = isValid(data.title)
        if (!req0) {
            return res.status(400).send({status : false, message : "title is required"})
        }

        const title=data.title.trim()

       // title shoulb be in enum
        const isValidTitle = function (title) {
            return ["Mr", "Mrs", "Miss"].indexOf(title) !== -1
        }

        if (!isValidTitle(title)) {
            return res.status(400).send({ status: false, message: `${title} title is not valid` })
        }

        // name is requires
        const req1 = isValid(name)
        if (!req1) {
            return res.status(400).send({status : false, message : "name is required"})
        }
        
        // phone is required
        const req2 = isValid(data.phone)
        if (!req2) {
            return res.status(400).send({status : false, message : "phone is required"})
        }
        const phone=data.phone.trim()
       
        //phone is already used
        const phoneIsAlreadyUsed = await UserModel.findOne({ phone: phone })
        if (phoneIsAlreadyUsed) {
            return res.status(400).send({status : false, message : "phone is already exist"})
        }

        //  phone must be valid
        if (!(/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/.test(phone))) {
            return res.status(400).send({status : false, message : "phone is invalid"})
        }

        // email is required
        const req3 = isValid(data.email)
        if (!req3) {
            return res.status(400).send({status : false, message : "email is required"})
        }
        const email=data.email.trim()

        //email is valid
        const emailIsAlreadyUsed = await UserModel.findOne({ email: email })
        if (emailIsAlreadyUsed) {
            return res.status(400).send({status : false, message : "email is already exist"})
        }

        //email is invalid
        if (!(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email))) {
            return res.status(400).send({status : false, message : "email is invalid"})
        }

        // password is required
        const req4 = isValid(password)
        if (!req4) {
            return res.status(400).send({status : false, message : "password is required"})
        }

        //password should be between 8 to 15
        if (password.trim().length < 8 || password.trim().length > 15) {
            return res.status(400).send({status : false, message : "password should be between 8 to 15"})
        }

        if (!isValid(data.address)) {
            res.status(400).send({ status: false, message: "User address is required" })
            return
        }

        if(!isValid(data.address.street))
        return res.status(400).send({ status : false, msg : "street is required" })
 
        
        if(!isValid(data.address.city))
        return res.status(400).send({ status : false, msg : "city is required" })

        
        if(!isValid(data.address.pincode))
        return res.status(400).send({ status : false, msg : "pincode is required" })
        const pincode =req.body.address.pincode.trim()

        if(!(/^[1-9][0-9]{5}$/.test(pincode)))
        { return  res.status(400).send({status : false, message : "pincode is invalid"})}


        const createData = await UserModel.create(data)
        res.status(201).send({ status: true, data: createData })
    }
    catch (err) {
        res.status(500).send({ status : false, error: err.message })
    }

}



const loginUser=async function(req,res){
    try{
    const data=req.body
    if(Object.keys(data)==0){return res.status(400).send({status : false, message : 'data  is missing'})}
   
    const {email, password } = data

    //email is required
    const req3 = isValid(email)
    if (!req3) {
        return res.status(400).send({status : false, message : "email is required"})
    }

    //password is required
    const req4 = isValid(password)
    if (!req4) {
        return res.status(400).send({status : false, message : "password is required"})
    }

    // email is not registered
      const findEmail= await UserModel.findOne({email:email})
      if(!findEmail){ return res.status(400).send({status : false, message : "email is not registered"})}

     // password is invalid
      const findPassword= await UserModel.findOne({password:password})
      if(!findPassword){ return res.status(400).send({status : false, message : "Password is invalid"})}


      if(findEmail && findPassword)
{
    // creating token
    const  token =  jwt.sign({
        userId : findEmail._id,
        iat:Math.floor(Date.now() /1000),
        exp:Math.floor(Date.now() /1000)+ 30*60
     },'Book-Management')

     res.header('x-api-key',token)
     return res.status(200).send({ status: true, message: 'User login successfully', token: token })
    }
}
catch (err) {
    //return res.status(401).send({error: "jwt expired"})
    res.status(500).send({status : false, error: err.message })
}
}

module.exports.loginUser = loginUser
module.exports.createUser = createUser