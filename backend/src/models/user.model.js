
import mongoose from "mongoose"
import bcryptjs from "bcryptjs"

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique: true,
        trim:true,
        match:[/.+\@.+\..+/, "Please enter a valid email address"]
    },
    password:{
        type:String,    
        required:true,
        select:false
    },
    profileImage:{
        type:String,
        default:"",
    },

},{timestamps: true})

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next()
    this.password = await bcryptjs.hash(this.password, 10)     
    next()  
})

const User = mongoose.model("User", userSchema)

export default User;