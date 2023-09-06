const mongoose = require("mongoose");

const JobSchema = mongoose.Schema({
  nameJob: {
    type: String,
  },
  description: {
    type: String,
  },
  timeWork: {
    type: String,
  },
  moneyWork: {
    type: String,
  },
  skill: {
    type: Array,
  },
  status: {
    type: String,
  },
  jobType: {
    type: String,
  },
  careerLevel: {
    type: String,
  },
  experience: {
    type: String,
  },
  gender: {
    type: String
  },
  address: {
    type: String
  },
  zipCode: {
    type: String
  },
  // latitude: {
  //   type: String
  // },
  // longitude: {
  //   type: String
  // },
  category: {
    type: String
  },
  ownerPerson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  proposal: [
    {
      idUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      file: {
        type: String,
      },
      hourRate: {
        type: String,
      },
      status: {
        type: String,
      },
    },
  ],
},{ timestamps: true });

const Job = mongoose.model("Job", JobSchema);

module.exports = Job;
