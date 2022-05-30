const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Connect DB

mongoose.connect('mongodb://localhost/pcat-test-db');
//Eğer DB yoksa baştan oluşturuyor.

//Create Schema
const PhotoSchema = new Schema({
  title: String,
  description: String,
});

//Model Creation
const Photo = mongoose.model('Photo', PhotoSchema);
//Photo keywordünün küçük harflerle çoğuluyla collection oluşturuyor mongoose.

//Create a Photo

/* Photo.create({
  title: 'Photo 1',
  description: 'This is photo 1',
}); */

//Read Photo

/* Photo.find({}, (err, data)=>{
    console.log(data)
}); */

//Update Photo
/* const id = '62947fdeb150c9d0b6b4c147';
Photo.findByIdAndUpdate(
  id,
  {
    title: 'Photo 1 updated',
    description: 'Photo has been updated',
  },
  {new: true},//yeni objeyi console a yazmak için
  (err, data) => {
    console.log(data);
  }
); */

//Delete Photo
const id = '62947fdeb150c9d0b6b4c147';
Photo.findByIdAndDelete(id,(err,data)=>{
    console.log('Photo has been deleted')
})
