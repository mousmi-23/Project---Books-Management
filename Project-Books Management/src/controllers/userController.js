const UserModel = require("../models/userModel")
const jwt = require("jsonwebtoken")
const { count } = require("../models/userModel")


const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}


const isValidTitle = function (title) {
    return ['Mr', 'Mrs', 'Miss'].includes(title)
    //return ['Mr' , 'Mrs' , 'Miss'].indexOf(title)!==-1
}


const isValidRequestValue = function (isValidRequestValue) {
    if (typeof isValidRequestValue === 'undefined' || isValidRequestValue === null) return false
    if (typeof isValidRequestValue === 'string' && isValidRequestValue.trim().length === 0) return false
    return true
}


const isString = function (isString) {
    if (typeof isString !== 'string') return false
    return true
}


const isPhoneRange = function (isPhoneRange) {
    if (isPhoneRange < 1000000000 || isPhoneRange > 9999999999) return false
    return true
}   // here accept more than 10 number but number must be a character form
// also not pass starting 0


let validatePhone = function (phone) {
    let regexForPhone = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
    return regexForPhone.test(phone)
} // can not validate with space have to use trim function


let validateEmail = function (email) {
    let regexForEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return regexForEmail.test(email)
};// if string not run test function & not consider space


const validatePassword = function (password) {
    if ((password.trim().length >= 8 && password.trim().length <= 15)) return false
    return true
} // not consider space at starting and last but accept in mid & not accept more than 15 or less than 8


const isValidPin = function (pincode) {
    let count = 0
    for (let i = 0; i < pincode.length; i++)
        if (pincode[i] >= 0 && pincode[i] <= 9) count++
    if (count == pincode.length) return true
    return false
} // have to pass only number from 0 to 9


const isValidRequestValueAdd = function (isValidRequestValue) {
    if (typeof isValidRequestValue === 'string' && isValidRequestValue.trim().length === 0) return false
    return true
} // not consider "" & not medatory


const isStrictString = function (value) {
    let a = value.replaceAll(" ", "")
    let count = 0
    for (let i = 0; i < a.length; i++) {
        if ((a[i] >= "A" && a[i] <= "Z") || (a[i] >= "a" && a[i] <= "z")) count++
    }
    if (count == a.length) return true
    return false
}





// create user
const createUser = async function (req, res) {
    try {
        if (isValidRequestBody(req.query)) return res.status(400).send({ status: false, msg: "You can not pass query" })


        let requestBody = req.body
        if (!isValidRequestBody(requestBody)) return res.status(400).send({ status: false, msg: "please provide user details in request body" })


        let { title, name, phone, email, password, address } = requestBody


        // you can not pass like "" but you can pass mix data
        title = title.replaceAll(" ", "")
        if (!isValidRequestValue(title)) return res.status(400).send({ status: false, msg: "please provide 'title' of user" })
        if (!isString(title)) return res.status(400).send({ status: false, msg: "please provide title in 'string' case only" })
        if (!isValidTitle(title)) return res.status(400).send({ status: false, msg: "please provide valid title [ Mr , Mrs , Miss ]" })
        requestBody.title = title

        // you can not pass like "" & mix data
        if (!isValidRequestValue(name)) return res.status(400).send({ status: false, msg: "please provide user 'name' " })
        if (!isString(name)) return res.status(400).send({ status: false, msg: "please provide user name in 'string' case only" })
        if (!isStrictString(name)) return res.status(400).send({ status: false, msg: "you have to pass only Alphabet character in your name" })


        // you can not pass like "" & mix data
        phone = phone.replaceAll(" ", "")
        if (!isValidRequestValue(phone)) return res.status(400).send({ status: false, msg: "please provide 'phone' no." })
        if (!isString(phone)) return res.status(400).send({ status: false, msg: "please provide your phone number in 'string' case" })
        if (!isPhoneRange(phone)) return res.status(400).send({ status: false, msg: "your 'phone' No. should be 10 digit " })
        if (!validatePhone(phone)) return res.status(400).send({ status: false, msg: `Your 'phone' No. '${phone}' is invalid` })  // dual inverted comma change the format
        let alreadyPhoneUse = await UserModel.find({ phone: phone })
        if (alreadyPhoneUse.length > 0) return res.status(400).send({ status: false, msg: `Your 'phone' No. '${phone}' is already use` })
        requestBody.phone = phone

        // you can not pass like "" but you can pass mix data & also consider capital and small as same
        email = email.replaceAll(" ", "")
        if (!isValidRequestValue(email)) return res.status(400).send({ status: false, msg: "please provide 'email' address" })
        if (!isString(email)) return res.status(400).send({ status: false, msg: "please provide your email in 'string' case" }) // no need to test
        if (!validateEmail(email)) return res.status(400).send({ status: false, msg: `your email '${email}' is invalid` })
        let alreadyEmailUse = await UserModel.find({ email: email })
        if (alreadyEmailUse.length > 0) return res.status(400).send({ status: false, msg: `Your email address '${email}' is already use` })
        requestBody.email = email

        // you can not pass like "" but you can pass mix data
        password = password.replaceAll(" ", "")
        if (!isValidRequestValue(password)) return res.status(400).send({ status: false, msg: "please provide 'password' " })
        if (!isString(password)) return res.status(400).send({ status: false, msg: "please provide your password in 'string' case" })
        if (validatePassword(password)) return res.status(400).send({ status: false, msg: "your password must be more than 8 character or less than 15 character. It is not consider space at starting and last also not consider space between two character " })
        requestBody.password = password

        let check = {}
        // if(!isValidRequestValue(address)) return res.status(400).send({ status: false, msg: "please provide user 'address' " })
        if (typeof check == typeof address) {


            if (Array.isArray(address) == true) return res.status(400).send({ status: false, msg: "please provide 'address' in object form with 'street' , 'city' and 'pincode' key value" })
            if (Object.keys(address).length <= 0) return res.status(400).send({ status: false, msg: "You can not pass empty object in 'address' please fill with 'street' , 'city' and 'pincode' key value" })


            let { street, city, pincode } = address


            // you can not pass like "" but you can pass mix data
            // if (!isValidRequestValue(street)) return res.status(400).send({ status: false, msg: "please provide 'street' under 'address' " })
            street = street.replaceAll(" ", "")
            if (!isValidRequestValueAdd(street)) return res.status(400).send({ status: false, msg: "you can not pass empty 'street' under 'address' " })
            if (!isString(street)) return res.status(400).send({ status: false, msg: "please provide your street in 'string' case" })
            address.street = street

            // you can not pass like "" & mix data
            // if (!isValidRequestValue(city)) return res.status(400).send({ status: false, msg: "please provide 'city' under 'address' " })
            city = city.replaceAll(" ", "")
            if (!isValidRequestValueAdd(city)) return res.status(400).send({ status: false, msg: "you can not pass empty 'city' under 'address' " })
            if (!isString(city)) return res.status(400).send({ status: false, msg: "please provide your city in 'string' case" })
            if (!isStrictString(city)) return res.status(400).send({ status: false, msg: "you have to pass only Alphabet character in your city name under address" })
            address.city = city

            pincode = pincode.replaceAll(" ", "")
            // you can not pass like "" but you can pass mix data
            // if (!isValidRequestValue(pincode)) return res.status(400).send({ status: false, msg: "please provide 'pincode' under 'address' " })
            if (!isValidRequestValueAdd(pincode)) return res.status(400).send({ status: false, msg: "you can not pass empty 'pincode' under 'address' " })
            if (!isString(pincode)) return res.status(400).send({ status: false, msg: "please provide your pincode in 'string' case" })
            if (!isValidPin(pincode)) return res.status(400).send({ status: false, msg: "enter pincode only 'number' in 'string' form" })
            if (pincode.length > 6) return res.status(400).send({ status: false, msg: "enter pincode only 6 digit" })
            address.pincode = pincode

            if (Object.keys(address).length > 3) return res.status(400).send({ status: false, msg: "You can pass only three key under 'aaddress' " })
            if (Object.keys(requestBody).length > 6) return res.status(400).send({ status: false, msg: "You can pass only six key under 'request body' " })


            let userData = await UserModel.create(requestBody)
            return res.status(201).send({ status: true, msg: userData })


        } else return res.status(400).send({ status: false, msg: "please provide 'address' in object form with 'street' , 'city' and 'pincode' key value" })


    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}





// user login
const loginUser = async function (req, res) {
    try {
        if (isValidRequestBody(req.query)) return res.status(400).send({ status: false, msg: "You can not pass query" })


        let requestBody = req.body
        if (!isValidRequestBody(requestBody)) return res.status(400).send({ status: false, msg: "please provide user login details in request body" })


        let { email, password } = requestBody


        password = password.replaceAll(" ", "")
        if (!isValidRequestValue(password)) return res.status(400).send({ status: false, msg: "please provide 'password' " })
        if (!isString(password)) return res.status(400).send({ status: false, msg: "please provide your password in 'string' case" })
        if (validatePassword(password)) return res.status(400).send({ status: false, msg: "your password must be more than 8 character or less than 15 character. It is not consider space at starting and last but consider between two character " })


        // you can not pass like "" but you can pass mix data & also consider capital and small as same
        email = email.replaceAll(" ", "")
        if (!isValidRequestValue(email)) return res.status(400).send({ status: false, msg: "please provide 'email' address" })
        if (!isString(email)) return res.status(400).send({ status: false, msg: "please provide your email in 'string' case" }) // no need to test
        if (!validateEmail(email)) return res.status(400).send({ status: false, msg: `your email '${email}' is invalid` })


        //  let presentPassword = await UserModel.find({ password : password })
        //  if (presentPassword.length <= 0) return res.status(400).send({ status: false, msg: `Your password '${password}' is not present` })
        //  let presentEmail = await UserModel.find({ email: email })
        //  if (presentEmail.length <= 0) return res.status(400).send({ status: false, msg: `Your email address '${email}' is not present` })


        let user = await UserModel.find({ password: password, email: email })
        if (user.length <= 0) return res.status(400).send({ status: false, msg: `Your password '${password}' OR your email address '${email}' is not present` })


        // const token = await jwt.sign({
        //     userId:user[0]._id,
        //     iat: Math.floor(Date.now() / 1000),
        //     exp : Math.floor(Date.now() / 1000) + 10 * 60 * 60
        // },'Book-Management')


        var token = await jwt.sign({ userId: user[0]._id, name: "sonu verma" }, "Er. Sonu Verma", {
            // expiresIn: "10h" 
            expiresIn: "20d"
            // expiresIn: "120s" 
            // expiresIn: "30s" 
        }); // secreate key not in object mode , else all in opject mode (option & payload)


        console.log(jwt.verify(token, "Er. Sonu Verma"))
        
        res.setHeader('x-api-key', token)
        return res.status(200).send({ status: true, msg: `User login successfully`, token: token })


    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
};




module.exports.loginUser = loginUser
module.exports.createUser = createUser
