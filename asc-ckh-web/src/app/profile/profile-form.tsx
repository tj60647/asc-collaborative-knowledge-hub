'use client'

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, ShieldAlert, Tag as TagIcon, Save, CheckCircle2 } from "lucide-react"
import { updateProfile } from "./actions"

type ProfileData = {
  title_prefix: string | null
  first_name: string
  middle_initial: string | null
  last_name: string
  bio: string | null
}

export function ProfileForm({ initialData }: { initialData: ProfileData }) {
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Profile state initialized with DB data
  const [profile, setProfile] = useState({
    title_prefix: initialData.title_prefix || "none",
    first_name: initialData.first_name || "",
    middle_initial: initialData.middle_initial || "",
    last_name: initialData.last_name || "",
    bio: initialData.bio || "",
    discoverabilityOptIn: true, // We will add this to schema later
  })

  // Mock declared interests (tags)
  const [declaredTags, setDeclaredTags] = useState(["Cybernetics", "Systems Theory", "Enactivism"])
  const [newTag, setNewTag] = useState("")

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSelectChange = (value: string | null) => {
    setProfile(prev => ({ ...prev, title_prefix: value || "none" }))
  }

  const handleToggleDiscoverability = (checked: boolean) => {
    setProfile(prev => ({ ...prev, discoverabilityOptIn: checked }))
  }

  const addTag = () => {
    if (newTag.trim() && !declaredTags.includes(newTag.trim())) {
      setDeclaredTags(prev => [...prev, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setDeclaredTags(prev => prev.filter(t => t !== tagToRemove))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setIsSaved(false)
    setError(null)

    const formData = new FormData()
    if (profile.title_prefix !== "none") formData.append("title_prefix", profile.title_prefix)
    formData.append("first_name", profile.first_name)
    formData.append("middle_initial", profile.middle_initial)
    formData.append("last_name", profile.last_name)
    formData.append("bio", profile.bio)

    const result = await updateProfile(formData)

    setIsSaving(false)
    
    if (result.error) {
      setError(result.error)
    } else {
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 3000)
    }
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-6">
      
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-md text-sm border border-destructive/20">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <CardTitle>Personal Details</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2 md:col-span-1">
              <Label htmlFor="title_prefix">Title / Prefix</Label>
              <Select value={profile.title_prefix} onValueChange={handleSelectChange} name="title_prefix">
                <SelectTrigger id="title_prefix">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="Dr.">Dr.</SelectItem>
                  <SelectItem value="Prof.">Prof.</SelectItem>
                  <SelectItem value="Mr.">Mr.</SelectItem>
                  <SelectItem value="Ms.">Ms.</SelectItem>
                  <SelectItem value="Mx.">Mx.</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 md:col-span-1">
              <Label htmlFor="first_name">First Name</Label>
              <Input id="first_name" name="first_name" value={profile.first_name} onChange={handleProfileChange} required />
            </div>

            <div className="space-y-2 md:col-span-1">
              <Label htmlFor="middle_initial">Middle Initial</Label>
              <Input id="middle_initial" name="middle_initial" value={profile.middle_initial} onChange={handleProfileChange} maxLength={10} placeholder="e.g. A." />
            </div>

            <div className="space-y-2 md:col-span-1">
              <Label htmlFor="last_name">Last Name</Label>
              <Input id="last_name" name="last_name" value={profile.last_name} onChange={handleProfileChange} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Biography</Label>
            <textarea 
              id="bio" 
              name="bio"
              className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={profile.bio}
              onChange={handleProfileChange}
              placeholder="Tell the community about your research..."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TagIcon className="h-5 w-5 text-primary" />
              <CardTitle>Declared Interests (Similarity Matching)</CardTitle>
            </div>
          </div>
          <CardDescription>
            These tags are used to match you with peers. Modifying these tags updates the <code>relationships</code> graph with a <code>declared</code> provenance.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {declaredTags.map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                {tag}
                <button type="button" onClick={() => removeTag(tag)} className="ml-1 text-primary/70 hover:text-primary">
                  &times;
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <Input 
              placeholder="e.g., Constructivism" 
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addTag()
                }
              }}
              className="max-w-sm"
            />
            <Button type="button" variant="outline" onClick={addTag}>Add Tag</Button>
          </div>
        </CardContent>
      </Card>

      <Card className={profile.discoverabilityOptIn ? "border-primary/20" : "border-amber-200 bg-amber-50/30"}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className={profile.discoverabilityOptIn ? "h-5 w-5 text-primary" : "h-5 w-5 text-amber-500"} />
              <CardTitle>Discoverability & Privacy</CardTitle>
            </div>
            <Switch 
              checked={profile.discoverabilityOptIn} 
              onCheckedChange={handleToggleDiscoverability}
              aria-label="Toggle discoverability"
            />
          </div>
          <CardDescription>
            {profile.discoverabilityOptIn 
              ? "Your profile is PUBLIC. You will appear in the Member Directory and can be matched with collaborators."
              : "Your profile is PRIVATE. You are hidden from the directory and matching engine. You can still access the hub."}
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="flex justify-end items-center gap-4 pt-4">
        {isSaved && <span className="text-sm font-medium text-green-600 flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> Profile Updated</span>}
        <Button type="submit" disabled={isSaving} size="lg">
          {isSaving ? "Saving..." : "Save Profile Settings"}
          {!isSaving && <Save className="ml-2 h-4 w-4" />}
        </Button>
      </div>

    </form>
  )
}
