import { Center, Environment, Html, OrbitControls, useGLTF } from "@react-three/drei"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion"
import { useInView } from "framer-motion"
import { Suspense, useEffect, useRef, useState } from "react"
import type { Group, PerspectiveCamera } from "three"
import { useNavigate } from "react-router-dom"

const MODEL_URL = "/models/lost_programmer.glb"
const EASE = [0.22, 1, 0.36, 1] as const

function useIsMobile(breakpoint = 768) {
    const [isMobile, setIsMobile] = useState(false)
    useEffect(() => {
        const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
        const update = () => setIsMobile(mq.matches)
        update()
        mq.addEventListener("change", update)
        return () => mq.removeEventListener("change", update)
    }, [breakpoint])
    return isMobile
}

function ResponsiveCamera() {
    const { camera, size } = useThree()
    useEffect(() => {
        const narrow = size.width < 768
        camera.position.set(0, 0.5, narrow ? 5.4 : 4)
        ;(camera as PerspectiveCamera).fov = narrow ? 45 : 40
        camera.updateProjectionMatrix()
    }, [camera, size.width])
    return null
}

function LostProgrammer({ spin }: { spin: boolean }) {
    const { scene } = useGLTF(MODEL_URL)
    const group = useRef<Group>(null)

    useFrame((_, delta) => {
        if (spin && group.current) group.current.rotation.y += delta * 0.4
    })

    return (
        <group ref={group}>
            <Center>
                <primitive object={scene} scale={0.7} />
            </Center>
        </group>
    )
}
useGLTF.preload(MODEL_URL)

function Loader() {
    return (
        <Html center>
            <span className="text-sm text-neutral-400">Loading…</span>
        </Html>
    )
}

/** Строка, выезжающая из-под маски. */
function Reveal({
    children,
    delay = 0,
    className = "",
}: {
    children: React.ReactNode
    delay?: number
    className?: string
}) {
    return (
        <span className="block overflow-hidden">
            <motion.span
                variants={{
                    hidden: { y: "110%" },
                    show: { y: "0%" },
                }}
                transition={{ duration: 0.85, ease: EASE, delay }}
                className={`block ${className}`}
            >
                {children}
            </motion.span>
        </span>
    )
}

/** Кнопка прайса с блоком, который следует за курсором. */
function PriceButton({ isMobile }: { isMobile: boolean }) {
    const [hover, setHover] = useState(false)
    const navigate = useNavigate()

    const mx = useMotionValue(0)
    const my = useMotionValue(0)
    const x = useSpring(mx, { stiffness: 400, damping: 32, mass: 0.4 })
    const y = useSpring(my, { stiffness: 400, damping: 32, mass: 0.4 })

    const onMove = (e: React.MouseEvent) => {
        mx.set(e.clientX)
        my.set(e.clientY)
    }

    const go = () => navigate("/pricing")

    return (
        <>
            <motion.button
                onClick={go}
                onMouseEnter={(e) => {
                    if (isMobile) return
                    mx.jump(e.clientX)
                    my.jump(e.clientY)
                    setHover(true)
                }}
                onMouseMove={isMobile ? undefined : onMove}
                onMouseLeave={() => setHover(false)}
                variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.75 }}
                whileTap={{ scale: 0.97 }}
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-neutral-900 px-6 py-3 md:px-7 md:py-3.5"
            >
                {/* заливка, наезжающая снизу */}
                <span className="absolute inset-0 translate-y-full rounded-full bg-neutral-900 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />

                <span className="relative z-10 text-sm font-medium tracking-tight text-neutral-900 transition-colors duration-500 group-hover:text-white md:text-base">
                    Price list
                </span>

                <span className="relative z-10 flex h-5 w-5 items-center justify-center overflow-hidden">
                    <span className="text-neutral-900 transition-all duration-500 group-hover:translate-x-4 group-hover:opacity-0">
                        →
                    </span>
                    <span className="absolute -translate-x-4 text-white opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
                        →
                    </span>
                </span>
            </motion.button>

            {/* блок у курсора */}
            <AnimatePresence>
                {hover && !isMobile && (
                    <motion.div
                        style={{ x, y }}
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.7 }}
                        transition={{ duration: 0.25, ease: EASE }}
                        className="pointer-events-none fixed top-0 left-0 z-[70]"
                    >
                        <div className="-translate-x-1/2 -translate-y-[150%]">
                            <div className="relative rounded-2xl bg-neutral-900 px-4 py-2.5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)]">
                                <span className="text-xs whitespace-nowrap text-white md:text-sm">
                                    Посмотреть цены
                                </span>
                                <span className="absolute -bottom-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 rounded-[2px] bg-neutral-900" />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default function Hero() {
    const isMobile = useIsMobile()
    const section = useRef<HTMLElement>(null)
    const inView = useInView(section, { margin: "-20%" })

    return (
        <section
            id="home"
            ref={section}
            className="relative flex w-full flex-col overflow-hidden md:min-h-svh md:flex-row"
        >
            {/* text */}
            <motion.div
                initial="hidden"
                animate={inView ? "show" : "hidden"}
                className="order-1 flex items-center justify-center px-6 pt-24 pb-8 md:order-2 md:h-svh md:w-2/5 md:justify-end md:px-10 md:pt-0 md:pb-0"
            >
                <div className="flex w-full max-w-md flex-col items-center md:max-w-none md:items-end">
                    <Reveal delay={0.05} className="text-xl sm:text-2xl">
                        hello,
                    </Reveal>

                    <div className="md:text-end">
                        <Reveal
                            delay={0.15}
                            className="text-center text-3xl leading-tight sm:text-4xl md:text-end md:text-5xl"
                        >
                            I build websites and 
                        </Reveal>
                        <Reveal
                            delay={0.24}
                            className="text-center text-3xl leading-tight sm:text-4xl md:text-end md:text-5xl"
                        >
                            full-stack applications.
                        </Reveal>
                    </div>

                    <div className="mt-10 md:mt-14">
                        <Reveal
                            delay={0.4}
                            className="text-center text-6xl leading-none font-black sm:text-7xl md:text-end md:text-8xl"
                        >
                            Abiyev
                        </Reveal>
                        <Reveal
                            delay={0.52}
                            className="text-center text-2xl sm:text-3xl md:text-end md:text-4xl"
                        >
                            RaOne
                        </Reveal>
                    </div>

                    {/* линия-разделитель */}
                    <motion.span
                        variants={{
                            hidden: { scaleX: 0 },
                            show: { scaleX: 1 },
                        }}
                        transition={{ duration: 0.9, ease: EASE, delay: 0.62 }}
                        className="mt-8 block h-px w-full origin-center bg-neutral-300 md:mt-10 md:origin-right"
                    />

                    <div className="mt-8 md:mt-10">
                        <PriceButton isMobile={isMobile} />
                    </div>
                </div>
            </motion.div>

            {/* 3d */}
            <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.94 }}
                transition={{ duration: 1.1, ease: EASE }}
                className={`order-2 h-[55svh] min-h-[320px] w-full md:order-1 md:h-svh md:w-3/5 md:min-h-0 ${
                    isMobile ? "pointer-events-none touch-pan-y" : ""
                }`}
            >
                <Canvas
                    camera={{ position: [0, 0.5, 4], fov: 40 }}
                    dpr={[1, isMobile ? 1.5 : 2]}
                    gl={{ antialias: true }}
                    style={{ touchAction: "pan-y" }}
                >
                    <ResponsiveCamera />

                    <ambientLight intensity={0.6} />
                    <directionalLight position={[3, 5, 2]} intensity={1} />

                    <Suspense fallback={<Loader />}>
                        <LostProgrammer spin={isMobile} />
                        <Environment preset="city" />
                    </Suspense>

                    {!isMobile && (
                        <OrbitControls
                            makeDefault
                            autoRotate
                            autoRotateSpeed={1.2}
                            enableZoom={false}
                            enablePan={false}
                            minPolarAngle={Math.PI / 3}
                            maxPolarAngle={Math.PI / 1.8}
                        />
                    )}
                </Canvas>
            </motion.div>

            {/* скролл-индикатор */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: inView ? 1 : 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
            >
                <span className="text-[10px] tracking-[0.25em] text-neutral-400 uppercase">
                    scroll
                </span>
                <motion.span
                    animate={{ y: [0, 8, 0], opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    className="h-8 w-px bg-neutral-400"
                />
            </motion.div>
        </section>
    )
}