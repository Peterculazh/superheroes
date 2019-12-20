const Superhero = require('../models').Superhero,
    path = require('path'),
    fs = require('fs'),
    rimraf = require("rimraf");

module.exports = {
    async listAllPagination(req, res) {
        try {
            let isPage = +req.query.page || 1;
            let page = +req.query.page;
            let itemsPerPage = 5;
            let items = await Superhero.findAndCountAll({
                offset: (isPage - 1) * itemsPerPage,
                limit: itemsPerPage,
                order: [
                    ['id', 'asc']
                ]
            });
            let countPages = items.count / itemsPerPage;
            if (countPages <= 1) {
                return res.render('index', {
                    superheroes: items.rows
                });
            } else {
                countPages = Math.ceil(countPages);
                let prevPage = null;
                if (page && page !== 1) {
                    prevPage = +page - 1;
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
        } catch (e) {
            res.status(500).send(e);
        }
    },

    async create(req, res) {
        try {
            let dir = path.join(__dirname + "/../../public/img/" + req.body.nickname + '/');
            let files = [];
            if (req.files.images) {
                files = [...req.files.title, ...req.files.images];
            } else {
                files = [...req.files.title];
            }

            req.body.images = [];
            files.forEach(file => {
                req.body.images.push(file.filename + "." + file.originalname.split('.').pop())
            });
            let item = await Superhero.create({
                ...req.body
            });

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            };

            files.forEach(file => {
                fs.copyFileSync(path.normalize(file.path), dir + file.filename + "." + file.originalname.split('.').pop());
                fs.unlink(path.normalize(file.path), err => {
                    if (err) throw err;
                });
            });

            res.status(201).redirect(`/superhero/${item.id}`);

        } catch (error) {
            return res.status(500).send(e);
        }
    },

    async read(req, res) {
        try {
            let id = req.params.id;
            let item = await Superhero.findByPk(id)

            if (!item) {
                return res.status(404).send({
                    error: "something go wrong"
                });
            }

            res.render('read.handlebars', {
                item
            });

        } catch (e) {
            return res.status(500).send(e);
        }
    },
    async updateRender(req, res) {
        try {
            let id = req.params.id;
            let item = await Superhero.findByPk(id);
            if (!item) {
                return res.status(404).redirect('/');
            }
            return res.status(200).render('update', {
                item
            });
        } catch (error) {
            return res.status(500).send(e);
        }
    },
    async update(req, res) {
        try {
            let id = req.params.id;
            let item = await Superhero.findByPk(id);
            let oldNickname = item.nickname;
            let newNickname = req.body.nickname;
            let oldDir = path.join(__dirname + "/../../public/img/" + oldNickname + '/');
            let newDir = path.join(__dirname + "/../../public/img/" + req.body.nickname + '/');

            if (!req.files.title && !req.files.images) {
                item.update({
                    ...req.body
                });
                if (oldNickname !== item.nickname) {
                    if (fs.existsSync(oldDir)) {
                        fs.renameSync(oldDir, newDir, e => {
                            console.log(e);
                        });
                    }
                    return res.status(200).redirect(`/superhero/${id}`);
                }
                return res.status(200).redirect(`/superhero/${id}`);
            } else if (req.files.title && !req.files.images) {
                let images = [...item.images];
                let img = images.shift();

                let file = req.files.title[0];
                if (fs.existsSync(oldDir + img)) {
                    fs.unlink(oldDir + img, (e) => {
                        console.log(e);
                    });
                }

                let newImg = file.filename + "." + file.originalname.split('.').pop();
                if (oldNickname !== item.nickname) {
                    if (fs.existsSync(oldDir)) {
                        fs.renameSync(oldDir, newDir, e => {
                            console.log(e);
                        });
                    }
                    fs.copyFileSync(path.normalize(file.path), newDir + newImg);
                    fs.unlink(path.normalize(file.path), err => {
                        if (err) throw err;
                    });
                    return res.status(200).redirect(`/superhero/${id}`);
                }

                images.unshift(newImg);
                req.body.images = images;
                item.update({
                    ...req.body
                });

                fs.copyFileSync(path.normalize(file.path), oldDir + newImg);
                fs.unlink(path.normalize(file.path), err => {
                    if (err) throw err;
                });
                return res.status(200).redirect(`/superhero/${id}`);
            } else if (!req.files.title && req.files.images) {
                let oldImages = item.images.slice(1);
                if (oldImages.length > 0) {
                    oldImages.forEach(file => {
                        fs.unlink(path.normalize(oldDir + file), err => {
                            if (err) throw err;
                        });
                    });
                }
                req.body.images = [item.images[0]];
                let files = [...req.files.images];
                files.forEach(file => {
                    req.body.images.push(file.filename + "." + file.originalname.split('.').pop())
                });

                if (oldNickname !== newNickname) {
                    if (fs.existsSync(oldDir)) {
                        fs.renameSync(oldDir, newDir, e => {
                            console.log(e);
                        });
                    }
                    item.update({
                        ...req.body
                    });
                    files.forEach(file => {
                        fs.copyFileSync(path.normalize(file.path), newDir + file.filename + "." + file.originalname.split('.').pop());
                        fs.unlink(path.normalize(file.path), err => {
                            if (err) throw err;
                        });
                    });
                    return res.status(200).redirect(`/superhero/${id}`);
                } else {
                    item.update({
                        ...req.body
                    });
                    files.forEach(file => {
                        fs.copyFileSync(path.normalize(file.path), oldDir + file.filename + "." + file.originalname.split('.').pop());
                        fs.unlink(path.normalize(file.path), err => {
                            if (err) throw err;
                        });
                    });
                    return res.status(200).redirect(`/superhero/${id}`);
                }
            } else if (req.files.title && req.files.images) {
                files = [...req.files.title, ...req.files.images];
                req.body.images = [];
                files.forEach(file => {
                    req.body.images.push(file.filename + "." + file.originalname.split('.').pop())
                });
                if (oldNickname !== item.nickname) {
                    if (fs.existsSync(oldDir)) {
                        fs.renameSync(oldDir, newDir, e => {
                            console.log(e);
                        });
                    }
                    item.update({
                        ...req.body
                    });
                    files.forEach(file => {
                        fs.copyFileSync(path.normalize(file.path), newDir + file.filename + "." + file.originalname.split('.').pop());
                        fs.unlink(path.normalize(file.path), err => {
                            if (err) throw err;
                        });
                    });
                    return res.status(200).redirect(`/superhero/${id}`);
                }
                item.update({
                    ...req.body
                });
                files.forEach(file => {
                    fs.copyFileSync(path.normalize(file.path), oldDir + file.filename + "." + file.originalname.split('.').pop());
                    fs.unlink(path.normalize(file.path), err => {
                        if (err) throw err;
                    });
                });
                return res.status(200).redirect(`/superhero/${id}`);
            }
        } catch (error) {
            return res.status(500).send(error);
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