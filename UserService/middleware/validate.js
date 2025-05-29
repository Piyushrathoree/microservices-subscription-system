import { z } from 'zod';

export const schemas = {
    register: z.object({
        name: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(6)
    }),
    
    login: z.object({
        email: z.string().email(),
        password: z.string()
    }),
    
    verify: z.object({
        verificationCode: z.string().length(6)
    }),
    
    forgotPassword: z.object({
        email: z.string().email()
    }),
    
    resetPassword: z.object({
        password: z.string().min(6)
    })
};

export const validate = (schema) => async (req, res, next) => {
    try {
        // Combine params and body for validation if needed
        const dataToValidate = {
            ...req.body,
            ...req.params
        };
        await schema.parseAsync(dataToValidate);
        next();
    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: error.errors[0].message
        });
    }
};
