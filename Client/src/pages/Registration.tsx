import { LogoLink } from "@ui";
import { RegistrationForm } from "@features/auth";

export const RegistrationPage = () => {
  return (
    <>
      <main className="h-screen flex flex-col justify-center">
        <div className="flex justify-center py-8">
          <div className="flex flex-col justify-center bg-white shadow-lg p-10 lg:w-3/7 lg:px-10">
            <div className="mb-10">
              <LogoLink enabledLink={false} isTextBelow={true} />
              <h2 className="text-3xl font-bold text-purple-700 mt-6">
                Вітаємо!
              </h2>
              <p className="text-gray-500 mt-2">
                Заповніть будь ласка наступні поля для проходження реєстрації
              </p>
            </div>

            <RegistrationForm />
          </div>

          <div className="w-4/7 items-center justify-center hidden lg:flex">
            <img
              src="./src/assets/Images/LoginPageImg.jpg"
              alt="Family illustration"
              className="w-full"
            />
          </div>
        </div>
      </main>
    </>
  );
};