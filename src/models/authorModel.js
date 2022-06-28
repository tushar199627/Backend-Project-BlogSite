const mongoose =require('mongoose');

const authorSchema = new mongoose.Schema({
    title: {
        type: String,
        enum: ["Mr", "Miss", "Mrs"]
    },
    fname:{type:String,
        required:true 
    },
    lname:{ type: String,
        required:true
    },
    emailId: {type:String,
        unique:true,
        required:true

    },
    password: {type: String,
        required:true
    },
  
},
    { timestamps: true });


    module.exports = mongoose.model('author', authorSchema)

