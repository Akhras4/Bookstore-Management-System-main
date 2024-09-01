const fs = require('fs-extra');
const path = require('path');
const AWS = require('aws-sdk');
const users = require("../models/user");
const books = require("../models/book");
require('dotenv').config();

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
            res.render('index', { userid, books, errors: null, username: user.UserName });
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
          ContentType: pdfFile.mimetype
        };
  
        const imageUploadParams = {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: `images/${imageFile.filename}`, 
          Body: fs.createReadStream(imageFile.path),
          ContentType: imageFile.mimetype
        };
  
        s3.upload(pdfUploadParams).promise()
          .then(pdfData => {
            const pdfUrl = `${process.env.AWS_S3_URL}/pdfs/${pdfFile.filename}`;
            return s3.upload(imageUploadParams).promise()
              .then(imageData => ({ pdfUrl, imageUrl: imageData.Location }));
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
    const pdfKey = req.params.pdfPath;
    console.log(`Fetching PDF with key: ${pdfKey}`);

    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `pdfs/${pdfKey}`, 
        Expires: 60 
    };
    s3.getSignedUrl('getObject', params, (err, url) => {
        if (err) {
            console.error('Error generating presigned URL:', err);
            return res.status(500).send('Error generating URL');
        }
        res.redirect(url);
    });
},

  delete: async (req, res) => {
    try {
      const userid = req.params.id;
      const bookid = req.params.bookid;
  
      const user = await users.findOne({ _id: userid }).populate('books');
      const book = user.books.find(book => book._id.toString() === bookid);
  
      if (!book) {
        throw new Error('Book not found');
      }
  
      const pdfKey = `pdfs/${path.basename(new URL(book.pdfPath).pathname)}`;
      const imageKey = `images/${path.basename(new URL(book.imagePath).pathname)}`;
  

      await books.deleteOne({ _id: bookid });
  

      user.books = user.books.filter(book => book._id.toString() !== bookid);
      await user.save();
  

      await s3.deleteObject({ Bucket: process.env.AWS_S3_BUCKET_NAME, Key: pdfKey }).promise();
      await s3.deleteObject({ Bucket: process.env.AWS_S3_BUCKET_NAME, Key: imageKey }).promise();
  
      res.redirect(`/user/${userid}/account`);
    } catch (err) {
      console.error('Delete error:', err);
      res.status(500).send(err.message);
    }
  },

  download: (req, res) => {
    const filename = req.params.filename; 
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `pdfs/${filename}`
    };
    s3.getObject(params, (err, data) => {
      if (err) {
        console.error('Error fetching file from S3:', err);
        res.status(404).send('File not found');
      } else {
        res.attachment(filename);
        res.send(data.Body);
      }
    });
  },

  renameForm: async (req, res) => {
    const userid = req.params.id;
    const { filename } = req.params;
    res.render('rename', { filename, userid });
  },

  rename: async (req, res) => {
    const userid = req.params.id;
    const { oldFilename } = req.params;
    const newFilename = req.body.newFilename;
    const oldKey = `pdfs/${oldFilename}`;
    const newKey = `pdfs/${newFilename}`;

    try {
      // Copy old file to new location
      const copyParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        CopySource: `${process.env.AWS_S3_BUCKET_NAME}/${oldKey}`,
        Key: newKey
      };
      await s3.copyObject(copyParams).promise();


      const deleteParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: oldKey
      };
      await s3.deleteObject(deleteParams).promise();

      res.redirect(`/user/${userid}/uploads`);
    } catch (err) {
      console.error('Rename error:', err);
      res.status(500).send(err.message);
    }
  },
};

module.exports = HomeController;
