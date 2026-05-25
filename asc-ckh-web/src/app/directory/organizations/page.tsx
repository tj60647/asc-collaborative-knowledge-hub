import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, AlertTriangle } from "lucide-react"
import Link from "next/link"

const organizations = [
  {
    name: "International Federation for Systems Research (IFSR)",
    url: "http://www.ifsr.org/",
    description: "A non-profit scientific and educational agency constituted of member organizations from a variety of countries. The overall purpose is to advance cybernetic and systems research and applications.",
    active: true,
  },
  {
    name: "L'Association Française de Science des Systèmes Cybernétiques (AFSCET)",
    url: "http://www.afscet.asso.fr/",
    description: "L'AFSCET a pour but le développement de la recherche sur les systèmes complexes, cybernétiques et cognitifs, dans les domaines technologiques, économiques, biologiques, sociologiques et épistémologiques.",
    active: true,
  },
  {
    name: "The Cybernetics Society UK",
    url: "http://www.cybsoc.org/",
    description: "The UK national learned society and professional body promoting pure and applied cybernetics. It holds scientific meetings, conferences, and social events.",
    active: true,
  },
  {
    name: "International Society for the Systems Sciences (ISSS)",
    url: "http://www.isss.org",
    description: "A broadly based professional society of scientists, philosophers, educators, futurists, and practitioners drawn together by a common interest in understanding reality systemically.",
    active: true,
  },
  {
    name: "System Dynamics Society",
    url: "http://www.albany.edu/cpr/sds/",
    description: "An international, nonprofit organization devoted to encouraging the development and use of systems thinking and system dynamics around the world.",
    active: true,
  },
  {
    name: "Austrian Society for Cybernetic Studies (ASCS)",
    url: "http://www.ai.univie.ac.at/oesgk/",
    description: "Founded in 1969 to study the theoretical bases of cybernetics and its applications on technical, economic, and social problems.",
    active: false,
  },
  {
    name: "Control Systems Group (CSG)",
    url: "http://www.ed.uiuc.edu/csg/index.html",
    description: "A membership organization dedicated to the application of William T. Powers' Perceptual Control Theory (PCT).",
    active: false,
  },
  {
    name: "Research Committee on Sociocybernetics",
    url: "http://www.unizar.es/sociocybernetics/indice.html",
    description: "Promotes the development of (socio)cybernetic theory and research within the social sciences.",
    active: false,
  },
  {
    name: "World Organization for Systems and Cybernetics (WOSC)",
    url: "http://www.cybsoc.org/wosc",
    description: "A federation of national associations and institutions devoted to systems or cybernetics, founded in 1960 by Professor J. Rose.",
    active: false,
  },
]

export default function OrganizationsPage() {
  const active = organizations.filter((o) => o.active)
  const archived = organizations.filter((o) => !o.active)

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
          Affiliated Organizations
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-zinc-600 max-w-2xl">
          There are several professional societies in the field of cybernetics and systems theory. Below is a curated listing of such societies and other relevant organizations from our historical archives.
        </p>
      </div>

      {/* Active Organizations */}
      <div>
        <h2 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300 mb-4">Active Organizations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {active.map((org) => (
            <Card key={org.name} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <CardTitle className="text-xl leading-tight text-zinc-900 dark:text-zinc-50">
                    {org.name}
                  </CardTitle>
                  <Link
                    href={org.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors"
                    title={`Visit ${org.name}`}
                  >
                    <ExternalLink className="h-5 w-5" />
                  </Link>
                </div>
                <CardDescription className="flex items-center gap-2 mt-2 font-mono text-xs">
                  <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Active Link
                  </span>
                  <span className="text-zinc-400 truncate">{org.url}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {org.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Historical Archive */}
      <div>
        <h2 className="text-lg font-semibold text-zinc-500 dark:text-zinc-400 mb-1">Historical Archive</h2>
        <p className="text-sm text-zinc-400 mb-4">These organizations are no longer reachable at their listed URLs but are preserved for historical reference.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {archived.map((org) => (
            <Card key={org.name} className="flex flex-col opacity-70">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <CardTitle className="text-xl leading-tight text-zinc-900 dark:text-zinc-50">
                    {org.name}
                  </CardTitle>
                  <div
                    className="shrink-0 p-2 text-amber-500 rounded-full"
                    title="This link is currently inactive or unreachable."
                  >
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                </div>
                <CardDescription className="flex items-center gap-2 mt-2 font-mono text-xs">
                  <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    Archived Link
                  </span>
                  <span className="text-zinc-400 truncate">{org.url}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {org.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
