import { NavItem, type INavItem } from "@ui/atoms"

interface INavBar {
  navList: INavItem[]
}

export const NavBar = ({ navList }: INavBar) => {
  return (
    <nav className="grid gap-1">
      {navList.map((item) => <NavItem key={item.link} {...item} />)}
    </nav>
  )
}