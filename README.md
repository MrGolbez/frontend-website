# Frontend Website

This contains the static frontend for my cloud resume project, available at `https://martycrane.com`. This project is my starting off point for getting familiar with Azure cloud infrastructure and Infrastructure as Code.

## Project Overview

The frontend is a lightweight static site built with plain HTML, CSS, and JavaScript. It serves as the public-facing resume and portfolio site for the Azure Cloud Resume Challenge and is designed to stay simple, fast, and easy to maintain as new pages are added over time.

- Render the resume and portfolio content
- Provide the public website experience at `martycrane.com`
- Call the backend visitor counter API on page load
- Display the current visitor count without exposing any secrets

## Files

- `index.html`: Main resume page content and page structure
- `styles.css`: Shared visual styling for the site
- `visitor-counter.js`: Frontend logic for calling the visitor counter API

## Visitor Counter Integration

The frontend expects an element with the ID `visitor-count` and updates it dynamically by calling the Azure Function backend.

The JavaScript supports:

- Local development via `http://localhost:7071/api/GetResumeCounter`
- Production overrides through the `data-api-url` attribute
- A same-origin `/api/GetResumeCounter` fallback if a proxy or rewrite is configured

Example markup:

```html
<span id="visitor-count" data-api-url="">Loading...</span>
```

## Local Development

Serve the site locally from this folder:

```powershell
cd c:\Users\mcrane\Documents\Cloud_Resume_Challenge\frontend-website
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

If the backend Function is also running locally, the visitor counter should update automatically.

## Frontend Deployment

The static site is deployed by `.github/workflows/frontend-deploy.yml` on pushes to `master` or `main`.

Required GitHub Actions secrets:

- `AZURE_CLIENT_ID`
- `AZURE_TENANT_ID`
- `AZURE_SUBSCRIPTION_ID`

The workflow uses Azure OpenID Connect through `azure/login`, so no publish profile, storage key, or connection string is stored in GitHub.

Optional GitHub Actions secret for Cloudflare cache purge:

- `CLOUDFLARE_API_TOKEN`

Required Azure permissions for the federated identity:

- `Storage Blob Data Contributor` on the resume storage account

Optional GitHub Actions variable for Cloudflare cache purge:

- `CLOUDFLARE_ZONE_ID`

If `CLOUDFLARE_ZONE_ID` is set, the workflow purges the cached homepage, `index.html`, `styles.css`, and `visitor-counter.js` after uploading the static files. The Cloudflare API token should be scoped only to the `martycrane.com` zone with cache purge permission.

## Planned Growth

This frontend is intended to become a longer-term personal website, so the structure has been split into separate files to support:

- Additional resume and portfolio pages
- Blog pages or article pages
- Utilize IaC with ARM and Bicep to build more infrastructure and further understanding of SecDevOps and Azure Cloud
