const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const path = require('path');
const methodOverride = require('method-override');
const ejs = require('ejs');
const photoController = require('./controllers/photoController');
const pageController = require('./controllers/pageController')

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
app.use(
  methodOverride('_method', {
    methods: ['POST', 'GET'],
  })
);

//ROUTES
app.get('/', photoController.getAllPhotos);
app.post('/photos', photoController.createPhoto);
app.get('/photos/:id', photoController.getPhoto);
app.put('/photos/:id', photoController.updatePhoto);
app.delete('/photos/:id', photoController.deletePhoto);

app.get('/about', pageController.getAboutPage);
app.get('/add', pageController.getAddPage);
app.get('/photos/edit/:id', pageController.getEditPage);

const port = 3000;

app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı.`);
});
