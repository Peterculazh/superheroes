const express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    methodOverride = require('method-override');
    handlebars = require('express-handlebars').create({
        defaultLayout: path.join(__dirname + '/views/layout/main.handlebars'),
        helpers: {
            pagination: (countPages, currentPage) => {
                let links = "<div>"
                for (let i = 1; i <= countPages; i++) {
                    if (i === currentPage) {
                        links += `<a href="/?page=${i}" class="active disabled" >${i}</a>`
                        continue;
                    }
                    links += `<a href="/?page=${i}">${i}</a>`;
                }
                return links + "</div>";
            }

        }
    });

const app = express();
const publicDirPath = path.join(__dirname + '/../public/');
app.use(methodOverride('_method'));
app.use(express.static(publicDirPath));
app.use(bodyParser.urlencoded({
    extended: true,
}));

app.engine('handlebars', handlebars.engine);
app.set('views', path.join(__dirname + '/views/'));
app.set('view engine', 'handlebars');

const port = process.env.PORT || 3000;


require('./routes/routes')(app);
app.listen(port, () => {
    console.log(`Server listen on ${port}`);
})