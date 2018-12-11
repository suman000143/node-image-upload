const express   = require('express');
const multer    = require('multer');
const ejs       = require('ejs');  
const path      = require('path');

const app       = express();


// SET STORAGE ENGINE
const storage   = multer.diskStorage({
    destination : './public/uploads',
    filename : function(req, file, cb){
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init Upload
const upload = multer({
    storage: storage,
    limits:{fileSize: 1000000},
    fileFilter: function(req, file, cb){
      checkFileType(file, cb);
    }
}).single('myImage');

// Check File Type
function checkFileType(file, cb){
    const filetypes = /jpeg|jpg|png|gif/; // Allowed ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase()); // Check ext
    const mimetype = filetypes.test(file.mimetype); // Check mime
  
    if(mimetype && extname){
      return cb(null,true);
    } else {
      cb('Error: Images Only!');
    }
}



// EJS
app.set('view engine', 'ejs');
// Public folder
app.use(express.static('./public'));

app.get('/', (req,res) => res.render('index'));

app.post('/upload', function(req,res){
    upload(req, res, (err) => {
        if(err){
          res.render('index', {
            msg: err
          });
        } else {
          if(req.file == undefined){
            res.render('index', {
              msg: 'Error: No File Selected!'
            });
          } else {
            res.render('index', {
              msg: 'File Uploaded!',
              file: `uploads/${req.file.filename}`
            });
          }
        }
    });
});

app.listen(3000, function(){
    console.log('app started at port 3000');
});