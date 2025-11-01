
type PageLayoutProps = {
    children: React.ReactNode;
    pagination?: React.ReactNode;
};

const PageLayout = ({ children, pagination }: PageLayoutProps) => {
    return (
        <div className='flex flex-col min-h-[calc(100vh-112px)]'>
            <div className="grow">
                {children}
            </div>
            {pagination}
        </div>
    );
};

export default PageLayout;  