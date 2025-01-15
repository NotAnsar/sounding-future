import React from 'react';

export default function SchemaScript({
	data,
}: {
	data: { [key: string]: string | number | boolean | object };
}) {
	return (
		<script
			type='application/ld+json'
			key='structured-data'
			dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
		/>
	);
}
