import Error from '@/components/Error';
import UserInfoForm from '@/components/settings/UserInfoForm';
import { getCurrentUserSafe } from '@/db/user';

export default async function Page() {
	const user = await getCurrentUserSafe();

	if (user.error || !user.user) {
		return <Error message={user.message} />;
	}

	return <UserInfoForm initialData={user.user} />;
}
