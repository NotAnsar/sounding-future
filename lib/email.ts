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

export async function sendWelcomeEmail(email: string, username: string) {
	await sendEmail({
		subject: 'Welcome to Sounding Future!',
		name: 'Sounding Future',
		from: process.env.EMAIL_USER || 'noreply@soundingfuture.com',
		to: email,
		body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Welcome to Sounding Future!</h1>
        <p>Hello ${username},</p>
        <p>Thank you for joining Sounding Future! We're excited to have you as part of our community.</p>
        
        <h2 style="color: #ae3795; margin-top: 20px;">Getting Started</h2>
        <p>Here are a few things you can do right away:</p>
        <ul style="padding-left: 20px;">
          <li><strong>Add your own tracks</strong> - You can upload and manage your own audio tracks through your profile dashboard.</li>
          <li><strong>Explore binaural rendering</strong> - Our platform offers special binaural audio rendering services for immersive sound experiences.</li>
          <li><strong>Connect with others</strong> - Discover and follow other creators in our community.</li>
        </ul>
        
        <div style="background-color: #f7f7f7; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Pro Tip:</strong> Check out our <a href="${process.env.NEXTAUTH_URL}/help-center" style="color: #ae3795; text-decoration: none;">help section</a> for tutorials and guides on how to make the most of our platform.</p>
        </div>
        
        <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
        
        <p>Happy creating!</p>
        <p>The Sounding Future Team</p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <small style="color: #888;">This is an automated email. Please do not reply directly to this message.</small>
      </div>
    `,
	});
}

export async function sendTrackCreatedEmail(
	email: string,
	username: string,
	trackName: string
) {
	await sendEmail({
		subject: 'Your New Track & Binaural Rendering Options',
		name: 'Sounding Future',
		from: process.env.EMAIL_USER || 'noreply@soundingfuture.com',
		to: email,
		body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Your Track Has Been Created!</h1>
        <p>Hello ${username},</p>
        <p>Congratulations on creating your new track "${trackName}"! Your creativity is what makes our platform thrive.</p>
        
        <div style="background-color: #f7f7f7; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h2 style="color: #ae3795; margin-top: 0;">Enhance Your Audio with Binaural Rendering</h2>
          <p>Did you know that Sounding Future offers binaural rendering services? Transform your track into an immersive 3D audio experience!</p>
          <p>Benefits include:</p>
          <ul style="padding-left: 20px;">
            <li>Create 3D spatial audio that surrounds the listener</li>
            <li>Enhance the listening experience with realistic sound positioning</li>
            <li>Make your tracks stand out from conventional stereo audio</li>
          </ul>
          <p style="margin-top: 20px;">
            <a href="${process.env.NEXTAUTH_URL}/tracks/${encodeURIComponent(
			trackName
		)}/edit" style="background-color: #ae3795; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Try Binaural Rendering
            </a>
          </p>
        </div>
        
        <p>If you need any assistance with your track or the binaural rendering process, our support team is always here to help.</p>
        
        <p>Keep creating amazing sounds!</p>
        <p>The Sounding Future Team</p>
        
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
		subject: 'Your Track Has Been Published - Share Your Thoughts!',
		name: 'Sounding Future',
		from: process.env.EMAIL_USER || 'noreply@soundingfuture.com',
		to: email,
		body: `
		<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
			<h1 style="color: #333;">Your Track Is Now Live!</h1>
			<p>Hello ${username},</p>
			<p>Great news! Your track "${trackName}" has been reviewed and published by our admin team.</p>
			
			<div style="background-color: #f7f7f7; padding: 20px; border-radius: 5px; margin: 20px 0;">
				<h2 style="color: #ae3795; margin-top: 0;">Share Your Experience</h2>
				<p>We'd love to hear about your experience with Sounding Future:</p>
				<ul style="padding-left: 20px;">
					<li>How was your track uploading experience?</li>
					<li>Did you try our binaural rendering service?</li>
					<li>What features would you like to see in the future?</li>
				</ul>
				<p style="margin-top: 20px;">
					<a href="${trackUrl}" style="background-color: #ae3795; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
						View Your Track
					</a>
				</p>
			</div>
			
			<p>Feel free to reply to this email with your feedback or suggestions.</p>
			
			<p>Thank you for being part of Sounding Future!</p>
			<p>The Sounding Future Team</p>
			
			<hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
			<small style="color: #888;">You can reply directly to this email to share your feedback.</small>
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
					<h1 style="color: #333;">You're Now a Pro User!</h1>
					<p>Hello ${username},</p>
					<p>Congratulations! Your Sounding Future account has been upgraded to <strong>Pro</strong> status.</p>
					
					<div style="background-color: #f7f7f7; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #ae3795;">
							<h2 style="color: #ae3795; margin-top: 0; font-size: 24px;">Pro Plan</h2>
							<p style="font-size: 18px; margin-bottom: 5px;">Become a Sounding Future supporter and use advanced features.</p>
							<p style="font-size: 22px; font-weight: bold; color: #333; margin-top: 15px; margin-bottom: 20px;">45€ /year</p>
							
							<p style="font-weight: bold; margin-bottom: 10px;">Includes everything from the Free Plan plus:</p>
							<ul style="padding-left: 20px; margin-top: 10px;">
									<li style="margin-bottom: 8px;"><strong>Upload up to 20 tracks</strong></li>
									<li style="margin-bottom: 8px;"><strong>Support discovery & promotion</strong> of new authors/artists</li>
									<li style="margin-bottom: 8px;"><strong>Coming:</strong> implementing multichannel streaming</li>
									<li style="margin-bottom: 8px;"><strong>Coming:</strong> development of dynamic streaming with head-tracking</li>
									<li style="margin-bottom: 8px;"><strong>Coming:</strong> Artists can offer their physical releases and merchandise for sale in a dedicated showcase</li>
									<li style="margin-bottom: 8px;"><strong>You're free to cancel</strong> your Pro Plan anytime</li>
							</ul>
							
							<p style="margin-top: 25px;">
									<a href="${process.env.NEXTAUTH_URL}/support-us" style="background-color: #ae3795; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; font-size: 16px;">
											Explore Your Pro Features
									</a>
							</p>
					</div>
					
					<p>Thank you for supporting Sounding Future and helping us create an amazing platform for spatial audio!</p>
					
					<p>The Sounding Future Team</p>
					
					<hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
					<small style="color: #888;">This is an automated email. Please do not reply directly to this message.</small>
			</div>
	`,
	});
}
