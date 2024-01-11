const express = require('express');
const LoginController = require('../controllers/loginController');
class LoginRoute {

    #router;

    get router(){
        return this.#router;
    }

    constructor() {

        this.#router = express.Router();
        let ctrl = new LoginController();
        this.#router.get('/', ctrl.indexView)
        this.#router.get("/logout", ctrl.logout);
        this.#router.post('/', ctrl.autenticar)
    }

}

module.exports = LoginRoute;
