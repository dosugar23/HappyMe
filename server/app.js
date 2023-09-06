const express = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const nodemailer = require("nodemailer");
const formEmail = require('./template/formEmail').formEmail;

cloudinary.config({
  cloud_name: "khanhbatluc",
  api_key: "139429812855649",
  api_secret: "ZbaVRrQYqmnqUo_eJO79RHQYWg8",
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "pdf_files", // Specify the folder where the uploaded files will be stored in Cloudinary
    resource_type: "auto", // Allow all types of files to be uploaded
    format: "pdf",
    pages: true,
  },
});

const upload = multer({ storage });

const io = require("socket.io")(8080, {
  cors: {
    origin: "http://localhost:3000",
  },
});

// Connect DB
require("./db/connection");

// Import Files
const Users = require("./models/Users");
const Conversations = require("./models/Conversations");
const Messages = require("./models/Messages");
const Category = require("./models/Category");
const Job = require("./models/Job");
const HistoryDraw = require("./models/HistoryDraw");
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// app Use
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const port = process.env.PORT || 8000;

// Socket.io
let users = [];
io.on("connection", (socket) => {
  console.log("User connected", socket.id);
  socket.on("addUser", (userId) => {
    const isUserExist = users.find((user) => user.userId === userId);
    if (!isUserExist) {
      const user = { userId, socketId: socket.id };
      users.push(user);
      io.emit("getUsers", users);
    }
  });

  socket.on(
    "sendMessage",
    async ({ senderId, receiverId, message, conversationId }) => {
      const receiver = users.find((user) => user.userId === receiverId);
      const sender = users.find((user) => user.userId === senderId);
      const user = await Users.findById(senderId);

      if (receiver) {
        io.to(receiver.socketId)
          .to(sender.socketId)
          .emit("getMessage", {
            senderId,
            message,
            conversationId,
            receiverId,
            user: {
              id: user._id,
              fullName: user.fullName,
              email: user.email,
              avatar: user.avatar,
            },
          });
      } else {
        io.to(sender.socketId).emit("getMessage", {
          senderId,
          message,
          conversationId,
          receiverId,
          user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            avatar: user.avatar,
          },
        });
      }
    }
  );

  socket.on("disconnect", () => {
    users = users.filter((user) => user.socketId !== socket.id);
    io.emit("getUsers", users);
  });
  // io.emit('getUsers', socket.userId);
});

// Routes
app.get("/", (req, res) => {
  res.send("Welcome");
});

app.post("/api/register", async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      password,
      address,
      phone,
      avatar,
      gender,
      birthday,
      skill,
      isWorker,
    } = req.body;

    if (
      !fullName ||
      !email ||
      !password ||
      !address ||
      !phone ||
      !gender ||
      !birthday ||
      !skill
      // !isWorker
    ) {
      res.status(400).send("Please fill all required fields");
    } else {
      const isAlreadyExist = await Users.findOne({ email });
      if (isAlreadyExist) {
        res.status(400).send("User already exists");
      } else {
        const newUser = new Users({
          fullName,
          email,
          address,
          phone,
          avatar,
          gender,
          birthday,
          skill,
          isWorker,
          role : isWorker ? 'freelance' : 'company',
          money: 0
        });
        bcryptjs.hash(password, 10, (err, hashedPassword) => {
          newUser.set("password", hashedPassword);
          newUser.save();
          next();
        });
        return res.status(200).send("User registered successfully");
      }
    }
  } catch (error) {
    console.log(error, "Error");
  }
});

app.get("/api/get-all-categories", async (req, res) => {
  try {
    const all = await Category.find({});

    if (all) {
      return res.status(200).json({ all });
    }
  } catch (error) {
    console.log(error, "Error");
  }
});

app.get("/api/get-detail-users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const all = await Users.findById(id);

    if (all) {
      return res.status(200).json({ all });
    }
  } catch (error) {
    console.log(error, "Error");
  }
});

app.post("/api/create-category", async (req, res, next) => {
  try {
    const { nameCategory, description } = req.body;

    if (!nameCategory || !description) {
      res.status(400).send("Please fill all required fields");
    } else {
      const category = new Category({
        nameCategory,
        description,
      });

      category.save();
      res.status(200).json("Success");
    }
  } catch (error) {
    console.log(error, "Error");
  }
});

app.post("/api/update-category/:id", async (req, res, next) => {
  try {
    const { nameCategory, description } = req.body;
    const data = Category.findOne({ _id: req.params.id });

    if (data) {
      data.nameCategory = nameCategory;
      data.description = description;
      data.save();

      return res.status(200).json("success");
    }
  } catch (error) {
    console.log(error, "Error");
  }
});

app.delete("/api/delete-category/:id", async (req, res) => {
  try {
    Category.deleteOne({ _id: req.params.id });
    return res.status(200).json("success");
  } catch (error) {
    console.log(error, "Error");
  }
});

app.delete("/api/delete-user/:id", async (req, res) => {
  try {
    await Users.deleteOne({ _id: req.params.id });
    return res.status(200).json("success");
  } catch (error) {
    console.log(error, "Error");
  }
});

app.get("/api/get-all-user", async (req, res) => {
  try {
    const user = await Users.find({ role : {$ne: 'admin'}});
    if (user) {
      return res.status(200).json(user);
    }
  } catch (error) {
    console.log(error, "Error");
  }
});

app.get("/api/get-user/:id", async (req, res) => {
  try {
    const user = await Users.findById(req.params.id);
    if (user) {
      return res.status(200).json(user);
    }
  } catch (error) {
    console.log(error, "Error");
  }
});

app.put("/api/update-user/:userId", async (req, res) => {
  const userId = req.params.userId;
  const updatedUserData = req.body;

  try {
    // Update the user in the database
    const updatedUser = await Users.findByIdAndUpdate(userId, updatedUserData, {
      new: true,
    });

    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(500).json({ error: "Can not find id user" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
});

app.post("/api/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).send("Please fill all required fields");
    } else {
      const user = await Users.findOne({ email });
      if (!user) {
        res.status(400).send("User email or password is incorrect");
      } else {
        const validateUser = await bcryptjs.compare(password, user.password);
        if (!validateUser) {
          res.status(400).send("User email or password is incorrect");
        } else {
          const payload = {
            userId: user._id,
            email: user.email,
          };
          const JWT_SECRET_KEY =
            process.env.JWT_SECRET_KEY || "THIS_IS_A_JWT_SECRET_KEY";

          jwt.sign(
            payload,
            JWT_SECRET_KEY,
            { expiresIn: 84600 },
            async (err, token) => {
              await Users.updateOne(
                { _id: user._id },
                {
                  $set: { token },
                }
              );
              user.save();
              return res
                .status(200)
                .json({
                  user: {
                    id: user._id,
                    email: user.email,
                    fullName: user.fullName,
                    role: user.role,
                    phone: user.phone,
                    money: user.money
                  },
                  token: token,
                });
            }
          );
        }
      }
    }
  } catch (error) {
    console.log(error, "Error");
  }
});

app.post("/api/add-job", async (req, res) => {
  const postData = req.body;
  try {
    const post = await Job.create(postData);
    res.status(200).json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
});

app.get("/api/get-show-all-job/:page/:limit", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.params;

    // Calculate the offset and convert query parameters to numbers
    const offset = (page - 1) * limit;
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    // Query the database for items, applying pagination
    const items = await Job.find().skip(offset).limit(limitNumber).exec();

    // Count the total number of items in the collection
    const totalCount = await Job.countDocuments();

    res.status(200).json({
      items,
      totalPages: Math.ceil(totalCount / limitNumber),
      currentPage: pageNumber,
    });
  } catch (error) {
    console.error("Error retrieving items:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/filter-all-job/:page/:limit/:name/:category", async (req, res) => {
  try {
    const { page = 1, limit = 10, name, category } = req.params;

    // Calculate the offset and convert query parameters to numbers
    const offset = (page - 1) * limit;
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const filterQuery = {};
    if (name && name != 0) {
      filterQuery.nameJob = { $regex: name, $options: "i" }; // Perform case-insensitive regex search for key
    }

    // Query the database for items, applying pagination
    const items = await Job.find(filterQuery).skip(offset).limit(limitNumber).exec();

    // Count the total number of items in the collection
    const totalCount = await Job.countDocuments();

    res.status(200).json({
      items,
      totalPages: Math.ceil(totalCount / limitNumber),
      currentPage: pageNumber,
    });
  } catch (error) {
    console.error("Error retrieving items:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/search-job/:page", async (req, res) => {
  try {
    // Get filter options from query parameters
    const { page = 1, limit = 10 } = req.params;

    // Calculate the offset and convert query parameters to numbers
    const offset = (page - 1) * limit;
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const { key, zip, category, experience, jobLevel, salary } = req.body;

    // Construct the filter query dynamically based on the provided options
    const filterQuery = {};
    if (key) {
      filterQuery.nameJob = { $regex: key, $options: "i" }; // Perform case-insensitive regex search for key
    }
    if (zip) {
      filterQuery.zipCode = { $regex: zip, $options: "i" }; // Perform case-insensitive regex search for zip
    }
    if (category.length > 0) {
      filterQuery.category = { $in: category };
    }
    if (experience.length > 0) {
      filterQuery.experience = { $in: experience };
    }
    if (jobLevel.length > 0) {
      filterQuery.careerLevel = { $in: jobLevel };
    }
    if (salary.length > 0) {
      filterQuery.moneyWork = { $in: salary };
    }

    // Perform the filtering query
    const filteredItems = await Job.find(filterQuery)
      .skip(offset)
      .limit(limitNumber)
      .exec();

    const totalCount = await Job.countDocuments();

    res.status(200).json({
      items: filteredItems,
      totalPages: Math.ceil(totalCount / limitNumber),
      currentPage: pageNumber,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/api/get-list-job/:id", async (req, res) => {
  try {
    const job = await Job.find({ ownerPerson: req.params.id });
    if (job) {
      return res.status(200).json(job);
    }
  } catch (error) {
    console.log(error, "Error");
  }
});

app.get("/api/get-list-job-has-send/:id", async (req, res) => {
  try {
    const idPerson = req.params.id;
    const job = await Job.find({});

    const listJobDependence = job.filter((item) => {
      const filterMember = item?.proposal.filter((e) => e.idUser == idPerson);
      return filterMember.length > 0;
    });

    return res.json(listJobDependence);
  } catch (error) {
    console.log(error, "Error");
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/get-all-list-job", async (req, res) => {
  try {
    const job = await Job.find({}).populate('ownerPerson');
    if (job) {
      return res.status(200).json(job);
    }
  } catch (error) {
    console.log(error, "Error");
  }
});

app.get("/api/get-detail-job/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("proposal.idUser");
    if (job) {
      return res.status(200).json(job);
    }
  } catch (error) {
    console.log(error, "Error");
  }
});

app.get("/api/get-related-job/:id", async (req, res) => {
  try {
    const job = await Job.find({ _id: { $ne: req.params.id } });
    if (job) {
      return res.status(200).json(job);
    }
  } catch (error) {
    console.log(error, "Error");
  }
});

app.put("/api/edit-job/:id", async (req, res) => {
  const jobId = req.params.id;
  const updateJobData = req.body;

  try {
    // Update the user in the database
    const updatedUser = await Job.findByIdAndUpdate(jobId, updateJobData, {
      new: true,
    });

    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(500).json({ error: "Can not find id job" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update job" });
  }
});

app.delete("/api/delete-job/:id", async (req, res) => {
  try {
    const data = await Job.deleteOne({ _id: req.params.id });
    if (data) {
      return res.status(200).json("success");
    }
  } catch (error) {
    console.log(error, "Error");
  }
});

app.post("/api/apply-proposals/:idPost", async (req, res) => {
  try {
    const { idUser, file, hourRate, status } = req.body;
    const postId = req.params.idPost;

    const job = await Job.findById(postId);
    if (!job) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    const alreadyReviewed = job.proposal.find(
      (r) => r.idUser.toString() === idUser.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).json({ error: "Proposal already reviewed" });
    }

    const review = {
      idUser,
      file,
      hourRate,
      status,
    };

    job.proposal.push(review);
    await job.save();
    res.status(200).json({ message: "Review added" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/api/update-proposals/:idPost/:idProposals", async (req, res) => {
  try {
    const { status } = req.body;
    const { idPost, idProposals } = req.params;

    const job = await Job.findById(idPost);
    if (!job) {
      return res.status(400).json("error");
    }

    const proposal = job.proposal.id(idProposals);
    if (!proposal) {
      return res.status(400).json("error");
    }

    const updatedData = {
      status,
    };

    Object.assign(proposal, updatedData);
    await job.save();

    return res.status(200).json("success");
  } catch (error) {
    console.log(error, "Error");
  }
});

app.delete("/api/remove-proposals/:idPost/:idProposals", async (req, res) => {
  try {
    const job = await Job.findById(idPost);
    if (!job) {
      return res.status(400).json("error");
    }

    const proposal = job.proposal.id(idProposals);
    if (!proposal) {
      return res.status(400).json("error");
    }

    proposal.remove();
    await job.save();

    return res.status(200).json("success");
  } catch (error) {
    console.log(error, "Error");
  }
});

app.post("/api/conversation", async (req, res) => {
  try {
    const { senderId, receiverId, nameConversation,isSendProposal,idJob } = req.body;

    const checkingExists = await Conversations.findOne({
      members: { $in: [receiverId] },
    });

    if (checkingExists) {
      return res.status(400).send("Conversation has exits");
    }

    const newCoversation = new Conversations({
      members: [senderId, receiverId],
      name: nameConversation,
      isSendProposal,
      idJob
    });
    await newCoversation.save();
    res.status(200).send("Conversation created successfully");
  } catch (error) {
    console.log(error, "Error");
  }
});

app.get("/api/detail-conversations/:idCon", async (req, res) => {
  try {
    const idCon = req.params.idCon;
    const conversations = await Job.findById(idCon);
    res.status(200).json(await conversations);
  } catch (error) {
    console.log(error, "Error");
  }
});

app.put("/api/deposit-money", async (req, res) => {
  try {
    const { idUser, money, idReceive, newMoney } = req.body;

    const updatedUser = await Users.findByIdAndUpdate(idUser, { money: money }, { new: true });

    const findUser = await Users.findByIdAndUpdate(
      idReceive,
      { $inc: { money: newMoney } },
      { new: true }
    );

    return res.status(200).json("success");
  } catch (error) {
    console.log('====================================');
    console.log(error);
    console.log('====================================');
    // Handle the error appropriately
  }
});

app.put("/api/add-money", async (req, res) => {
  try {
    const { idUser, money } = req.body;

    const updatedUser = await Users.findByIdAndUpdate(idUser,
      {
        money: money
      }
      , {
        new: true,
      });
    
    
    return res.status(200).json("success")

  } catch (error) {
    
  }
});


app.get("/api/conversations/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const conversations = await Conversations.find({
      members: { $in: [userId] },
    });
    const conversationUserData = Promise.all(
      conversations.map(async (conversation) => {
        const receiverId = conversation.members.find(
          (member) => member !== userId
        );
        const user = await Users.findById(receiverId);
        return {
          user: {
            receiverId: user._id,
            email: user.email,
            fullName: user.fullName,
            avatar: user.avatar,
          },
          conversationId: conversation._id,
          isSendProposal: conversation.isSendProposal,
          idJob: conversation.idJob
        };
      })
    );
    res.status(200).json(await conversationUserData);
  } catch (error) {
    console.log(error, "Error");
  }
});

app.post("/api/message", async (req, res) => {
  try {
    const { conversationId, senderId, message, receiverId = "" } = req.body;
    if (!senderId || !message)
      return res.status(400).send("Please fill all required fields");
    if (conversationId === "new" && receiverId) {
      const newCoversation = new Conversations({
        members: [senderId, receiverId],
      });
      await newCoversation.save();
      const newMessage = new Messages({
        conversationId: newCoversation._id,
        senderId,
        message,
      });
      await newMessage.save();
      return res.status(200).send("Message sent successfully");
    } else if (!conversationId && !receiverId) {
      return res.status(400).send("Please fill all required fields");
    }
    const newMessage = new Messages({ conversationId, senderId, message });
    await newMessage.save();
    res.status(200).send("Message sent successfully");
  } catch (error) {
    console.log(error, "Error");
  }
});

app.get("/api/message/:conversationId", async (req, res) => {
  try {
    const checkMessages = async (conversationId) => {
      console.log(conversationId, "conversationId");
      const nameConversation = await Conversations.findOne({
        _id: conversationId,
      });
      const messages = await Messages.find({ conversationId });
      const messageUserData = Promise.all(
        messages.map(async (message) => {
          const user = await Users.findById(message.senderId);
          return {
            user: {
              id: user._id,
              email: user.email,
              fullName: user.fullName,
              avatar: user.avatar,
            },
            message: message.message,
            nameConversation: nameConversation.name,
          };
        })
      );
      res.status(200).json(await messageUserData);
    };
    const conversationId = req.params.conversationId;
    if (conversationId === "new") {
      const checkConversation = await Conversations.find({
        members: { $all: [req.query.senderId, req.query.receiverId] },
      });
      if (checkConversation.length > 0) {
        checkMessages(checkConversation[0]._id);
      } else {
        return res.status(200).json([]);
      }
    } else {
      checkMessages(conversationId);
    }
  } catch (error) {
    console.log("Error", error);
  }
});

app.get("/api/users/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const users = await Users.find({ _id: { $ne: userId } });
    const usersData = Promise.all(
      users.map(async (user) => {
        return {
          user: {
            email: user.email,
            fullName: user.fullName,
            receiverId: user._id,
          },
        };
      })
    );
    res.status(200).json(await usersData);
  } catch (error) {
    console.log("Error", error);
  }
});

app.post("/api/send-email", async (req, res) => {
  const { to, subject, text, nameJob, idJob } = req.body;
  const transporter = nodemailer.createTransport({
    // Configure the email service provider
    service: "Gmail",
    auth: {
      user: "trainmodel0503@gmail.com",
      pass: "gbweaxmipkkxuwvq",
    },
  });

  const mailOptions = {
    from: "happyme@gmail.com",
    to,
    subject: subject,
    text: text,
    html: formEmail(nameJob, idJob) ,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to send email" });
    } else {
      console.log("Email sent:", info.response);
      res.json({ message: "Email sent successfully" });
    }
  });
});

app.post("/api/send-contract", async (req, res) => {
  const { to, subject, nameJob, idJob, text } = req.body;
  const transporter = nodemailer.createTransport({
    // Configure the email service provider
    service: "Gmail",
    auth: {
      user: "trainmodel0503@gmail.com",
      pass: "gbweaxmipkkxuwvq",
    },
  });

  const mailOptions = {
    from: "upwork@gmail.com",
    to,
    subject: subject,
    html: text ,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to send email" });
    } else {
      console.log("Email sent:", info.response);
      res.json({ message: "Email sent successfully" });
    }
  });
});

app.put("/api/edit-contract/:id", async (req, res) => {
  const conId = req.params.id;
  const updateJobData = req.body;

  try {
    // Update the user in the database
    const updatedUser = await Conversations.findByIdAndUpdate(conId, 
      updateJobData
      , {
      new: true,
    });

    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(500).json({ error: "Can not find id job" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update job" });
  }
});

app.post("/api/add-history", async (req, res) => {
  const postData = req.body;
  try {
    const post = await HistoryDraw.create(postData);
    res.status(200).json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
});

app.get("/api/get-list-history/:idUser", async (req, res) => {
  const idUser = req.params.idUser;

  try {
    const user = await HistoryDraw.find({
      idUser: idUser
    });

    return res.status(200).json(user);
 } catch (error) {
  console.log('====================================');
  console.log(error);
  console.log('====================================');
 }

 

});

app.get("/api/get-list-history-all", async (req, res) => {

  const user = await HistoryDraw.find({});

  return res.status(200).json(user);

});


app.listen(port, () => {
  console.log("listening on port " + port);
});
