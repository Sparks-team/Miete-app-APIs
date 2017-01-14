var router = require('express').Router();
var bookSchema = require('../models/model');
var userProductSchema = require('../models/userProduct')
var mongoose = require('mongoose');
var fs = require("fs");
var shortid = require('shortid');
var passport = require('passport');

router.route('/')
     .post(passport.authenticate('jwt', { session: false }),function(req,res){

         var uniqueRefno =  shortid.generate(); 
         console.log(uniqueRefno);
fs.writeFile("public/images/uploads/"+uniqueRefno+".jpg", new Buffer(req.body.photo, 'base64')  , function(err,done) {
     if(err)
     {
        
          console.log("Error in creating file " + JSON.stringify(err));
          res.send("Operation Failed");
     }
      
     else
     {
          console.log("File created "); 
                 var newBook = new bookSchema();
                 newBook.name = req.body.name;
                 newBook.uniqueId=uniqueRefno;
                 newBook.rentAmo=req.body.Rentamo;
                 newBook.rentDuo=req.body.Rentduo;
                 newBook.contactno=req.body.Contactno;
                 newBook.category=req.body.Category;
                 newBook.gender=req.body.Gender;
                 newBook.advmoney=req.body.Advmoney;
                 newBook.location=req.body.Location;
                 newBook.imgpath = "/images/uploads/"+uniqueRefno+".jpg";
                 newBook.save(function (err, result) {
                  if (err) {
                             console.log("Error in insert " + JSON.stringify(err));
                             res.send("Insertion Failed");
                          } else {
                          console.log("Insert Successful " + JSON.stringify(result));
                          console.log(" user "+req.user);
                          var newProduct = new userProductSchema();
                          newProduct.userid= req.user._id;
                          newProduct.refno=uniqueRefno;
                          newProduct.save(function(err,result){
                              if(err)
                              {
                                console.log("Error in second insert " + JSON.stringify(err));
                                res.send("User Insertion Failed");
                            }
                            else{
                                console.log("Second Insert Successful " + JSON.stringify(result));
                                res.send("Your Rental ad is successfully uploaded");  
                            }
                                    
                          });
                        
                              }
     });                                    
     }
      
 });
            


});




 module.exports = router;   