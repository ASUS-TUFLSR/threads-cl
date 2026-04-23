import User from "../models/userModel.js"
import Post from "../models/postModel.js"

export const createPost = async(req, res) => {
    try {
        const {postedBy, text, img} = req.body;

        if(!postedBy || !text) {
            res.status(400).json({error: "Please fill in all the fields"})
        }

        const user = await User.findById(postedBy);

        if(!user){
            res.status(404).json({error: "User not found"})
        }

        if(user._id.toString() !== req.user._id.toString()){
            return res.status(404).json({error: "Unauthorized"});
        }

        const maxLength = 500;
        if(text.length > maxLength){
            return res.status(400).json({error: `Text must be less than ${maxLength} characters`})
        }

        const newPost = new Post({postedBy, text, img});
        await newPost.save();

        res.status(201).json({message: "Post created successfully!", newPost})

    } catch (error) {
        res.status(500).json({error: error.message});
        console.log("Error in create post", error.message);
    }
}

export const getPost = async(req, res) => {
        try {
            const post = await Post.findById(req.params.id);

            if(!post){
                return res.status(404).json({ error: "Post not found" })
            }
            res.status(200).json({message: "Post found", post})
        } catch (error) {
            res.status(500).json({error: error.message});
            console.log("Unable to fetch posts", error.message)
        }   
}

export const deletePost = async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({error: "Post not found"});
        }

        if(post.postedBy.toString() !== req.user._id.toString()){
            return res.status(401).json({error: "Unauthorized"})    
        }

        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({message: "Post deleted successfully!"})
    } catch (error) {
        res.status(500).json({error: error.message});
        console.log("Unable to delete post", error.message);
    }
}

export const likeUnlikePost = async(req, res) => {
    try {
        const {id: postId} = req.params;
        const userId = req.user._id;

        const post = await Post.findById(postId);

        if(!post){
            res.status(404).json({error: "Not found"});
        }

        const userLikePost = post.likes.includes(userId);
        
        if(userLikePost){
            await Post.updateOne({_id: postId}, {$pull: {likes: userId}});
            res.status(200).json({message: "Post unliked successfully"});
        }else{
            post.likes.push(userId);
            await post.save();
            res.status(200).json({message: "Post liked successfully"})
        }
    } catch (error) {
        res.status(500).json({error: error.message});
        console.log("Error in likeUnlike", error.message);
    }
}

export const replyToPost = async(req, res) => {
    try {
        const {text} = req.body;
        const postId = req.params.id;
        const userId = req.user._id;
        const userProfilePic = req.user.userProfilePic;
        const username = req.user.username;

        if(!text){
            res.status(400).json({error: "Text field is required"});
        }

        const post = await Post.findById(postId);
        if(!post){
            res.status(404).json({error: "Post not found!"});
        }

        const reply = {userId, text, userProfilePic, username};

        post.replies.push(reply);
        await post.save();

        res.status(200).json({message: "Reply added successfully", post})
    } catch (error) {
        res.status(500).json({error: error.message});
        console.log("Error in reply post", error.message);
    }
}

export const getFeedPosts = async(req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if(!user){
            res.status(404).json({error: "User not found"});
        }

        const following = user.following;
        const feedPosts = await Post.find({postedBy: {$in:following}}).sort({createdAt: -1});

        res.status(200).json({feedPosts})
    } catch (error) {
        res.status(500).json({error: error.message});
        console.log("Error in getFeed", error.message);
    }
}