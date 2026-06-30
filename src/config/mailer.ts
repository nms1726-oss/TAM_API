import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'tam.soporte.gestion@gmail.com', // reemplaza si es necesario
        pass: 'vgapauoxhemtgatr', // los 16 caracteres
    },
});

export const enviarCorreoVerificacion = async (
    destinatario: string,
    nombre: string,
    codigo: string
) => {
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
        <div style="background: #003DA5; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 22px;">TAM</h1>
        </div>
        <div style="padding: 24px; background: #fff; border: 1px solid #eee;">
            <p>Hola <strong>${nombre}</strong>,</p>
            <p>Tu código de verificación es:</p>
            <div style="background: #f0f7ff; border-left: 4px solid #003DA5; padding: 16px; text-align: center; margin: 16px 0;">
                <span style="font-size: 28px; font-weight: bold; color: #003DA5; letter-spacing: 4px;">${codigo}</span>
            </div>
            <p style="color: #888; font-size: 13px;">Este código expira en 3 minutos.</p>
        </div>
    </div>
    `;

    await transporter.sendMail({
        from: '"TAM" <tam.soporte.gestion@gmail.com>',
        to: destinatario,
        subject: 'Código de verificación - TAM',
        html,
    });
};