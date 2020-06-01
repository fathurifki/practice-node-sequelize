const express = require('express');
const Sequelize = require('sequelize');

const app = express();
const port = 3001;

const connection = new Sequelize('practiceDb', 'refactory', 'refactory', {
    dialect: 'mysql'
})

const Feedback = connection.define('Feedback', {
    comments: Sequelize.STRING
});

const Recipe = connection.define('Recipe', {
    name: Sequelize.STRING,
    description: Sequelize.STRING
})

const Cook = connection.define('Cook', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'test'
    },
    email: {
        validate: {
            isEmail: true,
        },
        type: Sequelize.STRING
    },
    type: Sequelize.STRING,
});

Recipe.belongsTo(Cook, { as: 'CookRef', foreignKey: 'cookId' });     // puts foreignKey userId in Post table
Recipe.hasMany(Feedback, { as: 'comments' });

app.get('/recipes', (req, res) => {
    Recipe.findAll({
        include: [{
            mmodel: Cook, as: 'CookRef'
        }]
    })
        .then(cook => {
            res.json(cook)
        })
        .catch(error => {
            console.log(error);
            res.status(404).send(error);
        })
});

app.get('/cooks', (req, res) => {
    Cook.findAll()
        .then(cook => {
            res.json(cook);
        })
        .catch(error => {
            console.log(error);
            res.status(404).send(error);
        })
});

app.get('/recipe:id', (req, res) => {
    Recipe.findOne({
        where: { id: req.params.id },
        include: [{
            model: Feedback, as: 'comments',
            model: Cook, as: 'CookRef'
        }]
    })
        .then(cook => {
            res.json(cook);
        })
        .catch(error => {
            console.log(error),
                res.status(404).send(error)
        })
});

connection
    .authenticate()
    .then(() => {
        console.log('Connection has been  established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database: ', err);
    });


connection
    .sync({
        logging: console.log,
        force: false
    })
    .then(() => {
        console.log('Connection to database established successfully.');
        app.listen(port, () => {
            console.log('Running server on port ' + port);
        });
    })
    .then(() => {
        Cook.bulkCreate([{
            id: 1,
            name: 'listy',
            email: 'lisychan@gmail.com'
        }])
            .then(() => {
                console.log('cooks inserted successfully');
            })
            .catch(error => {
                console.log(error);
            })
    })
    .then(() => {
        Recipe.bulkCreate([{
            name: 'Ceker ayam',
            description: 'mie ayam sedap'
        }])
            .then(() => {
                console.log('user inserted successfully');
            })
            .catch(error => {
                console.log(error);
            })
    })
    .then(() => {
        Feedback.bulkCreate([{
            id: 1,
            comments: 'Gudeg Manis'
        }])
            .then(() => {
                console.log('Feedback inserted successfully');
            })
            .catch(error => {
                console.log(error);
            })
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
