import { z } from 'zod';

// =-=-=-Schemas Users-=-=-= //

export const AuthUserFormSchema = z.object({
    email: z
        .string()
        .nonempty('O email é obrigatório.'),
    password: z
        .string()
        .nonempty('A senha é obrigatória.')
});

export const UserFormSchema = z.object({
    email: z
        .string()
        .nonempty('O email é obrigatório.'),
    password: z
        .string()
        .nonempty('A senha é obrigatória.'),
    status: z
        .boolean().optional(),
    confirmpassword: z
        .string()
        .nonempty('A confirmação de senha é obrigatória.')
}).refine((data) => data.password === data.confirmpassword, {
    message: 'As senhas não se coincidem',
    path: ['confirmpassword']
})

export const ForgotPasswordSchema = z.object({
    email: z
        .string()
        .nonempty('O email é obrigatório.')
});

export const ClientsFormSchema = z.object({
    codigo: z
        .union([z.string().nonempty('Código obrigatório.'), z.number()]),
    nomeEmpresa: z
        .string()
        .nonempty('Razão social obrigatória.'),
    cnpj: z
        .string()
        .nonempty('CNPJ obrigatório.'),
    cep: z
        .string()
        .nonempty('CEP obrigatório.'),
    endereco: z
        .string()
        .nonempty('Endereço obrigatório.'),
    endereco2: z
        .string(),
    numero: z
        .string()
        .nonempty('Número obrigatório.'),
    contatos: z
        .array(
            z.object({
                nome: z.string(),
                cargo: z.string(),
                email: z.string(),
                tel1: z.string(),
                tel2: z.string(),
            })
        )
})