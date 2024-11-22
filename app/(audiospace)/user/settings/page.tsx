import UserInfoForm from '@/components/settings/UserInfoForm';
import { getCurrentUser } from '@/db/user';

export default async function Page() {
	const user = await getCurrentUser();

	return <UserInfoForm initialData={user} />;
}
