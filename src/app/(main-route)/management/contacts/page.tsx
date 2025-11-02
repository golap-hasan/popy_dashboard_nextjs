
import type { Metadata } from "next";
import Contacts from '@/components/main-route/management/contacts/Contacts';

export const metadata: Metadata = {
    title: "Contacts Management",
    description: "Manage customer contacts and inquiries.",
};

const ContactPage = () => {
    return (
       <Contacts />
    );
};

export default ContactPage;