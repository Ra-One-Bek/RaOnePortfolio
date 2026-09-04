import { Center, Environment, Html, OrbitControls, useGLTF } from "@react-three/drei"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Suspense, useEffect, useRef, useState } from "react"
import type { Group, PerspectiveCamera } from "three"

const MODEL_URL = "/models/lost_programmer.glb"

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

export default function Hero() {
    const isMobile = useIsMobile()

    return (
        <section id="home" className="relative flex w-full flex-col overflow-hidden md:min-h-svh md:flex-row">
            {/* text — сверху на мобилке, справа на десктопе */}
            <div className="order-1 flex items-center justify-center px-6 pt-24 pb-8 md:order-2 md:h-svh md:w-2/5 md:justify-end md:px-10 md:pt-0 md:pb-0">
                <div className="w-full max-w-md md:max-w-none">
                    <p className="text-center text-xl sm:text-2xl md:text-end">hello,</p>
                    <h1 className="text-center text-3xl leading-tight sm:text-4xl md:text-end md:text-5xl">
                        I'm creactive full-stack developer.
                    </h1>

                    <div className="mt-10 md:mt-14">
                        <h1 className="text-center text-6xl leading-none font-black sm:text-7xl md:text-end md:text-8xl">
                            Abiyev
                        </h1>
                        <h1 className="text-center text-2xl sm:text-3xl md:text-end md:text-4xl">
                            RaOne
                        </h1>
                    </div>
                </div>
            </div>

            {/* 3d — снизу на мобилке, слева на десктопе */}
            <div
                className={`order-2 h-[55svh] min-h-[320px] w-full md:order-1 md:h-svh md:w-3/5 md:min-h-0 ${
                    isMobile ? "pointer-events-none touch-pan-y" : ""
                }`}
            >
                <Canvas
                    camera={{ position: [0, 0.5, 4], fov: 40 }}
                    dpr={[1, isMobile ? 1.5 : 2]}
                    gl={{ antialias: true }}
                    style={{ touchAction: "pan-y" }}
                    // на мобилке R3F не вешает свои pointer-листенеры
                    events={isMobile ? undefined : undefined}
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
            </div>
        </section>
    )
}