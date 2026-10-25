"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import {
    AnimatePresence,
    motion,
    useReducedMotion,
    useScroll,
    useTransform,
    type MotionValue,
} from "framer-motion"

type Project = {
    title: string
    subtitle: string
    description: string
    tags: string[]
    year: string
    href?: string
    images?: string[]
}

const PROJECTS: Project[] = [
    {
        title: "EyesApp",
        subtitle: "ИИ очки с веб-приложением для людей с нарушением зрении",
        description:
        "EyesApp — умные ИИ-очки на базе ESP32-CAM, которые используют камеру для захвата изображения и передачи данных в веб-приложение. Система анализирует изображение с помощью ИИ, распознаёт объекты и текст, а результаты отображаются или озвучиваются для пользователя. Управление и запуск основных функций выполняются через веб-интерфейс.",
        tags: ["Next.js", "MDX", "Framer Motion"],
        year: "2025",
        images: [
            "/images/EyesApp/EyesApp-hero.png",
            "/images/EyesApp/EyesApp-nav.png",
            "/images/EyesApp/EyesApp-ai.png",
            "/images/EyesApp/EyesApp-music.png",
            "/images/EyesApp/EyesApp-status.png",
            "/images/EyesApp/EyesApp-connect.png",
        ],
    },
    
    {
        title: "PlantCare",
        subtitle: "Распознование видов растений и видов их болезней с помощью компьютерного зрения.",
        description:
            "Распознает растение и их болезни по картинке или же по Live camera. Точность распознование состовляет 94%. После распознование по шаговый план улучшение если есть шансы на спасение растений.",
        tags: ["React", "TypeScript", "Python(ML)", "TensorFlow"],
        year: "2026",
        images: [
            "/images/PlantCare/PlantCare.png",
            "/images/PlantCare/PlantCare2.jpg",
        ],
    },
    {
        title: "AqwaAI",
        subtitle: "online learning web-app",
        description:
            "Веб-приложение для онлайн обучение экономики с интеграции ИИ, реализовано в стиле Duolingo.",
        tags: ["React", "TypeScript", "ThreeJS", "NestJs", "postgresql", "prismaORM", "Gemini-Api", "Blender"],
        year: "2026",
        images: [
            "/images/AqwaAi/AqwaAi-landing.png",
            "/images/AqwaAi/AqwaAi-AI.png",
            "/images/AqwaAi/AqwaAi-profile.png",
        ],
    },
    {
        title: "RaOne AR shoping",
        subtitle: "Online shoping with integration AI",
        description:
            "Веб-приложение для покупки одежды и с просмотром трехмерной визуализацией, с интеграции ИИ, Использовано 3д модели и 3д сцены.",
        tags: ["React", "TypeScript", "NestJs", "postgresql", "prismaORM", "Gemini-Api"],
        year: "2026",
        images: [],
    },
    {
        title: "Wedding Invites",
        subtitle: "Interactive invitation platform",
        description:
            "3D-сцены, музыка, RSVP на serverless-функциях и админка с выгрузкой в Excel. Каждое приглашение — отдельный продукт под клиента.",
        tags: ["React", "Three.js", "Vercel", "Postgres"],
        year: "2026",
        images: [
            "/images/WeddingScreen.png",
            // Добавьте сюда пути к другим скриншотам из public/images.
        ],
        href: "https://wedding-rho-seven-36.vercel.app/",
    },
]

function ProjectImage({ src, title }: { src?: string; title: string }) {
    const [failed, setFailed] = useState(false)
    useEffect(() => setFailed(false), [src])

    if (!src || failed) {
        return (
            <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,#ffffff_0%,#f2f2f2_45%,#e4e4e4_100%)] p-8">
                <span className="text-center text-2xl font-medium tracking-tight text-neutral-400">
                    {title}
                </span>
            </div>
        )
    }

    return (
        <img src={src} alt={`Скриншот проекта ${title}`} draggable={false}
            onError={() => setFailed(true)} className="h-full w-full object-cover" />
    )
}

function Gallery({ project }: { project: Project }) {
    const [slide, setSlide] = useState(0)
    const images = project.images ?? []
    const count = images.length
    const move = (step: number) => setSlide((current) => (current + step + count) % count)
    const reducedMotion = useReducedMotion()

    return (
        <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50">
            <div className="relative h-[30vh] min-h-48 sm:h-[42vh]">
                <AnimatePresence initial={false} mode="wait">
                    <motion.div key={slide}
                        initial={{ opacity: reducedMotion ? 1 : 0 }} animate={{ opacity: 1 }}
                        exit={{ opacity: reducedMotion ? 1 : 0 }} transition={{ duration: 0.15 }}
                        drag={count > 1 ? "x" : false} dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.15} style={{ touchAction: "pan-y" }}
                        onDragEnd={(_, info) => {
                            if (info.offset.x < -50) move(1)
                            else if (info.offset.x > 50) move(-1)
                        }} className="absolute inset-0">
                        <ProjectImage src={images[slide]} title={project.title} />
                    </motion.div>
                </AnimatePresence>
                {count > 1 && (
                    <>
                        <button type="button" aria-label="Предыдущий слайд" onClick={() => move(-1)}
                            className="absolute top-1/2 left-3 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-xl text-neutral-900 shadow-sm hover:bg-white">←</button>
                        <button type="button" aria-label="Следующий слайд" onClick={() => move(1)}
                            className="absolute top-1/2 right-3 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-xl text-neutral-900 shadow-sm hover:bg-white">→</button>
                    </>
                )}
            </div>
            {count > 1 && (
                <div className="flex items-center justify-center gap-1 border-t border-neutral-200 py-2">
                    {images.map((src, index) => (
                        <button key={`${src}-${index}`} type="button" onClick={() => setSlide(index)}
                            aria-label={`Показать слайд ${index + 1}`} aria-pressed={slide === index}
                            className="flex h-9 min-w-9 items-center justify-center">
                            <span className={`h-2 rounded-full transition-all ${slide === index ? "w-6 bg-neutral-900" : "w-2 bg-neutral-300"}`} />
                        </button>
                    ))}
                    <span aria-live="polite" className="ml-2 text-xs text-neutral-500">{slide + 1} / {count}</span>
                </div>
            )}
        </div>
    )
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
    const dialog = useRef<HTMLDialogElement>(null)
    const [visible, setVisible] = useState(true)
    const closing = useRef(false)
    const reducedMotion = useReducedMotion()
    const close = () => {
        if (closing.current) return
        closing.current = true
        setVisible(false)
    }

    useEffect(() => {
        const element = dialog.current
        if (!element) return
        const previousFocus = document.activeElement as HTMLElement | null
        const previousOverflow = document.body.style.overflow
        const previousPadding = document.body.style.paddingRight
        const scrollbar = window.innerWidth - document.documentElement.clientWidth
        if (scrollbar > 0) {
            document.body.style.paddingRight = `${parseFloat(getComputedStyle(document.body).paddingRight) + scrollbar}px`
        }
        document.body.style.overflow = "hidden"
        element.showModal()
        return () => {
            element.close()
            document.body.style.overflow = previousOverflow
            document.body.style.paddingRight = previousPadding
            previousFocus?.focus({ preventScroll: true })
        }
    }, [])

    return createPortal(
        <dialog ref={dialog} aria-labelledby="project-modal-title"
            onCancel={(event) => { event.preventDefault(); close() }}
            className="fixed inset-0 m-0 h-[100dvh] max-h-none w-screen max-w-none overflow-hidden border-0 bg-transparent p-0 text-neutral-900 backdrop:bg-transparent">
            <AnimatePresence onExitComplete={onClose}>
                {visible && (
                    <motion.div key="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        transition={{ duration: reducedMotion ? 0 : 0.25 }}
                        className="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick={close} aria-hidden="true" />
                )}
                {visible && (
                    <motion.div key="sheet" initial={{ y: reducedMotion ? 0 : "100%" }} animate={{ y: 0 }}
                        exit={{ y: reducedMotion ? 0 : "100%", opacity: reducedMotion ? 0 : 1 }}
                        transition={
                            reducedMotion
                                ? { duration: 0 }
                                : {
                                    type: "tween",
                                    duration: 0.7,
                                    ease: [1, 1, 0.36, 1],
                                }
                        }
                        className="absolute inset-x-0 bottom-0 mx-auto flex max-h-[92dvh] w-full max-w-4xl flex-col overflow-hidden rounded-t-[2rem] bg-white shadow-2xl">
                        <motion.div drag="y" dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0, bottom: 0.5 }}
                            onDragEnd={(_, info) => { if (info.offset.y > 70 || info.velocity.y > 650) close() }}
                            style={{ touchAction: "none" }} className="flex shrink-0 cursor-grab justify-center pt-3 pb-2 active:cursor-grabbing">
                            <span aria-hidden="true" className="h-1.5 w-12 rounded-full bg-neutral-300" />
                        </motion.div>
                        <div className="flex shrink-0 items-center justify-between gap-4 px-5 pb-4 sm:px-8">
                            <p className="text-xs tracking-[0.2em] text-neutral-400 uppercase">Project / {project.year}</p>
                            <button type="button" autoFocus onClick={close} aria-label="Закрыть проект"
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-2xl transition hover:bg-neutral-200 focus-visible:outline-2 focus-visible:outline-offset-2">×</button>
                        </div>
                        <div className="min-h-0 overflow-y-auto overscroll-contain px-5 sm:px-8"
                            style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }}>
                            <Gallery project={project} />
                            <div className="pt-7 sm:pt-9">
                                <p className="mb-2 text-sm text-neutral-500">{project.subtitle}</p>
                                <h3 id="project-modal-title" className="text-3xl font-medium tracking-tight sm:text-5xl">{project.title}</h3>
                                <p className="mt-5 max-w-2xl whitespace-pre-line text-base leading-relaxed text-neutral-600 sm:text-lg">{project.description}</p>
                                <div className="mt-6 flex flex-wrap gap-2">
                                    {project.tags.map((tag) => <span key={tag} className="rounded-full border border-neutral-200 px-3 py-1.5 text-xs text-neutral-600">{tag}</span>)}
                                </div>
                                {project.href && project.href !== "#" && (
                                    <a href={project.href} target="_blank" rel="noopener noreferrer"
                                        className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-neutral-900 px-6 py-4 text-sm font-medium text-white transition hover:bg-neutral-700 sm:w-auto">Открыть сайт ↗</a>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </dialog>,
        document.body,
    )
}

function ProjectCard({ project, index, total, progress, onOpen }: {
    project: Project; index: number; total: number; progress: MotionValue<number>; onOpen: () => void
}) {
    const targetScale = 1 - (total - index - 1) * 0.05
    const scale = useTransform(progress, [index / total, 1], [1, targetScale])
    const reducedMotion = useReducedMotion()

    return (
        <div className="sticky top-0 flex h-[100svh] items-center justify-center px-4 sm:px-6">
            <motion.button type="button" onClick={onOpen} aria-haspopup="dialog"
                aria-label={`Подробнее о проекте ${project.title}`}
                style={{ scale: reducedMotion ? 1 : scale, top: `calc(-8vh + ${index * 26}px)` }}
                className="relative h-[70svh] w-full max-w-5xl origin-top cursor-pointer overflow-hidden rounded-3xl border border-neutral-200 bg-white text-left shadow-[0_30px_80px_-40px_rgba(0,0,0,0.35)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900">
                <div className="grid h-full grid-cols-1 grid-rows-[minmax(0,1fr)_minmax(0,1fr)] md:grid-cols-2 md:grid-rows-1">
                    <div className="flex min-h-0 flex-col justify-between p-5 sm:p-8 md:p-12">
                        <div className="flex items-center justify-between text-xs tracking-[0.2em] text-neutral-400 uppercase">
                            <span>{String(index + 1).padStart(2, "0")}</span><span>{project.year}</span>
                        </div>
                        <div className="py-3 md:py-8">
                            <p className="mb-2 text-xs text-neutral-500 md:text-sm">{project.subtitle}</p>
                            <h3 className="text-3xl leading-tight font-medium tracking-tight text-neutral-900 md:mb-5 md:text-5xl">{project.title}</h3>
                            <p className="hidden max-w-md text-base leading-relaxed text-neutral-600 md:block">{project.description}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            {project.tags.map((tag) => <span key={tag} className="rounded-full border border-neutral-200 px-2 py-1 text-[10px] text-neutral-500 md:px-3 md:text-xs">{tag}</span>)}
                            <span className="ml-auto text-xs text-neutral-900 md:text-sm">Подробнее ↗</span>
                        </div>
                    </div>
                    <div className="relative min-h-0 overflow-hidden bg-neutral-50">
                        <ProjectImage src={project.images?.[0]} title={project.title} />
                    </div>
                </div>
            </motion.button>
        </div>
    )
}

export default function Projects() {
    const container = useRef<HTMLDivElement>(null)
    const [selectedProject, setSelectedProject] = useState<Project | null>(null)
    const { scrollYProgress } = useScroll({ target: container, offset: ["start start", "end end"] })

    return (
        <section id="projects" className="w-full bg-white">
            <div className="mx-auto max-w-5xl px-6 pt-24 pb-12 md:pt-32 md:pb-16">
                <p className="mb-4 text-xs tracking-[0.25em] text-neutral-400 uppercase">Selected work</p>
                <h2 className="text-5xl font-medium tracking-tight text-neutral-900 md:text-6xl">Projects</h2>
                <div className="mt-10 h-px w-full bg-neutral-200" />
            </div>
            <div ref={container} className="relative">
                {PROJECTS.map((project, index) => (
                    <ProjectCard key={project.title} project={project} index={index} total={PROJECTS.length}
                        progress={scrollYProgress} onOpen={() => setSelectedProject(project)} />
                ))}
            </div>
            <div className="h-[20vh]" />
            {selectedProject && <ProjectModal key={selectedProject.title} project={selectedProject} onClose={() => setSelectedProject(null)} />}
        </section>
    )
}
