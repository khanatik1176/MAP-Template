'use client';
import { createContext, useState } from 'react';

export const ModeContext = createContext({
  isDarkModeActive: false,
  setIsDarkModeActive: (_value: boolean) => {},
  toggleMode: () => {},
});

interface ModeContextType {
    isDarkModeActive: boolean;
    setIsDarkModeActive: React.Dispatch<React.SetStateAction<boolean>>;
    toggleMode: () => void;
}

interface ModeProviderProps {
    children: React.ReactNode;
}

export const ModeProvider: React.FC<ModeProviderProps> = (props) => {
    const [isDarkModeActive, setIsDarkModeActive] = useState<boolean>(false);

    const toggleMode = () => {
        setIsDarkModeActive?.(!isDarkModeActive);
        // localStorage.setItem('isDarkModeActive', JSON.stringify(!isDarkModeActive));
    };

    const ModeValue: ModeContextType = {
        isDarkModeActive,
        setIsDarkModeActive,
        toggleMode,
    }

    return (
        <ModeContext.Provider value={ModeValue}>
            {props.children}
        </ModeContext.Provider>
    )
};
