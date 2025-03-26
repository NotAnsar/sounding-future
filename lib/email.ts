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

export async function sendArtistProfileCreatedEmail(
	email: string,
	username: string
) {
	await sendEmail({
		subject:
			"Welcome, Creator! Let's bring your music to life in 3D AudioSpace",
		name: 'Sounding Future',
		from: process.env.EMAIL_USER || 'noreply@soundingfuture.com',
		to: email,
		body: `
		<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
			
			<p>Hi ${username},</p>
			<p>Congratulations on creating your artist profile in Sounding Future's <b>3D AudioSpace</b>!</p>
			<p>We'd love to feature up to <b>three of your tracks</b> on the platform.</p>

			
			<p style="margin: 0;">✅ To unlock the full potential of your multichannel or ambisonics music, please upload your audio files directly using our <b>file upload service</b>.</p>
			<p style="margin: 0;">✅ Our Sounding Future team will create a <b>professional binaural/stereo rendering</b> of your tracks.</p>
			<p style="margin: 0;">✅ This ensures your music delivers an <b>outstanding listening experience</b> on any standard headphones or loudspeakers.</p>
			

			<p style="text-align: center; margin: 25px 0;">
				<a href="${process.env.NEXTAUTH_URL}/user/tracks" style="background-color: #ae3795; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
					👉 Upload your audio files now
				</a>
			</p>
			
			<p>Simply head to <a href="${process.env.NEXTAUTH_URL}/user/tracks" style="color: #467886; font-weight: 600;">My Tracks</a> and upload your music.</p>
			<p>If you have any questions, feel free to contact us at <a href="mailto:office@soundingfuture.com" style="color: #467886; font-weight: 600;">office@soundingfuture.com</a></p>

			<p>Best regards,<br>Sounding Future</p>
			<p style="color: #666; font-style: italic; margin:0;">Innovations in Music & AudioTech<br>Discover. Learn. Stream 3D Audio.</p>
			<p style="margin:0;">🌐 <a href="https://www.soundingfuture.com/en" style="color: #467886; font-weight: 500;">https://www.soundingfuture.com/</a></p>
			<hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
			<small style="color: #888;">This is an automated email. Please do not reply directly to this message.</small>
		</div>
	`,
	});
}

export async function sendWelcomeEmail(email: string, username: string) {
	await sendEmail({
		subject: 'Welcome to Sounding Future - Start Your Musical Adventure',
		name: 'Sounding Future',
		from: process.env.EMAIL_USER || 'noreply@soundingfuture.com',
		to: email,
		body: `
		<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
			
			<p>Hi ${username},</p>
			<p>Thank you for joining <b>Sounding Future's 3D AudioSpace</b>! We're excited to have you in our community.</p>
			
			
			
			<p style="margin: 0;">From now on, you can:</p>
			<p style="margin: 0;">✅ Discover exciting tracks from other artists.</p>
			<p style="margin: 0;">✅ Follow creators and stay updated on their latest releases.</p>
			<p style="margin: 0;">✅ Like tracks to support your favorite artists.</p>
			<p style="margin: 0;">✅ Save your favorite tracks in your personal collection.</p>
			


			<div >
				 <h3>🎯 For creators:</h3>
				 
				 <p>
				Interested in sharing your own multichannel or ambisonics music?
				<br/>
				Check if your music fits one of our <a href="${process.env.NEXTAUTH_URL}/genres" style="color: #467886; text-decoration: underline; font-weight: 500;">genres</a>. Then simply create your artist profile and upload your tracks along with all the details and audio files.
				</p>
			 </div>
			

			<p style="text-align: center; margin: 25px 0;">
				 <a href="${process.env.NEXTAUTH_URL}/login" style="background-color: #ae3795; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
				 👉 Log in now and start exploring
				 </a>
			 </p>


			<p>If you have any questions, feel free to contact us at <a href="mailto:office@soundingfuture.com" style="color: #467886; font-weight: 600;">office@soundingfuture.com</a></p>

			<p>Best regards,<br>Sounding Future</p>
			<p style="color: #666; font-style: italic; margin:0;">Innovations in Music & AudioTech<br>Discover. Learn. Stream 3D Audio.</p>
			<p style="margin:0;">🌐 <a href="https://www.soundingfuture.com/en" style="color: #467886; font-weight: 500;">https://www.soundingfuture.com/</a></p>

			<hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
			<small style="color: #888;">This is an automated email. Please do not reply directly to this message.</small>
		</div>
	`,
	});
}

export async function sendTrackPublishedEmail(
	email: string,
	username: string,
	trackName: string,
	trackUrl: string
) {
	await sendEmail({
		subject: `Your Track ${trackName} is now live in the 3D AudioSpace`,
		name: 'Sounding Future',
		from: process.env.EMAIL_USER || 'noreply@soundingfuture.com',
		to: email,
		body: `
		<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
			
			<p>Hi ${username},</p>
			<p>Good news! We've completed the renderings for your track "${trackName}" and uploaded them to the 3D AudioSpace.</p>

			<p>
				✅ You can now listen to the different track variants here: <a href="${trackUrl}" style="color: #467886; font-weight: 600;">${trackUrl}</a>
			</p>
			<p>
				✅ Please review the renderings and let us know if you're happy with the result or if you'd like any adjustments.
			</p>
			<p>
			<b>👉 Listen now and share your feedback:</b> <br>
			We look forward to hearing from you! Just drop us a message at <a href="mailto:office@soundingfuture.com" style="color: #467886; font-weight: 600;">office@soundingfuture.com</a>.
			</p>
			



			<p>Best regards,<br>Sounding Future</p>
			<p style="color: #666; font-style: italic; margin:0;">Innovations in Music & AudioTech<br>Discover. Learn. Stream 3D Audio.</p>
			<p style="margin:0;">🌐 <a href="https://www.soundingfuture.com/en" style="color: #467886; font-weight: 500;">https://www.soundingfuture.com/</a></p>

			<hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
			<small style="color: #888;">This is an automated email. Please do not reply directly to this message.</small>
		</div>
	`,
	});
}

export async function sendRoleChangeEmail(email: string, username: string) {
	await sendEmail({
		subject: 'Welcome to Sounding Future Pro!',
		name: 'Sounding Future',
		from: process.env.EMAIL_USER || 'noreply@soundingfuture.com',
		to: email,
		body: `
		<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
			
			<p>Hi ${username},</p>
			<p>Congratulations! Your Sounding Future account has been successfully upgraded to <b>Pro status</b>. 🚀</p>
			<p>As a Pro user, you now have access to exclusive features and benefits.</p>
			<p>
				You can find the full overview of all Pro benefits on our Support Us page: 
				<br/>
 				👉 <a href="${process.env.NEXTAUTH_URL}/support-us" style="color: #467886; text-decoration: underline; font-weight: 500;">View Pro Benefits</a>
			</p>
			
			
			
			<p style="margin-bottom: 0; font-weight: 600;">Thank you for supporting Sounding Future!</p>
			<p style="margin: 0;">Your contribution helps us:</p>
			<p style="margin: 0;">✅ Develop new features.</p>
			<p style="margin: 0;">✅ Promote creators.</p>
			<p style="margin: 0;">✅ Keep Sounding Future growing as an independent platform for immersive audio.</p>
			
			<p>If you have any questions, feel free to contact us at <a href="mailto:office@soundingfuture.com" style="color: #467886; font-weight: 600;">office@soundingfuture.com</a></p>

			<p>Best regards,<br>Sounding Future</p>
			<p style="color: #666; font-style: italic; margin:0;">Innovations in Music & AudioTech<br>Discover. Learn. Stream 3D Audio.</p>
			<p style="margin:0;">🌐 <a href="https://www.soundingfuture.com/en" style="color: #467886; font-weight: 500;">https://www.soundingfuture.com/</a></p>

			<hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
			<small style="color: #888;">This is an automated email. Please do not reply directly to this message.</small>
		</div>
	`,
	});
}
