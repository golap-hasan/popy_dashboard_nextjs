import Profile from "@/components/main-route/settings/profile/Profile";

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Profile - Popy',
    description: 'Profile',
};

const ProfilePage = () => {
    return (
        <Profile />
    );
};

export default ProfilePage;