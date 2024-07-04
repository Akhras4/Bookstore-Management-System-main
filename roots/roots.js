const { Router } = require("express");
const DoThis=require("../controller/functions")
const router=Router()
const multer = require('multer');
const HomeController = require('../controller/HomeController');
const account=require("../controller/account")


router.get("/",DoThis.redirecttologin)

router.get("/signup",DoThis.singup)
router.post("/signup",DoThis.singup)


router.get(`/VerificationEmail`,DoThis.tokenval)

router.get("/login",DoThis.login)
router.post("/login",DoThis.login)


//router.get(`/user/:username`,DoThis.cookieJWTAuth,DoThis.user)
//router.post(`/user/:username`,DoThis.cookieJWTAuth)


router.get("/user/:id/logout",DoThis.cookieJWTAuth,DoThis.logout)
router.post("/user/:id/logout",DoThis.cookieJWTAuth,DoThis.logout)





// Multer setup for PDF uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      if (file.fieldname === 'pdf') {
        cb(null, 'public/pdfs');
      } else if (file.fieldname === 'image') {
        cb(null, 'public/images');
    }
  },
    
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'pdf' && file.mimetype === 'application/pdf') {
            cb(null, true);
        } else if (file.fieldname === 'image' ) {
            cb(null, true);
        } else {
            cb(null, false);
      req.uploadError = 'Only .pdf and image format allowed!';
    } 
}
})




router.get(`/user/:id`,DoThis.cookieJWTAuth, HomeController.index);
router.post(`/user/:id/upload`,DoThis.cookieJWTAuth, upload.fields([{ name: 'pdf', maxCount: 1 }, { name: 'image', maxCount: 1 }]), HomeController.upload);
router.get(`/user/:id/public/pdfs/:pdfPath`,DoThis.cookieJWTAuth, HomeController.openPdf);
router.get(`/user/:id/delete/:bookid`,DoThis.cookieJWTAuth, HomeController.delete);
router.get(`/user/:id/download/:filename`,DoThis.cookieJWTAuth, HomeController.download);
router.get(`/user/:id/rename/:filename`,DoThis.cookieJWTAuth, HomeController.renameForm);
router.post(`/user/:id/rename/:oldFilename`,DoThis.cookieJWTAuth, HomeController.rename);


 

router.get(`/user/:id/account`,DoThis.cookieJWTAuth,account.account)
router.post(`/user/:id/account`,DoThis.cookieJWTAuth,account.account)

module.exports = router;













module.exports=router