import mongoose from 'mongoose';
import 'dotenv/config';

// Connect to MongoDB
const url = process.env.MONGO_URL;            // use dotenv's .env environment file
//   `mongodb+srv://fullstack:${password}@cluster0.ck2n2.mongodb.net/repos?retryWrites=true&w=majority`

mongoose.set('strictQuery',false);
if (!url) {
    throw new Error('MONGO_URL is undefined')
}
mongoose.connect(url);

export default mongoose;