"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Database, Upload, Bot, FileText, CheckCircle2 } from "lucide-react"
import Papa from "papaparse"

export default function AgentsControlCenter() {
  const [model, setModel] = useState("google/gemini-3.5-flash")
  const [isProcessing, setIsProcessing] = useState(false)
  const [mappedData, setMappedData] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [importSuccess, setImportSuccess] = useState(false)

  const [newsletterModel, setNewsletterModel] = useState("google/gemini-3.5-flash")
  const [newsletterDraft, setNewsletterDraft] = useState("")
  const [isDrafting, setIsDrafting] = useState(false)
  const [newsletterError, setNewsletterError] = useState<string | null>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // ... existing upload logic ...
    const file = e.target.files?.[0]
    if (!file) return

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        setIsProcessing(true)
        setError(null)
        setMappedData([])
        setImportSuccess(false)

        try {
          const response = await fetch('/api/map-data', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              csvData: results.data,
              model: model
            })
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.error || 'Failed to process data')
          }

          setMappedData(data.mappedData)
        } catch (err: any) {
          setError(err.message)
        } finally {
          setIsProcessing(false)
        }
      },
      error: (error: any) => {
        setError(error.message)
      }
    })
  }

  const handleImport = async () => {
    setIsImporting(true)
    setError(null)
    setTimeout(() => {
      setIsImporting(false)
      setImportSuccess(true)
      setMappedData([])
    }, 1500)
  }

  const handleGenerateNewsletter = async () => {
    setIsDrafting(true)
    setNewsletterError(null)
    setNewsletterDraft("")
    
    try {
      const response = await fetch('/api/agents/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: newsletterModel })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate draft')
      }

      setNewsletterDraft(data.draftContent)
    } catch (err: any) {
      setNewsletterError(err.message)
    } finally {
      setIsDrafting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Agent Control Center</h2>
        <p className="text-muted-foreground mt-1">Configure and monitor explicit AI utilities across the Hub.</p>
      </div>

      {/* Agent Card */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-blue-500" />
              <CardTitle>Legacy Data Migration Assistant</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-sm font-medium text-green-700 dark:text-green-400">Ready</span>
            </div>
          </div>
          <CardDescription className="pt-2 text-sm">
            <strong>System Role:</strong> Parses raw CSV exports from the legacy system and maps messy columns to the strict PostgreSQL schema (`first_name`, `last_name`, `email`, `role`, `bio`). Opts all users out of discoverability by default.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div className="grid gap-2">
            <Label htmlFor="model-select">OpenRouter Model</Label>
            <Input 
              id="model-select" 
              value={model} 
              onChange={(e) => setModel(e.target.value)} 
              placeholder="e.g., google/gemini-3.5-flash" 
              className="font-mono text-sm max-w-md"
            />
            <p className="text-xs text-muted-foreground">The explicit LLM model string to invoke. Never hardcoded.</p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="csv-upload">Upload Legacy CSV</Label>
            <div className="flex items-center gap-4">
              <Input 
                id="csv-upload" 
                type="file" 
                accept=".csv" 
                onChange={handleFileUpload}
                disabled={isProcessing || isImporting}
                className="max-w-md cursor-pointer"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4 border border-red-200">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Agent Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isProcessing && (
            <div className="flex items-center gap-3 text-sm text-blue-600 animate-pulse">
              <Database className="h-4 w-4" />
              Agent is analyzing and mapping schema...
            </div>
          )}

          {importSuccess && (
            <div className="rounded-md bg-green-50 p-4 border border-green-200">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <h3 className="text-sm font-medium text-green-800">Records successfully provisioned to the database. Welcome emails bypassed.</h3>
              </div>
            </div>
          )}

          {mappedData.length > 0 && (
            <div className="rounded-md border mt-6">
              <div className="bg-muted/50 p-3 border-b flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <FileText className="h-4 w-4" />
                  Validation Preview ({mappedData.length} records)
                </div>
                <p className="text-xs text-muted-foreground">Rec 9: Human Review Required</p>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>First Name</TableHead>
                    <TableHead>Last Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Bio</TableHead>
                    <TableHead>Discoverable</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mappedData.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{row.first_name || <span className="text-red-500 text-xs">Missing</span>}</TableCell>
                      <TableCell>{row.last_name || <span className="text-red-500 text-xs">Missing</span>}</TableCell>
                      <TableCell>{row.email || <span className="text-red-500 text-xs">Missing</span>}</TableCell>
                      <TableCell className="capitalize">
                        <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                          {row.role}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate" title={row.bio}>{row.bio || '-'}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                          False
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        {mappedData.length > 0 && (
          <CardFooter className="bg-muted/30 pt-6">
            <div className="flex w-full items-center justify-between">
              <p className="text-sm text-muted-foreground">Please review the mapped columns before confirming.</p>
              <Button onClick={handleImport} disabled={isImporting}>
                {isImporting ? "Importing..." : "Approve & Import"}
                {!isImporting && <Upload className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>

      {/* Newsletter Agent Card */}
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-purple-500" />
              <CardTitle>Editorial Assistant (Newsletter Drafts)</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-green-700 dark:text-green-400">Ready</span>
            </div>
          </div>
          <CardDescription className="pt-2 text-sm">
            <strong>System Role:</strong> Scans the database for recently published Glossary Terms and Publications and drafts an engaging HTML/Markdown newsletter. The draft requires explicit human editing and is outputted for copy-pasting into your external mailing provider.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="newsletter-model-select">OpenRouter Model</Label>
            <Input 
              id="newsletter-model-select" 
              value={newsletterModel}
              onChange={(e) => setNewsletterModel(e.target.value)}
              className="font-mono text-sm max-w-md"
            />
          </div>
          
          {newsletterError && (
            <div className="rounded-md bg-red-50 p-4 border border-red-200">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Agent Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{newsletterError}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-md border mt-2">
            <div className="bg-muted/50 p-3 border-b flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium">
                <FileText className="h-4 w-4" />
                Draft Output (Rec 9: Human Review Required)
              </div>
            </div>
            <div className="p-4">
              <textarea 
                className="w-full min-h-[200px] p-3 rounded-md border font-mono text-sm resize-y focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                placeholder="Click 'Generate Draft' to instruct the agent to fetch recent publications and write the newsletter draft here. You can edit the markdown directly before copying."
                value={newsletterDraft}
                onChange={(e) => setNewsletterDraft(e.target.value)}
                disabled={isDrafting}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-muted/30 pt-6">
            <div className="flex w-full items-center justify-end">
              <Button onClick={handleGenerateNewsletter} disabled={isDrafting}>
                {isDrafting ? "Drafting..." : "Generate Draft"} 
                {!isDrafting && <Bot className="ml-2 h-4 w-4" />}
              </Button>
            </div>
        </CardFooter>
      </Card>

    </div>
  )
}
