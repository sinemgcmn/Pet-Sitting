const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");

app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.get("/welcome", (req, res) => {
    // is going to run if the user puts /welcome in the url bar
    if (req.session.userId) {
        // if the user is logged in, they are NOT allowed to see the welcome page
        // so we redirect them away from /welcome and towards /, a page they're allowed to see
        res.redirect("/");
    } else {
        // send back HTML, which will then trigger start.js to render Welcome in DOM
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.post("/registration", (req, res) => {
    const { first, last, email, password } = req.body;
    if (first && last && email && password) {
        hash(password).then((hashedPassword) => {
            db.userInputForReg(first, last, email, hashedPassword).then(
                ({ rows }) => {
                    // console.log(rows);
                    req.session.userId = rows[0].id;
                    res.json({
                        success: true,
                    });
                }
            );
        });
    } else {
        res.json({
            success: false,
        });
    }
});

app.post("/login", (req, res) => {
    const { password, email } = req.body;
    if (email && password) {
        db.userInputForLog(email).then(({ rows }) => {
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
                        });
                    } else {
                        res.json({
                            success: false,
                        });
                    }
                });
            }
        });
    } else {
        res.json({
            success: false,
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
                db.userInputForReset(email, secretCode).then(({ rows }) => {
                    // console.log(rows);
                    ses.sendEmail(
                        email,
                        secretCode,
                        "Here is your security code to reset your password!"
                    );
                    res.json({
                        success: true,
                    });
                });
            }
        });
    } else {
        res.json({
            success: false,
        });
    }
});

app.post("/reset/verify", (req, res) => {
    const { secretCode, password, email } = req.body;
    // console.log("req.body.code", req.body.code);
    db.userCodeForReset(secretCode).then(({ rows }) => {
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
                hash(req.body.password).then((hashedPassword) => {
                    // console.log(req.body.password);
                    // console.log(hashedPassword);
                    // console.log(email);
                    db.selectFromResetCode(req.body.code).then(({ rows }) => {
                        // console.log("selectFromResetCode", rows);
                        db.updatePassword(rows[0].email, hashedPassword);
                        console.log("I am hashed");
                        res.json({
                            success: true,
                        });
                    });
                });
            }
        }
    });
});

// app.get("*", function (req, res) {
//     // runs if the user goes to literally any route except /welcome
//     if (!req.session.userId) {
//         // if the user is NOT logged in, redirect them to /welcome, which is the only page
//         // they're allowed to see
//         res.redirect("/welcome");
//     } else {
//         // this runs if the user is logged in
//         // in which case send back the HTML, after which start js kicks in and renders our p tag...
//         res.sendFile(path.join(__dirname, "..", "client", "index.html"));
//     }
// });

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
