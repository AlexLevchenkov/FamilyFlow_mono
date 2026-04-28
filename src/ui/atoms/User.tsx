import { useStore } from "@/store";

interface IProps {
  showAvatar: boolean
}

export const User = ({ showAvatar }: IProps) => {
  const { auth } = useStore();

  return <div>
    {showAvatar && auth.user?.avatar
      ? <img src={auth.user.avatar} alt={`Avatar ${auth.user.name}`} />
      : <></>
    }
    <p>Hi, {auth.user?.name}!</p>
  </div>
}