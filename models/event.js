const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        registrationClosed: {
            type: Boolean,
            required: true,
            default: false,
        },
        registeredStudents: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    {
        timestamps: true,
    }
);

eventSchema.methods.canBeDeletedBy = function (userRole) {
    return userRole === "ADMINISTRATOR";
};

eventSchema.methods.canBeEditedBy = function (userRole) {
    return userRole === "ADMINISTRATOR";
};

eventSchema.methods.canBeRegisteredBy = function (userRole) {
    return userRole === "STUDENT";
};

eventSchema.methods.canBeUnregisteredBy = function (userRole) {
    return userRole === "ADMINISTRATOR" || userRole === "FACULTY";
};

module.exports = mongoose.model("Event", eventSchema);
