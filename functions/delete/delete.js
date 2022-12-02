const { config } = require("dotenv");
const mongoose = require("mongoose");
const Jobs = require("../models/jobs.medals");
const handler = async (event) => {
  try {
    config({
      path: "functions\\.env",
    });
    mongoose
      .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => console.log("Connected to MongoDB"))
      .catch((err) => console.log(err));

    const jobId = event.queryStringParameters.jobId;
    await Jobs.deleteOne({ _id: jobId });
    const jobsData = await Jobs.find({});
    return {
      statusCode: 200,
      body: JSON.stringify(jobsData),
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };
