type CardProps = {
  title?: string;
  children: React.ReactNode;
  className?: string;
};

export function Card({ title, children, className = "" }: CardProps) {
  return (
    <section
      className={`
        bg-white/5 
        border border-white/10 
        rounded-xl 
        p-6 
        space-y-4 
        text-white
        ${className}
      `}
    >
      {title && (
        <h2 className="text-xl font-bold text-center">
          {title}
        </h2>
      )}

      {children}
    </section>
  );
}