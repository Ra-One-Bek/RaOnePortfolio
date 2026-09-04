import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

import SplashScreen from "./pages/SplashScreen"
import Contacts from "./pages/Contacts"
import Header from "./pages/Header"
import Hero from "./pages/Hero"
import Projects from "./pages/Projects"
import Skills from "./pages/Skills"

const SPLASH_KEY = "raone:splash"

function App() {
    const [showSplash, setShowSplash] = useState(
        () => sessionStorage.getItem(SPLASH_KEY) !== "done",
    )

    const handleFinish = () => {
        sessionStorage.setItem(SPLASH_KEY, "done")
        setShowSplash(false)
    }

    return (
        <>
            <AnimatePresence>
                {showSplash && <SplashScreen key="splash" onFinish={handleFinish} />}
            </AnimatePresence>

            {/* ВАЖНО: только opacity, без scale/transform — иначе сломается fixed у Header */}
            <motion.div
                initial={false}
                animate={{ opacity: showSplash ? 0 : 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            >
                <Header />
                <Hero />
                <Skills />
                <Projects />
                <Contacts />
            </motion.div>
        </>
    )
}

export default App