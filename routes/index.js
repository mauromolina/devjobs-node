const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home');
const vacantController = require('../controllers/vacant');
const userController = require('../controllers/user');

module.exports = () => {
    router.get('/', homeController.showJobs);
    router.get('/vacancies/new', vacantController.newVacantForm);
    router.post('/vacancies/new', vacantController.newVacant);
    router.get('/vacancies/:url', vacantController.getVacant);
    router.get('/vacancies/edit/:url', vacantController.editVacantForm);
    router.post('/vacancies/edit/:url', vacantController.editVacant);
    router.get('/newAccount', userController.createAccountForm)
    return router;
}

