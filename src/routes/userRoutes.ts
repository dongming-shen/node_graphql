// userRoutes.ts
import express from 'express';
import {User} from '../models/userModel'; // Adjust the import path as needed

const router = express.Router();

// CREATE a new user
router.post('/', async (req, res) => {
    try {
        const newUser = new User(req.body);
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        if (error instanceof Error) {
            // Now TypeScript knows that error is of type Error
            res.status(400).json({message: error.message});
        } else {
            // Handle the case where the error is not an Error object
            res.status(500).json({message: "An unknown error occurred"});
        }
    }
});

// READ all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        if (error instanceof Error) {
            // Now TypeScript knows that error is of type Error
            res.status(400).json({message: error.message});
        } else {
            // Handle the case where the error is not an Error object
            res.status(500).json({message: "An unknown error occurred"});
        }
    }
});

// READ a single user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) res.status(404).json({message: 'User not found'});
        res.json(user);
    } catch (error) {
        if (error instanceof Error) {
            // Now TypeScript knows that error is of type Error
            res.status(400).json({message: error.message});
        } else {
            // Handle the case where the error is not an Error object
            res.status(500).json({message: "An unknown error occurred"});
        }
    }
});

// UPDATE a user by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.json(updatedUser);
    } catch (error) {
        if (error instanceof Error) {
            // Now TypeScript knows that error is of type Error
            res.status(400).json({message: error.message});
        } else {
            // Handle the case where the error is not an Error object
            res.status(500).json({message: "An unknown error occurred"});
        }
    }
});

// DELETE a user by ID
router.delete('/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({message: 'User Deleted'});
    } catch (error) {
        if (error instanceof Error) {
            // Now TypeScript knows that error is of type Error
            res.status(400).json({message: error.message});
        } else {
            // Handle the case where the error is not an Error object
            res.status(500).json({message: "An unknown error occurred"});
        }
    }
});

export default router;
