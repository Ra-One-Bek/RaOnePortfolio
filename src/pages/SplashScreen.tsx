import { useCallback, useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

const EASE = [0.76, 0, 0.24, 1] as const

type Token = { t: string; c: string }

const LINES: Token[][] = [
    [
        { t: "const", c: "text-violet-400" },
        { t: " raone ", c: "text-neutral-100" },
        { t: "=", c: "text-neutral-500" },
        { t: " new ", c: "text-violet-400" },
        { t: "Developer", c: "text-sky-300" },
        { t: "();", c: "text-neutral-500" },
    ],
    [
        { t: "await", c: "text-violet-400" },
        { t: " raone", c: "text-neutral-100" },
        { t: ".", c: "text-neutral-500" },
        { t: "load", c: "text-amber-300" },
        { t: "(", c: "text-neutral-500" },
        { t: "skills", c: "text-neutral-300" },
        { t: ", ", c: "text-neutral-500" },
        { t: "projects", c: "text-neutral-300" },
        { t: ");", c: "text-neutral-500" },
    ],
    [
        { t: "open", c: "text-amber-300" },
        { t: "(", c: "text-neutral-500" },
        { t: "portfolio", c: "text-neutral-300" },
        { t: ");", c: "text-neutral-500" },
    ],
]

const PLAIN = LINES.map((line) => line.map((tok) => tok.t).join(""))

/** Слои, уезжающие вверх на выходе. Последний — верхний. */
const PANELS = ["bg-neutral-800", "bg-neutral-900", "bg-neutral-950"]

const ROWS = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
]

/** Детерминированная задержка: выглядит живо, но одинакова при каждом запуске. */
function delayFor(ch: string) {
    if (ch === " ") return 55
    if (".,;()".includes(ch)) return 95
    return 26 + (ch.charCodeAt(0) % 5) * 11
}

function renderLine(tokens: Token[], upto: number) {
    let left = upto
    return tokens.map((tok, i) => {
        if (left <= 0) return null
        const text = tok.t.slice(0, left)
        left -= tok.t.length
        return (
            <span key={i} className={tok.c}>
                {text}
            </span>
        )
    })
}

function Keyboard({ char }: { char: string | null }) {
    const upper = char ? char.toUpperCase() : null
    const isLetter = !!char && /[a-z]/i.test(char)
    const isSpace = char === " "
    const shift = !!char && (/[A-Z]/.test(char) || /[{}()"<>:?_+|~!@#$%^&*]/.test(char))

    return (
        <div className="flex scale-[0.85] flex-col items-center gap-1.5 select-none sm:scale-100">
            {ROWS.map((row, r) => (
                <div key={r} className="flex gap-1.5">
                    {row.map((key) => {
                        const active = isLetter && upper === key
                        return (
                            <motion.span
                                key={key}
                                animate={{
                                    y: active ? 2 : 0,
                                    backgroundColor: active
                                        ? "rgba(255,255,255,0.92)"
                                        : "rgba(255,255,255,0.05)",
                                    color: active ? "#0a0a0a" : "rgba(255,255,255,0.35)",
                                }}
                                transition={{ duration: 0.09 }}
                                className="flex h-6 w-6 items-center justify-center rounded-[5px] border border-white/10 text-[9px] font-medium sm:h-7 sm:w-7 sm:text-[10px]"
                            >
                                {key}
                            </motion.span>
                        )
                    })}
                </div>
            ))}

            <div className="flex gap-1.5">
                <motion.span
                    animate={{
                        y: shift ? 2 : 0,
                        backgroundColor: shift
                            ? "rgba(255,255,255,0.92)"
                            : "rgba(255,255,255,0.05)",
                        color: shift ? "#0a0a0a" : "rgba(255,255,255,0.35)",
                    }}
                    transition={{ duration: 0.09 }}
                    className="flex h-6 w-12 items-center justify-center rounded-[5px] border border-white/10 text-[9px] sm:h-7 sm:w-16 sm:text-[10px]"
                >
                    ⇧
                </motion.span>

                <motion.span
                    animate={{
                        y: isSpace ? 2 : 0,
                        backgroundColor: isSpace
                            ? "rgba(255,255,255,0.92)"
                            : "rgba(255,255,255,0.05)",
                    }}
                    transition={{ duration: 0.09 }}
                    className="h-6 w-32 rounded-[5px] border border-white/10 sm:h-7 sm:w-44"
                />

                <motion.span
                    animate={{
                        y: char === null ? 2 : 0,
                        backgroundColor:
                            char === null ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.05)",
                        color: char === null ? "#0a0a0a" : "rgba(255,255,255,0.35)",
                    }}
                    transition={{ duration: 0.09 }}
                    className="flex h-6 w-12 items-center justify-center rounded-[5px] border border-white/10 text-[9px] sm:h-7 sm:w-16 sm:text-[10px]"
                >
                    ↵
                </motion.span>
            </div>
        </div>
    )
}

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
    const [line, setLine] = useState(0)
    const [col, setCol] = useState(0)
    const [done, setDone] = useState(false)
    const finished = useRef(false)

    const finish = useCallback(() => {
        if (finished.current) return
        finished.current = true
        onFinish()
    }, [onFinish])

    // печать
    useEffect(() => {
        if (done) return
        const plain = PLAIN[line]

        if (col >= plain.length) {
            if (line === LINES.length - 1) {
                const t = setTimeout(() => setDone(true), 380)
                return () => clearTimeout(t)
            }
            const t = setTimeout(() => {
                setLine((l) => l + 1)
                setCol(0)
            }, 230)
            return () => clearTimeout(t)
        }

        const t = setTimeout(() => setCol((c) => c + 1), delayFor(plain[col]))
        return () => clearTimeout(t)
    }, [line, col, done])

    // автозакрытие после финальной строки
    useEffect(() => {
        if (!done) return
        const t = setTimeout(finish, 900)
        return () => clearTimeout(t)
    }, [done, finish])

    // пропуск по клику или клавише + блокировка скролла
    useEffect(() => {
        const prev = document.body.style.overflow
        document.body.style.overflow = "hidden"
        window.addEventListener("keydown", finish)
        window.addEventListener("pointerdown", finish)
        return () => {
            document.body.style.overflow = prev
            window.removeEventListener("keydown", finish)
            window.removeEventListener("pointerdown", finish)
        }
    }, [finish])

    // сокращённая анимация
    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            const t = setTimeout(finish, 400)
            return () => clearTimeout(t)
        }
    }, [finish])

    const currentChar = done ? null : (PLAIN[line][col] ?? null)

    return (
        <motion.div className="fixed inset-0 z-[100] cursor-pointer">
            {PANELS.map((bg, i) => (
                <motion.div
                    key={bg}
                    initial={{ y: "0%" }}
                    exit={{ y: "-100%" }}
                    transition={{
                        duration: 0.85,
                        ease: EASE,
                        delay: (PANELS.length - 1 - i) * 0.09,
                    }}
                    className={`absolute inset-0 ${bg}`}
                />
            ))}

            <motion.div
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.35, ease: "easeIn" }}
                className="relative flex h-full flex-col items-center justify-center px-5"
            >
                {/* окно редактора */}
                <div className="w-full max-w-lg overflow-hidden rounded-xl border border-white/10 bg-black/40 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] backdrop-blur-sm">
                    <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
                        <span className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
                        <span className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
                        <span className="ml-2 font-mono text-[11px] text-neutral-500">
                            portfolio.tsx
                        </span>
                    </div>

                    <div className="px-4 py-5 font-mono text-[12px] leading-relaxed sm:px-6 sm:py-6 sm:text-sm">
                        {LINES.map((tokens, i) => {
                            if (i > line) return null
                            const upto = i < line ? PLAIN[i].length : col
                            return (
                                <div key={i} className="flex gap-4">
                                    <span className="w-4 shrink-0 text-right text-neutral-700">
                                        {i + 1}
                                    </span>
                                    <span className="min-w-0 break-all">
                                        {renderLine(tokens, upto)}
                                        {i === line && !done && (
                                            <motion.span
                                                animate={{ opacity: [1, 1, 0, 0] }}
                                                transition={{
                                                    duration: 0.9,
                                                    repeat: Infinity,
                                                    times: [0, 0.5, 0.5, 1],
                                                }}
                                                className="ml-px inline-block h-[1em] w-[7px] translate-y-[2px] bg-white/80"
                                            />
                                        )}
                                    </span>
                                </div>
                            )
                        })}

                        <motion.div
                            animate={{ opacity: done ? 1 : 0, y: done ? 0 : 6 }}
                            transition={{ duration: 0.35 }}
                            className="mt-4 flex items-center gap-2 border-t border-white/10 pt-3 text-[11px] sm:text-xs"
                        >
                            <span className="text-emerald-400">✓</span>
                            <span className="text-neutral-400">ready in 0.42s</span>
                        </motion.div>
                    </div>
                </div>

                {/* клавиатура */}
                <div className="mt-10 sm:mt-12">
                    <Keyboard char={currentChar} />
                </div>

                <span className="absolute bottom-6 text-[10px] tracking-[0.25em] text-neutral-600 uppercase">
                    press anything to skip
                </span>
            </motion.div>
        </motion.div>
    )
}