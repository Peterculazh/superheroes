const SuperheroController = require('../controllers/superhero'),
    path = require('path'),
    multer = require('multer'),
    upload = multer({
        dest: path.normalize(path.join(__dirname + "/../../public/img")),
        preservePath: true
    });

    let imagesUpload = upload.fields([{
        name: 'title',
        maxCount: 1
    },{
        name: 'images',
    }])

module.exports = app => {
    app.get('/', SuperheroController.listAllPagination);

    app.get('/superhero/:id', SuperheroController.read);
    app.get('/add', (req, res) => {
        res.render('add');
    })
    app.post('/add', imagesUpload, SuperheroController.create);
    app.get('/superhero/update/:id', SuperheroController.updateRender);
    app.patch('/superhero/update/:id', imagesUpload, SuperheroController.update);
    app.delete('/superhero', SuperheroController.delete);
}