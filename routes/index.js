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
        vacantController.validateVacant,
        vacantController.newVacant);

    router.get('/vacancies/edit/:url', 
        authController.verifyUser,
        vacantController.editVacantForm);
    router.post('/vacancies/edit/:url', 
        authController.verifyUser,
        vacantController.validateVacant,
        vacantController.editVacant);

    router.delete('/vacancies/delete/:id', 
        authController.verifyUser,
        vacantController.deleteVacant);

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

    router.get('/forgotPassword', 
        authController.forgotPasswordForm);

    router.post('/forgotPassword', authController.sendToken)

    router.get('/admin', 
        authController.verifyUser,
        authController.showAdminPanel);

    router.get('/editProfile',
        authController.verifyUser,
        userController.editProfileForm);

    router.post('/editProfile',
        authController.verifyUser,
        userController.loadImage,
        userController.editProfile);

    router.post('/vacancies/:url',
        vacantController.loadCv,
        vacantController.contactRecruiter);

    router.get('/candidates/:id',
        authController.verifyUser,
        vacantController.getCandidates);
    
    return router;
}

