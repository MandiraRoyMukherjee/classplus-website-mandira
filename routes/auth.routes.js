const express = require('express');
const router = express.Router();
const {
    signup,
    signupAdmin,
    signin,
    signinAdmin,
    signout,
    signoutAdmin,
    getAllSignups,
    getStudentsById,
    modifyStudent,
    editTestsOfStudent
} = require('../controllers/auth.controllers');

// validators
const { runValidation } = require('../validators/index.validators');
const {
    userSignupValidator,
    userSigninValidator,
    adminSignupValidator
} = require('../validators/auth.validators');

router.post('/signup',userSignupValidator, runValidation, signup);
router.post('/signupAdmin', adminSignupValidator,runValidation,signupAdmin);
router.post('/signin', userSigninValidator, runValidation, signin);
router.post('/signinAdmin', userSigninValidator, runValidation, signinAdmin);
router.get('/signout', signout);
router.get('/signoutAdmin', signoutAdmin);
router.get('/getAllSignups', getAllSignups)
router.get('/getStudentsById/:id', getStudentsById)
router.post('/modifyStudent', modifyStudent)
router.put('/editTestsOfStudent/:id', editTestsOfStudent)



// const app = express();
// const bodyParser = require('body-parser');
// var urlencodedParser = bodyParser.urlencoded({ extended: false })

// app.get('/contact',function(req,res){
//     res.render('contact',{qs:req.query})
//     console.log('req---> ',req.body)
// })
// app.post('/contact',urlencodedParser,function(req,res){
//     console.log('req---> ',req.body)
// })
      /* GET login page. */ 
      router.get('/login', function(req, res, next) { 
        res.render('login', { title: 'Login Page', message:
         req.flash('loginMessage') }); 
     }); 
 /* GET Signup */ 
 router.get('/signup', function(req, res) { 
    res.render('signup', { title: 'Signup Page', 
       message:req.flash('signupMessage') }); 
}); 

module.exports = router;
