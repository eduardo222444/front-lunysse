export const Card = ({ children, className = '', ...props }) => {
    return (
      <div
        className={`rounded-2xl bg-white shadow-lg p-6 ${className}`}
        {...props}
      >
        
        {children}
      </div>
    );
  };