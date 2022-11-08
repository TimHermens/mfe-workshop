import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export function Breadcrumb() {
  const location = useLocation();
  const [urlSegments, setUrlSegments] = useState<
    { path: string; segment: string }[]
  >([]);

  useEffect(() => {
    const urlSegments = location.pathname.split('/').slice(1);
    setUrlSegments(
      urlSegments.map((segment, index) => {
        const path = `/${urlSegments.slice(0, index + 1).join('/')}`;
        return { path, segment };
      })
    );
  }, []);

  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        {urlSegments.map((urlSegment, index) => (
          <li key={index} className="breadcrumb-item">
            {index + 1 === urlSegments.length ? (
              <span style={{ textTransform: 'capitalize' }}>
                {urlSegment.segment}
              </span>
            ) : (
              <Link
                to={urlSegment.path}
                style={{ textTransform: 'capitalize' }}
              >
                {urlSegment.segment}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
