'use client';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { Button } from '../../ui/button';
import { MoreHorizontalIcon } from 'lucide-react';

import { Dialog } from '@radix-ui/react-dialog';
import Link from 'next/link';
import { useState } from 'react';
import { DeleteTrack } from './DeleteTrack';

export default function ActionCell({ id }: { id: string }) {
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);

	return (
		<>
			<Dialog>
				<DropdownMenu modal={false}>
					<DropdownMenuTrigger asChild>
						<Button variant='ghost' className='h-8 w-8 p-0'>
							<span className='sr-only'>Open menu</span>
							<MoreHorizontalIcon className='h-4 w-4' />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
						<DropdownMenuItem onClick={() => navigator.clipboard.writeText(id)}>
							Copy track ID
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem className='p-0'>
							<Link
								href={`/user/tracks/upload/${id}`}
								className='px-2 py-1.5 w-full'
							>
								Edit Track
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => {
								setIsDeleteDialogOpen(true);
							}}
							className='cursor-pointer'
						>
							Delete Track
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
				{isDeleteDialogOpen && (
					<DeleteTrack
						id={id}
						open={isDeleteDialogOpen}
						setOpen={setIsDeleteDialogOpen}
					/>
				)}
			</Dialog>
		</>
	);
}
