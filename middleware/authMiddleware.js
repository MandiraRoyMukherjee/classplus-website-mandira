const jwt = require('jsonwebtoken');
const User = require('../models/user.models');

const requireAuthAdmin = (req, res, next) => {
  const tokenAdmin = req.cookies.tokenAdmin;
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
  res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
  res.setHeader("Expires", "0");

  // check json web token exists & is verified
  if (tokenAdmin) {
    jwt.verify(tokenAdmin, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect('/admin_login');
      } else {
        // console.log(decodedToken);
        req.decodedToken = decodedToken;
        next();
      }
    });
  } else {
    // res.redirect('/admin_login');
    res.redirect('/admin_login');

    console.log("user not verified")
  }
};
const requireAuth = (req, res, next) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
  res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
  res.setHeader("Expires", "0");
  const token = req.cookies.token;

  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect('/login');
      } else {
        // console.log(decodedToken);
        req.decodedToken = decodedToken;
        next();
      }
    });
  } else {
    // res.redirect('/admin_login');
    res.redirect('/login');

    console.log("user not verified")
  }
};


// check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token,process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};


module.exports = { requireAuth, checkUser, requireAuthAdmin };