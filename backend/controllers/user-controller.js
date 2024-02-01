import User from "../schema/user-schema.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'
import crypto from 'crypto'
import Token from "../schema/userToken-schema.js";
// import sendEmail from "../send-grid/sendgrid.js";
import dotenv from 'dotenv';
dotenv.config();

// for registration
const registeruser = async (req, res) => {
  const user = req.body;
  const { name, email, username, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const userfind = await User.findOne({ $or: [{ username: username }, { email: email }] });
  try {
    if (userfind) {
      return res.json({ message: 'User Already Exists' })

    } else {
      const userWithHashedPassword = { name, email, username, password: hashedPassword }
      const newUser = await new User({ ...userWithHashedPassword }).save();
      console.log(newUser);
      res.json({ message: 'User Added Successfully Sending Verification Email', newUser: userWithHashedPassword })

      const token = await new Token({
        userid: newUser._id,
        emailToken: crypto.randomBytes(64).toString("hex")
      }).save();

      const apiNodemaileruser = process.env.NODEMAILER_USER;
      const apiNodemailerpass = process.env.NODEMAILER_PASS;
      console.log(apiNodemaileruser)
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: apiNodemaileruser,
          pass: apiNodemailerpass
        }
      });
      const link=`${process.env.BASE_URL}/api/auth/confirm/${token.emailToken}`

      var mailOptions = {
        from: apiNodemaileruser,
        to: email,
        subject: 'Sending donkey using Node.js',
        text: 'That was easy!',
        html: `<center><a href=${link}><button style="font-size:3rem;color:white;background-color:green">Verify</button></a></center><br><center><img src="https://th.bing.com/th?id=OIP.2-KpRxUs419A0xxrogxqTQHaFz&w=282&h=221&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2"></img></center>`
      };

      transporter.sendMail(mailOptions, async function (error, info) {
        if (error) {
          res.json({ message: 'error lol' })
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);



        }
      });




    }
  } catch (error) {
    res.json({ message: 'Check the email format' })
  }


}



// for login
const loginperson = async (req, res) => {
  const user = req.body;
  const userfind = await User.findOne({ username: user.username });
  if (userfind) {
    const isPasswordCorrect = await bcrypt.compare(user.password, userfind.password)
    console.log(isPasswordCorrect)
    if (isPasswordCorrect) {
      const token = jwt.sign(
        { userid:userfind._id,
          name: userfind.name,
          email: userfind.email
        }, process.env.JWTCODE, { expiresIn: "7d" }
      )
      if (!userfind.verified) {
        res.json({ message: 'Verify Your Email' })
      } else {
        return res.json({ message: 'Login Successful', user: token, logined: true, userDetails: { email: userfind.email, name: userfind.name },userid:userfind._id})
      }


    } else {
      res.json({ message: 'Password Incorrect', logined: false })
    }
  } else {
    res.json({ message: 'User Not Found ' })
  }
}


const VerifyToken=async(req,res)=>{
     try {
      const finaltoken= await Token.findOne({
          emailToken:req.params.token
      });
      console.log('verified token',finaltoken.emailToken)
      await User.updateOne({_id:finaltoken.userid},{$set:{verified:true}})
      await Token.findByIdAndRemove(finaltoken._id)
      res.json({message:'Email Verified'})
     } catch (error) {
      console.log(error)
     }
}

// const confirmToken=async(req,res)=>{
//   console.log(req.params.token)
//   try {
//     const finaltoken= await Token.findOne({
//         emailToken:req.params.token
//     });
//     console.log(finaltoken)
//     await User.updateOne({_id:finaltoken.userid},{$set:{verified:true}})
//    } catch (error) {
//     console.log(error)
//   }
// }






export { registeruser, loginperson,VerifyToken};






