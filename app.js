const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const methodOverride = require('method-override');
const ejs = require('ejs');
const Photo = require('./models/Photo');

const app = express();

mongoose.connect('mongodb://localhost/pcat-test-db');

//TEMPLATE ENGINE
app.set('view engine', 'ejs');

const myLogger = (req, res, next) => {
  console.log('Middleware Log 1');
  next();
  //next demezsek bir sonraki mw ye geçmez.
  //Middlewareler sırayla çalışır.
};

const myLogger2 = (req, res, next) => {
  console.log('Middleware Log 2');
  next();
};
//MIDDLEWARE
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
//url deki datayı okumamızı sağlıyor.
//req-res döngüsü arasında tıkanmamak için bu middlewareleri kullanmak gerekiyor.
app.use(express.json());
//jsona dönüştürmeyi sağlıyor.
//static dosyalarımızı bu olmadan alamayız.
/* app.use(myLogger);
app.use(myLogger2); */
//To serve static files such as images, CSS files, and JavaScript files,
//use the express.static built-in middleware function in Express.

/*Middleware: Arayazılım gibi bir anlama geliyor.
Express ile bir request - response döngüsü kuruyoruz. 
Bu request - response döngüsü içerisindeki her şeye middleware denir.
Her şey bu ikisi arasında yapılır.
Biz middleware içerisinde her türlü ihtiyacımızı karşılayacak
işlemi yapabiliriz.
Middleware ile static dosyaları çağırabiliriz, datayı işleyebiliriz
fonksiyon yazarız vs.
*/
app.use(fileUpload());
app.use(methodOverride('_method'));

//ROUTES
app.get('/', async (req, res) => {
  //get request de bir middleware. Routingler de middleware.
  //res.sendFile(path.resolve(__dirname, 'views/index.html'));
  //send metodu nextin işlevini görüyor ve mw nin tamamlandığını
  //söylüyor.
  const photos = await Photo.find({}).sort('-dateCreated');
  res.render('index', {
    photos: photos,
  });
});
app.get('/about', (req, res) => {
  res.render('about');
});
app.get('/add', (req, res) => {
  res.render('add');
});
app.post('/photos', async (req, res) => {
  /*  console.log(req.files.image)
  console.log(req.body) */
  /*   await Photo.create(req.body);
  res.redirect('/'); */
  //add sayfasında form var ama photosa gidiyor.
  const uploadDir = 'public/uploads';
  //Önceden yapmasını istediğimiz için SYNC kullanıyoruz.
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }
  let uploadedImage = req.files.image;
  let uploadPath = __dirname + '/public/uploads/' + uploadedImage.name;

  uploadedImage.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body,
      image: '/uploads/' + uploadedImage.name,
    });
    res.redirect('/');
  });
});
app.get('/photos/:id', async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  res.render('photo', {
    photo: photo,
  });
});
app.get('/photos/edit/:id', async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  res.render('edit', {
    photo,
  });
});
app.put('/photos/:id', async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  photo.title = req.body.title;
  photo.description = req.body.description;
  photo.dateCreated = Date.now();
  photo.save();
  res.redirect(`/photos/${req.params.id}`);
});
const port = 3000;

app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı.`);
});
