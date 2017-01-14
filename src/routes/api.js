var express = require('express'); //importing express modulue
var router = express.Router();  //creating router object
var User = require('../models/user');  
var passport = require('../utilities/passport');
var jwt = require('jsonwebtoken'); 
var config = require('../utilities/config');

router.route('/register')
.post(function(req, res) {  
  if(!req.body.email || !req.body.password) {
    res.json({ success: false, message: 'Please enter email and password.' });
  } else {
    var newUser = new User({
      email: req.body.email,
      password: req.body.password,
      name:req.body.name,
      address:req.body.address,
      phone:req.body.phone
    });

    // Attempt to save the user
    newUser.save(function(err) {
      if (err) {
        return res.json({ success: false, message: 'That email address already exists.'});
      }
      res.json({ success: true, message: 'Successfully created new user.' });
    });
  }
});

router.route('/login')
.post( function(req, res) {  

 User.findOne({  email: req.body.email }, function (err, user) {
      if (err) { throw err; }
      else{
        if (!user) {  res.send({ success: false, message: 'Authentication failed. User not found.' }); }
      else{
        if (user.password !== req.body.password) { 
          res.send({ success: false, message: 'Authentication failed. Passwords did not match.' });
      }else{
      var payload = {id: user._id};
       var token = jwt.sign(payload, config.secret,{
            expiresIn: 10080 // in seconds
          });
          res.json({ success: true, token: 'JWT ' + token });
      } }} });

});

module.exports = router;