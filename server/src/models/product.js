import mongoose from "mongoose";

const { Schema } = mongoose

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
    },
    Desc:{
        type:String
    },
    categoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        require:true
    }
    
}, { versionKey: false });



export default mongoose.model('Product', productSchema);
