import mongoose from 'mongoose'

const repoSchema = new mongoose.Schema({
  id: Number,
  user: String,
  repoName: String,
  url: String,
  stars: Number,
  description: String,
  topics: [],
  repoLink: String,
  commits: Number
})

export default repoSchema