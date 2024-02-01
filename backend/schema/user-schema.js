import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { type: String,  require:true},
    email: { type: String, unique: true, require:true},
    username: { type: String, unique: true , require:true},
    password: { type: String,  require:true},
    profilepicture:{ type:String ,default:'0'},
    profilepictureid:{ type:String,default:'0' },
    verified: { type:Boolean, default:false},
    followers:[{ type: mongoose.Types.ObjectId, ref: "User" }],
    following:[{ type: mongoose.Types.ObjectId, ref: "User" }],
    birthday:{ type:String}
   
},{timestamps:true})

UserSchema.index({ createdAt: 1 }, { expireAfterSeconds: 360, partialFilterExpression: { verified: false } });
const User= mongoose.model('User',UserSchema)

export default User;