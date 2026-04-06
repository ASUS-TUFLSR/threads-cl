import User from "../models/userModel.js"
import Post from "../models/postModel.js"

export const createPost = async(req, res) => {
    try {
        const {postedBy, text, img} = req.body;

        if(!postedBy || !text) {
            res.status(400).json({message: "Please fill in all the fields"})
        }

        const user = await User.findById(postedBy);

        if(!user){
            res.status(404).json({message: "User not found"})
        }

        if(user._id.toString() !== req.user._id.toString()){
            return res.status(404).json({message: "Unauthorized"});
        }

        const maxLength = 500;
        if(text.length > maxLength){
            return res.status(400).json({message: `Text must be less than ${maxLength} characters`})
        }

        const newPost = new Post({postedBy, text, img});
        await newPost.save();

        res.status(201).json({message: "Post created successfully!", newPost})

    } catch (error) {
        res.status(500).json({message: error.message});
        console.log("Error in create post", error.message);
    }
}