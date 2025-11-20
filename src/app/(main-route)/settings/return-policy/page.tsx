import ReturnPolicy from '@/components/main-route/settings/return-policy/ReturnPolicy';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Return Policy - Popy',
    description: 'Return Policy',
};

const page = () => {
    return <ReturnPolicy />;
};

export default page;