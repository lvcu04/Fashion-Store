// import React , {createContext, useContext, useState, ReactNode} from 'react';
// import { useColorScheme } from 'react-native';

// type ThemeContextType = {
//     isDarkMode: boolean;
//     toggleTheme: () => void;
// };

// const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// export const ThemeProvider = ({ children }: { children: ReactNode }) => {
//     const systemThreme = useColorScheme();
//     const [darkMode, setDarkMode] = useState(systemThreme === 'dark');

//     const toggleTheme = () => setDarkMode((prev) => !prev);
    
//     return (
//         <ThemeContext.Provider value={{ isDarkMode: darkMode, toggleTheme }}>
//             {children}
//         </ThemeContext.Provider>
//     );
// };

// export const useTheme = (): ThemeContextType => {
//     const context = useContext(ThemeContext);
//     if (!context) throw new Error('useTheme must be used within a ThemeProvider');
//     return context;
// };