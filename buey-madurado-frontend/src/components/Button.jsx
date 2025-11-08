// src/components/Button.jsx
export default function Button({ children, variant = "primary", size = "md", className = "", ...props }) {

  const sizes = {
    sm: "px-4 py-1 text-sm",
    md: "px-5 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const base = `
    rounded-full font-sans font-semibold
    transition-all duration-500 transform hover:scale-105
    border-[1.5px] border-transparent
  `;

  const variants = {
    primary: `
      bg-amber-500 text-[#1a1410]
      hover:bg-[#1a1410] hover:text-amber-500
      hover:border-amber-500
      ${base}
    `,
    secondary: `
      bg-white text-amber-900 border border-amber-900
      hover:bg-amber-100
      ${base}
    `,
  };

  return (
    <button
      className={`${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
