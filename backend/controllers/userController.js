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

export const loginUser = async(req, res) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});
        const isPassword = await bcrypt.compare(password, user?.password || ""); // bcrypt can't compare with null values

        if(!user || !isPassword) {
            return res.status(400).json({message: "Invalid username or password"});
        }

        generateTokenAndSetCookies(user._id, res);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log("Error in Login User: ", error.message );
    }
}

export const logoutUser = async(req, res) => {
    try {
        res.cookie("jwt", "",{maxAge:1});
        res.status(200).json("User logged out successfully")
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log("Error in logout User: ", error.message);
    }
}


export const followUnfollowUser = async(req, res) => {
    try {
        const { id } = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if(id === req.user._id) return res.status(400).json({message: "You cannot follow/unfollow yourself"});

        if(!userToModify || !currentUser) return res.status(400).json({message: "User not found"});

    } catch (error) {
        res.status(500).json({message: error.message});
        console.log("Error in FollowUnfollowUser: ", error.message)
    }
}
