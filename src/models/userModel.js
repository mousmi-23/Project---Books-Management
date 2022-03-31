const mongoose=require('mongoose')
const userSchema= new mongoose.Schema({


    title: {
    type: String,
      trim:true,
     required:true,
     enum:["Mr", "Mrs", "Miss"]
    },
    name: {
        type:String, 
        required:true,
        trim:true
        },
    phone: {
        type:String,
        trim:true,
     match:[/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/],
        required:true,
         unique:true
    
        },
    email: {
        type:String,
        trim:true,
        required:true, 
        match:[/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/, 'Please fill a valid email address'],
     unique:true
    }, 
    password: {
       type: String,
       required:true,
       trim:true,
        minLen :8, 
        maxLen: 15
    },
    address: {
        street:{
            type:String,
            trim:true
        },
        city:{
            type: String ,
            trim:true
        },
        pincode:{
            type:String ,
            match:[/^[1-9][0-9]{5}$/],
            trim:true
      },
    }

},{timestamps:true})

module.exports=mongoose.model("user",userSchema)


// // { 
// //     title: {string, mandatory, enum[Mr, Mrs, Miss]},
// //     name: {string, mandatory},
// //     phone: {string, mandatory, unique},
// //     email: {string, mandatory, valid email, unique}, 
// //     password: {string, mandatory, minLen 8, maxLen 15},
// //     address: {
// //       street: {string},
// //       city: {string},
// //       pincode: {string}
// //     },
// //     createdAt: {timestamp},
// //     updatedAt: {timestamp}
// //   }

// const mongoose = require('mongoose')
// const validator = require('email-validator')

// const UserSchema = new mongoose.Schema({

//     title : {
//         type : String,
//         required : [true, "title is required"],
//         enum : ["Mr", "Mrs", "Miss"]
//     },

//     name : {
//         type : String,
//         required : [true, "first name is required"],
//         lowercase: true,
//         trim: true
//     },

//     phone : {
//         type : String,
//         required : [true, "phone no. is mandatory"],
//         unique : true,
//         trim : true
//     },

//     email : {
//         type : String,
//         required : [true, "email is required"],
//         unique : true,
//         lowercase : true,
//         trim : true,
       
//     },

//     password : {
//         type : String,
//         required : [true, "password is required"],
//         minlength :[8, "minimum length of password should be 8"],
//         maxlength : [15, "maximum length of password should be 15"]
//     },

//     address : {
//         street : {
//             type : String,
//             trim : true
//         },
//         city : {
//             type : String,
//             trim : true
//         },
//         pincode : {
//             type : String,
//             trim : true
//         }
//     },

// }, { timestamps : true });


// module.exports = mongoose.model('User', UserSchema)