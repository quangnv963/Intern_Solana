import mongoose from "mongoose";

const { Schema } = mongoose

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique:true,
        default:"UnCategory"

    },
    slug: {
        type: String,
        required: true,
        unique:true,
        default:"UnCategory"
    },
    
    
}, { versionKey: false });



export default mongoose.model('Category', categorySchema);
