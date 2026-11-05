import { useEffect, useState } from 'react';
import { useCurrentUserQuery } from '@hooks';

interface UserProps {}

export const ProfileUser = () => {
  const { user, refetch } = useCurrentUserQuery();
  const [hasImageError, setHasImageError] = useState(false);
  const name = user?.name || 'Велком';
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toLocaleUpperCase('uk-UA');

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    setHasImageError(false);
  }, [user?.avatar]);

  return (
    <div className="flex min-w-0 flex-1 items-center gap-3">
      {user?.avatar && !hasImageError ? (
        <img
          alt={name}
          className="size-10 shrink-0 rounded-full object-cover"
          src={user.avatar}
          onError={() => setHasImageError(true)}
        />
      ) : (
        <div className="grid size-10 shrink-0 place-items-center rounded-full bg-gradientBlue text-sm font-extrabold text-info">
          {initials}
        </div>
      )}
      <div className="min-w-0">
        <p className="truncate text-sm font-extrabold">{name}</p>
      </div>
    </div>
  );
};
