var express = require("express");
var usersRouter = require("./routes/users");
var app = express();
app.use(express.json());

app.use("/users", usersRouter);
//process.env.PORT ||
app.listen(4000, () => {
    console.log('Server started on port 4000');
});

module.exports = app;   