import { useRef } from "react"
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion"

type Project = {
    title: string
    subtitle: string
    description: string
    tags: string[]
    year: string
    href?: string
    image?: string
}

const PROJECTS: Project[] = [
    {
        title: "Wedding Invites",
        subtitle: "Interactive invitation platform",
        description:
            "3D-сцены, музыка, RSVP на serverless-функциях и админка с выгрузкой в Excel. Каждое приглашение — отдельный продукт под клиента.",
        tags: ["React", "Three.js", "Vercel", "Postgres"],
        year: "2026",
        href: "#",
    },
    {
        title: "Portfolio Engine",
        subtitle: "Personal site & case studies",
        description:
            "Минималистичный движок для портфолио: MDX-кейсы, тёмная/светлая тема, анимации на скролле и полностью статическая сборка.",
        tags: ["Next.js", "MDX", "Framer Motion"],
        year: "2025",
        href: "#",
    },
    {
        title: "Dashboard Kit",
        subtitle: "Analytics interface",
        description:
            "Набор компонентов для админ-панелей: таблицы с фильтрами, графики, экспорт, роли и аутентификация на HMAC-куках.",
        tags: ["TypeScript", "Prisma", "Tailwind"],
        year: "2025",
        href: "#",
    },
    {
        title: "Shop Front",
        subtitle: "Headless e-commerce",
        description:
            "Витрина с корзиной, оплатой и мгновенным поиском. Оптимизация изображений через sharp, LCP меньше секунды.",
        tags: ["React", "Stripe", "Edge Functions"],
        year: "2024",
        href: "#",
    },
]

function ProjectCard({
    project,
    index,
    total,
    progress,
}: {
    project: Project
    index: number
    total: number
    progress: MotionValue<number>
}) {
    // Нижние карточки ужимаются сильнее верхних
    const targetScale = 1 - (total - index - 1) * 0.05
    const scale = useTransform(progress, [index / total, 1], [1, targetScale])

    return (
        <div id="projects" className="sticky top-0 flex h-screen items-center justify-center px-6">
            <motion.article
                style={{ scale, top: `calc(-8vh + ${index * 26}px)` }}
                className="relative h-[68vh] w-full max-w-5xl origin-top overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-[0_30px_80px_-40px_rgba(0,0,0,0.35)] will-change-transform"
            >
                <div className="grid h-full grid-cols-1 md:grid-cols-2">
                    {/* text */}
                    <div className="flex h-full flex-col justify-between p-8 md:p-12">
                        <div className="flex items-center justify-between text-xs tracking-[0.2em] text-neutral-400 uppercase">
                            <span>{String(index + 1).padStart(2, "0")}</span>
                            <span>{project.year}</span>
                        </div>

                        <div className="py-8">
                            <p className="mb-3 text-sm text-neutral-500">{project.subtitle}</p>
                            <h3 className="mb-5 text-4xl leading-tight font-medium tracking-tight text-neutral-900 md:text-5xl">
                                {project.title}
                            </h3>
                            <p className="max-w-md text-base leading-relaxed text-neutral-600">
                                {project.description}
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            {project.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-500"
                                >
                                    {tag}
                                </span>
                            ))}
                            {project.href && (
                                
                                <a href={project.href}
                                    className="ml-auto text-sm text-neutral-900 underline-offset-4 transition hover:underline"
                                >
                                    View →
                                </a>
                            )}
                        </div>
                    </div>

                    {/* visual */}
                    <div className="relative hidden h-full overflow-hidden bg-neutral-50 md:block">
                        {project.image ? (
                            <img
                                src={project.image}
                                alt={project.title}
                                className="h-full w-full object-cover"
                                loading="lazy"
                            />
                        ) : (
                            <div className="h-full w-full bg-[radial-gradient(circle_at_30%_20%,#ffffff_0%,#f2f2f2_45%,#e4e4e4_100%)]" />
                        )}
                    </div>
                </div>
            </motion.article>
        </div>
    )
}

export default function Projects() {
    const container = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ["start start", "end end"],
    })

    return (
        <section className="w-full bg-white">
            {/* heading */}
            <div className="mx-auto max-w-5xl px-6 pt-32 pb-16">
                <p className="mb-4 text-xs tracking-[0.25em] text-neutral-400 uppercase">
                    Selected work
                </p>
                <h2 className="text-5xl font-medium tracking-tight text-neutral-900 md:text-6xl">
                    Projects
                </h2>
                <div className="mt-10 h-px w-full bg-neutral-200" />
            </div>

            {/* stacking cards */}
            <div ref={container} className="relative">
                {PROJECTS.map((project, i) => (
                    <ProjectCard
                        key={project.title}
                        project={project}
                        index={i}
                        total={PROJECTS.length}
                        progress={scrollYProgress}
                    />
                ))}
            </div>

            <div className="h-[20vh]" />
        </section>
    )
}