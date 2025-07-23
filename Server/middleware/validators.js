import { body, validationResult } from 'express-validator';

export const validatePrintHtml = [
    body('htmlContent').isString().withMessage('htmlContent must be a string.').notEmpty().withMessage('htmlContent is required.'),
    body('paperSize').optional().isString().withMessage('paperSize must be a string.'),
    body('printerName').optional().isString().withMessage('printerName must be a string.'),
    body('printerOptions').optional().isObject().withMessage('printerOptions must be an object.'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

export const validatePrintBase64 = [
    body('base64Data').isBase64().withMessage('base64Data must be a valid Base64 string.').notEmpty().withMessage('base64Data is required.'),
    body('printerName').optional().isString().withMessage('printerName must be a string.'),
    body('printerOptions').optional().isObject().withMessage('printerOptions must be an object.'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];