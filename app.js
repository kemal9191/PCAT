const express = require('express');
const path = require('path');

const app = express();

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
//static dosyalarımızı bu olmadan alamayız.
app.use(myLogger);
app.use(myLogger2);
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

app.get('/', (req, res) => {
  //get request de bir middleware. Routingler de middleware.
  res.sendFile(path.resolve(__dirname, 'tmp/index.html'));
  //send metodu nextin işlevini görüyor ve mw nin tamamlandığını
  //söylüyor.
});

const port = 3000;

app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı.`);
});
