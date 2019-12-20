# Hello
That was interesting task and I enjoyed to make it. Maybe it's not very professional way to code but I think that I can improve code, just need time.

I spent **15 hours** for task.

Most challenging was working with files. It's first time when I worked with them, but it give good experience for me. Also pagination was hard too.

Unfortunaly I didn't make tests for task but I really tried. (I think this is Windows problem)

## What I used

1. PostgreSQL - as DB for task;
2. Body-parser - for getting data from forms;
3. Express - framework;
4. Multer - to upload files to server;
5. Pg - for connecting to DB;
6. Pg-hstore - I thought to use it to store way to images in DB but changed my mind and don't want to delete it if PG package depends on it. Don't want to risky;
7. Sequelize - ORM for my DB;
8. Rimraf - to remove folders on deleting item from DB;
9. Handlebars - for rendering pages;
10. Env-cmd - for connecting env config to server.

And there few packages for testing for future. Or you can try with it :)

PS. Folder `superheroesimages` contain just images. Nothing depends on it and it's just for you if you want to play and you can take pictures from it and don't search for them in google.

---
# Instruction
I left `superheroes.tar.gz` in repo. It's dump of DB. To copy write in command line `pg_restore -h hostname -U username -F format -d dbname dumpfile` where:
  * **hostname** — server name;
  * **username** — users name that using to login in server;
  * **format**  — format for dump. I used `c` so write you too;
  * **dumpfile** — name of dump file. You must be in folder which contain file;
  * **dbname** — name of database. Create it before import.

You can write such `pg_restore -h hostname -U username -F c -d superheroes superheroes.tar.gz` where you need to create database before submit and enter **hostname and username**.

After importing data in DB. You can start server with `npm start`. It should start server on `localhost:3000`, port you can define in `config/dev.env` in main folder. I hope it will work with no problems.

### How I do

For first I wanted to store images of super-heroes in folder which name is super-hero nickname to bee more stuctured than just images of every super-hero in on folder. Yes, it make all work with files more-more harder.

You can see my "awesome code" that working with files, especially in `update` function. There I wanted to make updating of super-hero more flexible, and I don't know how to make posibility to add images. To be more precisely I maybe know, but it can take a lot of time to realize that.