const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
var Jimp = require('jimp');


// Set The Storage Engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb){
    cb(null,file.fieldname + path.extname(file.originalname));
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
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}

// Init app
const app = express();

// EJS
app.set('view engine', 'ejs');

// Public Folder
app.use(express.static('./public'));

app.get('/', (req, res) => res.render('index'));
app.get('/index2', (req, res) => res.render('index2'));

app.post('/upload', (req, res) => {
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
        Jimp.read('public/uploads/'+req.file.filename)
        .then(lenna => {
          return lenna
            .grayscale()
            .quality(60) // set greyscale
            .write('public/uploads/grayscale.jpg'); // save
        })
        .catch(err => {
          console.error(err);
        });
        
        Jimp.read('public/uploads/'+req.file.filename)
        .then(lenna2 => {
          return lenna2
            .sepia()
            .quality(60) // set greyscale
            .write('public/uploads/sepia.jpg'); // save
        })
        .catch(err => {
          console.error(err);
        });

        Jimp.read('public/uploads/'+req.file.filename)
        .then(lenna3 => {
          return lenna3
            .blur(2)
            .quality(60) // set greyscale
            .write('public/uploads/blur.jpg'); // save
        })
        .catch(err => {
          console.error(err);
        });
        
        Jimp.read('public/uploads/'+req.file.filename)
        .then(lenna4 => {
          return lenna4
            .resize(256,256)  
            .quality(60) // set greyscale
            .write('public/uploads/resize.jpg'); // save
        })
        .catch(err => {
          console.error(err);
        });
        res.render('index', {
          msg: 'File Uploaded!',
          file: `uploads/${req.file.filename}`,
          file2: `uploads/grayscale.jpg`,
          file3: `uploads/sepia.jpg`,
          file4: `uploads/blur.jpg`,
          file5: `uploads/resize.jpg`
        });
    }
  }});

});


const port = 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));
