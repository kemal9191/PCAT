const Photo = require('../models/Photo');

const fs = require('fs');

exports.getAllPhotos = async (req, res) => {
  //get request de bir middleware. Routingler de middleware.
  //res.sendFile(path.resolve(__dirname, 'views/index.html'));
  //send metodu nextin işlevini görüyor ve mw nin tamamlandığını
  //söylüyor.
/*   console.log(req.query)
  const photos = await Photo.find({}).sort('-dateCreated');
   */

  const page = req.query.page || 1;
  const photosPerPage = 1;
  const totalPhotos = await Photo.find().countDocuments();
  const photos = await Photo.find({}).sort('-dateCreated')
  .skip((page-1) * photosPerPage)
  .limit(photosPerPage)
  res.render('index', {
    photos: photos,
    current: page,
    pages: (Math.ceil(totalPhotos/photosPerPage))
  });
};

exports.getPhoto = async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  res.render('photo', {
    photo: photo,
  });
};

exports.createPhoto = async (req, res) => {
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
  let uploadPath = __dirname + '/../public/uploads/' + uploadedImage.name;

  uploadedImage.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body,
      image: '/uploads/' + uploadedImage.name,
    });
    res.redirect('/');
  });
};

exports.updatePhoto = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  photo.title = req.body.title;
  photo.description = req.body.description;
  photo.dateCreated = Date.now();
  photo.save();
  res.redirect(`/photos/${req.params.id}`);
};

exports.deletePhoto = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  let deletedImage = __dirname + '/../public' + photo.image;
  fs.unlinkSync(deletedImage);
  await Photo.findByIdAndRemove(req.params.id);
  res.redirect('/');
};
