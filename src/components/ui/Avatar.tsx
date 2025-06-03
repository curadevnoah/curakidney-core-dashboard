interface AvatarProps {
  children?: React.ReactNode;
  alt: string;
  size?: "large" | "medium" | "small";
  status?: "online" | "busy" | "offline";
}

export const Avatar: React.FC<AvatarProps> = ({
  children,
  alt,
  size = "medium",
  status = "offline",
}) => {
  const sizeClasses = {
    small: "h-8 w-8 text-sm",
    medium: "h-10 w-10 text-base",
    large: "h-12 w-12 text-lg",
  };

  const statusClasses = {
    online: "bg-success-500",
    busy: "bg-warning-500",
    offline: "bg-gray-400",
  };

  return (
    <div className="relative">
      <div
        className={`
          ${sizeClasses[size]}
          flex items-center justify-center
          rounded-full
          bg-brand-100 dark:bg-brand-900/50
          text-brand-700 dark:text-brand-300
          font-medium
        `}
        title={alt}
      >
        {children}
      </div>
      {status && (
        <div
          className={`
            absolute bottom-0 right-0
            h-3 w-3
            rounded-full
            border-2 border-white dark:border-gray-900
            ${statusClasses[status]}
          `}
        />
      )}
    </div>
  );
};
