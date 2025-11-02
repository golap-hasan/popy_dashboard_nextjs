
import Terms from "@/components/main-route/settings/terms/Terms";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Terms - Popy',
    description: 'Terms',
};

const TermsPage = () => {
    return (
        <Terms />
    );
};

export default TermsPage;