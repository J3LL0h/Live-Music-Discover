# Ticketmaster API Demo 

## Context and API application
This demo displays fetches and displays concert information using the Ticketmaster Discovery API. All the event inforamtion shown on the website is sourced from Ticketmaster. This includes artist name, dates, venues, location, and ticket links to the ticketmaster website.

The website uses Node.js backend to send requests to Ticketmaster API and return the results to the frontend of the website. This approach ensures the API key isn't exposed in the frontend JavaScript as the user explores concert information.

## API Credentials and Environment Variables
To get your API Key, you'll need to sign up through the Ticketmaster Developer portal (https://developer-account.ticketmaster.com/user/login) and create an account to access the Discovery API. 

When coding locally, be sure to store your API key in a .env file. The variable name needs to match the one referenced in your Node.js code.

```
TICKETMASTER_API_KEY=your_ticketmaster_api_key***

``` 
## About 
This project demonstates the integration of the Ticketmaster Discovery API through a Node.js backend to retrieve and display concert information.
Created by in the context of Systems Design in the [Interaction Design](https://ixd.sheridancollege.ca/program.html) program at [Sheridan College.](https://www.sheridancollege.ca/) .

Thanks to [Ticketmaster](https://developer.ticketmaster.com/) for all the concert and event information!