import { useEffect, useMemo, useState } from "react"
import { initialTasks } from "./mocks/data"
import { AuthPage, Home, MyTasks, Calendar, Goals, Family, VerifyEmailPage } from "@/pages"
import { MainLayout } from "@layouts/MainLayout"
import { ToastContainer } from "@/ui"
import { authApi } from "@api/auth.api"
import { useAuthStore } from "@store/auth"
import { navigate } from "@lib/navigation"

let sessionBootstrapPromise: Promise<void> | null = null

function bootstrapSession() {
  if (!useAuthStore.getState().accessToken) return Promise.resolve()

  if (!sessionBootstrapPromise) {
    sessionBootstrapPromise = authApi.refreshToken()
      .then((response) => {
        useAuthStore.getState().refreshTokens({
          access: response.data.data.accessToken,
        })
      })
      .catch(() => {
        useAuthStore.getState().logout()
      })
      .finally(() => {
        sessionBootstrapPromise = null
      })
  }

  return sessionBootstrapPromise
}

export default function App() {
  const [path, setPath] = useState(window.location.pathname)
  const [authReady, setAuthReady] = useState(false)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const [tasks, setTasks] = useState(initialTasks)
  const [activeNav, setActiveNav] = useState("Огляд")
  const [filter, setFilter] = useState("Усі")
  const [showComposer, setShowComposer] = useState(false)
  const [newTask, setNewTask] = useState("")
  const [selectedDay, setSelectedDay] = useState(26)

  useEffect(() => {
    const updatePath = () => setPath(window.location.pathname)
    window.addEventListener("popstate", updatePath)
    return () => window.removeEventListener("popstate", updatePath)
  }, [])

  useEffect(() => {
    let active = true
    bootstrapSession().finally(() => {
      if (active) setAuthReady(true)
    })
    return () => {
      active = false
    }
  }, [])

  const visibleTasks = useMemo(() => {
    if (filter === "Виконані") return tasks.filter((task) => task.done)
    if (filter === "Активні") return tasks.filter((task) => !task.done)
    return tasks
  }, [filter, tasks])

  const resetPasswordToken = path.match(/^\/reset-password\/([^/]+)\/?$/)?.[1]
  const verifyEmailToken = path.match(/^\/verify-email\/([^/]+)\/?$/)?.[1]
  const isAuthLanding = [
    "/login",
    "/register",
    "/registration",
    "/reset-password",
    "/forgot-password",
  ].includes(path)
  const isPublicPath = isAuthLanding || Boolean(resetPasswordToken) || Boolean(verifyEmailToken)

  useEffect(() => {
    if (!authReady) return
    if (!isAuthenticated && !isPublicPath) {
      navigate("/login")
    } else if (isAuthenticated && isAuthLanding) {
      navigate("/")
    }
  }, [authReady, isAuthenticated, isAuthLanding, isPublicPath])

  if (!authReady) {
    return (
      <>
        <main className="grid min-h-screen place-items-center bg-white text-sm text-page-muted" aria-busy="true">
          Перевірка сесії…
        </main>
        <ToastContainer />
      </>
    )
  }

  if (!isAuthenticated && !isPublicPath) {
    return <><AuthPage view="login" /><ToastContainer /></>
  }

  if (isAuthenticated && isAuthLanding) return <ToastContainer />

  if (path === "/login") return <><AuthPage view="login" /><ToastContainer /></>
  if (path === "/register" || path === "/registration") return <><AuthPage view="register" /><ToastContainer /></>
  if (resetPasswordToken) return <><AuthPage view="reset-password" token={decodeURIComponent(resetPasswordToken)} /><ToastContainer /></>
  if (verifyEmailToken) return <><VerifyEmailPage token={decodeURIComponent(verifyEmailToken)} /><ToastContainer /></>
  if (path === "/reset-password" || path === "/forgot-password") return <><AuthPage view="reset" /><ToastContainer /></>

  function toggleTask(id: number) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
    )
  }

  function addTask() {
    if (!newTask.trim()) return
    setTasks((current) => [
      ...current,
      {
        id: Date.now(),
        title: newTask.trim(),
        meta: "Особиста справа",
        time: "Сьогодні",
        category: "Нове",
        color: "#8b63de",
        done: false,
      },
    ])
    setNewTask("")
    setShowComposer(false)
  }

  const completed = tasks.filter((task) => task.done).length
  const progress = Math.round((completed / tasks.length) * 100)

  return (
    <>
      <MainLayout activeNav={activeNav} setActiveNav={setActiveNav} tasks={tasks}>
        {activeNav === "Огляд" && (
          <Home
            tasks={tasks}
            visibleTasks={visibleTasks}
            completed={completed}
            progress={progress}
            filter={filter}
            setFilter={setFilter}
            showComposer={showComposer}
            setShowComposer={setShowComposer}
            newTask={newTask}
            setNewTask={setNewTask}
            addTask={addTask}
            toggleTask={toggleTask}
            setActiveNav={setActiveNav}
          />
        )}
        {activeNav === "Мої справи" && (
          <MyTasks
            tasks={tasks}
            visibleTasks={visibleTasks}
            completed={completed}
            filter={filter}
            setFilter={setFilter}
            showComposer={showComposer}
            setShowComposer={setShowComposer}
            newTask={newTask}
            setNewTask={setNewTask}
            addTask={addTask}
            toggleTask={toggleTask}
          />
        )}
        {activeNav === "Календар" && (
          <Calendar selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
        )}
        {activeNav === "Цілі" && <Goals />}
        {activeNav === "Родина" && <Family />}
      </MainLayout>
      <ToastContainer />
    </>
  )
}
