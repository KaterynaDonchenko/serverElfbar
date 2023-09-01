const UserModel = require('../models/UserModal');
const bcrypt= require('bcrypt');
const uuid = require('uuid');
const adminEmailService = require('./AdminEmailService');
const tokenService = require('./TokenService');
const UserDto = require('../dtos/UserDto');
const AppiError = require('../exeptions/ApiError');

class UserService {

    async registration(email, password) {
        const candidate = await UserModel.findOne({email});
        if (candidate) {
            throw AppiError.BadRequest(`The user with the email ${email} exists`);
        }

        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4();

        const user = await UserModel.create({email, password: hashPassword, activationLink});
        await adminEmailService.sendActivateEmail(email, `${process.env.API_URL}/admin/activate/${activationLink}`);

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto
        }
    }

    async activate(link) {
        const user = await UserModel.findOne({activationLink: link});
        if (!user) {
            throw AppiError.BadRequest('the not corect activation link');
        }
        user.isActivated = true;
        await user.save();
    }

    async login(email, password) {
        const user = await UserModel.findOne({email});
        if (!user) {
            throw AppiError.BadRequest(`the user was not found`);
        }

        const isPassEquel = await bcrypt.compare(password, user.password);

        if (!isPassEquel) {
            throw AppiError.BadRequest('the password is not corect');
        }
        
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto
        }
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw AppiError.UnauthorizeError();
        }

        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = tokenService.findToken(refreshToken);

        if (!userData || !tokenFromDb) {
            throw AppiError.UnauthorizeError();
        }

        const user = UserModel.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto
        }
    }

    async getUsers() {
        const users = UserModel.find();
        return users;
    }
}

module.exports = new UserService();