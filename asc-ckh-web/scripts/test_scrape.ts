import { chromium } from 'playwright'

async function scrape() {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  
  console.log("Navigating to Teamup...")
  await page.goto('https://teamup.com/ksok1qhw323snqy99e?showProfileAndInfo=0&showSidepanel=1&showViewHeader=1&showAgendaDetails=0&showDateControls=1', { waitUntil: 'networkidle' })

  console.log("Waiting for events to render...")
  // Teamup uses .event or .event-title classes, wait for a bit
  await page.waitForTimeout(5000)
  
  // Let's get the page content to see how it renders
  const events = await page.evaluate(() => {
    // Try to find any element that looks like an event
    // Teamup usually uses div.event or similar
    const eventNodes = document.querySelectorAll('.event, .fc-event, .agenda-item')
    const results: any[] = []
    eventNodes.forEach(node => {
      results.push(node.textContent?.trim())
    })
    return results
  })

  console.log(`Found ${events.length} event elements.`)
  if (events.length > 0) {
    console.log("Sample:", events.slice(0, 5))
  } else {
    // Fallback: extract all text to figure out classes
    const html = await page.evaluate(() => document.body.innerHTML)
    console.log("No events found with generic classes. HTML snippet:")
    console.log(html.substring(0, 500))
  }

  await browser.close()
}

scrape().catch(console.error)
