import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Link } from "react-router-dom"

const EASE = [0.22, 1, 0.36, 1] as const

type Item = {
    name: string
    note?: string
    price: string
    tag?: string
}

type Group = {
    meta: string
    title: string
    caption: string
    items: Item[]
}

const GROUPS: Group[] = [
    {
        meta: "01",
        title: "Сайты и лендинги",
        caption: "Одностраничники, свадебные приглашения, портфолио, визитки",
        items: [
            {
                name: "По шаблону",
                note: "Готовая структура, ваш контент и цвета",
                price: "8 500",
            },
            {
                name: "Индивидуальный дизайн",
                note: "Полный дизайн от разработчика под вашу задачу",
                price: "12 000",
                tag: "Популярное",
            },
            {
                name: "С 3D-сценой",
                note: "3D-модели и сцены под ваши критерии — например, зал вашего ресторана",
                price: "20 000",
            },
        ],
    },
    {
        meta: "02",
        title: "Fullstack проекты",
        caption: "Фронтенд, бэкенд, база данных, админ-панель, деплой",
        items: [
            {
                name: "Базовый",
                note: "Цена зависит от сложности и объёма функционала",
                price: "от 80 000",
            },
            {
                name: "С акцентом на дизайн",
                note: "Авторский дизайн, анимации, оптимизация производительности",
                price: "от 120 000",
            },
            {
                name: "С 3D-моделями и сценами",
                note: "Интерактивные 3D-сцены под критерии заказчика",
                price: "от 140 000",
            },
            {
                name: "CRM, B2B, B2C",
                note: "Роли и доступы, аналитика, выгрузки, интеграции",
                price: "от 200 000",
            },
        ],
    },
    {
        meta: "03",
        title: "Мобильные приложения",
        caption: "iOS и Android",
        items: [
            {
                name: "Приложение",
                note: "Стоимость по уровню сложности и количеству экранов",
                price: "от 120 000",
            },
        ],
    },
    {
        meta: "04",
        title: "Отдельные услуги",
        caption: "Можно заказать без разработки сайта",
        items: [
            {
                name: "UI/UX дизайн",
                note: "Прототип, макеты, дизайн-система",
                price: "от 20 000",
            },
            {
                name: "3D-модели",
                note: "Формат GLB и другие, готовые к вебу",
                price: "от 10 000",
            },
            {
                name: "Доработка проекта",
                note: "Редизайн, анимации, правки существующего сайта",
                price: "договорная",
            },
        ],
    },
]

const BONUS = [
    { name: "Подружиться", price: "100" },
    { name: "Стать партнёром", price: "100" },
]

function Row({ item, delay }: { item: Item; delay: number }) {
    const ref = useRef<HTMLDivElement>(null)
    const inView = useInView(ref, { once: true, margin: "-10%" })

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, ease: "easeOut", delay }}
            className="group flex flex-col gap-2 border-b border-neutral-200 py-5 transition-colors hover:bg-neutral-50 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8 md:py-6"
        >
            <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                    <h4 className="text-lg font-medium tracking-tight text-neutral-900 md:text-xl">
                        {item.name}
                    </h4>
                    {item.tag && (
                        <span className="rounded-full bg-neutral-900 px-2.5 py-0.5 text-[10px] tracking-[0.15em] text-white uppercase">
                            {item.tag}
                        </span>
                    )}
                </div>
                {item.note && (
                    <p className="mt-1.5 max-w-md text-sm leading-relaxed text-neutral-500">
                        {item.note}
                    </p>
                )}
            </div>

            <div className="flex shrink-0 items-baseline gap-1.5 sm:justify-end">
                <span className="text-xl font-medium tracking-tight text-neutral-900 md:text-2xl">
                    {item.price}
                </span>
                {item.price !== "договорная" && <span className="text-sm text-neutral-400">₸</span>}
            </div>
        </motion.div>
    )
}

export default function Pricing() {
    return (
        <div className="min-h-svh w-full bg-white">
            <div className="mx-auto max-w-4xl px-5 pt-28 pb-24 sm:px-6 md:pt-36 md:pb-32">
                {/* back */}
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                >
                    <Link
                        to="/"
                        className="group inline-flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
                    >
                        <span className="transition-transform duration-300 group-hover:-translate-x-1">
                            ←
                        </span>
                        На главную
                    </Link>
                </motion.div>

                {/* heading */}
                <div className="mt-10 md:mt-14">
                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
                        className="mb-4 text-[10px] tracking-[0.25em] text-neutral-400 uppercase sm:text-xs"
                    >
                        Price list
                    </motion.p>

                    <span className="block overflow-hidden">
                        <motion.h1
                            initial={{ y: "110%" }}
                            animate={{ y: "0%" }}
                            transition={{ duration: 0.85, ease: EASE, delay: 0.1 }}
                            className="text-4xl font-medium tracking-tight text-neutral-900 sm:text-5xl md:text-6xl"
                        >
                            Услуги и цены
                        </motion.h1>
                    </span>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: EASE, delay: 0.25 }}
                        className="mt-5 max-w-lg text-sm leading-relaxed text-neutral-500 md:text-base"
                    >
                        Цены указаны в тенге за проект. Итоговая стоимость зависит от объёма
                        работы — напишите, и я посчитаю точно под вашу задачу.
                    </motion.p>
                </div>

                {/* groups */}
                <div className="mt-16 space-y-16 md:mt-20 md:space-y-20">
                    {GROUPS.map((group) => (
                        <div key={group.meta}>
                            <div className="mb-2 flex items-baseline gap-4 border-t border-neutral-900 pt-5">
                                <span className="text-[10px] tracking-[0.2em] text-neutral-400 sm:text-xs">
                                    {group.meta}
                                </span>
                                <div>
                                    <h2 className="text-2xl font-medium tracking-tight text-neutral-900 md:text-3xl">
                                        {group.title}
                                    </h2>
                                    <p className="mt-1 text-sm text-neutral-500">{group.caption}</p>
                                </div>
                            </div>

                            <div>
                                {group.items.map((item, i) => (
                                    <Row key={item.name} item={item} delay={i * 0.06} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* bonus */}
                <div className="mt-20 rounded-3xl border border-neutral-200 p-6 sm:p-8">
                    <p className="mb-5 text-[10px] tracking-[0.2em] text-neutral-400 uppercase sm:text-xs">
                        Специальное предложение
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row sm:gap-10">
                        {BONUS.map((b) => (
                            <div key={b.name} className="flex items-baseline justify-between gap-4">
                                <span className="text-base text-neutral-900">{b.name}</span>
                                <span className="text-base text-neutral-900">
                                    {b.price} <span className="text-neutral-400">₸</span>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* cta */}
                <div className="mt-16 flex flex-col items-start gap-6 border-t border-neutral-200 pt-10 sm:flex-row sm:items-center sm:justify-between">
                    <p className="max-w-sm text-sm leading-relaxed text-neutral-500">
                        Не нашли свой вариант? Напишите — обсудим задачу и подберём формат.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        
                        <a href="https://t.me/gucc1_prado"
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-full bg-neutral-900 px-6 py-2.5 text-sm text-white transition hover:bg-neutral-700"
                        >
                            Написать в Telegram
                        </a>
                        
                        <a href="mailto:helloaktau@gmail.com"
                            className="rounded-full border border-neutral-300 px-6 py-2.5 text-sm text-neutral-900 transition hover:border-neutral-900"
                        >
                            Email
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}