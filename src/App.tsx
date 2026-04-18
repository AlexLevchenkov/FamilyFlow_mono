import LoginLogout from '@organisms/LoginLogout';
import '@styles/fonts.css'
import Logo from '@atoms/Logo';

export default function App() {
  return (
    <div>
      <LoginLogout />
      <Logo />
      <h1 className="text-white bg-red-500 text-xl">
        Перевірка кастомного кольору
      </h1>
      <p className="font-script">This will use the Great Vibes font family.</p>
    </div>
  );
}
