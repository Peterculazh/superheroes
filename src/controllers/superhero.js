const Superhero = require('../models').Superhero,
    path = require('path'),
    fs = require('fs'),
    rimraf = require("rimraf");


module.exports = {
    async listAllPagination(req, res) {
        try {
            let isPage = req.query.page || 1;
            let page = +req.query.page;
            let itemsPerPage = 5;
            return Superhero.findAndCountAll({
                    offset: (isPage - 1) * itemsPerPage,
                    limit: itemsPerPage
                })
                .then(items => {
                    let countPages = items.count / itemsPerPage;
                    if (countPages <= 1) {
                        return res.render('index', {
                            superheroes: items.rows
                        });
                    } else {
                        countPages = Math.round(countPages + 1);
                        let prevPage = null;
                        if (page && page !== 1) {
                            prevPage = countPages - 1;
                        }
                        let nextPage = null;
                        if (page < countPages || !page) {
                            nextPage = (+page || 1) + 1
                        }
                        return res.render('index', {
                            superheroes: items.rows,
                            countPages,
                            prevPage,
                            currentPage: +page || 1,
                            nextPage,
                        });
                    }

                })
                .catch(e => {
                    console.log(e);
                    res.render('index');
                })
        } catch (e) {
            res.status(500).send(e);
        }
    },

    create(req, res) {
        try {
            req.body.images = [];
            req.files.forEach(file => {
                req.body.images.push(file.filename + "." + file.originalname.split('.').pop())
            });
            return Superhero.create({
                    ...req.body
                })
                .then(result => {
                    let dir = path.join(__dirname + "/../../public/img/" + req.body.nickname + '/');
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir);
                    };
                    req.files.forEach(file => {
                        fs.copyFileSync(path.normalize(file.path), dir + file.filename + "." + file.originalname.split('.').pop());
                        fs.unlink(path.normalize(file.path), err => {
                            if (err) throw err;
                        });
                    });
                    res.status(201).redirect('/');
                })
                .catch(e => {
                    return res.status(500).send({
                        error: e,
                        message: "Please look at error and try again"
                    });
                })
        } catch (error) {
            return res.status(500).send(e);
        }
    },

    read(req, res) {
        try {
            let id = req.params.id;
            return Superhero.findByPk(id)
                .then(item => {
                    if (!item) {
                        return res.status(404).send({
                            error: "something go wrong"
                        });
                    }
                    res.render('read.handlebars', {
                        item
                    });
                })
                .catch(e => {
                    res.status(500).redirect('/');
                })
        } catch (e) {
            res.status(500).send(e);
        }
    },
    async delete(req, res) {
        try {
            let id = req.body.id
            let superhero = await Superhero.findByPk(id);
            superhero.destroy();
            let dir = path.join(__dirname + "/../../public/img/" + superhero.nickname + '/');
            rimraf(dir, (e) => {
                console.log(e);
            });
            res.status(200).redirect('/');
        } catch (e) {
            res.status(500).redirect('/');
        }
    }
}