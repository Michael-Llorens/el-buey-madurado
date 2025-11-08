export default function NavLink({ href, children }) {
  return (
    <li>
      <a
        href={href}
        className="
          text-lg text-white 
          hover:text-amber-400 
          transform hover:scale-105 
          transition-all duration-300 
          inline-block
        "
      >
        {children}
      </a>
    </li>
  );
}
