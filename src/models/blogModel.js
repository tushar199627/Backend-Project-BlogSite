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
    tags: { type: [String],
    },
    catagory: {type:[String],
        required:true
    },
    subcategory: {
        type: [String],
    },
    publishedAt: Date,
    ispublished: {type: Boolean,
                default:false
    },
    deleteAt: Date,
    isDeleted:{type: Boolean,
        default:false
    },
}, {timestamps: true });


module.exports = mongoose.model('Blog', blogSchema) //users


