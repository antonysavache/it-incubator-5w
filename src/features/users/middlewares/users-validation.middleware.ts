import { body } from 'express-validator';

export const usersValidation = [
    body('login')
        .trim()
        .notEmpty().withMessage('Login is required')
        .isString().withMessage('Login should be string')
        .isLength({ min: 3, max: 10 }).withMessage('Login length should be from 3 to 10')
        .matches(/^[a-zA-Z0-9_-]*$/).withMessage('Login should contain only latin letters, numbers, dash and underscore'),

    body('password')
        .trim()
        .notEmpty().withMessage('Password is required')
        .isString().withMessage('Password should be string')
        .isLength({ min: 6, max: 20 }).withMessage('Password length should be from 6 to 20'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isString().withMessage('Email should be string')
        .isLength({ max: 100 }).withMessage('Email is too long')
        .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).withMessage('Email should be valid')
];