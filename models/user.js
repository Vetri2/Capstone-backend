const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ["ADMINISTRATOR", "STUDENT", "FACULTY"],
    },
});

userSchema.methods.isAdmin = function () {
    return this.role === "ADMINISTRATOR";
};

userSchema.methods.isStudent = function () {
    return this.role === "STUDENT";
};

userSchema.methods.isFaculty = function () {
    return this.role === "FACULTY";
};

userSchema.pre("save", async function (next) {
    try {
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(this.password, salt);
        this.password = hash;
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model("User", userSchema);
