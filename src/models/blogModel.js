const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const blogSchema = new mongoose.Schema( {
    title:{ type:String,
        required:true
    },
    body: {type:String,
        required:true
    },
    authorId: {
        type: ObjectId,
        ref: "author",
        required:true
    },
    tags:[String],
    catagory: {type:[String],
        required:true
    },
    subcategory: [String],
    publishedAt:{type: Date,
        default:null},
    ispublished: {type: Boolean,
                default:false
    },
    deleteAt: {type:Date,
        default:null},
    isDeleted:{type: Boolean,
        default:false
    },
}, {timestamps: true });


module.exports = mongoose.model('Blog', blogSchema) 


