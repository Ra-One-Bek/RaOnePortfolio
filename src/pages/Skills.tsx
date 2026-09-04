type Skill = {
  name: string;
  short: string;
  accent: string;
};

type SkillGroup = {
  eyebrow: string;
  title: string;
  description: string;
  skills: Skill[];
};

const skillGroups: SkillGroup[] = [
  {
    eyebrow: "01 / DEVELOPMENT",
    title: "Building digital products",
    description:
      "From interactive interfaces to reliable APIs and production-ready infrastructure.",
    skills: [
      { name: "React", short: "RE", accent: "from-cyan-400 to-blue-500" },
      { name: "TypeScript", short: "TS", accent: "from-blue-500 to-indigo-600" },
      { name: "NestJS", short: "NE", accent: "from-rose-500 to-red-600" },
      { name: "PostgreSQL", short: "PG", accent: "from-sky-600 to-blue-800" },
      { name: "Supabase", short: "SU", accent: "from-emerald-400 to-green-600" },
      { name: "Three.js", short: "3D", accent: "from-zinc-500 to-zinc-900" },
    ],
  },
  {
    eyebrow: "02 / ENGINEERING",
    title: "Tools & infrastructure",
    description:
      "A practical workflow for shipping, versioning and scaling modern applications.",
    skills: [
      { name: "Git", short: "GT", accent: "from-orange-500 to-red-500" },
      { name: "GitHub", short: "GH", accent: "from-zinc-600 to-zinc-950" },
      { name: "Docker", short: "DO", accent: "from-sky-400 to-blue-600" },
      { name: "Python / ML", short: "PY", accent: "from-blue-500 to-amber-400" },
      { name: "Cloud", short: "CL", accent: "from-violet-500 to-fuchsia-500" },
    ],
  },
  {
    eyebrow: "03 / UI & 3D",
    title: "Designing the experience",
    description:
      "Clear interfaces, strong visual systems and expressive three-dimensional details.",
    skills: [
      { name: "Figma", short: "FI", accent: "from-fuchsia-500 to-orange-400" },
      { name: "Blender", short: "BL", accent: "from-orange-500 to-amber-500" },
      { name: "Photoshop", short: "PS", accent: "from-blue-600 to-cyan-400" },
    ],
  },
];

function SkillPill({ skill }: { skill: Skill }) {
  return (
    <li className="group flex items-center gap-3 rounded-full border border-black/10 bg-white/70 py-2 pl-2 pr-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-black/20 hover:bg-white hover:shadow-[0_14px_34px_rgba(15,23,42,0.10)]">
      <span
        aria-hidden="true"
        className={`grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br ${skill.accent} text-[10px] font-bold tracking-wider text-white shadow-sm transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105`}
      >
        {skill.short}
      </span>
      <span className="whitespace-nowrap text-sm font-medium text-zinc-800">
        {skill.name}
      </span>
    </li>
  );
}

export default function Skills() {
  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="relative isolate overflow-hidden px-5 py-24 text-zinc-950 sm:px-8 lg:px-12 lg:py-32"
    >
      <div
        aria-hidden="true"
        className="absolute -right-24 top-10 -z-10 size-80 rounded-full bg-blue-300/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -left-20 bottom-0 -z-10 size-72 rounded-full bg-orange-300/20 blur-3xl"
      />

      <div className="mx-auto max-w-7xl">
        <header className="grid gap-6 border-b border-black/15 pb-12 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
              My toolkit
            </p>
            <h2
              id="skills-heading"
              className="max-w-3xl text-4xl font-semibold tracking-[-0.045em] sm:text-6xl lg:text-7xl"
            >
              Skills that turn ideas
              <span className="block font-serif font-normal italic text-zinc-500">
                into real products.
              </span>
            </h2>
          </div>

          <p className="max-w-sm text-base leading-7 text-zinc-600 md:text-right">
            I combine development, design and 3D to build thoughtful digital
            experiences from concept to launch.
          </p>
        </header>

        <div className="divide-y divide-black/15">
          {skillGroups.map((group) => (
            <article
              key={group.eyebrow}
              className="grid gap-8 py-12 lg:grid-cols-[0.8fr_1fr_1.45fr] lg:gap-12 lg:py-16"
            >
              <p className="text-xs font-semibold tracking-[0.22em] text-zinc-400">
                {group.eyebrow}
              </p>

              <div>
                <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  {group.title}
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-6 text-zinc-500">
                  {group.description}
                </p>
              </div>

              <ul className="flex flex-wrap content-start gap-3" aria-label={group.title}>
                {group.skills.map((skill) => (
                  <SkillPill key={skill.name} skill={skill} />
                ))}
              </ul>
            </article>
          ))}
        </div>

        <footer className="flex items-center justify-between border-t border-black/15 pt-7 text-xs uppercase tracking-[0.22em] text-zinc-400">
          <span>Code · Design · Motion</span>
          <span className="hidden sm:block">Always learning</span>
        </footer>
      </div>
    </section>
  );
}
