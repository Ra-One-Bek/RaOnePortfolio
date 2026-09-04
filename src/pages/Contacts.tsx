import { Suspense, useRef, useEffect, useLayoutEffect, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Environment, Html, useGLTF } from "@react-three/drei"
import { motion, useInView } from "framer-motion"
import { Box3, Vector3, Sphere } from "three"
import type { Group, PerspectiveCamera } from "three"

const MODEL_URL = "/models/RaOne_room.glb"

/** Ставит модель вертикально. 0 если GLB Y-up, -Math.PI/2 если Z-up (Blender). */
const UP_FIX = Math.PI / 10
/** Разворот по горизонтали — только это число крути для смены ракурса. */
const YAW = Math.PI / 0.75
/** Насколько камера приподнята над горизонтом, в градусах. 0 = строго анфас. */
const ELEVATION = 1
/** Запас вокруг модели: меньше — крупнее, больше — дальше. */
const MARGIN = 1.35

const MAX_TILT = 0.12
const SMOOTH = 0.01

type Contact = {
    label: string
    value: string
    href: string
}

const EMAIL = "helloaktau@gmail.com"

const CONTACTS: Contact[] = [
    { label: "Email", value: EMAIL, href: `mailto:${EMAIL}` },
    { label: "Telegram", value: "@gucc1_prado", href: "https://t.me/gucc1_prado" },
    { label: "GitHub", value: "github.com/raone", href: "https://github.com/raone" },
    { label: "LinkedIn", value: "in/abiyev", href: "https://linkedin.com/in/abiyev" },
    { label: "Phone", value: "+7 778 963 34 05", href: "tel:+77789633405" },
    { label: "Location", value: "Astana, Kazakhstan", href: "#" },
]

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

function Room({ tilt }: { tilt: boolean }) {
    const { scene } = useGLTF(MODEL_URL)
    const { camera, size } = useThree()

    const tiltGroup = useRef<Group>(null)
    const model = useRef<Group>(null)
    const radius = useRef(1)
    const pointer = useRef({ x: 0, y: 0 })

    // 1. Центрируем модель в начале координат
    useLayoutEffect(() => {
        const g = model.current
        if (!g) return
        g.position.set(0, 0, 0)
        g.updateWorldMatrix(true, true)
        const box = new Box3().setFromObject(g)
        const center = box.getCenter(new Vector3())
        g.position.sub(center)
        radius.current = box.getBoundingSphere(new Sphere()).radius
    }, [scene])

    // 2. Ставим камеру: угол фиксированный, меняется только дистанция
    useLayoutEffect(() => {
        const cam = camera as PerspectiveCamera
        const r = radius.current
        if (!r) return
        const fov = (cam.fov * Math.PI) / 180
        const fitHeight = r / Math.sin(fov / 2)
        const fitWidth = fitHeight / cam.aspect
        const dist = MARGIN * Math.max(fitHeight, fitWidth)

        const phi = (ELEVATION * Math.PI) / 180
        cam.position.set(0, Math.sin(phi) * dist, Math.cos(phi) * dist)
        cam.lookAt(0, 0, 0)
        cam.updateProjectionMatrix()
    }, [camera, size.width, size.height, scene])

    // 3. Мягкая реакция на курсор
    useEffect(() => {
        if (!tilt) return
        const onMove = (e: MouseEvent) => {
            pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
            pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
        }
        window.addEventListener("mousemove", onMove)
        return () => window.removeEventListener("mousemove", onMove)
    }, [tilt])

    useFrame((_, delta) => {
        const g = tiltGroup.current
        if (!g) return
        const tx = tilt ? pointer.current.x * MAX_TILT : 0
        const ty = tilt ? pointer.current.y * MAX_TILT * 0.5 : 0
        const k = 1 - Math.pow(SMOOTH, delta)
        g.rotation.y += (tx - g.rotation.y) * k
        g.rotation.x += (ty - g.rotation.x) * k
    })

    return (
        <group ref={tiltGroup}>
            <group ref={model} rotation={[UP_FIX, YAW, 0]}>
                <primitive object={scene} />
            </group>
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

export default function Contacts() {
    const panel = useRef<HTMLDivElement>(null)
    const inView = useInView(panel, { once: true, margin: "-15%" })
    const isMobile = useIsMobile()

    return (
        <section id="contacts" className="relative w-full overflow-hidden bg-white">
            <div className="flex w-full flex-col md:min-h-svh md:flex-row">
                {/* left — 3d room */}
                <div className="pointer-events-none relative h-[45svh] min-h-[280px] w-full md:h-svh md:w-1/2 md:min-h-0">
                    <Canvas
                        camera={{ position: [0, 0, 9], fov: 35 }}
                        dpr={[1, isMobile ? 1.5 : 2]}
                        gl={{ antialias: true }}
                        style={{ touchAction: "pan-y" }}
                    >
                        <ambientLight intensity={0.7} />
                        <directionalLight position={[4, 6, 3]} intensity={1.1} />

                        <Suspense fallback={<Loader />}>
                            <Room tilt={!isMobile} />
                            <Environment preset="apartment" />
                        </Suspense>
                    </Canvas>

                    <div className="absolute bottom-6 left-6 text-[10px] tracking-[0.25em] text-neutral-400 uppercase md:bottom-8 md:left-8 md:text-xs">
                        RaOne / room
                    </div>
                </div>

                {/* right — sliding panel */}
                <div
                    ref={panel}
                    className="flex w-full items-center justify-center overflow-hidden px-4 pt-4 pb-16 sm:px-6 md:h-svh md:w-1/2 md:justify-end md:px-10 md:py-20"
                >
                    <motion.div
                        initial={{ x: isMobile ? 0 : "60%", y: isMobile ? 40 : 0, opacity: 0 }}
                        animate={inView ? { x: 0, y: 0, opacity: 1 } : {}}
                        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full max-w-xl rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0_30px_80px_-45px_rgba(0,0,0,0.4)] sm:p-8 md:p-12"
                    >
                        <p className="mb-3 text-[10px] tracking-[0.25em] text-neutral-400 uppercase sm:text-xs md:mb-4">
                            Get in touch
                        </p>
                        <h2 className="mb-3 text-3xl font-medium tracking-tight text-neutral-900 sm:text-4xl md:text-5xl">
                            Contacts
                        </h2>
                        <p className="mb-8 max-w-sm text-sm leading-relaxed text-neutral-500 md:mb-10">
                            Открыт для проектов, коллабораций и просто хороших разговоров о коде.
                        </p>

                        <div className="divide-y divide-neutral-200 border-t border-neutral-200">
                            {CONTACTS.map((item, i) => (
                                <motion.a
                                    key={item.label}
                                    href={item.href}
                                    target={item.href.startsWith("http") ? "_blank" : undefined}
                                    rel="noreferrer"
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={inView ? { opacity: 1, y: 0 } : {}}
                                    transition={{
                                        duration: 0.5,
                                        delay: 0.35 + i * 0.07,
                                        ease: "easeOut",
                                    }}
                                    className="group flex flex-col gap-1 py-3 transition-colors hover:bg-neutral-50 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:py-4"
                                >
                                    <span className="text-[10px] tracking-[0.18em] text-neutral-400 uppercase sm:text-xs">
                                        {item.label}
                                    </span>
                                    <span className="flex items-center gap-3 text-sm break-all text-neutral-900 sm:text-base sm:break-normal md:text-lg">
                                        {item.value}
                                        <span className="shrink-0 text-neutral-300 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-neutral-900">
                                            →
                                        </span>
                                    </span>
                                </motion.a>
                            ))}
                        </div>

                        <div className="mt-8 flex flex-col items-start gap-4 border-t border-neutral-200 pt-6 sm:flex-row sm:items-center sm:justify-between md:mt-10">
                            <span className="text-xs text-neutral-400">
                                © {new Date().getFullYear()} Abiyev RaOne
                            </span>

                            
                            <a href={`mailto:${EMAIL}`}
                                className="rounded-full bg-neutral-900 px-5 py-2 text-sm text-white transition hover:bg-neutral-700"
                            >
                                Write me
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}