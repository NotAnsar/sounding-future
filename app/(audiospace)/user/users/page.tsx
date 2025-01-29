import { columns } from '@/components/UsersCrud/table/columns';
import { DataTable } from '@/components/UsersCrud/table/data-table';
import Error from '@/components/Error';
import { buttonVariants } from '@/components/ui/button';
import { getUsers } from '@/db/user';
import { auth } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function page() {
	const [session, data] = await Promise.all([auth(), getUsers()]);

	if (!session || session.user.role !== 'admin') {
		notFound();
	}

	if (data.error) {
		return <Error message={data.message} />;
	}

	return (
		<>
			<div className='flex flex-col sm:flex-row sm:items-center justify-between mt-4 mb-4 sm:mb-12 gap-2'>
				<h2 className='text-3xl md:text-5xl font-semibold'>Users</h2>

				<Link href={'/user/users/new'} className={cn(buttonVariants())}>
					<Plus className='w-4 h-auto aspect-square mr-2' /> Add User
				</Link>
			</div>
			<DataTable columns={columns} data={data.data} />
		</>
	);
}
