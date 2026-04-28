import {
  HomePage,
  CalendarPage,
  FamilyPage,
  GoalsPage,
  MyTasksPage,
  SettingsPage,
} from "@/pages";

export const privateRoutes = [
  { path: "/", element: <HomePage /> },
  { path: "/calendar", element: <CalendarPage /> },
  { path: "/family", element: <FamilyPage /> },
  { path: "/goals", element: <GoalsPage /> },
  { path: "/my_tasks", element: <MyTasksPage /> },
  { path: "/settings", element: <SettingsPage /> },
];