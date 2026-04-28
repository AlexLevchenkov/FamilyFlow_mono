import type { INavItem } from "@ui/atoms";
import { NavBar } from "@ui/molecules";

import TaskSVG from "@assets/SVG/Task.svg";
import CalendarSVG from "@assets/SVG/Calendar.svg";
import GoalsSVG from "@assets/SVG/Goals.svg";
import FamilySVG from "@assets/SVG/Family.svg";
import SettingsSVG from "@assets/SVG/Settings.svg";

export const NavMenu = () => {
  const navList: INavItem[] = [
    {text: "My Tasks", link: "my_tasks", logo: TaskSVG},
    {text: "Calendar", link: "calendar", logo: CalendarSVG},
    {text: "Goals", link: "goald", logo: GoalsSVG},
    {text: "Family", link: "family", logo: FamilySVG},
    {text: "Settings", link: "settings", logo: SettingsSVG},
  ]

  return (
    <NavBar navList={navList} />
  )
}