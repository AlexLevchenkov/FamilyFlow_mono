import { NavLink } from "react-router-dom";

export const VerifyEmailPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white px-6">
      {/* Логотип */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-blue-700">Підтвердження електронної пошти</h1>
      </div>

      {/* Ілюстрація */}
      <div className="w-64 mb-8">
        <img
          src="/assets/email_verified.svg"
          alt="Email verified"
          className="w-full h-auto"
        />
      </div>

      {/* Повідомлення */}
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Вашу електронну пошту було успішно підтверджено!
        </h2>
        <p className="text-gray-600 mb-6">
          Дякуємо, тепер ви можете користуватися всіма функціями нашого сервісу.
        </p>

        <NavLink
          to="/"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Перейти на головну
        </NavLink>
      </div>

      {/* Футер */}
      <footer className="mt-12 text-sm text-gray-500">
        <div className="flex gap-3 justify-center mb-2">
          <a href="/support" className="hover:text-blue-600">Підтримка</a>
          <span>|</span>
          <a href="/privacy" className="hover:text-blue-600">Політика конфіденційності</a>
          <span>|</span>
          <a href="/terms" className="hover:text-blue-600">Умови використання</a>
        </div>
        <p>© 2026 FamilyFlow. Усі права захищено.</p>
      </footer>
    </div>
  );
};
