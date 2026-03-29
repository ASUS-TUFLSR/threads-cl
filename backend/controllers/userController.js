import User from "../models/userModel.js";
import bcrypt from "bcryptjs"
import generateTokenAndSetCookies from "../utils/helpers/generateTokenAndSetCookies.js";

export const signupUser = async(req, res) => {
    try {
        const {name, email, username, password} = req.body;
        const user = await User.findOne({$or:[{email}, {username}]});

        if(!name || !username || !email || !password){
            return res.status(400).json({ message: "All field's are required" });
        }

        if(user) {
             if (user.email === email) {
             return res.status(400).json({ message: "Email already exists" });
              }
             if (user.username === username) {
             return res.status(400).json({ message: "Username already taken" });
              }
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name,
            email,
            username,
            password: hashedPassword
        });

            generateTokenAndSetCookies(newUser._id, res);
           
            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                username: newUser.username,
            });
        

    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log("Error in signup User ", error.message)
    }
}
