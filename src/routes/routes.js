const SuperheroController = require('../controllers/superhero'),
    path = require('path'),
    multer = require('multer'),
    upload = multer({
        dest: path.normalize(path.join(__dirname + "/../../public/img")),
        preservePath: true
    });

module.exports = app => {
    app.get('/', SuperheroController.listAllPagination);

    app.get('/superhero/:id', SuperheroController.read);
    app.get('/add', (req, res) => {
        res.render('add');
    })
    app.delete('/superhero', SuperheroController.delete);
    app.post('/add', upload.array('images'), SuperheroController.create);
}