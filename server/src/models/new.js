import mongoose from "mongoose";

const { Schema } = mongoose

const productSchema = new Schema({
    img: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
    },
    date:{
        type:String
    }
    
}, { versionKey: false });



export default mongoose.model('New', productSchema);
