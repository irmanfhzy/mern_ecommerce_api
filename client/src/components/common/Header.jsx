export default function Header({ children, className = "", ...props }) {
  return (
    <header className={className} {...props}>
      {children}
    </header>
  );
}

Header.Left = function HeaderLeft({ children, className = "", ...props }) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
};

Header.Center = function HeaderCenter({ children, className = "", ...props }) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
};

Header.Right = function HeaderRight({ children, className = "", ...props }) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
};
