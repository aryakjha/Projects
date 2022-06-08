const exp = require('express');

const userapp = exp.Router();
const bcryptjs = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()
userapp.use(exp.json())
const User = require("../Models/User")
const Favourite = require("../Models/Favourite")
const Comment=require("../Models/Comment")


const errorhandling = require("express-async-handler")
const verifytoken = require("./middleware/verifyToken")




  

// post userdata
userapp.post('/createuser',errorhandling(async (req, res) => {
  
   

   // grt user from client and convert to js object
    let userobjfromclient = req.body
    //search by user name
    let usercheck = await User.findOne({ email: userobjfromclient.email }).exec()

    if (usercheck != null) {
        res.send({ message: "already user exists in this email" })
    } else {
        
        let newuser = new User({ ...userobjfromclient })
        if (newuser.password == "") {
            res.send({ message: "password should not empty" })
        } else {
            let hashedpassword = await bcryptjs.hash(newuser.password, 5)
            newuser.password = hashedpassword
            let user = await newuser.save()
            res.status(201).send({ message: "user created", payload: user })
        }
    }
}))



 


// login by userdata
userapp.post('/login', errorhandling(async (req, res) => {
    let usercredobj = req.body
    let userfromdb = await User.findOne({ email: usercredobj.email }).exec()
    if (userfromdb == null) {
        res.send({ message: "Invalid user" })
    } 
    else {
        let status = await bcryptjs.compare(usercredobj.password, userfromdb.password)
        if (status == false) {
            res.send({ message: "invalid password" })
        } else {
            let signedtoken = jwt.sign({ name: userfromdb.name }, process.env.SECURITY_KEY, { expiresIn: 300 })
            res.status(200).send({ message: "login successfully", token: signedtoken, user: userfromdb })
        }
    }
}))

// // // get by username
// // userapp.get('/getuser/:username', errorhandling(async (req, res) => {
// //     usernamefromclient = req.params.username
// //     //if user is not find it return null
// //     let userfoundfromdb = await User.findOne({ username: usernamefromclient }).exec()

// //     //send response
// //     if (userfoundfromdb == false) {
// //         res.send({ message: "user is under deactivation" })
// //     } else {
// //         res.status(200).send({ message: "user data", payload: userfoundfromdb })
// //     }
// // }))

// // //get by id
// // userapp.get('/getuser/:id', errorhandling(async (req, res) => {

// // }))

// // //updsate 
// // userapp.put('/updateuser', errorhandling(async (req, res) => {
// //     let userobjfromclient = req.body
// //     await User.findOneAndUpdate({ username: userobjfromclient.username },
// //         { $set: { email: userobjfromclient.email, city: userobjfromclient.city } })
// //     res.status(200).send({ message: "user updated" })
// // }))

// // //delete
// // userapp.put('/deleteuser', errorhandling(async (req, res) => {
// //     let userobjfromclient = req.body
// //     await User.findOneAndUpdate({ username: userobjfromclient.username },
// //         { $set: { status: userobjfromclient.status } })
// //     res.status(200).send({ message: "user deactivate" })
// // }))

// // //activate user by username
// // userapp.put('/activateuser/:username', errorhandling(async (req, res) => {
// //     let usernamefromclient = req.params.username
// //     await User.findOneAndUpdate({ username: usernamefromclient },
// //         { $set: { status: true } })
// //     res.status(200).send({ message: "user activated" })
// // }))


// private routes
userapp.post("/favourite", errorhandling(async (req, res) => {
    
    let itemobjfromclient = req.body
  console.log(itemobjfromclient)


    let usercheck = await Favourite.findOne({ name: itemobjfromclient.name }).exec()

 
    if (usercheck == null) {
        let newcart = new Favourite({ ...itemobjfromclient })
            let favourites = await newcart.save()
            res.status(201).send({ message: "book added to favourite", payload: favourites })
        
    } else {

            usercheck.favourites.push(itemobjfromclient.favourites[0])
            let favourites = await usercheck.save()
            res.status(201).send({ message: "book added to favourite exists", payload: favourites })
        
    }
}))

// // userapp.get("/viewtasks/:username", verifytoken, errorhandling(async (req, res) => {
// //     //console.log(req.params.username)
// //     usernamefromclient = req.params.username
// //     //if user is not find it return null
// //     let userfoundfromdb = await Task.findOne({ username: usernamefromclient }).exec()

// //     //send response
// //     if (userfoundfromdb.tasks.length == 0) {
// //         res.send({ message: "no task found" })
// //     } else {
// //         res.status(200).send({ message: "task list", payload: userfoundfromdb })
// //     }
// //     //  res.send({message:"all task"})
// // }))

//edit task
userapp.put('/save-editedprofile', verifytoken, errorhandling(async (req, res) => {
    let editedobj = req.body
    let email=editedobj.email
    delete editedobj.username
//get user task obj
    let userprofileobj=await User.findOne({email:email})


    userprofileobj.name=editedobj.name
    userprofileobj.phoneno=editedobj.phoneno
    userprofileobj.location=editedobj.location

let profile=await userprofileobj.save()
    res.status(200).send({ message: "profile edited", payload:profile })
}))


userapp.get("/viewprofile/:email", verifytoken, errorhandling(async (req, res) => {
    //console.log(req.params.username)
    emailfromclient = req.params.email
    //if user is not find it return null
    let userfoundfromdb = await User.findOne({ email: emailfromclient }).exec()

    //send response
    if (userfoundfromdb == null) {
        res.send({ message: "no user data found" })
    } else {
        res.status(200).send({ message: "userdata", payload: userfoundfromdb })
    }
    //  res.send({message:"all task"})
}))

// // private routes
// userapp.post("/cart", errorhandling(async (req, res) => {
    
//     let itemobjfromclient = req.body
//   //  console.log(itemobjfromclient.cart[0].dishname)


//     let usercheck = await Cart.findOne({ email: itemobjfromclient.email }).exec()
//     //let dishfromdb=await Dish.findOne({ dishname : itemobjfromclient.cart[0].dishname })
//     //dishfromdb.quantity=dishfromdb.quantity-itemobjfromclient.cart[0].quantity
//   //  await dishfromdb.save()
//     if (usercheck == null) {
//         let newcart = new Cart({ ...itemobjfromclient })
//             let cart = await newcart.save()
//             res.status(201).send({ message: "item added to cart", payload: cart })
        
//     } else {

//             usercheck.cart.push(itemobjfromclient.cart[0])
//             let cart = await usercheck.save()
//             res.status(201).send({ message: "item added to exist", payload: cart })
        
//     }
// }))


//get cart dishes
userapp.get("/favourite/:name",errorhandling(async(req,res)=>{
    let name=req.params.name
 let datafromdb=await Favourite.findOne({name:name}).exec()

 res.send({message:"favourite books",payload:datafromdb})
}))


// // cart update

// userapp.put("/cartupdate/:email",errorhandling(async(req,res)=>{
//     let email=req.params.email
//     let editobj=req.body
//  let cartdatafromdb=await Cart.findOne({email:email}).exec()

//  let dishobjindex=cartdatafromdb.cart.findIndex(dishobj=>dishobj._id == editobj.id)

//  if(editobj.operation=="INC"){
//      cartdatafromdb.cart[dishobjindex].quantity+= (cartdatafromdb.cart[dishobjindex].quantity < 10 ? 1 : 0 )
//  }
//  else if(editobj.operation=="DEC"){
//     cartdatafromdb.cart[dishobjindex].quantity-= (cartdatafromdb.cart[dishobjindex].quantity > 1 ? 1 : 0 )
// }
// cartdatafromdb.save()
//  res.send({message:"Cart updated"})
// }))


// //remove from cart
// userapp.delete("/cartdelete/:id/:email",errorhandling(async(req,res)=>{
//     let id=req.params.id
//     let email=req.params.email
//     console.log(id,"email",email)
//     let cartdatafromdb=await Cart.findOne({email:email}).exec()
    
//  let dishobjindex=cartdatafromdb.cart.findIndex(dishobj=>dishobj._id == id)
 
//  cartdatafromdb.cart.splice(dishobjindex,1)
//     cartdatafromdb.save()
//     res.send({message:"dish removed from cart"})
// }))


// // total amount from cart
// userapp.get("/totalamount/:email",errorhandling(async(req,res)=>{
//     let totalamount=0
//     let email=req.params.email
//  let cartdatafromdb=await Cart.findOne({email:email}).exec()
// for(let obj of cartdatafromdb.cart)
// {
//     totalamount+=obj.price*obj.quantity
// }

//  res.send({message:"Total Amount",payload:totalamount})
// }))


// //payment at cart
// userapp.post("/takeaway",errorhandling(async(req,res)=>{
//     let takeawayobj=req.body


//     let newtakeaway = new Takeaway({ ...takeawayobj })
//     await newtakeaway.save()
//     res.send({message:"order details added"})

// }))


// //homedelivery
// userapp.post("/homedelivery",errorhandling(async(req,res)=>{
//     let homedeliveryobj=req.body
  
//     let newhomedelivery = new Homedelivery({ ...homedeliveryobj })
//     await newhomedelivery.save()
//     res.send({message:"order details added"})
    
// }))


// //get order status of user

// userapp.get("/homeorder/:email",errorhandling(async(req,res)=>{
// let email=req.params.email

// let homedeliveryfromdb=await Homedelivery.find({email:email})
// if(homedeliveryfromdb!=null){
//     res.send({message:"Home Delivery Orders",payload:homedeliveryfromdb})
// }else{
//     res.send({message:"no order found"})
// }

// }))


// //get order status of user

// userapp.get("/takeawayorder/:email",errorhandling(async(req,res)=>{
//     let email=req.params.email
    
//     let takeawayfromdb=await Takeaway.find({email:email})
    
//     if(takeawayfromdb!=null){
//         res.send({message:"Take Away Orders",payload:takeawayfromdb})
//     }else{
//         res.send({message:"no order found"})
//     }
//     }))

userapp.get('/getcomments/:title',errorhandling(async(req,res)=>{

    let title=req.params.title

   

    //get all food

    let favouriteFromDB=await Comment.findOne({title:title})

    //if food store is empty

    if(favouriteFromDB==null){

        res.send({message:"Currently No comments Available",payload:[]})

    }

    //if food is available

    else{

        //send res

        res.status(200).send({message:"Available Comments",payload:favouriteFromDB.comment})

    }

}))
    

userapp.post("/addcomments",errorhandling(async(req,res)=>{



    //get favObj sent from client

    let ObjFromClient=req.body

 

    //create userfavObj doc type

    let userFavouriteDoc=new Comment({...ObjFromClient})

 

    //find user fav Obj is already available or not

    let userFavouriteFromDB=await Comment.findOne({title:ObjFromClient.title})

    //if no user fav obj available, save userfavDoc in DB

    if(userFavouriteFromDB==null){

            let userfavourite=await userFavouriteDoc.save()

            res.status(201).send({message:"Comment added Successfully"})

 

    }

    //if user fav obj available, update user fav Obj with new fav in DB

    else{

            //adding new cart to existing user cart obj

            userFavouriteFromDB.comment.push(ObjFromClient.comment[0])

            //updating the updated user cart obj

            await userFavouriteFromDB.save()

            //send res

            res.status(200).send({message:"Added to Existing comment Successfully" })

    }

   

 }))


//error handling middleware(syntax error)
userapp.use((err, req, res, next) => {
    res.send({ message: err.message })
})

module.exports = userapp