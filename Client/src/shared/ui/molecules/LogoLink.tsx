import { Logo } from '@ui/atoms';

interface ILogoLink {
  isTextBelow?: boolean;
  enabledLink?: boolean;
}

export const LogoLink = ({
  isTextBelow = false,
  enabledLink = true,
}: ILogoLink) => {
  const content = (
    <div
      className={`
        flex items-center justify-center
        ${isTextBelow ? 'flex-col' : 'flex-row'}
      `}
    >
      <div
        className={`
          ${
            isTextBelow ? 
            'w-12 sm:w-16 md:w-20 lg:w-24' : 
            'w-6 sm:w-8 md:w-10 lg:w-12'
          } 
        `}
      >
        <Logo />
      </div>
      <span className="text-text text-base sm:text-lg md:text-xl lg:text-2xl">
        Family
        <b className="text-lightText">Flow</b>
      </span>
    </div >
  )

  return enabledLink ?
    <a className="inline-block" href="/">{content}</a> :
    <div className="inline-block cursor-default">{content}</div>
}
