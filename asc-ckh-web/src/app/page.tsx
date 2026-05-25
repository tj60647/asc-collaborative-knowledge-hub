import Link from "next/link"
import { ArrowRight, BookOpen, Calendar, HelpCircle, History, Info, Layers, Network, ShieldCheck, UserPlus, Users } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-white text-zinc-900 font-sans antialiased">
      
      {/* Top Banner: Global Announcement */}
      <div className="w-full bg-zinc-50 border-b border-zinc-150 py-2.5 px-6 text-center text-xs tracking-wide text-zinc-600 font-medium">
        ASC 2026 Conference: <span className="font-semibold text-zinc-900">Conversational Confluences</span> &middot; August 3–7, 2026 &middot; Ouro Preto, Brazil
      </div>

      {/* Main Navigation */}
      <div className="w-full border-b border-zinc-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <header className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-bold tracking-widest text-zinc-950 uppercase border border-zinc-950 px-2 py-0.5">
              ASC
            </span>
            <span className="text-xs font-semibold tracking-wide text-zinc-900 hidden md:inline">
              American Society for Cybernetics
            </span>
          </div>
          <nav className="flex items-center space-x-6">
            <a href="#about" className="text-xs tracking-wide text-zinc-500 hover:text-zinc-950 transition-colors">
              About
            </a>
            <a href="#initiatives" className="text-xs tracking-wide text-zinc-500 hover:text-zinc-950 transition-colors">
              Initiatives
            </a>
            <a href="#scholarship" className="text-xs tracking-wide text-zinc-500 hover:text-zinc-950 transition-colors">
              Scholarship
            </a>
            <Link href="/calendar" className="text-xs tracking-wide text-zinc-500 hover:text-zinc-950 transition-colors">
              Calendar
            </Link>
            <Link href="/profile" className="text-xs tracking-wide text-zinc-500 hover:text-zinc-950 transition-colors">
              Member Portal
            </Link>
            <Link
              href="/join"
              className="text-xs font-semibold tracking-wide bg-zinc-950 text-white hover:bg-zinc-800 px-4 py-2 transition-colors"
            >
              Join the ASC
            </Link>
          </nav>
        </header>
      </div>

      {/* Hero Section */}
      <section className="w-full max-w-6xl mx-auto px-6 py-24 sm:py-32 flex flex-col justify-center border-b border-zinc-100">
        <div className="max-w-4xl">
          <span className="text-xs font-bold tracking-widest text-zinc-400 uppercase mb-4 block">
            ESTABLISHED 1964
          </span>
          <h1 className="text-4xl sm:text-6xl font-light tracking-tight text-zinc-950 mb-8 leading-[1.15]">
            The Science of Feedback, Systems, and Collective Inquiry.
          </h1>
          <p className="text-lg sm:text-xl text-zinc-600 font-light max-w-3xl leading-relaxed mb-10">
            Welcome to the American Society for Cybernetics. We host an interdisciplinary community of researchers, practitioners, and creators dedicated to cybernetic principles, second-order reflexivity, and systemic understanding.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/join"
              className="inline-flex h-11 items-center justify-center gap-2 bg-zinc-950 px-6 font-medium text-xs text-white hover:bg-zinc-800 transition-colors shadow-sm"
            >
              Become a Member
              <ArrowRight className="size-3.5" />
            </Link>
            <a
              href="#about"
              className="inline-flex h-11 items-center justify-center gap-2 border border-zinc-200 bg-white hover:bg-zinc-50 px-6 font-medium text-xs text-zinc-800 transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="w-full max-w-6xl mx-auto px-6 py-20 border-b border-zinc-100">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div>
            <h2 className="text-xs font-bold tracking-widest text-zinc-400 uppercase mb-4">
              HISTORICAL CORE
            </h2>
            <p className="text-2xl font-light tracking-tight text-zinc-950 leading-snug">
              An interdisciplinary legacy spanning cognitive sciences, arts, design, and mathematics.
            </p>
          </div>
          <div className="lg:col-span-2 space-y-6 text-zinc-600 font-light leading-relaxed">
            <p>
              Founded in Washington, D.C., in 1964, the American Society for Cybernetics (ASC) was established to foster research into the principles governing complex, self-regulating systems. Cybernetics focuses on how systems observe, process information, self-correct, and interact through feedback loops.
            </p>
            <p>
              Our historical path has been deeply shaped by pioneering thinkers including Gregory Bateson, Margaret Mead, Heinz von Foerster, Warren McCulloch, Stafford Beer, and Ernst von Glasersfeld. The ASC is uniquely dedicated to <span className="font-medium text-zinc-900">second-order cybernetics</span>—the study of observing systems, circularity, self-governance, and the reflexivity of the observer.
            </p>
          </div>
        </div>
      </section>

      {/* Initiatives Grid */}
      <section id="initiatives" className="w-full max-w-6xl mx-auto px-6 py-20 border-b border-zinc-100">
        <div className="mb-12">
          <h2 className="text-xs font-bold tracking-widest text-zinc-400 uppercase mb-4">
            SOCIETY ACTIVITIES
          </h2>
          <p className="text-3xl font-light tracking-tight text-zinc-950">
            Active Research Circles & Initiatives
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Initiative 1 */}
          <div className="border border-zinc-150 p-6 flex flex-col justify-between hover:bg-zinc-50/50 transition-colors">
            <div>
              <div className="text-zinc-500 mb-4">
                <Calendar className="size-5 stroke-[1.5]" />
              </div>
              <h3 className="text-sm font-semibold text-zinc-950 mb-2">Speaker Series</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Our virtual dialogues held on the third Sunday of each month, exploring themes like "Emergent Territories" through metalogues and panels.
              </p>
            </div>
          </div>

          {/* Initiative 2 */}
          <div className="border border-zinc-150 p-6 flex flex-col justify-between hover:bg-zinc-50/50 transition-colors">
            <div>
              <div className="text-zinc-500 mb-4">
                <Users className="size-5 stroke-[1.5]" />
              </div>
              <h3 className="text-sm font-semibold text-zinc-950 mb-2">#NewMacyMeetings</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                A trans-generational, trans-disciplinary revival of the original Macy Meetings of the 1940-50s, focused on systemic global crises.
              </p>
            </div>
          </div>

          {/* Initiative 3 */}
          <div className="border border-zinc-150 p-6 flex flex-col justify-between hover:bg-zinc-50/50 transition-colors">
            <div>
              <div className="text-zinc-500 mb-4">
                <History className="size-5 stroke-[1.5]" />
              </div>
              <h3 className="text-sm font-semibold text-zinc-950 mb-2">Archives Working Group</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Volunteer-led initiatives aimed at organizing, preserving, and digitizing primary cybernetic historical materials for researchers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Scholarship Section */}
      <section id="scholarship" className="w-full max-w-6xl mx-auto px-6 py-20 border-b border-zinc-100">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div>
            <h2 className="text-xs font-bold tracking-widest text-zinc-400 uppercase mb-4">
              THEORETICAL FOUNDATION
            </h2>
            <p className="text-2xl font-light tracking-tight text-zinc-950 mb-6 leading-snug">
              Scholarly Perspectives & Cybernetic Definitions
            </p>
            <p className="text-xs text-zinc-500 font-light leading-relaxed">
              Cybernetics has been defined in multiple ways, emphasizing organization, information boundaries, and the circular dynamics of feedback.
            </p>
          </div>
          
          <div className="lg:col-span-2 space-y-8">
            {/* Quote 1 */}
            <div className="border-l-2 border-zinc-200 pl-6 py-1">
              <blockquote className="text-sm italic text-zinc-700 font-light mb-2">
                &ldquo;Control and communication theory, whether in the machine or in the animal.&rdquo;
              </blockquote>
              <cite className="text-xs font-semibold text-zinc-500 not-italic">&mdash; Norbert Wiener</cite>
            </div>

            {/* Quote 2 */}
            <div className="border-l-2 border-zinc-200 pl-6 py-1">
              <blockquote className="text-sm italic text-zinc-700 font-light mb-2">
                &ldquo;The science of effective organization.&rdquo;
              </blockquote>
              <cite className="text-xs font-semibold text-zinc-500 not-italic">&mdash; Stafford Beer</cite>
            </div>

            {/* Quote 3 */}
            <div className="border-l-2 border-zinc-200 pl-6 py-1">
              <blockquote className="text-sm italic text-zinc-700 font-light mb-2">
                &ldquo;The study of systems that are open to energy but closed to information.&rdquo;
              </blockquote>
              <cite className="text-xs font-semibold text-zinc-500 not-italic">&mdash; W. Ross Ashby</cite>
            </div>
          </div>
        </div>
      </section>

      {/* Digital Workspace Announcement (Knowledge Hub Portal) */}
      <section className="w-full max-w-6xl mx-auto px-6 py-20">
        <div className="bg-zinc-50 border border-zinc-150 p-8 sm:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-xs font-bold tracking-widest text-zinc-400 uppercase mb-2 block">
              COLLABORATIVE KNOWLEDGE HUB
            </span>
            <h3 className="text-xl font-medium text-zinc-950 mb-3">
              The Digital Roster, Treasury, and Archives
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed font-light">
              We are currently deploying the Collaborative Knowledge Hub—a peer-governed database hosting member discoverability indices, real-time treasury ledger reports, and the collective archival glossary. 
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full lg:w-auto">
            <Link
              href="/admin"
              className="inline-flex h-10 items-center justify-center gap-2 bg-zinc-950 text-white hover:bg-zinc-800 px-6 font-semibold text-xs transition-colors text-center"
            >
              Coordinator Portal
            </Link>
            <Link
              href="/admin/treasury"
              className="inline-flex h-10 items-center justify-center gap-2 border border-zinc-250 bg-white hover:bg-zinc-50 px-6 font-semibold text-xs text-zinc-800 transition-colors text-center"
            >
              Treasury Transparency
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto px-6 py-12 border-t border-zinc-100 flex flex-col md:flex-row items-start md:items-center justify-between text-xs text-zinc-400 gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-zinc-950">ASC</span>
            <span className="text-zinc-300">|</span>
            <span className="text-zinc-500">American Society for Cybernetics</span>
          </div>
          <p className="max-w-md font-light text-[11px] leading-relaxed text-zinc-400">
            Dedicated to fostering the understanding and development of cybernetics, systemic thought, and interdisciplinary circular frameworks.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-2 text-zinc-500">
          <span className="cursor-default hover:text-zinc-700 transition-colors">GDPR Compliant Architecture</span>
          <span className="cursor-default hover:text-zinc-700 transition-colors">Open-Source Core</span>
          <a href="https://asc-cybernetics.org/" className="hover:text-zinc-700 transition-colors">Legacy Reference</a>
        </div>
      </footer>
    </div>
  )
}
