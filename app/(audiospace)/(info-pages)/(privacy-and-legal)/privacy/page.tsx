// import React from 'react';

// export default function PrivacyPolicy() {
// 	return (
// 		<div className='space-y-8'>
// 			<p className='mt-4 '>
// 				{
// 					"This Privacy Policy provides transparency on how the Platform collects, uses, and protects personal data and gives users control over their data. We take compliance with the European Commission's General Data Protection Regulation, GDPR, very seriously."
// 				}
// 			</p>

// 			<section className='space-y-4'>
// 				<h2 className='text-2xl font-semibold'>1. Collection of data</h2>
// 				<p>
// 					We collect personal data to enable you to use our audio streaming
// 					platform and to continuously improve the quality of our services. The
// 					types of information we collect include:
// 				</p>
// 				<ul className='list-disc pl-6 space-y-2'>
// 					<li>
// 						Registration Data: When you register, we collect your name, email
// 						address, and other information such as your password.
// 					</li>
// 					<li>
// 						Usage data: We collect information about your activities on the
// 						Platform, such as tracks played or liked, and playlists created.
// 					</li>
// 					<li>
// 						Technical Data: This includes device information, browser type, and
// 						operating system to ensure and improve the functionality of the
// 						Platform.
// 					</li>
// 					<li>
// 						Communication Data: When you contact us (e.g. via support requests),
// 						we collect the content of the communication and your contact
// 						information.
// 					</li>
// 				</ul>
// 			</section>

// 			<section className='space-y-4'>
// 				<h2 className='text-2xl font-semibold'>2. Use of data</h2>
// 				<p>The data collected by us are used for the following purposes:</p>
// 				<ul className='list-disc pl-6 space-y-2'>
// 					<li>
// 						Providing the Service: To provide you with access to our platform
// 						and the content offered.
// 					</li>
// 					<li>
// 						Notifications: We use your email address to send you important
// 						notices about changes to our Service or to inform you about new
// 						features. You can opt out of receiving such communications at any
// 						time.
// 					</li>
// 				</ul>
// 			</section>

// 			<section className='space-y-4'>
// 				<h2 className='text-2xl font-semibold'>
// 					3. Disclosure to third parties
// 				</h2>
// 				<p>
// 					We only give your personal data to third parties if this is necessary
// 					for the provision of our services or if we are legally obliged to do
// 					so. Examples of data transfers are:
// 				</p>
// 				<ul className='list-disc pl-6 space-y-2'>
// 					<li>
// 						Service providers: We work with external service providers who
// 						assist us in providing our platform, such as hosting providers,
// 						payment providers or analytics providers. These service providers
// 						only receive the information they need to perform their services and
// 						are contractually bound to protect your information.
// 					</li>
// 					<li>
// 						Legal Requirements: We disclose information when required to do so
// 						by law, such as in the course of criminal prosecution or legal
// 						proceedings.
// 					</li>
// 				</ul>
// 			</section>

// 			<section className='space-y-4'>
// 				<h2 className='text-2xl font-semibold'>4. Analytics</h2>
// 				<p>
// 					We use anonymous or aggregated information to measure the success of
// 					our marketing campaigns or to analyze the use of our platform. In
// 					these cases, the information is no longer personally identifiable and
// 					is hosted on our Sounding Future Matomo server in Austria GDPR
// 					conform.
// 				</p>
// 			</section>

// 			<section className='space-y-4'>
// 				<h2 className='text-2xl font-semibold'>5. User rights</h2>
// 				<p>
// 					You have the right at any time to obtain information about the data
// 					stored about you:
// 				</p>
// 				<ul className='list-disc pl-6 space-y-2'>
// 					<li>
// 						Correction of data: If your data is incomplete or inaccurate, you
// 						can request that it be corrected.
// 					</li>
// 					<li>
// 						Erasure of data: You have the right to request the deletion of your
// 						personal data if they are no longer needed or if you wish to
// 						withdraw your consent.
// 					</li>
// 				</ul>
// 				<p>
// 					To exercise your rights or if you have any questions regarding the
// 					processing of your data, you can always contact us under the contact
// 					data indicated below.
// 				</p>
// 			</section>
// 		</div>
// 	);
// }

import { getTermsData } from '@/db/section';
import React from 'react';

export default async function PrivacyPolicy() {
	const { data } = await getTermsData('privacy');

	if (!data) {
		return <div>Privacy Policy data not found</div>;
	}

	return (
		<div className='max-w-3xl'>
			<div className='space-y-8'>
				<p className='mt-4'>{data.introduction}</p>

				{data.sections.map((section, index) => (
					<section key={section.id} className='space-y-4'>
						<h2 className='text-2xl font-semibold'>
							{index + 1}. {section.title}
						</h2>

						<p>{section.content}</p>

						{section.items && (
							<ul className='list-disc pl-6 space-y-2'>
								{section.items.map((item: string, index) => (
									<li key={index}>{item}</li>
								))}
							</ul>
						)}

						{section.footer && <p className='text-muted'>{section.footer}</p>}
					</section>
				))}

				<p className='mt-4'>{data.footer}</p>
			</div>
		</div>
	);
}
