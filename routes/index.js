const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home');
const vacantController = require('../controllers/vacant');

module.exports = () => {
    router.get('/', homeController.showJobs);
    router.get('/vacancies/new', vacantController.newVacantForm);
    router.post('/vacancies/new', vacantController.newVacant);
    router.get('/vacancies/:url', vacantController.getVacant);

    return router;
}

