import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Icon } from '@ui';
import { useVerifyEmail } from '@features/auth';

export const VerifyEmailPage = ({ token }: { token: string }) => {
  const verifyEmailMutation = useVerifyEmail();
  const navigate = useNavigate();
  const submittedToken = useRef<string | null>(null);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );

  useEffect(() => {
    if (!token || submittedToken.current === token) return;
    submittedToken.current = token;
    verifyEmailMutation.mutate(token, {
      onSuccess: () => setStatus('success'),
      onError: () => setStatus('error'),
    });
  }, [token, verifyEmailMutation]);

  const isSuccess = status === 'success';

  return (
    <main className="grid min-h-screen place-items-center bg-white px-5">
      <section className="w-full max-w-md text-center">
        <div
          className={`mx-auto mb-6 grid size-16 place-items-center rounded-3xl ${isSuccess ? 'bg-successSoft text-success' : status === 'error' ? 'bg-red-50 text-red-600' : 'bg-background text-background2'}`}
        >
          <Icon name={isSuccess ? 'check' : 'mail'} size={28} />
        </div>
        <p className="mb-2 text-xs font-black uppercase tracking-widest text-primary">
          {status === 'loading'
            ? 'Перевірка'
            : isSuccess
              ? 'Готово'
              : 'Безпека акаунта'}
        </p>
        <h1 className="text-3xl font-black tracking-tight text-text">
          {status === 'loading'
            ? 'Підтверджуємо електронну пошту'
            : isSuccess
              ? 'Пошту підтверджено'
              : 'Не вдалося підтвердити пошту'}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-lightText">
          {status === 'loading'
            ? 'Це займе лише мить.'
            : isSuccess
              ? 'Тепер ви можете увійти до FamilyFlow.'
              : 'Посилання недійсне або строк його дії минув. Запросіть новий лист і спробуйте ще раз.'}
        </p>
        {status !== 'loading' && (
          <button
            className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,var(--color-background1),var(--color-background2))] px-4 py-3 text-sm font-black text-white shadow-lg transition duration-150 hover:-translate-y-px hover:shadow-xl"
            onClick={() => navigate('/login')}
            type="button"
          >
            Перейти до входу <Icon name="chevron" size={17} />
          </button>
        )}
      </section>
    </main>
  );
};
