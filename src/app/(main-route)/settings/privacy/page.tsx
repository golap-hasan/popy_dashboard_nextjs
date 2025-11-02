import Privacy from '@/components/main-route/settings/privacy/Privacy';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy - Popy',
    description: 'Privacy',
};

const PrivacyPage = () => {
    return <Privacy />;
};

export default PrivacyPage;