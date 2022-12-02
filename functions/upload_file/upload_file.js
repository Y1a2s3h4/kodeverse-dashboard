const { config } = require("dotenv");
const mongoose = require("mongoose");
const Jobs = require("../models/jobs.medals");
const parser = require("lambda-multipart-parser");
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
    let result = await parser.parse(event);
    result = result.files[0].content.toString();
    result = JSON.parse(result);
    if (result.update === "one") {
      let {
        company_name,
        community: opening_site,
        email,
        job,
        domain,
        type,
      } = result;
      const Job = await Jobs.create({
        company_logo: `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${company_name}&size=512`,
        company_name,
        opening_site,
        type,
        email,
        tags: [
          `${company_name}`,
          "recruiting",
          "hr",
          "cv",
          "resume",
          "hiring",
          "jobs",
          "career",
          "kodeverse",
        ],
        job,
        domain,
      });
      Job.save();
      return {
        statusCode: 200,
        body: JSON.stringify(Job),
      };
    } else {
      console.log(result);
      let {
        company_details,
        community: opening_site,
        job,
        domain,
        type,
      } = result;
      let arrOfDetails = company_details.map((item) => ({
        company_logo: `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${item.name}&size=512`,
        company_name: item.name,
        opening_site,
        type,
        email: item.email,
        tags: [
          `${item.name}`,
          "recruiting",
          "hr",
          "cv",
          "resume",
          "hiring",
          "jobs",
          "career",
          "kodeverse",
          "job",
          "share",
        ],
        job,
        domain,
      }));
      // company_details.map(async (item, idx) => {
      //         console.log(`current item ${idx}: `, item);
      //         let Job = await Jobs.create({
      //           company_logo: `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${item.name}&size=512`,
      //           company_name: item.name,
      //           opening_site,
      //           type,
      //           email: item.email,
      //           tags: [
      //             `${item.name}`,
      //             "recruiting",
      //             "hr",
      //             "cv",
      //             "resume",
      //             "hiring",
      //             "jobs",
      //             "career",
      //             "kodeverse",
      //             "job",
      //             "share",
      //           ],
      //           job,
      //           domain,
      //         });
      //         Job.save();
      //       });
      await Jobs.insertMany(arrOfDetails);
      const jobsData = await Jobs.find({});
      return {
        statusCode: 200,
        body: JSON.stringify(jobsData),
      };
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};
module.exports = { handler };
