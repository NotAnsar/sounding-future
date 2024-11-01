import nodemailer from 'nodemailer';

interface EmailParams {
	subject: string;
	name: string;
	from: string;
	body: string;
	to?: string;
}

export async function sendPasswordResetEmail(email: string, token: string) {
	const resetLink = `${process.env.NEXTAUTH_URL}/update-password?token=${token}`;

	await sendEmail({
		subject: 'Password Reset Request for Sounding Future',
		name: 'Sounding Future', // Replace with your actual app name
		from: process.env.EMAIL_USER || 'noreply@yourdomain.com',
		to: email,
		body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Password Reset Request</h1>
        <p>You have requested a password reset for your account. Click the link below to reset your password:</p>
        <p style="margin: 20px 0;">
          <a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Reset Password
          </a>
        </p>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <small style="color: #888;">This is an automated email. Please do not reply.</small>
      </div>
    `,
	});
}

export async function sendEmail({
	subject,
	name,
	from,
	body,
	to,
}: EmailParams): Promise<void> {
	const myEmail = process.env.EMAIL_USER;
	const transporter = nodemailer.createTransport({
		host: process.env.EMAIL_SERVER,
		port: parseInt(process.env.EMAIL_PORT || '587', 10),
		auth: { user: myEmail, pass: process.env.EMAIL_PASSWORD },
	});

	const mailOptions = {
		from: `"${name}" <${myEmail}>`,
		replyTo: from,
		to: to || process.env.EMAIL_RECEIVER,
		subject,
		html: body,
	};

	try {
		await transporter.sendMail(mailOptions);
	} catch (error) {
		console.error('Error sending email:', error);
		throw new Error('Failed to send email');
	}
}

export function getEmailString(
	subject: string,
	name: string,
	message: string,
	email: string
): string {
	return `
	<!DOCTYPE html>
	<html lang="en">
	<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Sounding future Contact Form Submission</title>
			<style>
					body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
					table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
					img { -ms-interpolation-mode: bicubic; }
					img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
					table { border-collapse: collapse !important; }
					body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }
					a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
					div[style*="margin: 16px 0;"] { margin: 0 !important; }
			</style>
	</head>
	<body style="background-color: #f7f7f7; margin: 0 !important; padding: 0 !important;">
			<table border="0" cellpadding="0" cellspacing="0" width="100%">
					<tr>
							<td align="center" style="padding: 40px 10px 40px 10px;">
									<table border="0" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px;">
											<tr>
													<td align="center" bgcolor="#0b111d" style="padding: 30px 30px 30px 30px; border-radius: 8px 8px 0px 0px;">
															<h1 style="font-size: 32px; font-weight: 700; margin: 0; color: #ffffff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">Sounding Future</h1>
													</td>
											</tr>
											<tr>
													<td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px; border-radius: 0px 0px 8px 8px;">
															<table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 540px;">
																	<tr>
																			<td style="padding-bottom: 30px;">
																					<h2 style="font-size: 24px; font-weight: 600; color: #333333; margin: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">New Contact Form Submission</h2>
																			</td>
																	</tr>
																	<tr>
																			<td style="padding-bottom: 20px;">
																					<table border="0" cellpadding="0" cellspacing="0" width="100%">
																							<tr>
																									<td width="25%" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 600; color: #ae3795;">Name:</td>
																									<td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; color: #333333;">${name}</td>
																							</tr>
																					</table>
																			</td>
																	</tr>
																	<tr>
																			<td style="padding-bottom: 20px;">
																					<table border="0" cellpadding="0" cellspacing="0" width="100%">
																							<tr>
																									<td width="25%" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 600; color: #ae3795;">Email:</td>
																									<td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; color: #333333;">${email}</td>
																							</tr>
																					</table>
																			</td>
																	</tr>
																	<tr>
																			<td style="padding-bottom: 20px;">
																					<table border="0" cellpadding="0" cellspacing="0" width="100%">
																							<tr>
																									<td width="25%" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 600; color: #ae3795;">Subject:</td>
																									<td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; color: #333333;">${subject}</td>
																							</tr>
																					</table>
																			</td>
																	</tr>
																	<tr>
																			<td style="padding-top: 20px; padding-bottom: 20px;">
																					<table border="0" cellpadding="0" cellspacing="0" width="100%">
																							<tr>
																									<td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 600; color: #ae3795; padding-bottom: 10px;">Message:</td>
																							</tr>
																							<tr>
																									<td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; color: #333333; background-color: #f7f7f7; padding: 20px; border-radius: 6px;">${message}</td>
																							</tr>
																					</table>
																			</td>
																	</tr>
															</table>
													</td>
											</tr>
											<tr>
													<td bgcolor="#f7f7f7" style="padding: 30px 30px 30px 30px;">
															<table border="0" cellpadding="0" cellspacing="0" width="100%">
																	<tr>
																			<td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666666; text-align: center;">
																					This is an automated message from the Swap Rx contact form.
																			</td>
																	</tr>
															</table>
													</td>
											</tr>
									</table>
							</td>
					</tr>
			</table>
	</body>
	</html>
`;
}
