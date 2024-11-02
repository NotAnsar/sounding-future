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
