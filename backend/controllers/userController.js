import User from "../models/userModel.js";
import bcrypt from "bcryptjs"
import generateTokenAndSetCookies from "../utils/helpers/generateTokenAndSetCookies.js";
import { v2 as cloudinary } from "cloudinary"


export const getUserProfile = async(req, res) => {
      const {username} = req.params;
      try {
        const user = await User.findOne({username}).select("-password -updatedAt")
        if(!user) return res.status(400).json({error: "User not found"});
       
        res.status(200).json(user)
      } catch (error) {
        res.status(500).json({error: error.message});
        console.log("Error in userProfile", error);
      }      
}

export const signupUser = async(req, res) => {
    try {
        const {name, email, username, password} = req.body;
        const user = await User.findOne({$or:[{email}, {username}]});

        if(!name || !username || !email || !password){
            return res.status(400).json({ error: "All field's are required" });
        }

        if(user) {
             if (user.email === email) {
             return res.status(400).json({ error: "Email already exists" });
              }
             if (user.username === username) {
             return res.status(400).json({ error: "Username already taken" });
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
        res.status(500).json({ error: error.message });
        console.log("Error in signup User ", error.message)
    }
}

export const loginUser = async(req, res) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});
        const isPassword = await bcrypt.compare(password, user?.password || ""); // bcrypt can't compare with null values

        if(!user || !isPassword) {
            return res.status(400).json({error: "Invalid username or password"});
        }

        generateTokenAndSetCookies(user._id, res);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log("Error in Login User: ", error.message );
    }
}

export const logoutUser = async(req, res) => {
    try {
        res.cookie("jwt", "",{maxAge:1});
        res.status(200).json("User logged out successfully")
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log("Error in logout User: ", error.message);
    }
}


export const followUnfollowUser = async(req, res) => {
    try {
        const { id } = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if(id === req.user._id.toString()) return res.status(400).json({error: "You cannot follow/unfollow yourself"});

        if(!userToModify || !currentUser) return res.status(400).json({error: "User not found"});
        const isFollowing = currentUser.following.includes(id);

        if(isFollowing){
            // Unfollow User
            // Modify current user following, modify follwers of userToModify
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
            res.status(200).json({message: "User unfollowed successfully"});
        } else {
            // Follow User
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
            res.status(200).json({message: "User followed successfully"});
        }
    } catch (error) {
        res.status(500).json({error: error.message});
        console.log("Error in FollowUnfollowUser: ", error.message)
    }
}

export const updateUser = async(req, res) => {
     const {name, email, username, password, bio} = req.body;
     let { profilePic } = req.body;
     const userId = req.user._id;
    try {
      let user = await User.findById(userId);
      if(!user) return res.status(400).json({error: "User not found"});
      
        if(req.params.id !== userId.toString()){
            return res.status(400).json({error: "You cannot update other user's profile"})
        }

      if(password){
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user.password = hashedPassword;
      }

      if(profilePic){
        if(user.profilePic){
            await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0])
        }
        const uploadedResponse = await cloudinary.uploader.upload(profilePic);
        profilePic = uploadedResponse.secure_url;
      }

      user.name = name || user.name;
      user.email = email || user.email;
      user.bio = bio || user.bio;
      user.profilePic = profilePic || user.profilePic;
      user.username = username || user.username;

      user = await user.save();

      res.status(200).json({message: "Profile updated successfully", user})

    } catch (error) {
        res.status(500).json({error: error.message});
        console.log("Error in UpdateUser: ", error.message);
    }
}


