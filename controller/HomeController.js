
const fs = require('fs-extra');
const path = require('path');
const users = require("../models/user");
const books = require("../models/book");
require('dotenv').config();
const AWS = require('aws-sdk');

const PDF_FOLDER = path.join(__dirname, '..', 'public', 'pdfs');
const IMAGES_FOLDER = path.join(__dirname, '..', 'public', 'images');
const PORT = process.env.PORT ;


/* This code snippet defines a JavaScript object named `HomeController` which contains several methods
for handling different routes and actions in a web application. Here is a breakdown of what each
method does: */
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});
const HomeController = {
  index: (req, res) => {
    const userid = req.params.id;
    users.findOne({ _id: userid })
      .then(user => {
        books.find({})
          .then(books => {
            console.log(req.files);
            res.render(`index`, { userid, books, errors: null, username: user.UserName });
          })
          .catch(err => {
            res.render('index', { userid, books });
          });
      })
      .catch(err => {
        res.render('index', { userid });
      });
  },

  upload: (req, res) => {
    if (req.method === "POST") {
      if (req.uploadError) {
        const userid = req.params.id;
        console.log(req.params);
        return res.status(401).render("index", { errors: req.uploadError, userid });
      } else {
        const userid = req.params.id;
        const { title, description } = req.body;
        const pdfFile = req.files['pdf'][0];
        const imageFile = req.files['image'][0];
        const pdfUploadParams = {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: `pdfs/${pdfFile.filename}`, 
          Body: fs.createReadStream(pdfFile.path),
          ContentType: pdfFile.mimetype,
          ACL: 'public-read' 
        };

        const imageUploadParams = {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: `images/${imageFile.filename}`, // Key defines the file path in S3
          Body: fs.createReadStream(imageFile.path),
          ContentType: imageFile.mimetype,
          ACL: 'public-read'
        };
        s3.upload(pdfUploadParams).promise()
          .then(pdfData => {
            // Upload Image to S3
            return s3.upload(imageUploadParams).promise()
              .then(imageData => ({ pdfUrl: pdfData.Location, imageUrl: imageData.Location }));
          })
          .then(({ pdfUrl, imageUrl }) => {
            const newbook = new books({
              user_id: userid,
              title: title,
              description: description,
              pdfPath: pdfUrl,
              imagePath: imageUrl
            });
            return newbook.save()
              .then(() => users.findById(userid))
              .then(user => {
                if (!user) {
                  throw new Error("User not found");
                }
                user.books.push(newbook._id);
                return user.save();
              });
          })
          .then(() => {
            res.redirect(`/user/${userid}`);
          })
          .catch(error => {
            console.error('Upload error:', error);
            res.status(500).send('Internal server error');
          });
      }
    }
  },

openPdf: (req, res) => {
  try {
    const pdfPath = req.params.pdfPath;
    const fullPath = path.join(__dirname, '..', 'public', 'pdfs', pdfPath);    
    res.sendFile(fullPath);
  } catch (error) {
    console.error(error);
    res.status(404).send('File not found');
  }
},
  delete: async (req, res) => {
    try {
      const userid = req.params.id;
      const bookid = req.params.bookid;
      let filePath;
      let imgPath;
      console.log(bookid)
      users.findOne({_id:userid})
      .populate("books")
      .then(user=>{ 
             const index =user.books.findIndex(book => book._id.toString() === bookid);
             filePath = user.books[index].pdfPath;
             imgPath= user.books[index].imagePath;
             user.books.splice(index, 1);
             return user.save()})
      .then(()=>{  books.deleteOne({_id:bookid})})
      .then(()=> { const filename = path.basename(filePath); fs.unlink(path.join(PDF_FOLDER, filename))
                   const filenameimg = path.basename(imgPath); fs.unlink(path.join(IMAGES_FOLDER, filenameimg)) })           
       .then(()=>{  res.redirect(`/user/${ userid }/account`)})
    } catch (err) {
      res.status(500).send(err.message);
    }
  },
  download: (req, res) => {
    const { filename } = req.params;
    res.download(path.join(PDF_FOLDER, filename));
  },
  renameForm: async (req, res) => {
    const userid = req.params.id;
    const { filename } = req.params;
    res.render('rename', { filename,  userid });
  },


  rename: async (req, res) => {
    const userid = req.params.id;
    const { oldFilename } = req.params;
    const newFilename = req.body.newFilename;
    const oldPath = path.join(PDF_FOLDER, oldFilename);
    const newPath = path.join(PDF_FOLDER, newFilename);

    try {
      await fs.rename(oldPath, newPath);
      res.redirect(`/user/${ userid }/uploads`);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },
};


module.exports = HomeController;