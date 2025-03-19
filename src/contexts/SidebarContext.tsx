import { FC, useState, createContext, ReactNode } from 'react';

type SidebarContext = {
  sidebarToggle: boolean;
  toggleSidebar: () => void;
};

export const SidebarContext = createContext<SidebarContext>({} as SidebarContext);

interface SidebarProviderProps {
  children: ReactNode;
}

export const SidebarProvider: FC<SidebarProviderProps> = ({ children }) => {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const toggleSidebar = () => {
    setSidebarToggle(!sidebarToggle);
  };

  return (
    <SidebarContext.Provider value={{ sidebarToggle, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};
