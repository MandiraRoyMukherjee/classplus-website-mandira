const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const axios = require("axios");
var Promise = require("promise");
const path = require("path");
const upload = require("express-fileupload");
require("dotenv").config();
const branchRoutes = require("./routes/branch.routes");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const announcementRoutes = require("./routes/announcement.routes");
var multer = require("multer");
const { requireAuth, requireAuthAdmin, checkUser } = require("./middleware/authMiddleware");
const cloudinary = require("cloudinary");
const testRoutes = require("./routes/test.routes");
const study_materialRoutes = require("./routes/study_material.routes");
const questionRoutes = require("./routes/question.routes");
const videoRoutes = require("./routes/video.routes");
const assignmentRoutes = require("./routes/assignment.routes");
var FormData = require("form-data");
var form = new FormData();
var fs = require("fs");
const app = express();
const jwt = require("jsonwebtoken");
app.set("views", __dirname + "/views");
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
cloudinary.config({
  cloud_name: "husain3012",
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// view engine setup
// app.engine('handlebars',exphbs({ extname: "hbs", defaultLayout: false, layoutsDir: "views/ "}));
// app.set('view engine','handlebars');
// app.use('/public',express.static(path.join(__dirname, 'public')));
// app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));

mongoose
  .connect(process.env.DATABASE_CLOUD, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true })
  .then(() => console.log("DB connected"))
  .catch((err) => {
    console.log(err);
  });
app.use(morgan("dev"));
app.use(cookieParser());
app.use(cors());
app.use(cors({ exposedHeaders: "Authorization, X-Custom, internalApiKey,orgId" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: "50mb", parameterLimit: 100000, extended: true }));
app.use(upload());
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PATCH, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});
cors;
const serverRoot = "http://localhost:" + (process.env.PORT || 3000);

app.set("view engine", "ejs");

app.get("/register", function (req, res) {
  res.render("register", { qs: req.query, msg: "ok" });
});
app.post("/register", function (req, res) {
  if (req.body && req.body.name) {
    axios
      .post(serverRoot + "/api/signup", req.body)
      .then(function (response) {
        res.redirect("/login");
      })
      .catch(function (error) {
        console.log(error);
      });
  }
});
app.post("/register_admin", function (req, res) {
  if (req.body && req.body.name) {
    axios
      .post(serverRoot + "/api/signupAdmin", req.body)
      .then(function (response) {
        res.redirect("/admin_login");
      })
      .catch(function (error) {
        console.log(error);
      });
  }
});
// empty command
app.get("/login", function (req, res) {
  if (req.cookies && req.cookies.token) {
    const token = req.cookies.token;
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        res.render("login", { msg: "Session Expired" });
      } else {
        res.redirect("/student_dashboard");
      }
    });
  } else {
    res.render("login", { msg: "ok" });
  }
});
app.get("/admin_login", function (req, res) {
  if (req.cookies && req.cookies.tokenAdmin) {
    const tokenAdmin = req.cookies.tokenAdmin;
    jwt.verify(tokenAdmin, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        res.render("admin_login", { msg: "Session Expired" });
      } else {
        res.redirect("/create_batches");
      }
    });
  } else {
    res.render("admin_login", { msg: "ok" });
  }
});
app.get("/register_admin", function (req, res) {
  res.render("register_admin");
});

var username;
var LocalStorage = require("node-localstorage").LocalStorage;
const { test } = require("./controllers/branch.controllers");
const { count } = require("./models/user.models");
var localStorage = new LocalStorage("./scratch");
app.post("/login", function (req, res) {
  if (req.body && req.body.email && req.body.password) {
    axios
      .post(serverRoot + "/api/signin", req.body)
      .then(function (response) {
        console.log(response);
        if (response.data.status) {
          res.cookie("token", response.data.token, { expiresIn: "1d" });
          //res.render('student_dashboard',{ username : response.data.user.name })
          localStorage.setItem("userToken", response.data.token); //if you are sending token.
          localStorage.setItem("userId", response.data.user._id); //if you are sending token.
          localStorage.setItem("userName", response.data.user.username); //if you are sending token.
          localStorage.setItem("userEmail", response.data.user.email); //if you are sending token.
          localStorage.setItem("name", response.data.user.name); //if you are sending token.
          //localStorage.setItem('class', response.data.user._class)//if you are sending token.
          //localStorage.setItem('parentPhoneNo', response.data.user.parentPhoneNo)//if you are sending token.
          res.redirect("/student_dashboard");
        } else {
          res.render("login", { msg: response.data.error });
        }
      })
      .catch(function (error) {
        res.render("login", { msg: error.response.data.error });
      });
  }
});

app.post("/admin_login", function (req, res) {
  if (req.body && req.body.email && req.body.password) {
    axios
      .post(serverRoot + "/api/signinAdmin", req.body, { withCredentials: true })
      .then(function (response) {
        res.cookie("tokenAdmin", response.data.tokenAdmin, { expiresIn: "1d" });
        username = response.data.user.name;
        res.redirect("/create_batches");
      })
      .catch(function (error) {
        console.log(error);
        res.render("admin_login", { msg: "Invalid Email or password" });
      });
  }
});

app.get("/create_batches", requireAuthAdmin, function (req, res) {
  console.log(req.decodedToken);
  axios
    .get(serverRoot + "/api/branches", { params: { admin: req.decodedToken._id } })
    .then(function (response) {
      res.render("create_batches", { branchData: response.data.userData });
    })
    .catch(function (error) {
      console.log(error);
    });
});

// app.get("/student_dashboard", requireAuth, function (req, res) {
//   if (!localStorage.getItem("userId")) {
//     res.redirect("/api/signout");
//   } else {
//     axios
//       .get(serverRoot + "/api/announcement/getAnnouncementsForAStudentFromAllBranches/" + localStorage.getItem("userId"))
//       .then(function (response1) {
//         if (response1.data.announcementData) res.render("student_dashboard", { user_id: localStorage.getItem("userId"), announcement: response1.data.announcementData, username: localStorage.getItem("name") });
//       })
//       .catch(function (error2) {
//         console.log(error2);
//       });
//   }
// });
app.get("/announcements", function (req, res) {
  axios
    .get(serverRoot + "/api/announcement/getAnnouncementsByBranchIdForStudent/" + localStorage.getItem("batchID"))
    .then(function (response1) {
      if (response1.data.status) {
        axios
          .get(serverRoot + "/api/announcement/getAnnouncementsByBranchIdForAdmin/" + localStorage.getItem("batchID"))
          .then(function (response2) {
            if (response2.data.status) {
              res.render("announcements", { success: false, student: response1.data.announcementData, admin: response2.data.announcementData });
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  // res.render('announcements',{success:false})
});
app.post("/admin_announcement", function (req, res) {
  var obj = {
    branchId: localStorage.getItem("batchID"),
    admin_announcement: true,
    student_announcement: false,
    announcement: req.body.admin_announcement,
  };
  axios
    .post(serverRoot + "/api/announcement/createAnnouncement", obj)
    .then(function (response) {
      if (response.data.status) {
        axios
          .get(serverRoot + "/api/announcement/getAnnouncementsByBranchIdForStudent/" + localStorage.getItem("batchID"))
          .then(function (response1) {
            if (response1.data.status) {
              axios
                .get(serverRoot + "/api/announcement/getAnnouncementsByBranchIdForAdmin/" + localStorage.getItem("batchID"))
                .then(function (response2) {
                  if (response2.data.status) {
                    res.render("announcements", { success: true, student: response1.data.announcementData, admin: response2.data.announcementData });
                  }
                })
                .catch(function (error) {
                  console.log(error);
                });
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    })
    .catch(function (error) {
      console.log(error);
    });
});
app.post("/student_announcement", function (req, res) {
  var obj = {
    branchId: localStorage.getItem("batchID"),
    admin_announcement: false,
    student_announcement: true,
    announcement: req.body.student_announcement,
  };
  console.log(obj);
  axios
    .post(serverRoot + "/api/announcement/createAnnouncement", obj)
    .then(function (response) {
      if (response.data.status) {
        axios
          .get(serverRoot + "/api/announcement/getAnnouncementsByBranchIdForStudent/" + localStorage.getItem("batchID"))
          .then(function (response1) {
            if (response1.data.status) {
              axios
                .get(serverRoot + "/api/announcement/getAnnouncementsByBranchIdForAdmin/" + localStorage.getItem("batchID"))
                .then(function (response2) {
                  if (response2.data.status) {
                    res.render("announcements", { success: true, student: response1.data.announcementData, admin: response2.data.announcementData });
                  }
                })
                .catch(function (error) {
                  console.log(error);
                });
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    })
    .catch(function (error) {
      console.log(error);
    });
});
/* app.get('/dashboard',function(req,res){
        res.render('dashboard',{ username : username })
    })*/
app.get("/about_you", function (req, res) {
  axios
    .get(serverRoot + "/api/getAllBranchesForAStudent/" + localStorage.getItem("userId"))
    .then(function (response) {
      if (response.data.result > 0) {
        res.render("about_you", { user_id: localStorage.getItem("userId"), branchData: response.data.result, name: localStorage.getItem("name") });
      } else {
        res.render("about_you", {
          user_id: localStorage.getItem("userId"),
          branchData: response.data.result,
          name: localStorage.getItem("name"),
          parentPhoneNo: localStorage.getItem("parentPhoneNo"),
          email: localStorage.getItem("userEmail"),
        });
      }
    })
    .catch(function (error) {
      console.log(error);
    });
});
app.get("/student_test", function (req, res) {
  axios
    .get(serverRoot + "/api/test/getAlltestsForAStudent/" + localStorage.getItem("userId"))
    .then(function (response) {
      if (response.data.testData.length > 0) {
        res.render("student_test", { user_id: localStorage.getItem("userId"), test: response.data.testData, name: localStorage.getItem("name") });
      } else {
        res.render("student_test", { user_id: localStorage.getItem("userId"), test: response.data.testData, name: localStorage.getItem("name") });
      }
    })
    .catch(function (error) {
      console.log(error);
    });
});
var selectedStudents = [];
var selectedBatches = [];
var id = "";
app.get("/batch", function (req, res) {
  id = req.query.id;
  localStorage.setItem("batchID", req.query.id);
  axios
    .get(serverRoot + "/api/branchStudentsByBranchId/" + req.query.id)
    .then(function (response) {
      response.data.studentslist.forEach((element) => {
        selectedStudents.push(element._id);
      });
      res.render("batch", { id: req.query.id, batchStudents: response.data.studentslist, title: response.data.branchData[0].title, branchData: response.data.branchData[0] });
      // res.render('students',{ userData : response.data.studentData,  userName : response.data.userData[0].name })
    })
    .catch(function (error) {
      console.log(error);
    });
});
app.get("/create_batches", function (req, res) {
  axios
    .get(serverRoot + "/api/branches")
    .then(function (response) {
      res.render("create_batches", { branchData: response.data.userData });
    })
    .catch(function (error) {
      console.log(error);
    });
});
app.post("/create_batches", requireAuthAdmin, function (req, res) {
  if (req.body) {
    var obj = {
      postedBy: req.decodedToken._id,
      title: req.body.BatchName,
      code: req.body.BatchCode,
      start_date: req.body.date,
      _class: req.body.class,
    };
    axios
      .post(serverRoot + "/api/branch/create", obj)
      .then(function (response) {
        res.redirect("/create_batches");
      })
      .catch(function (error) {
        console.log(error);
      });
  }
});
app.post("/join_new_batch", requireAuth, function (req, res) {
  if (req.body) {
    const obj = {
      student_id: req.decodedToken._id,
      branch_id: req.body.batch_id,
    };
console.log(obj);
    axios
      .post(serverRoot + "/api/branch/request", obj)
      .then(function (response) {
        console.log(response.data);
        res.redirect("/student_dashboard");
      })
      .catch(function (error) {
        console.log(error);
      });
  }
});
app.get("/add_students", function (req, res) {
  const branch_id = req.query.id;
  axios
    .get(serverRoot + "/api/branchStudentsByBranchId/" + req.query.id)
    .then(function (response) {
      response.data.studentslist.forEach((element) => {
        selectedStudents.push(element._id);
      });
      axios
        .get(serverRoot + "/api/getPendingRequests", { params: { branch_id } })
        .then(function (allSignups) {
          console.log(allSignups.data);
          let data = allSignups.data.users.filter((item) => !selectedStudents.includes(item._id));
          res.render("add_students", { id: req.query.id, userData: data });
          selectedStudents = [];
        })
        .catch(function (error) {
          console.log(error);
        });
    })
    .catch(function (error) {
      console.log(error);
    });
});
app.post("/add_students", function (req, res) {
  if (!Array.isArray(req.body.user)) {
    req.body.user = [req.body.user];
  }
  console.log(req.body.user);

  axios
    .put(serverRoot + "/api/addStudentsToBranch/" + req.query.id, { students: req.body.user })
    .then(function (response) {
      axios
        .get(serverRoot + "/api/branchStudentsByBranchId/" + req.query.id)
        .then(function (response) {
          response.data.studentslist.forEach((element) => {
            selectedStudents.push(element._id);
          });
          res.render("batch", { id: req.query.id, batchStudents: response.data.studentslist, title: response.data.branchData[0].title, branchData: response.data.branchData[0] });
        })
        .catch(function (error) {
          console.log(error);
        });
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.get("/student_dashboard", requireAuth, function (req, res) {
  // console.log(response.data);
  axios
    .get(serverRoot + "/api/announcement/getAnnouncementsForAStudentFromAllBranches/", { params: { id: localStorage.getItem("userId") } })
    .then(function (response1) {
      axios.get(serverRoot + "/api/getAllBranches/").then(function (branches) {
        res.render("student_dashboard", { branches: branches.data.branches, user_id: localStorage.getItem("userId"), announcement: response1.data.announcementData, username: localStorage.getItem("name") });
      });
    })
    .catch(function (error2) {
      console.log(error2);
    });
});
app.get("/students",requireAuthAdmin, function (req, res) {
  axios
    .get(serverRoot + "/api/getAllSignups")
    .then(function (response) {
      res.render("students", { userData: response.data.userData, userName: response.data.userData[0].name });
    })
    .catch(function (error) {
      console.log(error);
    });
});
app.get("/student_details",requireAuthAdmin ,function (req, res) {
  let id = req.query.id;
  axios
    .get(serverRoot + "/api/getStudentsById/" + id)
    .then(function (response) {
      axios
      .get(serverRoot+"/api/getAllBranchesForAStudent/" + id)
      .then(function(branchesData){
      let x = response.data.userData.name.charAt(0);
      // console.log(response.data.userData);
      res.render("student_details", { userData: response.data.userData, name: x, branchesData:branchesData.data.result});
      })
    })
    .catch(function (error) {
      console.log(error);
    });
});
app.get("/test", function (req, res) {
  axios
    .get(serverRoot + "/api/test/getAllTests")
    .then(function (response) {
      res.render("test", { testData: response.data.testData });
    })
    .catch(function (error) {
      console.log(error);
    });
});
app.post("/test", function (req, res) {
  var obj = {
    title: req.body.title,
    points: req.body.points,
    total_questions: req.body.questions,
    duration: req.body.time,
  };
  if (req.query && req.query.id) {
    axios
      .put(serverRoot + "/api/test/editTest/" + req.query.id, obj)
      .then(function (response) {
        if (response) {
          axios
            .get(serverRoot + "/api/test/getAllTests")
            .then(function (response) {
              res.render("test", { testData: response.data.testData });
            })
            .catch(function (error) {
              console.log(error);
            });
        } else {
          console.log("**** something went wrong while creating tests *********");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  } else {
    axios
      .post(serverRoot + "/api/test/createTest", obj)
      .then(function (response) {
        if (response.status) {
          axios
            .get(serverRoot + "/api/test/getAllTests")
            .then(function (response) {
              res.render("test", { testData: response.data.testData });
            })
            .catch(function (error) {
              console.log(error);
            });
        } else {
          console.log("**** something went wrong while creating tests *********");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }
});

var testId;
app.get("/view_test", function (req, res) {
  testId = req.query.id;
  axios
    .get(serverRoot + "/api/question/getQuestionsByTestId/" + testId)
    .then(function (response) {
      axios
        .get(serverRoot + "/api/test/getTestById/" + testId)
        .then(function (response1) {
          var stdCombo = response1.data.testData[0].students.map(function (value, index) {
            if (response1.data.testData[0].studentsName[index] != undefined) {
              return [value, response1.data.testData[0].studentsName[index]];
            } else {
              return undefined;
            }
          });
          var bthCombo = response1.data.testData[0].branches.map(function (value, index) {
            return [value, response1.data.testData[0].branchesName[index]];
          });
          var addQues = true;
          if (response1.data.testData[0].total_questions - response.data.count == 0) {
            addQues = false;
          }
          res.render("view_test", { id: req.query.id, questionData: response.data.questionData, testData: response1.data.testData[0], stdCombo: stdCombo, bthCombo: bthCombo, count: response.data.count, addQues: addQues });
        })
        .catch(function (error) {
          console.log(error);
        });
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.post("/view_test", function (req, res) {
  if (testId) {
    req.body.testId = testId;
    if (req.body.answer1 || req.body.answer2 || req.body.answer3 || req.body.answer4) {
      let answer = [];
      answer.push(req.body.answer1);
      answer.push(req.body.answer2);
      answer.push(req.body.answer3);
      answer.push(req.body.answer4);
      answer = answer.filter(function (element) {
        return element !== undefined;
      });
      req.body.answer = answer.toString();
    }
    axios
      .post(serverRoot + "/api/question/createQuestion", req.body)
      .then(function (response) {
        if (response.status) {
          axios
            .get(serverRoot + "/api/question/getQuestionsByTestId/" + testId)
            .then(function (response) {
              axios
                .get(serverRoot + "/api/test/getTestById/" + testId)
                .then(function (response1) {
                  var stdCombo = response1.data.testData[0].students.map(function (value, index) {
                    return [value, response1.data.testData[0].studentsName[index]];
                  });
                  var bthCombo = response1.data.testData[0].branches.map(function (value, index) {
                    return [value, response1.data.testData[0].branchesName[index]];
                  });
                  var addQues = true;
                  if (response1.data.testData[0].total_questions - response.data.count == 0) {
                    addQues = false;
                  }
                  res.render("view_test", { id: testId, questionData: response.data.questionData, testData: response1.data.testData[0], stdCombo: stdCombo, bthCombo: bthCombo, count: response.data.count, addQues: addQues });
                })
                .catch(function (error) {
                  console.log(error);
                });
            })
            .catch(function (error) {
              console.log(error);
            });
        } else {
          console.log("**** something went wrong while creating tests *********");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  } else {
    console.log("^^^^^^^^no test id found^^^^^^");
  }
});

app.get("/add_students_test", (req, res) => {
  axios
    .get(serverRoot + "/api/test/getTestById/" + req.query.id)
    .then(function (response) {
      response.data.testData[0].students.forEach((element) => {
        selectedStudents.push(element);
      });
      axios
        .get(serverRoot + "/api/getAllSignups")
        .then(function (allSignups) {
          let data = allSignups.data.userData.filter((item) => !selectedStudents.includes(item._id));

          res.render("add_students_test", { id: req.query.id, userData: data, testId: testId });
          selectedStudents = [];
        })
        .catch(function (error) {
          console.log(error);
        });
    })
    .catch(function (error) {
      console.log(error);
    });
});
app.post("/add_students_test", (req, res) => {
  let stdId = [];
  let name = [];
  if (Array.isArray(req.body.vehicle1)) {
    req.body.vehicle1.forEach((element) => {
      let arr = [];
      arr.push(element.split("-"));
      stdId.push(arr[0][0]);
      name.push(arr[0][1]);
    });
  } else {
    let arr = [];
    arr.push(req.body.vehicle1.split("-"));
    stdId.push(arr[0][0]);
    name.push(arr[0][1]);
  }
  axios
    .put(serverRoot + "/api/test/addStudentsToTest/" + testId, { students: stdId, studentsName: name })
    .then(function (response) {
      if (response) {
        axios
          .get(serverRoot + "/api/question/getQuestionsByTestId/" + testId)
          .then(function (response2) {
            axios
              .get(serverRoot + "/api/test/getTestById/" + testId)
              .then(function (response1) {
                var stdCombo = response1.data.testData[0].students.map(function (value, index) {
                  return [value, response1.data.testData[0].studentsName[index]];
                });
                var bthCombo = response1.data.testData[0].branches.map(function (value, index) {
                  return [value, response1.data.testData[0].branchesName[index]];
                });
                var addQues = true;
                if (response1.data.testData[0].total_questions - response2.data.count == 0) {
                  addQues = false;
                }
                res.render("view_test", { id: req.query.id, questionData: response2.data.questionData, testData: response1.data.testData[0], stdCombo: stdCombo, bthCombo: bthCombo, count: response2.data.count, addQues: addQues });
              })
              .catch(function (error) {
                console.log(error);
              });
          })
          .catch(function (error) {
            console.log(error);
          });
      } else {
        console.log("**** something went wrong while creating tests *********");
      }
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.get("/add_batches_test", (req, res) => {
  axios
    .get(serverRoot + "/api/test/getTestById/" + req.query.id)
    .then(function (response) {
      response.data.testData[0].branches.forEach((element) => {
        selectedBatches.push(element);
      });
      axios
        .get(serverRoot + "/api/branches")
        .then(function (branches) {
          let data = branches.data.userData.filter((item) => !selectedBatches.includes(item._id));
          res.render("add_batches_test", { id: req.query.id, branchData: data, testId: testId });
          selectedBatches = [];
        })
        .catch(function (error) {
          console.log(error);
        });
    })
    .catch(function (error) {
      console.log(error);
    });
});
app.post("/add_batches_test", (req, res) => {
  let stdId = [];
  let name = [];
  if (Array.isArray(req.body.vehicle1)) {
    req.body.vehicle1.forEach((element) => {
      let arr = [];
      arr.push(element.split("-"));
      stdId.push(arr[0][0]);
      name.push(arr[0][1]);
    });
  } else {
    let arr = [];
    arr.push(req.body.vehicle1.split("-"));
    stdId.push(arr[0][0]);
    name.push(arr[0][1]);
  }
  axios
    .put(serverRoot + "/api/test/addBranchesToTest/" + testId, { branches: stdId, branchesName: name })
    .then(function (response) {
      if (response) {
        axios
          .get(serverRoot + "/api/question/getQuestionsByTestId/" + testId)
          .then(function (response2) {
            axios
              .get(serverRoot + "/api/test/getTestById/" + testId)
              .then(function (response1) {
                var stdCombo = response1.data.testData[0].students.map(function (value, index) {
                  return [value, response1.data.testData[0].studentsName[index]];
                });
                var bthCombo = response1.data.testData[0].branches.map(function (value, index) {
                  return [value, response1.data.testData[0].branchesName[index]];
                });
                let addQues = true;
                if (response1.data.testData[0].total_questions - response2.data.count == 0) {
                  addQues = false;
                }
                res.render("view_test", { id: req.query.id, questionData: response2.data.questionData, testData: response1.data.testData[0], stdCombo: stdCombo, bthCombo: bthCombo, count: response2.data.count, addQues: addQues });
              })
              .catch(function (error) {
                console.log(error);
              });
          })
          .catch(function (error) {
            console.log(error);
          });
      } else {
        console.log("**** something went wrong while creating tests *********");
      }
    })
    .catch(function (error) {
      console.log(error);
    });
});
app.get("/student_testview", function (req, res) {
  var _id = req.query.id;
  axios
    .get(serverRoot + "/api/question/getQuestionsByTestId/" + req.query.id)
    .then(function (response) {
      // we can even get all query values from response also
      let totalMarks = parseInt(req.query.points * response.data.count);
      axios
        .get(serverRoot + "/api/test/getAlltestsForAStudent/" + localStorage.getItem("userId"))
        .then(function (response1) {
          var test = response1.data.testData.map((value) => {
            if (value.doneTest && value.doneTest.testIds == req.query.id) return value.doneTest.studentAnswers;
          });
          arr = test.filter((obj) => obj);
          arr = arr[0];
          var unattempt = 0;
          var attempt = 0;
          arr.forEach((value) => {
            if (value.answer == "") unattempt += 1;
            else attempt += 1;
          });
          var questionans = response.data.questionData;
          var right = 0;
          for (var i = 0; i < arr.length; i++) {
            if (questionans[i].answer == arr[i].answer) right += 1;
          }
          axios.get(serverRoot + "/api/test/getTestRankByTestId/" + _id).then(function (response3) {
            if (response.data.questionData.length > 0) {
              res.render("student_testview", {
                user_id: localStorage.getItem("userId"),
                right: right,
                rank: response3.data.highestScore,
                user_id: localStorage.getItem("userId"),
                attemp: attempt,
                unattemp: unattempt,
                answers: arr,
                questions: questionans,
                scoredMarks: req.query.score,
                totalMarks: totalMarks,
                points: req.query.points,
                title: req.query.title,
                name: localStorage.getItem("name"),
              });
            } else {
              res.render("student_testview", {
                user_id: localStorage.getItem("userId"),
                right: right,
                rank: response3.data.highestScore,
                user_id: localStorage.getItem("userId"),
                attemp: attempt,
                unattemp: unattempt,
                answers: arr,
                questions: questionans,
                scoredMarks: req.query.score,
                totalMarks: totalMarks,
                points: req.query.points,
                title: req.query.title,
                name: localStorage.getItem("name"),
              });
            }
          });
        })
        .catch(function (error1) {
          console.log(error);
        })
        .catch(function (error) {
          console.log(error);
        });
    })
    .catch(function (error) {
      console.log(error);
    });
});
// app.get('/student_testview',function(req,res){
//     axios.get('http://localhost:8000/api/question/getQuestionsByTestId/'+req.query.id)
//     .then(function (response) { // we can even get all query values from response also
//         console.log('YYYYYYYYYY',response.data.questionData,response.data.testDetails)
//         let totalMarks = parseInt(req.query.points*response.data.count)
//         if(response.data.questionData.length>0){
//             res.render('student_testview',{ questions : response.data.questionData,scoredMarks:req.query.score,totalMarks:totalMarks,points:req.query.points,title:req.query.title,name:localStorage.getItem('name')})
//         }else{
//             res.render('student_testview',{ questions : response.data.questionData,scoredMarks:req.query.score,totalMarks:totalMarks,points:req.query.points,title:req.query.title,name:localStorage.getItem('name')})
//         }
//     })
//     .catch(function (error) {
//         console.log(error);
//     });
// })
app.get("/student_takequiz", function (req, res) {
  axios
    .get(serverRoot + "/api/question/getQuestionsByTestId/" + req.query.id)
    .then(function (response) {
      if (response.data.questionData.length > 0) {
        res.render("student_takequiz", {
          user_id: localStorage.getItem("userId"),
          localStorage,
          count: response.data.testDetails[0].duration,
          questions: response.data.questionData,
          testDetails: response.data.testDetails,
          name: localStorage.getItem("name"),
        });
      } else {
        res.render("student_takequiz", {
          user_id: localStorage.getItem("userId"),
          count: response.data.testDetails[0].duration,
          questions: response.data.questionData,
          testDetails: response.data.testDetails,
          name: localStorage.getItem("name"),
        });
      }
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.post("/student_takequiz", function (req, res) {
  axios
    .get(serverRoot + "/api/test/getAlltestsForAStudent/" + localStorage.getItem("userId"))
    .then(function (response) {
      if (response.data.testData.length > 0) {
        res.render("student_takequiz", { count: response.data.testDetails[0].duration, questions: response.data.questionData, testDetails: response.data.testDetails, name: localStorage.getItem("name") });
      } else {
        res.render("student_test", { user_id: localStorage.getItem("userId"), test: response.data.testData, name: localStorage.getItem("name") });
      }
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.post("/submit_quiz", function (req, res) {
  var myData = Object.keys(req.body).map((key) => {
    return { _id: key.split("?")[1], answer: req.body[key].trim().toLowerCase().split(/\s/).join("") };
  });
  var output = [];
  //Iterating each element of the myData
  myData.forEach((o) => {
    //Checking the duplicate value and updating the data field
    let temp = output.find((x) => {
      if (x && x._id === o._id) {
        x.answer += "," + o.answer;
        return true;
      }
    });
    if (!temp) output.push(o);
  });
  for (var i = 0; i < output.length; i++) {
    if (output[i].answer[0] == ",") output[i].answer = output[i].answer.substring(1);
  }

  axios
    .get(serverRoot + "/api/question/getKeyAnswersByTestId/" + req.query.id)
    .then(function (response) {
      if (response.data.answersData.length > 0) {
        const toHash = (value) => value._id + "@" + value.answer;

        const entries = new Map();

        for (const el of [...output, ...response.data.answersData]) {
          const key = toHash(el);
          if (entries.has(key)) {
            entries.delete(key);
          } else {
            entries.set(key, el);
          }
        }

        const result = [...entries.values()];
        const totalWrongAnswers = result.length / 2;
        const totalCorrectAnswers = response.data.count - totalWrongAnswers;
        const scoredMarks = parseInt(totalCorrectAnswers * req.query.points);
        // const totalMarks = parseInt(req.query.totalQuestion * req.query.points)
        const totalMarks = parseInt(response.data.count * req.query.points);

        var objUpdate = {
          testIds: [
            {
              testIds: req.query.testId,
              score: scoredMarks,
              studentAnswers: output,
              status: "Completed",
              action: "view",
            },
          ],
        };
        axios
          .put(serverRoot + "/api/editTestsOfStudent/" + localStorage.getItem("userId"), objUpdate)
          .then(function (stdresponse) {
            if (stdresponse) {
              axios
                .get(serverRoot + "/api/test/getAlltestsForAStudent/" + localStorage.getItem("userId"))
                .then(function (response) {
                  if (response.data.testData.length > 0) {
                    res.render("student_test", { user_id: localStorage.getItem("userId"), test: response.data.testData, name: localStorage.getItem("name") });
                  } else {
                    res.render("student_test", { user_id: localStorage.getItem("userId"), test: response.data.testData, name: localStorage.getItem("name") });
                  }
                })
                .catch(function (error) {
                  console.log(error);
                });
            } else {
              console.log("******error at fetching stundent profile *******");
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      } else {
        console.log("******error at stundent profile update*******");
      }
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.get("/admin_material", function (req, res) {
  axios
    .get(serverRoot + "/api/studyMaterial/getStudyMaterialsByBranchId/" + localStorage.getItem("batchID"))
    .then(function (response) {
      if (response.data.study_materialData.length > 0) {
        res.render("admin_material", { study_materialData: response.data.study_materialData });
      } else {
        res.render("admin_material", { study_materialData: response.data.study_materialData });
      }
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.post("/admin_material", function (req, res) {
  if (req.files) {
    var file = req.files.file;
    var filename = file.name;
    file.mv("./uploads/" + filename, function (err) {
      if (err) {
        console.log("*****error****");
      } else {
        form.append("file", fs.createReadStream("./uploads/" + filename));

        axios
          .post(serverRoot + "/api/studyMaterial/createStudyMaterial/" + localStorage.getItem("batchID"), form, { headers: form.getHeaders() })
          .then(function (response) {
            if (response.data.study_materialData.length > 0) {
              res.render("admin_material", { study_materialData: response.data.study_materialData });
            } else {
              axios
                .get(serverRoot + "/api/studyMaterial/getStudyMaterialsByBranchId/" + localStorage.getItem("batchID"))
                .then(function (response) {
                  if (response.data.study_materialData.length > 0) {
                    res.render("admin_material", { study_materialData: response.data.study_materialData });
                  } else {
                    res.render("admin_material", { study_materialData: response.data.study_materialData });
                  }
                })
                .catch(function (error) {
                  console.log(error);
                });
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    });
  }
});
app.get("/admin_attendance",function(req,res){
  res.render("admin_attendance",{ qs: req.query });

});
app.get("/admin_video", function (req, res) {
  axios
    .get(serverRoot + "/api/video/getVideoLinksByBranchId/" + localStorage.getItem("batchID"))
    .then(function (videos) {
      res.render("admin_video", { videoData: videos.data.videoData });
    })
    .catch(function (error) {
      console.log(error);
    });
});
app.post("/admin_video", function (req, res) {
  var obj = {
    branchId: localStorage.getItem("batchID"),
    videoURL: req.body.w3review.trim(),
  };
  axios
    .post(serverRoot + "/api/video/createVideoLink", obj)
    .then(function (videosCreate) {
      axios
        .get(serverRoot + "/api/video/getVideoLinksByBranchId/" + localStorage.getItem("batchID"))
        .then(function (videos) {
          res.render("admin_video", { videoData: videos.data.videoData });
        })
        .catch(function (error) {
          console.log(error);
        });
    })
    .catch(function (error) {
      console.log(error);
    });
});
app.get("/admin_assignment", function (req, res) {
  axios
    .get(serverRoot + "/api/assignment/getAssignmentsByBranchId/" + localStorage.getItem("batchID"))
    .then(function (response) {
      if (response.data.assignmentData.length > 0) {
        res.render("admin_assignment", { assignment_Data: response.data.assignmentData });
      } else {
        res.render("admin_assignment", { assignment_Data: response.data.assignmentData });
      }
    })
    .catch(function (error) {
      console.log(error);
    });
});
require("events").EventEmitter.defaultMaxListeners = 15;

app.post("/admin_assignment", function (req, res) {
  if (req.files) {
    var file = req.files.file;
    var filename = file.name;
    file.mv("./uploadAssignments/" + filename, function (err) {
      if (err) {
        console.log("*****error****");
      } else {
        form.append("file", fs.createReadStream("./uploadAssignments/" + filename));

        axios
          .post(serverRoot + "/api/assignment/createAssignment/" + localStorage.getItem("batchID"), form, { headers: form.getHeaders() })
          .then(function (response) {
            console.log("***********88", response.data.assignmentData);
            if (Object.keys(response.data.assignmentData).length) {
              // res.render('assignmentData',{assignmentData:response.data.assignmentData})
              axios
                .get(serverRoot + "/api/assignment/getAssignmentsByBranchId/" + localStorage.getItem("batchID"))
                .then(function (response) {
                  if (response.data.assignmentData.length > 0) {
                    res.render("admin_assignment", { assignment_Data: response.data.assignmentData });
                  } else {
                    res.render("admin_assignment", { assignment_Data: response.data.assignmentData });
                  }
                })
                .catch(function (error) {
                  console.log(error);
                });
            } else {
              axios
                .get(serverRoot + "/api/assignment/getAssignmentsByBranchId/" + localStorage.getItem("batchID"))
                .then(function (response) {
                  if (response.data.assignmentData.length > 0) {
                    res.render("admin_assignment", { assignment_Data: response.data.assignmentData });
                  } else {
                    res.render("admin_assignment", { assignment_Data: response.data.assignmentData });
                  }
                })
                .catch(function (error) {
                  console.log(error);
                });
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    });
  }
});
app.post("/modify_student", function (req, res) {
  const _id = req.body.studentId;
  const attachment = req.files.parentPhoto1 || req.files.parentPhoto2;
  const base64data = Buffer.from(attachment.data).toString("base64");
  if (req.files) {
    cloudinary.v2.uploader.upload(
      "data:image/png;base64," + base64data,
      {
        overwrite: true,
        invalidate: true,
        resource_type: "auto",
      },
      function (error, result) {
        if (error) {
          console.log(error);
        } else {
          // console.log(result);
          if (req.files.parentPhoto1) {
            req.body.parentPhoto1 = result.secure_url;
          } else {
            req.body.parentPhoto2 = result.secure_url;
          }
          axios
            .post(serverRoot + "/api/modifyStudent/", req.body)
            .then(function (response) {
              res.redirect("/student_details/?id=" + _id);
            })
            .catch(function (error) {
              console.log(error);
            });
        }
      }
    );
  }
});

app.get("/getpdf", function (req, res) {
  console.log("**********888", req.query);
  if (req.query.assignment == "true") {
    axios
      .get(serverRoot + "/api/assignment/getPDFbyAssignmentId/" + req.query.id)
      .then(function (response) {
        if (response.data.assignmentData.length > 0) {
          res.render("get_pdf", { result: response.data.assignmentData[0].assignment });
        } else {
          res.render("get_pdf", { result: response.data.assignmentData[0].assignment });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  } else if (req.query.studyMaterial == "true") {
    axios
      .get(serverRoot + "/api/studyMaterial/getPDFbystudyMaterialId/" + req.query.id)
      .then(function (response) {
        if (response.data.study_material.length > 0) {
          res.render("get_pdf", { result: response.data.study_material[0].study_material });
        } else {
          res.render("get_pdf", { result: response.data.study_material[0].study_material });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }
});
app.get("/add_students_mail", (req, res) => {
  axios
    .get(serverRoot + "/api/getAllSignups")
    .then(function (allSignups) {
      res.render("add_students_mail", { userData: allSignups.data.userData });
    })
    .catch(function (error) {
      console.log(error);
    });
});
app.get("/add_batches_mail", (req, res) => {
  axios
    .get(serverRoot + "/api/branches")
    .then(function (branches) {
      res.render("add_batches_mail", { branchData: branches.data.userData });
    })
    .catch(function (error) {
      console.log(error);
    });
});
var names = [];
var emailIds = [];
app.post("/add_students_mail", (req, res) => {
  req.body.vehicle1.forEach((element) => {
    var [before, after] = element.split("|");
    names.push(before);
    emailIds.push(after);
  });
  res.render("admin_mail", { mailTo: names, email: false });
});

app.post("/add_batches_mail", (req, res) => {
  var names = [];
  var batchIds = [];
  req.body.vehicle1.forEach((element) => {
    var [before, after] = element.split("|");
    names.push(before);
    emailIds.push(after);
  });
  res.render("admin_mail", { mailTo: req.body.vehicle1, email: false });
});
app.get("/admin_mail", (req, res) => {
  res.render("admin_mail", { mailTo: [], email: false });
});
app.post("/admin_mail", (req, res) => {
  var obj = {
    from: process.env.EMAIL,
    to: emailIds,
    subject: req.body.subject,
    text: req.body.text,
  };
  axios
    .post(serverRoot + "/api/sendEmail", obj)
    .then(function (email) {
      res.render("admin_mail", { mailTo: [], email: true });
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.get("/student_material", (req, res) => {
  axios
    .get(serverRoot + "/api/studyMaterial/getStudyMaterialsForAStudentFromAllBranches/" + localStorage.getItem("userId"))
    .then(function (response) {
      res.render("student_material", { study_materialData: response.data.study_materialData });
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.get("/student_videos", (req, res) => {
  axios
    .get(serverRoot + "/api/video/getVideosForAStudentFromAllBranches/" + req.query.id)
    .then(function (response) {
      var updatevideos = response.data.videoData.map((value) => {
        var newurl = value.videoURL.replace("watch?v=", "embed/");
        value.videoURL = newurl;
        return value;
      });
      //console.log(updatevideos);
      res.render("student_videos", { user_id: req.query.id, videos: updatevideos });
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.get("/student_assignment", (req, res) => {
  axios
    .get(serverRoot + "/api/assignment/getAssignmentsForAStudentFromAllBranches/" + localStorage.getItem("userId"))
    .then(function (response) {
      res.render("student_assignment", { user_id: localStorage.getItem("userId"), assignment_Data: response.data.assignmentData });
    })
    .catch(function (error) {
      console.log(error);
    });
});

if (process.env.NODE_ENV === "development") {
  app.use(cors({ origin: `${process.env.CLIENT_URL}` }));
}
// routes middleware
app.use("/api", branchRoutes);
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", testRoutes);
app.use("/api", questionRoutes);
app.use("/api", videoRoutes);
app.use("/api", announcementRoutes);
app.use("/api", assignmentRoutes);
app.use("/api", study_materialRoutes);
app.use("/", (req, res) => {
  // res
  // .status(200)
  // .send("...??????")
  res.render("index", { qs: req.query });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server connected on port ${port}`);
});
