const mongoose = require("mongoose");
const Jobs = require("../models/jobs.medals");
const { config } = require("dotenv");

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
    const body = JSON.parse(event.body);
    const {
      company_logo,
      company_name,
      opening_site,
      type,
      email,
      tags,
      job,
      domain,
    } = body;
    console.log({
      company_logo,
      company_name,
      opening_site,
      type,
      email,
      tags,
      job,
      domain,
    });
    const Job = await Jobs.create({
      company_logo,
      company_name,
      opening_site,
      type,
      email,
      tags,
      job,
      domain,
    });
    Job.save();
    return { statusCode: 200, body: JSON.stringify(Job) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify(error) };
  }
};

module.exports = { handler };
