import mongoose from 'mongoose';

export const connect = () => {
    mongoose.connect('mongodb://localhost:27017/mydatabase', {
        // useNewUrlParser: true,
        // useUnifiedTopology: true
    })
        .then(() => console.log("Connected successfully to MongoDB"))
        .catch(err => console.error('MongoDB connection error:', err));

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
};
