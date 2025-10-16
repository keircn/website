interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageContainer({
  children,
  className = "",
}: PageContainerProps) {
  return (
    <main className="flex-1 pt-6 md:pt-4">
      <div
        className={`max-w-6xl lg:max-w-full mx-auto px-4 border border-border rounded-lg p-6 ml-0 mb-2.5 md:ml-6 mr-4 ${className}`}
      >
        {children}
      </div>
    </main>
  );
}
