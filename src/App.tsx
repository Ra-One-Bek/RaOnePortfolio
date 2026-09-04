import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Route, Routes, useLocation } from "react-router-dom"

import SplashScreen from "./pages/SplashScreen"
import Contacts from "./pages/Contacts"
import Header from "./pages/Header"
import Hero from "./pages/Hero"
import Projects from "./pages/Projects"
import Skills from "./pages/Skills"
import Pricing from "./pages/Pricing"

const SPLASH_KEY = "raone:splash"
const EASE = [0.22, 1, 0.36, 1] as const

function Home() {
    const location = useLocation()

    // переход с /pricing на секцию главной
    useEffect(() => {
        const target = (location.state as { scrollTo?: string } | null)?.scrollTo
        if (!target) return
        const t = setTimeout(() => {
            document.getElementById(target)?.scrollIntoView({ behavior: "smooth" })
        }, 120)
        return () => clearTimeout(t)
    }, [location.state])

    return (
        <>
            <Hero />
            <Skills />
            <Projects />
            <Contacts />
        </>
    )
}

function ScrollToTop() {
    const { pathname, state } = useLocation()
    useEffect(() => {
        if ((state as { scrollTo?: string } | null)?.scrollTo) return
        window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior })
    }, [pathname, state])
    return null
}

function App() {
    const location = useLocation()
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

            <ScrollToTop />

            {/* только opacity, без transform — иначе сломается fixed у Header */}
            <motion.div
                initial={false}
                animate={{ opacity: showSplash ? 0 : 1 }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
            >
                <Header />

                <AnimatePresence mode="wait">
                    <motion.main
                        key={location.pathname}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35, ease: EASE }}
                    >
                        <Routes location={location}>
                            <Route path="/" element={<Home />} />
                            <Route path="/pricing" element={<Pricing />} />
                            <Route path="*" element={<Home />} />
                        </Routes>
                    </motion.main>
                </AnimatePresence>
            </motion.div>
        </>
    )
}

export default App