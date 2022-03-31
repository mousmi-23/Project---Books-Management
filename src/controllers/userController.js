const UserModel = require('../models/userModel')
const validate = require('validator')
const jwt=require ('jsonwebtoken')

const isValid = function (value) {
    if (typeof (value) == "undefined" || typeof (value) == "null") { return false }
    if (typeof (value) == "string" && value.trim().length == 0) { return false }
    if (typeof (value) == "string" && value.trim().length > 1) { return true }
    return true
}

const createUser = async function (req, res) {
    try {
         const data = req.body
         if(Object.keys(data)==0){return res.status(400).send('data  is missing')}

        let { name,password} = data
     
        const req0 = isValid(data.title)
        if (!req0) {
            return res.status(400).send("title is required")
        }
        const title=data.title.trim()

        // title shoulb be  enum
        const isValidTitle = function (title) {
            return ["Mr", "Mrs", "Miss"].indexOf(title) !== -1
        }

        if (!isValidTitle(title)) {
            return res.status(400).send({ status: false, message: `${title} title is not valid` })
        }
        // name is requires

        const req1 = isValid(name)
        if (!req1) {
            return res.status(400).send("name is required")
        }
      // phone is required
         
        const req2 = isValid(data.phone)
        if (!req2) {
            return res.status(400).send("phone is required")
        }
        const phone=data.phone.trim()
       
        //phone is already used
        const phoneIsAlreadyUsed = await UserModel.findOne({ phone: phone })
        if (phoneIsAlreadyUsed) {
            return res.status(400).send("phone is already exist")
        }

        //  phone must be valid
        if (!(/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/.test(phone))) {
            return res.status(400).send("phone is invalid")
        }

        // email is required
        const req3 = isValid(data.email)
        if (!req3) {
            return res.status(400).send("email is required")
        }

        const email=data.email.trim()

        // if (!validate.isEmail(email)) {
        //     return res.status(400).send({ status: false, msg: "Invalid Email" })
        // }

        //email is valid
        const emailIsAlreadyUsed = await UserModel.findOne({ email: email })
        if (emailIsAlreadyUsed) {
            return res.status(400).send("email is already exist")
        }

        //email is invalid
        if (!(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email))) {
            return res.status(400).send("email is invalid")
        }

      // password is required
        const req4 = isValid(password)
        if (!req4) {
            return res.status(400).send("password is required")
        }

    //password should be between 8 to 15
        if (password.trim().length < 8 || password.trim().length > 15) {
            return res.status(400).send("password should be between 8 to 15")
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
        { return  res.status(400).send("pincode is invalid")}


    


        const createData = await UserModel.create(data)
        res.status(201).send({ status: true, data: createData })
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }

}



const loginUser=async function(req,res){
    try{
    const data=req.body
    if(Object.keys(data)==0){return res.status(400).send('data  is missing')}
   
    const {email, password } = data


//email is required
    const req3 = isValid(email)
    if (!req3) {
        return res.status(400).send("email is required")
    }

    //password is required
    const req4 = isValid(password)
    if (!req4) {
        return res.status(400).send("password is required")
    }

    // email is not registered
      const findEmail= await UserModel.findOne({email:email})
      if(!findEmail){ return res.status(400).send("email is not registered")}

     // password is invalid
      const findPassword= await UserModel.findOne({password:password})
      if(!findPassword){ return res.status(400).send("Password is invalid")}


if(findEmail && findPassword)
{
    // creating token
    const  token =  jwt.sign({
        userId:findEmail._id,
        iat:Math.floor(Date.now() /1000),
        exp:Math.floor(Date.now() /1000)+ 60*30
     },'Book-Management')
     res.header('x-api-key',token)
     return res.status(200).send({ status: true, message: 'User login successfully', token: token })
}
}
catch (err) {
    //return res.status(401).send({error: "jwt expired"})
    res.status(500).send({ error: err.message })
}
}

module.exports.loginUser = loginUser

module.exports.createUser = createUser



// const UserModel = require('../models/userModel')
// const jwt = require('jsonwebtoken')
// const validate = require('validator');
// //const { request } = require('express');

// const isValid = (value) => {

//     if (typeof (value) === 'undefined' || typeof (value) === 'null') {
//         return false;
//     }
//     if (typeof (value) === "string" && value.trim().length === 0) {
//         return false;
//     }
//     return true
// }


// const isValidTitle = (title) => {
//     return ['Mr', 'Mrs', 'Miss'].indexOf(title) !== -1
// }

// // const isValidEmail = (email) => {
// //     if (validate.isEmail(email)) {
// //         return true
// //     }
// // }


// const isValidRequestBody = (requestBody) => {
//     return Object.keys(requestBody).length > 0
// }

// const createUser = async function (req, res) {
//     try {
// //have to validate params
//         let requestBody = req.body;
//         if (!isValidRequestBody(requestBody)) {
//             return res.status(400).send({ status: false, message: "Invalid request Parameters. Please provide User Details" })
//         }

//         // Extracting Parameters

//         let { title, name, phone, email, password, address } = requestBody;

//         // Validating....

//         if (!isValid(title)) {
//             return res.status(400).send({ status: false, message: "Title is required" })
            
//         }

//         if (!isValidTitle(title)) {
//            return res.status(400).send({ status: false, message: "Title Should Be Among Mr , Mrs , Miss" })
            
//         }

//         if (!isValid(name)) {
//            return res.status(400).send({ status: false, message: "User Name is required" })
            
//         }//name must have a string

//         if (!isValid(phone)) {
//            return res.status(400).send({ status: false, message: "User phone number is required" })
            
//         }

//         if (!isValid(email)) {
//            return res.status(400).send({ status: false, message: "User email is required" })
            
//         }

//         if (!validate.isEmail(email)) {
//            return res.status(400).send({ status: false, msg: "Invalid Email" })
//         }

//         if (!isValid(password)) {
//            return res.status(400).send({ status: false, message: "User password is required" })
            
//         }// 10 digit number and character

//         if (password.trim().length <= 8 || password.trim().length >= 15) {
//            return res.status(400).send({ status: false, message: "password should be 8 to 15 characters" })
            
//         }

//         // if(!isValidRequestBody(address))
//         //   return res.status(400).send({ status : false, msg : "address" })

//         if (!isValid(address)) {
//            return res.status(400).send({ status: false, message: "User address is required" })
            
//         }

//         if(!isValid(address.street))
//         return res.status(400).send({ status : false, msg : "street is required" })
 
        
//         if(!isValid(address.city))
//         return res.status(400).send({ status : false, msg : "city is required" })

        
//         if(!isValid(address.pincode))
//         return res.status(400).send({ status : false, msg : "pincode is required" })
        

//         const isPhoneAlreadyUsed = await UserModel.findOne({ phone });

//         if (isPhoneAlreadyUsed) {
//             return res.status(400).send({ status: false, message: `${phone} is Already Registered` })
            
//         }

//         const isEmailAlreadyUsed = await UserModel.findOne({ email });

//         if (isEmailAlreadyUsed) {
//             return res.status(400).send({ status: false, message: `${email} is Already Registered` })
            
//         }//trim


//         const userData = await UserModel.create( requestBody );
//         return res.status(201).send({ status: true, message: 'User Created Successfully', user: userData })
        

//     } catch (err) {
//         //if(SyntaxError == true)
//         //res.send()
//         return res.status(500).send({ status: false, message: err.message })
        
//     }
// }




// ////   login_Part   ////
// const loginUser = async function (req, res) {
//     try {

//         const requestBody = req.body;

//         if (!isValidRequestBody(requestBody)) {
//             return res.status(400).send({ status: false, message: "Invalid request parameters . Please Provide login Details" })
//         }

//         const { email, password } = requestBody

//         if (!isValid(email)) {
//             return res.status(400).send({ status: false, message: "Email is required" })//space
            
//         }

//         if (!validate.isEmail(email)) {
//             return res.status(400).send({ status: false, message: "Invalid email" })
//         }

//         if (!isValid(password)) {
//             return res.status(400).send({ status: false, message: "Password is required" })//length 
//         }

//         let user = await UserModel.findOne({ email, password });

//         if (!user)
//             return res.status(404).send({ status: false, message: "User Not Found , plz check Credentials", });

// //16675845623/1000=16675845.623(Math.floor use)=16675845
//         const token = jwt.sign({
//             userId : user._id.toString(),
//             iat: Math.floor(Date.now() / 1000),
//             exp: Math.floor(Date.now() / 1000) + (30 * 60)
//         }, 'Book-Management')

//         res.setHeader('x-api-key', token)
//         res.status(200).send({ status: true, message: `User login successfully`, data: { token } })

//     } catch (error) {
//         if(error.message == error.message)
//         return res.status(402).send({status : false, message : "Token is expired"  })
//         return res.status(500).send({ status: false, message: error.message })
        
//     }

// };


// module.exports.createUser = createUser;

// module.exports.loginUser = loginUser








// // const loginUser = async function(req,res) {
// //     try {

// //     const {email, password } = data

// //     const req3 = isValid(email)
// //     if (!req3) {
// //         return res.status(400).send("email is required")
// //     }

// //     const req4 = isValid(password)
// //     if (!req4) {
// //         return res.status(400).send("password is required")
// //     }

// //       const findEmail= await UserModel.find({email:email})
// //       if(!findEmail){ return res.status(400).send("email is not registered")}


// //       const findPassword= await UserModel.find({password:password})
// //       if(!findPassword){ return res.status(400).send("Password is invalid")}


// // if(findEmail && findPassword)
// // {

// //     const  token =  jwt.sign({
// //         userId:findEmail._id,
// //         iat:Math.floor(Date.now() /1000),
// //         exp:Math.floor(Date.now() /1000)+ 10*60*60
// //      },'Book-Management')
// //      res.header('x-api-key',token)
// //      return res.status(200).send({ status: true, message: 'User login successfully', token: token })
// // }}
// // catch(err) {
// // res.status(500).send({ status : false , message : err.message})
// // return
// // }}




// // const UserModel = require("../models/userModel")
// // const jwt = require("jsonwebtoken")


// // const isValidRequestBody = function (requestBody) {
// //     return Object.keys(requestBody).length > 0
// // }


// // const isValidTitle = function (title) {
// //     return ['Mr', 'Mrs', 'Miss'].includes(title)
// //     //return ['Mr' , 'Mrs' , 'Miss'].indexOf(title)!==-1
// // }


// // const isValidRequestValue = function (isValidRequestValue) {
// //     if (typeof isValidRequestValue === 'undefined' || isValidRequestValue === null) return false
// //     if (typeof isValidRequestValue === 'string' && isValidRequestValue.trim().length === 0) return false
// //     return true
// // }


// // const isValidRequestValueAdd = function (isValidRequestValue) {
// //     //    if (typeof isValidRequestValue === 'undefined' || isValidRequestValue === null) return false
// //     if (typeof isValidRequestValue === 'string' && isValidRequestValue.trim().length === 0) return false
// //     return true
// // }


// // const isString = function (isString) {
// //     if (typeof isString !== 'string') return false
// //     return true
// // }


// // const isPhoneRange = function (isPhoneRange) {
// //     if (isPhoneRange < 1000000000 || isPhoneRange > 9999999999) return false
// //     return true
// // }   // here accept more than 10 number but number must be a character


// // let validateEmail = function (email) {
// //     let regexForEmail = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/
// //     return regexForEmail.test(email)
// // };


// // let validatePhone = function (phone) {
// //     let regexForPhone = /^((\\+[1-9]{1,4}[ \\-])|(\\([0-9]{2,3}\\)[ \\-])|([0-9]{2,4})[ \\-])?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
// //     return regexForPhone.test(phone)
// // }


// // const validatePassword = function (password) {
// //     if ((password.trim().length >= 8 && password.trim().length <= 15)) return false
// //     return true
// // } // not consider space at starting and last & not accept more than 15 or less than 8


// // const isValidPin = function (pincode) {
// //     let count = 0
// //     let pincode1 = pincode.trim()
// //     for (let i = 0; i < pincode1.length; i++)
// //         if (pincode1[i] >= 0 && pincode1[i] <= 9) count++
// //     if (count == pincode1.length) return true
// //     return false
// // }

// // const createUser = async function (req, res) {
// //     try {
// //         if (isValidRequestBody(req.query)) return res.status(400).send({ status: false, msg: "You can not pass query" })


// //         let requestBody = req.body
// //         if (!isValidRequestBody(requestBody)) return res.status(400).send({ status: false, msg: "please provide user details in request body" })


// //         const { title, name, phone, email, password, address } = requestBody


// //         if (!isValidRequestValue(title)) return res.status(400).send({ status: false, msg: "please provide 'title' of user" })
// //         if (!isString(title)) return res.status(400).send({ status: false, msg: "please provide title in 'string' case only" })
// //         if (!isValidTitle(title)) return res.status(400).send({ status: false, msg: "please provide valid title [ Mr , Mrs , Miss ]" })


// //         if (!isValidRequestValue(name)) return res.status(400).send({ status: false, msg: "please provide user 'name' " })
// //         if (!isString(name)) return res.status(400).send({ status: false, msg: "please provide user name in 'string' case only" })


// //         if (!isValidRequestValue(phone)) return res.status(400).send({ status: false, msg: "please provide 'phone' no." })
// //         if (!isString(phone)) return res.status(400).send({ status: false, msg: "please provide your phone number in 'string' case" })
// //         if (!isPhoneRange(phone)) return res.status(400).send({ status: false, msg: "your 'phone' No. should be 10 digit " })
// //         if (!validatePhone(phone)) return res.status(400).send({ status: false, msg: `Your 'phone' No. '${phone}' is invalid` })  // dual inverted comma change the format
// //         let alreadyPhoneUse = await UserModel.find({ phone: phone })
// //         if (alreadyPhoneUse.length > 0) return res.status(400).send({ status: false, msg: `Your 'phone' No. '${phone}' is already use` })


// //         if (!isValidRequestValue(email)) return res.status(400).send({ status: false, msg: "please provide 'email' address" })
// //         if (!isString(email)) return res.status(400).send({ status: false, msg: "please provide your email in 'string' case" }) // no need to test
// //         if (!validateEmail(email)) return res.status(400).send({ status: false, msg: `your email '${email}' is invalid` })
// //         let alreadyEmailUse = await UserModel.find({ email: email })
// //         if (alreadyEmailUse.length > 0) return res.status(400).send({ status: false, msg: `Your email address '${email}' is already use` })


// //         if (!isValidRequestValue(password)) return res.status(400).send({ status: false, msg: "please provide 'password' " })
// //         if (!isString(password)) return res.status(400).send({ status: false, msg: "please provide your password in 'string' case" })
// //         if (validatePassword(password)) return res.status(400).send({ status: false, msg: "your password must be more than 8 character or less than 15 character. It is not consider space at starting and last but consider between two character " })

// //         let check = {}
// //         // if(!isValidRequestValue(address)) return res.status(400).send({ status: false, msg: "please provide user 'address' " })
// //         if (typeof check == typeof address) {
// //             if (Array.isArray(address) == true) return res.status(400).send({ status: false, msg: "please provide 'address' in object form with 'street' , 'city' and 'pincode' key value" })
// //             if (Object.keys(address).length <= 0) return res.status(400).send({ status: false, msg: "You can not pass empty object in 'address' please fill with 'street' , 'city' and 'pincode' key value" })
// //             const { street, city, pincode } = address
// //             // if (!isValidRequestValue(street)) return res.status(400).send({ status: false, msg: "please provide 'street' under 'address' " })
// //             if (!isValidRequestValueAdd(street)) return res.status(400).send({ status: false, msg: "you can not pass empty 'street' under 'address' " })
// //             if (!isString(street)) return res.status(400).send({ status: false, msg: "please provide your street in 'string' case" })
// //             // if (!isValidRequestValue(city)) return res.status(400).send({ status: false, msg: "please provide 'city' under 'address' " })
// //             if (!isValidRequestValueAdd(city)) return res.status(400).send({ status: false, msg: "you can not pass empty 'city' under 'address' " })
// //             if (!isString(city)) return res.status(400).send({ status: false, msg: "please provide your city in 'string' case" })
// //             // if (!isValidRequestValue(pincode)) return res.status(400).send({ status: false, msg: "please provide 'pincode' under 'address' " })
// //             if (!isValidRequestValueAdd(pincode)) return res.status(400).send({ status: false, msg: "you can not pass empty 'pincode' under 'address' " })
// //             if (!isString(pincode)) return res.status(400).send({ status: false, msg: "please provide your pincode in 'string' case" })
// //             if (!isValidPin(pincode)) return res.status(400).send({ status: false, msg: "enter pincode only 'number' in 'string' form" })
// //             if (Object.keys(address).length > 3) return res.status(400).send({ status: false, msg: "You can pass only three key under 'aaddress' " })
// //             if (Object.keys(requestBody).length > 6) return res.status(400).send({ status: false, msg: "You can pass only six key under 'request body' " })


// //             let userData = await UserModel.create(requestBody)
// //             return res.status(201).send({ status: true, msg: userData })


// //         } else return res.status(400).send({ status: false, msg: "please provide 'address' in object form with 'street' , 'city' and 'pincode' key value" })


// //     } catch (error) {
// //         return res.status(500).send({ status: false, msg: error.message })
// //     }
// // }