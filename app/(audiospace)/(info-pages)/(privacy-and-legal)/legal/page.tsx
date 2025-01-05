import React from 'react';

export default function TermsOfUse() {
	return (
		<div className='max-w-3xl'>
			<div className='space-y-8'>
				<p className='mt-4'>
					We have laid down our Terms of use here to ensure fair and smooth
					cooperation between users, the service owners, and us as platform
					operators in the 3Daudiospace.
				</p>

				<section className='space-y-4'>
					<h2 className='text-2xl font-semibold'>1. User behavior</h2>
					<p>
						As a user of our audio streaming platform, you agree to use the
						platform in a manner that will fulfill and does not violate the
						rights of third parties. In particular, it is prohibited:
					</p>
					<ul className='list-disc pl-6 space-y-2'>
						<li>
							Uploading copyrighted material to the platform without the
							appropriate license or permission.
						</li>
						<li>
							Distribute inappropriate content, including defamatory,
							slanderous, obscene, violent, or discriminatory content.
						</li>
						<li>
							Storage, misuse of data, or manipulation of the Platform. Any form
							of unauthorized access, hacking, or use of software that could
							interfere with the normal functioning of our Platform is
							prohibited.
						</li>
						<li>
							The creation of accounts or use of fake identities to obtain
							unjustified advantages.
						</li>
					</ul>
					<p className='text-muted'>
						If you violate these provisions, we reserve the right to block or
						terminate your access to the Platform without prior notice.
					</p>
				</section>

				<section className='space-y-4'>
					<h2 className='text-2xl font-semibold'>2. Disclaimer</h2>
					<p>
						We provide the Platform and its contents and assume no liability for
						their availability, functionality, and freedom from errors. We are
						not liable for:
					</p>
					<ul className='list-disc pl-6 space-y-2'>
						<li>
							Technical disruptions that may lead to an interruption of the
							service.
						</li>
						<li>
							Loss of data or content due to system errors or security gaps.
						</li>
					</ul>
					<p>
						In no event shall we be liable for any indirect, incidental,
						consequential or punitive damages arising out of use or inability to
						use the Platform.
					</p>
				</section>

				<section className='space-y-4'>
					<h2 className='text-2xl font-semibold'>3. Termination of use</h2>
					<p>
						We reserve the right to terminate your access to the Platform at any
						time and without prior notice if you violate these Terms of Use:
					</p>
					<ul className='list-disc pl-6 space-y-2'>
						<li>Engage in abusive behavior.</li>
						<li>Use the Platform for illegal or unethical activities.</li>
						<li>Violate copyright or other laws.</li>
					</ul>
					<p>
						We reserve the right to take legal action in the event of serious or
						repeated abuse.
					</p>
				</section>

				<section className='space-y-4'>
					<h2 className='text-2xl font-semibold'>
						4. Changes to the Terms of Use
					</h2>
					<p>
						We reserve the right to change these Terms of Use at any time. We
						will notify you of any material changes by e-mail or by a prominent
						notice on the Platform at the time the modified Terms take effect.
						By continuing to use our Platform following the effective date of
						any such changes shall constitute your acceptance of the amended
						Terms. If you do not agree to the changes, you must stop using the
						Platform.
					</p>
				</section>
			</div>
		</div>
	);
}

// // // import React from 'react';

// // // export default function TermsOfUse() {
// // // 	return (
// // // 		<div className='max-w-3xl'>
// // // 			<div className='space-y-8'>
// // // 				<p className='mt-4'>{termsData.introduction.text}</p>

// // // 				{termsData.sections.map((section) => (
// // // 					<section key={section.id} className='space-y-4'>
// // // 						<h2 className='text-2xl font-semibold'>
// // // 							{section.id}. {section.title}
// // // 						</h2>
// // // 						<p>{section.description}</p>
// // // 						{section.items && (
// // // 							<ul className='list-disc pl-6 space-y-2'>
// // // 								{section.items.map((item: string, index) => (
// // // 									<li key={index}>{item}</li>
// // // 								))}
// // // 							</ul>
// // // 						)}
// // // 						{section.footer && <p className='text-muted'>{section.footer}</p>}
// // // 					</section>
// // // 				))}
// // // 			</div>
// // // 		</div>
// // // 	);
// // // }

// // // interface TermsData {
// // // 	introduction: { text: string };
// // // 	sections: Section[];
// // // }

// // // interface Section {
// // // 	id: number;
// // // 	title: string;
// // // 	description: string;
// // // 	items?: string[];
// // // 	footer?: string;
// // // }

// // // export const termsData: TermsData = {
// // // 	introduction: {
// // // 		text: 'We have laid down our Terms of use here to ensure fair and smooth cooperation between users, the service owners, and us as platform operators in the 3Daudiospace.',
// // // 	},
// // // 	sections: [
// // // 		{
// // // 			id: 1,
// // // 			title: 'User behavior',
// // // 			description:
// // // 				'As a user of our audio streaming platform, you agree to use the platform in a manner that will fulfill and does not violate the rights of third parties. In particular, it is prohibited:',
// // // 			items: [
// // // 				'Uploading copyrighted material to the platform without the appropriate license or permission.',
// // // 				'Distribute inappropriate content, including defamatory, slanderous, obscene, violent, or discriminatory content.',
// // // 				'Storage, misuse of data, or manipulation of the Platform. Any form of unauthorized access, hacking, or use of software that could interfere with the normal functioning of our Platform is prohibited.',
// // // 				'The creation of accounts or use of fake identities to obtain unjustified advantages.',
// // // 			],
// // // 			footer:
// // // 				'If you violate these provisions, we reserve the right to block or terminate your access to the Platform without prior notice.',
// // // 		},
// // // 		{
// // // 			id: 2,
// // // 			title: 'Disclaimer',
// // // 			description:
// // // 				'We provide the Platform and its contents and assume no liability for their availability, functionality, and freedom from errors. We are not liable for:',
// // // 			items: [
// // // 				'Technical disruptions that may lead to an interruption of the service.',
// // // 				'Loss of data or content due to system errors or security gaps.',
// // // 			],
// // // 			footer:
// // // 				'In no event shall we be liable for any indirect, incidental, consequential or punitive damages arising out of use or inability to use the Platform.',
// // // 		},
// // // 		{
// // // 			id: 3,
// // // 			title: 'Termination of use',
// // // 			description:
// // // 				'We reserve the right to terminate your access to the Platform at any time and without prior notice if you violate these Terms of Use:',
// // // 			items: [
// // // 				'Engage in abusive behavior.',
// // // 				'Use the Platform for illegal or unethical activities.',
// // // 				'Violate copyright or other laws.',
// // // 			],
// // // 			footer:
// // // 				'We reserve the right to take legal action in the event of serious or repeated abuse.',
// // // 		},
// // // 		{
// // // 			id: 4,
// // // 			title: 'Changes to the Terms of Use',
// // // 			description:
// // // 				'We reserve the right to change these Terms of Use at any time. We will notify you of any material changes by e-mail or by a prominent notice on the Platform at the time the modified Terms take effect. By continuing to use our Platform following the effective date of any such changes shall constitute your acceptance of the amended Terms. If you do not agree to the changes, you must stop using the Platform.',
// // // 		},
// // // 	],
// // // };

// 'use client';

// import React, { useState } from 'react';
// import { Pencil, Save, X } from 'lucide-react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Textarea } from '@/components/ui/textarea';
// import { Input } from '@/components/ui/input';

// const TermsAdmin = () => {
// 	const [sections, setSections] = useState([
// 		{
// 			id: 1,
// 			title: '1. User behavior',
// 			content: `As a user of our audio streaming platform, you agree to use the platform in a manner that will fulfill and does not violate the rights of third parties. In particular, it is prohibited:

// • Uploading copyrighted material to the platform without the appropriate license or permission.
// • Distribute inappropriate content, including defamatory, slanderous, obscene, violent, or discriminatory content.
// • Storage, misuse of data, or manipulation of the Platform. Any form of unauthorized access, hacking, or use of software that could interfere with the normal functioning of our Platform is prohibited.
// • The creation of accounts or use of fake identities to obtain unjustified advantages.

// If you violate these provisions, we reserve the right to block or terminate your access to the Platform without prior notice.`,
// 		},
// 		{
// 			id: 2,
// 			title: '2. Disclaimer',
// 			content: `We provide the Platform and its contents and assume no liability for their availability, functionality, and freedom from errors. We are not liable for:

// • Technical disruptions that may lead to an interruption of the service.
// • Loss of data or content due to system errors or security gaps.

// In no event shall we be liable for any indirect, incidental, consequential or punitive damages arising out of use or inability to use the Platform.`,
// 		},
// 		{
// 			id: 3,
// 			title: '3. Termination of use',
// 			content: `We reserve the right to terminate your access to the Platform at any time and without prior notice if you violate these Terms of Use:

// • Engage in abusive behavior.
// • Use the Platform for illegal or unethical activities.
// • Violate copyright or other laws.

// We reserve the right to take legal action in the event of serious or repeated abuse.`,
// 		},
// 		{
// 			id: 4,
// 			title: '4. Changes to the Terms of Use',
// 			content: `We reserve the right to change these Terms of Use at any time. We will notify you of any material changes by e-mail or by a prominent notice on the Platform at the time the modified Terms take effect. By continuing to use our Platform following the effective date of any such changes shall constitute your acceptance of the amended Terms. If you do not agree to the changes, you must stop using the Platform.`,
// 		},
// 	]);

// 	const [editingSection, setEditingSection] = useState<number | null>(null);
// 	const [editContent, setEditContent] = useState<string>('');
// 	const [editTitle, setEditTitle] = useState<string>('');

// 	const handleEdit = (section: {
// 		id: number;
// 		content: string;
// 		title: string;
// 	}) => {
// 		setEditingSection(section.id);
// 		setEditContent(section.content);
// 		setEditTitle(section.title);
// 	};

// 	const handleSave = (id: number) => {
// 		setSections(
// 			sections.map((section) =>
// 				section.id === id
// 					? { ...section, title: editTitle, content: editContent }
// 					: section
// 			)
// 		);
// 		setEditingSection(null);
// 	};

// 	const handleCancel = () => {
// 		setEditingSection(null);
// 		setEditContent('');
// 		setEditTitle('');
// 	};

// 	return (
// 		<div className='max-w-4xl mx-auto text-white'>
// 			<Card className='mb-6 text-white'>
// 				<CardHeader>
// 					<CardTitle>Terms of Use Admin Panel</CardTitle>
// 				</CardHeader>
// 				<CardContent>
// 					<p className='text-white'>
// 						Edit and manage the Terms of Use sections below. Click the edit
// 						button to modify content.
// 					</p>
// 				</CardContent>
// 			</Card>

// 			<div className='space-y-6'>
// 				{sections.map((section) => (
// 					<Card key={section.id} className='w-full text-white'>
// 						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
// 							{editingSection === section.id ? (
// 								<Input
// 									type='text'
// 									value={editTitle}
// 									onChange={(e) => setEditTitle(e.target.value)}
// 									className='flex-1 px-3 py-2 border rounded-md mr-4 '
// 								/>
// 							) : (
// 								<CardTitle>{section.title}</CardTitle>
// 							)}
// 							<div className='space-x-2'>
// 								{editingSection === section.id ? (
// 									<>
// 										<Button size='sm' onClick={() => handleSave(section.id)}>
// 											<Save className='h-4 w-4 mr-2' />
// 											Save
// 										</Button>
// 										<Button size='sm' onClick={handleCancel}>
// 											<X className='h-4 w-4 mr-2' />
// 											Cancel
// 										</Button>
// 									</>
// 								) : (
// 									<Button size='sm' onClick={() => handleEdit(section)}>
// 										<Pencil className='h-4 w-4 mr-2' />
// 										Edit
// 									</Button>
// 								)}
// 							</div>
// 						</CardHeader>
// 						<CardContent>
// 							{editingSection === section.id ? (
// 								<Textarea
// 									value={editContent}
// 									onChange={(e) => setEditContent(e.target.value)}
// 									className='min-h-[200px]'
// 								/>
// 							) : (
// 								<div className='whitespace-pre-wrap'>{section.content}</div>
// 							)}
// 						</CardContent>
// 					</Card>
// 				))}
// 			</div>
// 		</div>
// 	);
// };

// export default TermsAdmin;
