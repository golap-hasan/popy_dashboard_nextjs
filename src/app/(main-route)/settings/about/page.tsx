import About from '@/components/main-route/settings/about/About';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About Us - Popy',
    description: 'About Us',
};

const AboutPage = () => {
  return <About />;
};

export default AboutPage;