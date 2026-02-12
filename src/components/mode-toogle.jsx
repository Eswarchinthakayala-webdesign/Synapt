import React from "react"
import { Moon, Sun } from "lucide-react"
import { motion } from "framer-motion"
import { useTheme } from "./theme-provider"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const isDark = theme === "dark"

  return (
    <div 
      onClick={toggleTheme}
      className="relative w-16 h-8 flex items-center bg-foreground/5 rounded-full p-1 cursor-pointer border border-foreground/10 group overflow-hidden"
    >
      {/* Background Glow */}
      <motion.div
        animate={{
          backgroundColor: isDark ? "rgba(var(--primary), 0.1)" : "rgba(255, 180, 0, 0.1)",
        }}
        className="absolute inset-0 transition-colors duration-500"
      />

      {/* Switch Knob */}
      <motion.div
        className="z-10 w-6 h-6 flex items-center justify-center bg-foreground rounded-full shadow-lg"
        animate={{
          x: isDark ? 32 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30
        }}
      >
        <div className="relative w-4 h-4">
          <motion.div
            initial={false}
            animate={{
              rotate: isDark ? 0 : 90,
              scale: isDark ? 0 : 1,
              opacity: isDark ? 0 : 1,
            }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center text-background"
          >
            <Sun className="w-4 h-4" />
          </motion.div>
          <motion.div
            initial={false}
            animate={{
              rotate: isDark ? 0 : -90,
              scale: isDark ? 1 : 0,
              opacity: isDark ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center text-background"
          >
            <Moon className="w-4 h-4" />
          </motion.div>
        </div>
      </motion.div>

      {/* Background Icons */}
      <div className="absolute inset-0 flex justify-between items-center px-2 pointer-events-none opacity-20">
        <Sun className="w-3 h-3" />
        <Moon className="w-3 h-3" />
      </div>
    </div>
  )
}