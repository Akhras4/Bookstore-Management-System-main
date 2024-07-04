
const { model, Error } = require('mongoose');
const users = require("../models/user");
const userinfo = require("../models/userinfo");


/**
 * The function `account` retrieves user account information and renders it on a webpage, including
 * user details, user info, and associated books.
 * @param req - The `req` parameter in the `account` function represents the request object, which
 * contains information about the HTTP request that was made. This object includes properties such as
 * `method`, `params`, and other request details. In this code snippet, the function is checking if the
 * request method is a GET
 * @param res - The `res` parameter in the `account` function is the response object that is used to
 * send a response back to the client making the request. It is typically used to send data, status
 * codes, and render views in response to client requests.
 */
const account=(req,res)=>{
    if ( req.method === "GET" ){
        const userid = req.params.id;
       users.findOne({_id:userid})
            .populate('books')
            .exec()
             .then(user=>{
                userinfo.findOne({user_id:userid})
                .then(userinfo=>{
                    if(!userinfo){
                       return res.status(200).render("account", {
                        userid,
                        username:user.UserName,
                        email:user.email,
                        phoneNumber:user.phoneNumber,
                        aboutyou:null,image:null,
                        books: user.books || null} ) 
                    }
                    res.status(200).render("account",
                     {userid,
                        username:user.UserName,
                        email:user.email,
                        phoneNumber:user.phoneNumber,
                        aboutyou:userinfo.aboutyou,
                        image:userinfo.image,
                        books: user.books || null

                    } )

                }).catch((err)=>{
                      res.status(200).render("account", {userid,username:user.UserName,email:user.email,phoneNumber:user.phoneNumber} )
                })
         }).catch(err=>{res.status(400).render("index", {userid} )})
    }  

/* This part of the code snippet is handling the logic for updating user information when a POST
request is made to the `/user/:id/account` endpoint. Here's a breakdown of what the code is doing: */
if ( req.method == "POST" ){
        userid=req.params.id
        console.log(req.params)
        const  {about}=req.body
        console.log(req.body)
        users.findOne({_id:userid})
        .then(user=>{
            userinfo.findOneAndUpdate({ user_id: userid }, 
                                     { aboutyou: about },
                                     { upsert: true, new: true } )
                    .then(userinfo=>{
                         res.status(200).redirect(`/user/${userid}/account` )
                    }).catch(err=>{res.status(400).redirect(`/user/${userid}/account` )})
        }).catch(err=>{res.status(400).redirect(`/user/${userid}` )})
    }
}





module.exports = {
    account,    
}