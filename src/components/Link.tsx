import { useNavigate } from 'react-router-dom';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

export function Link({ href, children, ...props }: LinkProps) {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    // Handle home navigation and scroll to top
    if (href === '/' || href === '#top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (href === '/') {
        navigate('/');
      }
      return;
    }

    // Handle navigation links
    if (href.startsWith('/')) {
      navigate(href);
      return;
    }

    // Handle anchor links
    if (href.startsWith('#')) {
      const targetId = href.slice(1); // Remove the # from the href
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    // Handle external links
    if (href.startsWith('http')) {
      window.open(href, '_blank', 'noopener,noreferrer');
      return;
    }
  };

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}