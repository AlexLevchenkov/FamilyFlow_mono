import {
  Home,
  Calendar,
  Family,
  Goals,
  MyTasks,
  SettingsPage,
} from '@/pages';

export const privateRoutes = [
  {
    path: '/',
    element: (
      <Home
        tasks={[]}
        visibleTasks={[]}
        completed={0}
        progress={0}
        filter="Усі"
        setFilter={() => {}}
        showComposer={false}
        setShowComposer={() => {}}
        newTask=""
        setNewTask={() => {}}
        addTask={() => {}}
        toggleTask={() => {}}
        setActiveNav={() => {}}
      />
    ),
  },
  {
    path: '/calendar',
    element: <Calendar selectedDay={26} setSelectedDay={() => {}} />,
  },
  { path: '/family', element: <Family /> },
  { path: '/goals', element: <Goals /> },
  {
    path: '/my_tasks',
    element: (
      <MyTasks
        tasks={[]}
        visibleTasks={[]}
        completed={0}
        filter="Усі"
        setFilter={() => {}}
        showComposer={false}
        setShowComposer={() => {}}
        newTask=""
        setNewTask={() => {}}
        addTask={() => {}}
        toggleTask={() => {}}
      />
    ),
  },
  { path: '/settings', element: <SettingsPage /> },
];