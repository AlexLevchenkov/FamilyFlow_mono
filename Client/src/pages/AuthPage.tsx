import type { AuthView } from "../types/index"
import { Icon } from "../ui/atoms/Icon"
import { LoginForm } from "../ui/organisms/AuthForm"
import { RegistrationForm } from "../ui/organisms/RegistrationForm"
import { ForgotPasswordForm } from "../ui/organisms/ForgotPasswordForm"
import { ResetPasswordForm } from "../ui/organisms/ResetPasswordForm"
import familyIllustration from "@assets/Images/Сім'я без фону.png"
import { navigate } from "../lib/navigation"

const authEyebrowClasses =
  "mb-2 text-xs font-black uppercase tracking-widest text-page-accent-bright"
const authHeadingClasses =
  "m-0 text-3xl font-black leading-tight tracking-tighter text-page-heading md:text-4xl"
const socialButtonClasses =
  "flex min-h-11 items-center justify-center gap-2.5 rounded-xl border border-page-border text-sm font-black text-page-control transition duration-150 hover:border-page-border-accent hover:bg-page-surface"
const floatingCardClasses =
  "z-40 flex items-center gap-2.5 rounded-2xl border border-white/75 bg-white/80 p-3 shadow-xl backdrop-blur-md"
const floatingCardTitleClasses =
  "block text-xs font-black text-page-visual-heading"
const floatingCardDetailClasses =
  "mt-0.5 block text-xs font-bold text-page-muted"

export function AuthPage({
  view,
  token,
}: {
  view: AuthView
  token?: string
}) {
  const content = {
    login: {
      eyebrow: "Раді бачити вас знову",
      title: "Увійдіть у FamilyFlow",
      description:
        "Продовжуйте планувати сімейні справи легко й без зайвого клопоту.",
    },
    register: {
      eyebrow: "Почнімо разом",
      title: "Створіть сімейний простір",
      description: "Об'єднайте справи, події та важливі моменти всієї родини.",
    },
    reset: {
      eyebrow: "Безпека акаунта",
      title: "Відновлення пароля",
      description:
        "Вкажіть електронну пошту, і ми надішлемо посилання для відновлення доступу.",
    },
    "reset-password": {
      eyebrow: "Безпека акаунта",
      title: "Створіть новий пароль",
      description: "Введіть новий пароль двічі, щоб підтвердити його.",
    },
  }[view]

  return (
    <main className="grid min-h-screen grid-cols-[minmax(430px,0.88fr)_minmax(520px,1.12fr)] bg-white max-lg:block">
      <section className="relative flex min-h-screen flex-col px-[clamp(32px,6vw,92px)] pt-11 pb-7
                          max-lg:min-h-screen max-lg:pt-7 max-lg:pb-5 max-lg:px-[clamp(1.5rem,7vw,4rem)]"
      >
        <button
          className="inline-flex w-fit items-center gap-3 text-text"
          onClick={() => navigate("/")}
        >
          <span className="relative w-9 h-7">
            <span className="w-7 h-7 absolute top-2 left-2 rounded-md rotate-45" style={{
              background: "linear-gradient(135deg, #b157e9, #7653da)",
            }} />
            <span className="w-7 h-7 absolute top-2 right-2 rounded-md rotate-45" style={{
              background: "linear-gradient(135deg, #6d8bf0, #38b6e7)",
              mixBlendMode: "multiply",
            }} />
          </span>
          <strong className="text-2xl font-black tracking-[-0.6px]">
            FamilyFlow
          </strong>
        </button>

        <div className="m-auto w-full max-w-110 pt-12 pb-9 max-lg:pt-14">
          {view !== "login" && (
            <button
              className="mb-7 flex items-center gap-2 text-sm font-extrabold text-page-muted"
              onClick={() => navigate("/login")}
            >
              <Icon name="arrow" size={17} /> Назад до входу
            </button>
          )}
          <p className={authEyebrowClasses}>{content.eyebrow}</p>
          <h1 className={authHeadingClasses}>{content.title}</h1>
          <p className="mt-3 max-w-sm text-base leading-relaxed text-page-copy">{content.description}</p>

          {view === "login" && <LoginForm />}
          {view === "register" && <RegistrationForm />}
          {view === "reset" && <ForgotPasswordForm />}
          {view === "reset-password" && token && (
            <ResetPasswordForm token={token} />
          )}

          {(view === "login" || view === "register") && (
            <>
              <div className="my-6 flex items-center gap-3 text-xs font-bold text-page-faint">
                <span className="h-px flex-1 bg-page-border" />
                <span>або продовжити через</span>
                <span className="h-px flex-1 bg-page-border" />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <button className={socialButtonClasses} aria-label="Увійти через Google">
                  <b className="text-base">G</b> Google
                </button>
                <button className={socialButtonClasses} aria-label="Увійти через Apple">
                  <b className="text-base">●</b> Apple
                </button>
              </div>
              <p className="mt-6 text-center text-sm font-bold text-page-muted">
                {view === "login" ? "Ще не з нами?" : "Вже маєте акаунт?"}
                <button
                  className="ml-1 font-black text-background2"
                  onClick={() =>
                    navigate(view === "login" ? "/register" : "/login")
                  }
                >
                  {view === "login" ? "Створити акаунт" : "Увійти"}
                </button>
              </p>
            </>
          )}
        </div>

        <p className="text-xs font-bold text-page-faint">© 2026 FamilyFlow · Створено для родин</p>
      </section>

      <section className="relative mt-3 mr-3 mb-3 min-h-[calc(100vh-24px)] overflow-hidden rounded-3xl bg-[radial-gradient(circle_at_80%_15%,rgba(255,255,255,0.55),transparent_25%),linear-gradient(145deg,var(--color-page-gradient-lavender)_0%,var(--color-page-gradient-blue)_50%,var(--color-page-gradient-mint)_100%)] max-lg:hidden">
        <div className="absolute -right-36 -top-28 size-96 rounded-full bg-white/15" />
        <div className="absolute -bottom-44 -left-38 size-112 rounded-full border-8 border-white/40 opacity-70" />
        <div className="absolute top-[8%] left-[8%] z-30">
          <span className="inline-block rounded-full border border-[rgba(99,74,180,0.13)] bg-white/55 px-3 py-2 text-xs font-black uppercase tracking-widest text-background2">
            Сімейний простір №1
          </span>
          <h2 className="mt-4 text-3xl font-black leading-none tracking-tighter text-page-visual-heading md:text-5xl">
            Менше рутини.
            <br />
            Більше часу разом.
          </h2>
          <p className="mt-4 max-w-sm text-base leading-relaxed text-page-copy">
            Домовляйтесь, плануйте і підтримуйте одне одного щодня.
          </p>
        </div>
        <div className="absolute right-[-4%] bottom-[-2%] left-[3%] z-20 h-2/3">
          <div className="absolute right-[9%] bottom-[5%] left-[15%] h-[52%] rounded-full bg-white/35 blur-sm" />
          <img
            className="relative size-full object-contain object-bottom drop-shadow-2xl"
            alt="Щаслива родина біля дому"
            src={familyIllustration}
          />
        </div>
        <div className={`absolute top-[33%] right-[7%] ${floatingCardClasses}`}>
          <span className="grid size-7 place-items-center rounded-lg bg-page-success-soft text-page-success">
            <Icon name="check" size={13} />
          </span>
          <div>
            <strong className={floatingCardTitleClasses}>Сімейна вечеря</strong>
            <small className={floatingCardDetailClasses}>Усі вже підтвердили</small>
          </div>
        </div>
        <div className={`absolute bottom-[9%] left-[5%] ${floatingCardClasses}`}>
          <div className="flex pl-2">
            <i className="-ml-2 grid size-7 place-items-center rounded-full border-2 border-white bg-[#dfe5ff] text-xs font-black not-italic text-[#5267ca]">О</i>
            <i className="-ml-2 grid size-7 place-items-center rounded-full border-2 border-white bg-[#fbe2eb] text-xs font-black not-italic text-[#d55f82]">А</i>
            <i className="-ml-2 grid size-7 place-items-center rounded-full border-2 border-white bg-[#fff0d8] text-xs font-black not-italic text-[#db8c26]">М</i>
          </div>
          <div>
            <strong className={floatingCardTitleClasses}>Уся родина разом</strong>
            <small className={floatingCardDetailClasses}>4 учасники онлайн</small>
          </div>
        </div>
      </section>
    </main>
  )
}
