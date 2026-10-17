const searchForm = document.querySelector('form#searchForm')
const resultsSection = document.querySelector("section#results")
const searchText = document.querySelector('#searchText')
const cityFilter = document.querySelector('#cityFilter')
const genreFilter = document.querySelector('#genreFilter')

searchForm.addEventListener("submit", async event => {
  event.preventDefault()

  const keyword = searchText.value.trim()
  if (!keyword) {
    displayResults(null)
    return
  }

  const params = new URLSearchParams({ keyword })
  const city = cityFilter.value.trim()
  const genre = genreFilter.value.trim()
  if (city) params.set('city', city)
  if (genre) params.set('classificationName', genre)

  const endpointURL = `/search?${params}`

  try {
    const response = await fetch(endpointURL)
    if (!response.ok) throw new Error('Event search failed')
    displayResults(await response.json())
  } catch (error) {
    displayMessage('Could not load events. Check the server and try again.')
  }
})

const displayResults = data => {
  resultsSection.replaceChildren()

  const events = data?._embedded?.events
  if (data?.error || !Array.isArray(events) || events.length === 0) {
    displayMessage('No shows')
    return
  }

  events.forEach(renderEvent)
}

const displayMessage = text => {
  resultsSection.replaceChildren()
  const message = document.createElement('p')
  message.textContent = text
  resultsSection.appendChild(message)
}

const renderEvent = event => {
  const venue = event._embedded?.venues?.[0]
  const location = [
    venue?.address?.line1,
    venue?.city?.name,
    venue?.state?.stateCode || venue?.state?.name,
    venue?.country?.countryCode || venue?.country?.name
  ].filter(Boolean).join(', ')

  const result = document.createElement('div')
  result.classList.add('lexicalEntry')

  const title = document.createElement('h2')
  title.textContent = event.name || 'Untitled event'
  result.appendChild(title)

  const details = document.createElement('div')
  details.classList.add('entry')
  appendDetail(details, 'Date', formatEventDate(event.dates?.start))
  appendDetail(details, 'Venue', venue?.name || 'Venue not listed')
  appendDetail(details, 'Location', location || 'Location not listed')

  if (event.url) {
    const ticketLink = document.createElement('a')
    ticketLink.href = event.url
    ticketLink.textContent = 'Get tickets'
    ticketLink.target = '_blank'
    ticketLink.rel = 'noopener noreferrer'
    details.appendChild(ticketLink)
  }

  result.appendChild(details)
  resultsSection.appendChild(result)
}

const appendDetail = (parent, label, value) => {
  const detail = document.createElement('p')
  detail.classList.add('sense')
  detail.textContent = `${label}: ${value}`
  parent.appendChild(detail)
}

const formatEventDate = start => {
  const value = start?.dateTime || start?.localDate
  if (!value) return 'Date not listed'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  const options = start.dateTime
    ? { dateStyle: 'medium', timeStyle: 'short' }
    : { dateStyle: 'medium', timeZone: 'UTC' }
  return new Intl.DateTimeFormat(undefined, options).format(date)
}

