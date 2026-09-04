import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

type Link = { label: string; id: string; meta: string }

const LINKS: Link[] = [
    { label: "Home", id: "home", meta: "01" },
    { label: "Skills", id: "skills", meta: "02" },
    { label: "Projects", id: "projects", meta: "03" },
    { label: "Contacts", id: "contacts", meta: "04" },
]

const SOCIALS = [
    { label: "Telegram", href: "https://t.me/gucc1_prado" },
    { label: "GitHub", href: "https://github.com/raone" },
    { label: "LinkedIn", href: "https://linkedin.com/in/abiyev" },
]

const EASE = [0.76, 0, 0.24, 1] as const

/** Слои, которые проезжают друг за другом. Последний — с контентом. */
const SHEETS = ["bg-neutral-300", "bg-neutral-500", "bg-neutral-950"]

export default function Header() {
    const [open, setOpen] = useState(false)
    const [hidden, setHidden] = useState(false)
    const lastY = useRef(0)

    // прячем шапку при скролле вниз, возвращаем при скролле вверх
    useEffect(() => {
        const onScroll = () => {
            const y = window.scrollY
            setHidden(y > 120 && y > lastY.current)
            lastY.current = y
        }
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    // блокировка скролла без прыжка страницы + закрытие по Escape
    useEffect(() => {
        if (!open) return
        const gap = window.innerWidth - document.documentElement.clientWidth
        const prev = document.body.style.cssText
        document.body.style.overflow = "hidden"
        document.body.style.paddingRight = `${gap}px`

        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
        window.addEventListener("keydown", onKey)

        return () => {
            document.body.style.cssText = prev
            window.removeEventListener("keydown", onKey)
        }
    }, [open])

    const go = (id: string) => {
        setOpen(false)
        setTimeout(() => {
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
        }, 700)
    }

    return (
        <>
            <motion.header
                animate={{ y: hidden && !open ? "-120%" : "0%" }}
                transition={{ duration: 0.45, ease: EASE }}
                className="fixed inset-x-0 top-0 z-[60] flex items-center justify-between px-5 py-5 mix-blend-difference sm:px-8 md:px-10"
            >
                <button
                    onClick={() => go("home")}
                    className="text-sm tracking-[0.2em] text-slate-600 uppercase"
                >
                    RaOne
                </button>

                <button
                    onClick={() => setOpen((v) => !v)}
                    aria-label={open ? "Закрыть меню" : "Открыть меню"}
                    className="group flex items-center gap-3"
                >
                    <span className="hidden text-xs tracking-[0.2em] text-gray-500 uppercase sm:block">
                        {open ? "Close" : "Menu"}
                    </span>
                    <span className="relative flex h-6 w-8 flex-col justify-center">
                        <motion.span
                            animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -4 }}
                            transition={{ duration: 0.4, ease: EASE }}
                            className="absolute h-px w-8 bg-gray-500"
                        />
                        <motion.span
                            animate={
                                open
                                    ? { rotate: -45, y: 0, width: 32 }
                                    : { rotate: 0, y: 4, width: 20 }
                            }
                            transition={{ duration: 0.4, ease: EASE }}
                            className="absolute right-0 h-px bg-gray-500"
                        />
                    </span>
                </button>
            </motion.header>

            <AnimatePresence>
                {open && (
                    <div className="fixed inset-0 z-50">
                        {/* слои-шторки */}
                        {SHEETS.map((bg, i) => (
                            <motion.div
                                key={bg}
                                initial={{ x: "100%" }}
                                animate={{ x: "0%" }}
                                exit={{ x: "100%" }}
                                transition={{
                                    duration: 0.75,
                                    ease: EASE,
                                    delay: i * 0.07,
                                }}
                                className={`absolute inset-0 ${bg}`}
                            />
                        ))}

                        {/* контент */}
                        <motion.nav
                            initial="hidden"
                            animate="show"
                            exit="hidden"
                            className="relative flex h-full flex-col justify-between px-5 pt-28 pb-10 sm:px-8 md:px-10 md:pt-32"
                        >
                            <ul>
                                {LINKS.map((link, i) => (
                                    <li
                                        key={link.id}
                                        className="overflow-hidden border-b border-white/10"
                                    >
                                        <motion.button
                                            onClick={() => go(link.id)}
                                            variants={{
                                                hidden: { y: "110%", opacity: 0 },
                                                show: { y: "0%", opacity: 1 },
                                            }}
                                            transition={{
                                                duration: 0.7,
                                                ease: EASE,
                                                delay: 0.35 + i * 0.08,
                                            }}
                                            className="group flex w-full items-baseline gap-4 py-4 text-left sm:gap-8 md:py-6"
                                        >
                                            <span className="w-6 shrink-0 text-[10px] tracking-[0.2em] text-white/35 transition-colors duration-300 group-hover:text-white sm:text-xs">
                                                {link.meta}
                                            </span>

                                            {/* перекатывающийся текст */}
                                            <span className="relative block overflow-hidden">
                                                <span className="block text-4xl leading-[1.05] font-medium tracking-tight text-white transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full sm:text-6xl md:text-7xl">
                                                    {link.label}
                                                </span>
                                                <span
                                                    aria-hidden
                                                    className="absolute inset-0 block translate-y-full text-4xl leading-[1.05] font-medium tracking-tight text-white/45 italic transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0 sm:text-6xl md:text-7xl"
                                                >
                                                    {link.label}
                                                </span>
                                            </span>

                                            <span className="ml-auto translate-x-[-8px] text-xl text-white/0 transition-all duration-500 group-hover:translate-x-0 group-hover:text-white">
                                                ↗
                                            </span>
                                        </motion.button>
                                    </li>
                                ))}
                            </ul>

                            <motion.div
                                variants={{
                                    hidden: { opacity: 0, y: 16 },
                                    show: { opacity: 1, y: 0 },
                                }}
                                transition={{ duration: 0.6, ease: "easeOut", delay: 0.75 }}
                                className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
                            >
                                <div className="flex flex-wrap gap-x-6 gap-y-2">
                                    {SOCIALS.map((s) => (
                                        
                                        <a  key={s.label}
                                            href={s.href}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-xs tracking-[0.18em] text-white/50 uppercase transition-colors hover:text-white"
                                        >
                                            {s.label}
                                        </a>
                                    ))}
                                </div>

                                
                                <a href="mailto:helloaktau@gmail.com"
                                    className="text-sm text-white/70 transition-colors hover:text-white"
                                >
                                    helloaktau@gmail.com
                                </a>
                            </motion.div>

                            {/* декоративная подпись-призрак */}
                            <motion.span
                                variants={{
                                    hidden: { opacity: 0 },
                                    show: { opacity: 1 },
                                }}
                                transition={{ duration: 1, delay: 0.6 }}
                                className="pointer-events-none absolute right-4 bottom-24 hidden text-[16vw] leading-none font-black text-white/[0.04] select-none md:block"
                            >
                                MENU
                            </motion.span>
                        </motion.nav>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}