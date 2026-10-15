interface FamilyAvatarProps {
  initials: string;
  color: string;
  size?: 'compact' | 'profile';
}

const avatarClasses = {
  compact: 'size-[47px] rounded-[17px] text-[15px] font-black',
  profile: 'size-20 rounded-[26px] text-2xl font-extrabold',
};

const indicatorClasses = {
  compact:
    'absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-white',
  profile:
    'absolute right-1 bottom-1 size-3.5 rounded-full border-[3px] border-white',
};

export function FamilyAvatar({
  initials,
  color,
  size = 'compact',
}: FamilyAvatarProps) {
  return (
    <span
      className={`relative grid place-items-center ${avatarClasses[size]}`}
      style={{ backgroundColor: `${color}20`, color }}
    >
      {initials}
      <i
        aria-hidden="true"
        className={indicatorClasses[size]}
        style={{ backgroundColor: color }}
      />
    </span>
  );
}
