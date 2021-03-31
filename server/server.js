const express = require("express");
const app = express();
const db = require("./db");
//hash pasword///
const { hash, compare } = require("./utils/bc.js");
const cryptoRandomString = require("crypto-random-string");
//hash pasword///
///amazon mail service//
const ses = require("./ses");
///amazon mail service//
//cookie//////
const cookieSession = require("cookie-session");
const csurf = require("csurf");
//cookie//////
///essential setting
const compression = require("compression");
const path = require("path");
///essential setting
//socket IO
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});
//socket IO
///aws///
const multer = require("multer");
const uidSafe = require("uid-safe");
const s3 = require("./s3");
const config = require("./config");
const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});
const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

// app.use(
//     cookieSession({
//         secret: `wingardium leviosa`,
//         maxAge: 1000 * 60 * 60 * 24 * 14,
//     })
// );
////socket IO
const cookieSessionMiddleware = cookieSession({
    secret: `wingardium leviosa`,
    maxAge: 1000 * 60 * 60 * 24 * 14,
});
app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});
////socket IO

app.use(csurf());

app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

app.use(express.json());

app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

////routes///////
app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
        // getPage(currentStatus, res);
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.post("/registration", (req, res) => {
    const {
        lat,
        lon,
        status,
        address,
        first,
        last,
        email,
        password,
    } = req.body;
    // console.log("status", status);
    console.log("req.body", req.body);
    var currentStatus = false;
    if (status == "family") {
        currentStatus = true;
        hash(password).then((hashedPassword) => {
            db.userInputForRegFam(
                currentStatus,
                first,
                last,
                email,
                hashedPassword,
                lat,
                lon
            )
                .then(({ rows }) => {
                    console.log("userInputForRegFam", rows);
                    req.session.userId = rows[0].id;
                    res.json({
                        success: true,
                        user_status: currentStatus,
                    });
                })
                .catch((err) => {
                    console.log(
                        "Error with adding user (server):",
                        err.message
                    );
                    res.json({ success: false });
                });
        });
    } else {
        hash(password)
            .then((hashedPassword) => {
                db.userInputForRegSit(
                    currentStatus,
                    address,
                    first,
                    last,
                    email,
                    hashedPassword,
                    lat,
                    lon
                )
                    .then(({ rows }) => {
                        console.log("userInputForRegSit", rows);
                        req.session.userId = rows[0].id;
                        res.json({
                            success: true,
                            user_status: currentStatus,
                        });
                    })
                    .catch((err) => {
                        console.log(
                            "Error with adding user (server):",
                            err.message
                        );
                        res.json({ success: false });
                    });
            })
            .catch((err) => {
                console.log("Error with hashing password:", err.message);
            });
    }

    // console.log("sanity check");
});

app.post("/login", (req, res) => {
    const { password, email } = req.body;
    if (email && password) {
        // console.log(email);
        // console.log(password);
        db.userInputForLog(email)
            .then(({ rows }) => {
                // console.log(rows);
                if (rows.length === 0) {
                    res.json({
                        success: false,
                    });
                } else if (rows) {
                    compare(password, rows[0].password_hash).then((match) => {
                        if (match) {
                            req.session.userId = rows[0].id;
                            res.json({
                                success: true,
                                user_status: rows[0].is_family,
                            });
                        } else {
                            res.json({
                                success: false,
                            });
                        }
                    });
                }
            })
            .catch((err) => {
                console.log("Error getting user info at login:", err.message);
                return res.json({ success: false });
            });
    }
});

app.post("/reset/start", (req, res) => {
    const { email } = req.body;
    if (email) {
        db.userInputForLog(email).then(({ rows }) => {
            // console.log(rows);
            if (rows.length === 0) {
                res.json({
                    success: false,
                });
            } else if (rows) {
                // console.log("it is matched");
                // console.log(rows);
                const secretCode = cryptoRandomString({ length: 6 });
                // console.log(secretCode);
                db.userInputForReset(email, secretCode)
                    .then(({ rows }) => {
                        // console.log(rows);
                        ses.sendEmail(
                            email,
                            secretCode,
                            "Here is your security code to reset your password!"
                        )
                            .then(() => {
                                console.log("It worked, email sent!");
                                res.json({ success: true });
                            })
                            .catch((err) => {
                                console.log(
                                    "Error in sending email:",
                                    err.message
                                );
                                res.json({ success: false });
                            });
                    })
                    .catch((err) => {
                        console.log(
                            "Error in adding secret code:",
                            err.message
                        );
                    });
            }
        });
    }
});

app.post("/reset/verify", (req, res) => {
    const { secretCode, password, email } = req.body;
    // console.log("req.body.code", req.body.code);
    db.userCodeForReset(secretCode)
        .then(({ rows }) => {
            // console.log("rows:", rows);
            if (rows.length === 0) {
                res.json({
                    success: false,
                });
            } else if (rows) {
                if (req.body.code === rows[0].secret_code) {
                    // console.log("rows[0].secret_code", rows[0].secret_code);
                    // console.log("req.body.code", req.body.code);
                    // console.log("i am true");
                    hash(req.body.password)
                        .then((hashedPassword) => {
                            // console.log(req.body.password);
                            // console.log(hashedPassword);
                            // console.log(email);
                            db.selectFromResetCode(req.body.code)
                                .then(({ rows }) => {
                                    // console.log("selectFromResetCode", rows);
                                    db.updatePassword(
                                        rows[0].email,
                                        hashedPassword
                                    );
                                    console.log("I am hashed");
                                    res.json({
                                        success: true,
                                    });
                                })
                                .catch((err) => {
                                    console.log(
                                        "Error updating password:",
                                        err.message
                                    );
                                });
                            console.log("Hashed reset pass!");
                        })
                        .catch((err) => {
                            console.log(
                                "Error hashing reset password:",
                                err.message
                            );
                        });
                    console.log("Secret code matched!");
                }
            } else {
                console.log("Secret code does not match!");
                res.json({ success: false });
            }
        })
        .catch((err) => {
            console.log("Error checking secret code:", err.message);
            res.json({ success: false });
        });
});

app.get("/sitter", (req, res) => {
    const userId = req.session.userId;
    console.log("req.session.userId:", userId);
    // console.log("userId:", userId);
    if (userId) {
        // console.log("I am here");

        db.selectUserInputForPic(userId)
            .then((result) => {
                // console.log(result);
                res.json({
                    success: result.rows,
                });
            })
            .catch((err) => {
                console.log("Error with sitter:", err.message);
            });
    }
});

app.get("/api/search", (req, res) => {
    const userId = req.session.userId;
    db.selectAllSitters().then((result) => {
        // console.log(result.rows);
        res.json({
            success: result.rows,
        });
    });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    const userId = req.session.userId;
    const { filename } = req.file;
    const url = config.s3Url + filename;
    if (req.session.userId) {
        db.selectUserInputForPic(userId)
            .then(({ rows }) => {
                // console.log("selectUserInputForPic", rows[0].id);
                if (req.file) {
                    db.updatePic(rows[0].id, url).then((result) => {
                        console.log(result.rows);
                        res.json(result.rows[0]);
                    });
                    // console.log("rowupdatePics:", rows);
                } else {
                    res.json({
                        success: false,
                    });
                }
            })
            .catch((err) => {
                console.log("Error with upload:", err.message);
            });
    }
});

app.post("/bio", (req, res) => {
    // console.log("I am coming from server");
    const { bioDraft } = req.body;
    // console.log(req.body);
    const userId = req.session.userId;
    console.log("userid", userId);
    console.log("bio", bioDraft);
    db.updateBioInfo(userId, bioDraft)
        .then(({ rows }) => {
            // console.log(rows);
            res.json(rows);
        })
        .catch((err) => {
            console.log("Error with bio:", err.message);
        });
});

app.post("/service", (req, res) => {
    // console.log("I am coming from server");
    const { serDraft } = req.body;
    // console.log(req.body);
    const userId = req.session.userId;
    db.updateServiceInfo(userId, serDraft)
        .then(({ rows }) => {
            console.log(rows);
            res.json(rows);
        })
        .catch((err) => {
            console.log("Error with service:", err.message);
        });
});

app.post("/home", (req, res) => {
    // console.log("I am coming from server");
    const { homeDraft } = req.body;
    // console.log(req.body);
    const userId = req.session.userId;
    db.updateHomeInfo(userId, homeDraft)
        .then(({ rows }) => {
            // console.log(rows);
            res.json(rows);
        })
        .catch((err) => {
            console.log("Error with home:", err.message);
        });
});

app.post("/skills", (req, res) => {
    // console.log("I am coming from server");
    const { skillsDraft } = req.body;
    // console.log(req.body);
    const userId = req.session.userId;
    db.updateSkillsInfo(userId, skillsDraft)
        .then(({ rows }) => {
            console.log(rows);
            res.json(rows);
        })
        .catch((err) => {
            console.log("Error with skills:", err.message);
        });
});

app.post("/pet", (req, res) => {
    // console.log("I am coming from server");
    const { petDraft } = req.body;
    // console.log(req.body);
    const userId = req.session.userId;
    db.updatePetInfo(userId, petDraft).then(({ rows }) => {
        // console.log(rows);
        res.json(rows);
    });
});

app.post("/otherSitters", (req, res) => {
    console.log("otherpro", req.body);
    const userId = req.body.id;
    if (userId == req.session.userId) {
        res.json({
            success: false,
        });
    } else {
        db.selectUserInputForPic(userId).then((result) => {
            console.log(result.rows);
            res.json({
                success: result.rows,
            });
        });
    }
});

app.post("/rateUpdate", (req, res) => {
    const userId = req.body.id;
    const value = req.body.value;
    if (userId == req.session.userId) {
        res.json({
            success: false,
        });
    } else {
        db.getRateInfo(userId, value).then(({ rows }) => {
            console.log("rows", rows[0]);
            var currentRate = rows[0].rate;
            var counter = rows[0].counter_rate;
            db.updateRateInfoWithUser(
                userId,
                calculateRate(currentRate, value, counter)
            ).then((result) => {
                // console.log("updateRateInfo", result.rows);
                res.json({
                    success: result.rows,
                });
            });
        });
    }
});

app.get("/logout", (req, res) => {
    console.log("I am from server and from logout");
    req.session.userId = null;
    res.redirect("/welcome");
});

app.get("*", function (req, res) {
    // runs if the user goes to literally any route except /welcome
    if (!req.session.userId) {
        // if the user is NOT logged in, redirect them to /welcome, which is the only page
        // they're allowed to see
        res.redirect("/welcome");
    } else {
        // this runs if the user is logged in
        // in which case send back the HTML, after which start js kicks in and renders our p tag...
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

function calculateRate(currentRate, value, counter) {
    if (counter == 0) {
        return value;
    }
    var result =
        (currentRate * parseInt(counter) + parseInt(value)) /
        (parseInt(counter) + 1);
    return (Math.round(result * 100) / 100).toFixed(2);
}

server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});

io.on("connection", (socket) => {
    const userId = socket.request.session.userId;
    console.log("userid in socket", userId);
    console.log("socketId in socket", socket.id);
    console.log(`Socket with id: ${socket.id} has connected!`);

    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }

    db.selectMessage(socket.request.session.userId)
        .then(({ rows }) => {
            console.log("privateMessages", rows);
            io.sockets.sockets.get(socket.id).emit("privateMessages", {
                messages: rows,
            });
        })
        .catch((err) => console.log(err));

    //////////////////

    socket.on("privateMessage", function (data) {
        const { recipient, info } = data;
        const sender = socket.request.session.userId;
        const new_message = {};

        db.saveMessage(sender, recipient, info)
            .then(({ rows }) => {
                const { sender_id, recipient_id, info, id } = rows[0];

                new_message.info = info;
                new_message.sender_id = sender_id;
                new_message.recipient_id = recipient_id;
                new_message.messages_id = id;

                db.getId(sender_id).then(({ rows }) => {
                    const { username, imageurl } = rows[0];
                    new_message.first_name = username;
                    new_message.imageurl = imageurl;
                    console.log("private message inhalt", new_message);
                    io.sockets.sockets
                        .get(socket.id)
                        .emit("privateMessage", new_message);
                });
            })
            .catch((err) => console.log(err));
    });

    ////////////////////

    //Confirm the user is logged in by finding the user's id in socket.request.session.

    socket.on("disconnect", () => {
        // console.log(`Socket with id: ${socket.id} just DISCONNECTED!`);
    });
});
