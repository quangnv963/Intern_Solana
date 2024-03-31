import mongoose from "mongoose";

const { Schema } = mongoose

const userSchema = new Schema(
    {
        name: {
            type:String,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
        },
        role: {
            type: String,
            enum: ["admin", "member"],
            default: "member",
        },
    },
    {versionKey: false }
);
export default mongoose.model("User", userSchema);
