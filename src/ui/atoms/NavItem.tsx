import { NavLink } from 'react-router-dom';

export interface INavItem {
  logo?: string;
  link: string;
  text: string;
}

export const NavItem = ({ logo, link, text }: INavItem) => {
  return (
    link &&
    text && (
      <NavLink
        to={link}
        className={({ isActive }) =>
          `flex gap-1 items-center w-full max-h-fit p-2
          ${isActive ? 'text-white bg-button' : 'text-text'}`
        }
      >
        {logo ? <img className="max-w-8" src={logo} /> : null}
        <span className="whitespace-nowrap">{text}</span>
      </NavLink>
    )
  );
};
