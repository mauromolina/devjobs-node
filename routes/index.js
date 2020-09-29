const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home');
const vacantController = require('../controllers/vacant');
const userController = require('../controllers/user');
const authController = require('../controllers/auth');

module.exports = () => {

    router.get('/', homeController.showJobs);

    router.get('/vacancies/new', 
        authController.verifyUser,
        vacantController.newVacantForm);
    router.post('/vacancies/new', 
        authController.verifyUser,
        vacantController.newVacant);

    router.get('/vacancies/edit/:url', 
        authController.verifyUser,
        vacantController.editVacantForm);
    router.post('/vacancies/edit/:url', 
        authController.verifyUser,
        vacantController.editVacant);

    router.get('/vacancies/:url', vacantController.getVacant);
    
    router.get('/newAccount', userController.createAccountForm);
    router.post('/newAccount',
        userController.validateRegistration,
        userController.createAccount);
    
    router.get('/login', userController.loginForm);
    router.post('/login', authController.authUser);

    router.get('/logout', 
    authController.verifyUser,
    authController.logOut);

    router.get('/admin', 
        authController.verifyUser,
        authController.showAdminPanel);
    
    return router;
}

