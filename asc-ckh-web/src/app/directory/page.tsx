"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Mail, Sparkles, Filter } from "lucide-react"

// Mock Directory Data where discoverability_opt_in = true
const mockDirectory = [
  { id: "1", name: "Jane Scholar", role: "Member", tags: ["Systems Theory", "Design"], email: "jane@example.com", isMatch: false },
  { id: "2", name: "Dr. Maturana", role: "Fellow", tags: ["Autopoiesis", "Biology", "Cybernetics"], email: "maturana@example.com", isMatch: true, matchReason: "Cybernetics" },
  { id: "3", name: "Elena V.", role: "Student", tags: ["Conversational Systems", "Enactivism"], email: "elena@example.com", isMatch: true, matchReason: "Enactivism" },
  { id: "4", name: "John Ashby", role: "Member", tags: ["Law of Requisite Variety"], email: "john@example.com", isMatch: false },
]

export default function MemberDirectoryPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredDirectory = mockDirectory.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const matches = filteredDirectory.filter(m => m.isMatch)
  const others = filteredDirectory.filter(m => !m.isMatch)

  const handleSuggestCollaboration = (member: any) => {
    // Generate the pre-populated mailto link (Journey E - Step 7 & 8)
    const subject = encodeURIComponent("Collaboration Inquiry via ASC Knowledge Hub")
    const body = encodeURIComponent(`Hello ${member.name.split(' ')[0]},\n\nI found your profile in the ASC Directory. We matched because we both share a declared interest in: ${member.matchReason}.\n\nI am currently working on...`)
    
    // Log the interaction intent (Mock)
    console.log(`[PROVENANCE LOG]: relation_type='collaboration_intent', source='current_user', target='${member.id}'`)
    
    // Open email client
    window.location.href = `mailto:${member.email}?subject=${subject}&body=${body}`
  }

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Member Directory</h1>
          <p className="text-muted-foreground mt-2">Connect with peers across the Society.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name or interest..."
            className="pl-8 bg-background"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {matches.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-purple-500" />
            <h2 className="text-xl font-semibold">Suggested Peers (Similarity Matches)</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matches.map(member => (
              <Card key={member.id} className="border-purple-200 bg-purple-50/10 shadow-sm flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                      <CardDescription>{member.role}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-3 flex-1">
                  <div className="text-sm font-medium text-purple-800 bg-purple-100/50 p-2 rounded-md mb-3">
                    <strong>Match Reason:</strong> You both list interests in <em>{member.matchReason}</em>.
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {member.tags.map(tag => (
                      <span key={tag} className="inline-flex text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button 
                    variant="default" 
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={() => handleSuggestCollaboration(member)}
                  >
                    <Mail className="mr-2 h-4 w-4" /> Suggest Collaboration
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">All Opted-In Members</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {others.map(member => (
            <Card key={member.id} className="shadow-sm flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{member.name}</CardTitle>
                <CardDescription>{member.role}</CardDescription>
              </CardHeader>
              <CardContent className="pb-3 flex-1">
                <div className="flex flex-wrap gap-1">
                  {member.tags.map(tag => (
                    <span key={tag} className="inline-flex text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => window.location.href = `mailto:${member.email}`}
                >
                  <Mail className="mr-2 h-4 w-4" /> Contact
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        {others.length === 0 && matches.length === 0 && (
          <div className="text-center p-8 text-muted-foreground border rounded-md">
            No members found matching your search.
          </div>
        )}
      </section>

    </div>
  )
}
