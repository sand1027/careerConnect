import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async(req, res) => {
    try {
        const { fullname, email, password, role } = req.body;

        console.log(fullname, email, password, role);

        // Check if any required field is missing
        if (!fullname || !email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false,
            });
        }

        // Check if the file exists and upload it if present
        let profilePhotoUrl = null; // Default to null if no file is uploaded
        const file = req.file;
        if (file) {
            const fileUri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            profilePhotoUrl = cloudResponse.secure_url; // Assign Cloudinary URL to the profile photo
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists with this email.',
                success: false,
            });
        }

        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user with the provided data
        const newUser = await User.create({
            fullname, // Use 'fullname' as per the schema
            email,
            // Ensure phoneNumber is included
            password: hashedPassword,
            role,
            profile: {
                profilePhoto: profilePhotoUrl, // Include profile photo URL if provided
            },
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true,
            user: {
                fullname: newUser.fullname,
                email: newUser.email,
                phoneNumber: newUser.phoneNumber,
                role: newUser.role,
                profilePhoto: newUser.profile.profilePhoto,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error",
            success: false,
        });
    }
};

export const login = async(req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        };
        // check role is correct or not
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            })
        };

        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });


        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}


export const logout = async(req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const updateProfile = async(req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;

        const file = req.file;
        // cloudinary ayega idhar
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);



        let skillsArray;
        if (skills) {
            skillsArray = skills.split(",");
        }
        const userId = req.id;
        let user = await User.findById(userId);
        console.log(userId)
        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            })
        }
        // updating data
        if (fullname) user.fullname = fullname
        if (email) user.email = email
        if (phoneNumber) user.phoneNumber = phoneNumber
        if (bio) user.profile.bio = bio
        if (skills) user.profile.skills = skillsArray

        // resume comes later here...
        if (cloudResponse) {
            user.profile.resume = cloudResponse.secure_url
            user.profile.resumeOriginalName = file.originalname // Save the original file name
        }


        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).json({
            message: "Profile updated successfully.",
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const savedJobs = async(req, res) => {
    try {
        const { jobId } = req.body;
        const userId = req.id;

        let user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            })
        }

        if (user.profile.savedJobs.includes(jobId)) {
            return res.status(400).json({
                message: "Job is already saved",
                success: false
            })
        }

        user.profile.savedJobs.push(jobId);
        await user.save()

        await user.populate('profile.savedJobs');
        return res.status(200).json({
            user,
            message: "Job saved successfully",
            success: true,
            savedJobs: user.profile.savedJobs
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred",
            error: error.message,
            success: false
        });

    }
}