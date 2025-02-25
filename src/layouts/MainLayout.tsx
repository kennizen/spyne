import { ReactNode } from "react";

interface IProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: IProps) => {
  return <main className="h-screen w-full">{children}</main>;
};
