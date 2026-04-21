# Cloud Resume Frontend

Static frontend for my Azure Cloud Resume Challenge portfolio site: `https://martycrane.com`.

This repo contains the public resume page, blog index, dated blog posts, visitor counter JavaScript, styling, and the GitHub Actions workflow that deploys the site to Azure Storage.

## What This Demonstrates

- Static website hosting on Azure Storage
- Custom domain delivery through Cloudflare DNS/CDN
- Vanilla HTML, CSS, and JavaScript
- Browser-to-API integration with an Azure Function
- Secure GitHub Actions deployment using Azure OIDC
- Cloudflare cache purge after deployment
- No secrets committed to source control

## Site Pages

- `index.html`: Resume and portfolio landing page
- `blog.html`: Blog homepage with dated post links
- `posts/`: Individual blog post pages
- `styles.css`: Shared styling for the resume and blog pages
- `visitor-counter.js`: Frontend logic for calling the visitor counter API

## Visitor Counter Flow

The resume page includes a visitor counter that calls the backend API on page load.

Flow:

```text
Browser JavaScript
  -> Azure Function HTTP endpoint
  -> Cosmos DB Table API
  -> JSON response
  -> DOM update
```

The frontend expects an element with the ID `visitor-count`:

```html
<span id="visitor-count" data-api-url="">Loading...</span>
```

The JavaScript supports:

- Local development via `http://localhost:7071/api/GetResumeCounter`
- Production overrides through the `data-api-url` attribute
- A same-origin `/api/GetResumeCounter` fallback if a proxy or rewrite is configured
- Safe failure handling that displays `Unavailable` if the API cannot be reached

## Local Development

Serve the site locally from this folder:

```powershell
cd C:\Users\mcrane\Documents\Cloud_Resume_Challenge\frontend-website
python -m http.server 8000
```

Open:

```text
http://localhost:8000
```

If the backend Function is also running locally, the visitor counter should update automatically.

## Deployment

The site deploys through `.github/workflows/frontend-deploy.yml`.

The workflow runs on pushes to `master` or `main` when frontend files change, and it can also be run manually.

Deployment steps:

1. Check out the repo
2. Validate required static files
3. Log in to Azure with OIDC
4. Upload HTML, CSS, and JavaScript files to the Azure Storage `$web` container
5. Purge Cloudflare cache after a successful deploy

Required GitHub Actions secrets:

- `AZURE_CLIENT_ID`
- `AZURE_TENANT_ID`
- `AZURE_SUBSCRIPTION_ID`
- `CLOUDFLARE_API_TOKEN`

Required GitHub Actions variable:

- `CLOUDFLARE_ZONE_ID`

Required Azure permission for the federated identity:

- `Storage Blob Data Contributor` on the static website storage account

The workflow uses Azure OpenID Connect through `azure/login`, so no Azure client secret, storage key, publish profile, or connection string is stored in GitHub.

Manual workflow run:

```powershell
gh workflow run "Frontend Deploy" --ref master
```

Inspect recent runs:

```powershell
gh run list --workflow "Frontend Deploy"
```

Expected successful steps:

- Azure login
- Upload static site files
- Purge Cloudflare cache

## Blog Structure

The blog is intentionally static and framework-free.

Current structure:

```text
blog.html
posts/
  2026-04-20-cloud-resume-challenge.html
  2026-04-20-supply-chain-baseline.html
```

To add a new post:

1. Create a dated HTML page under `posts/`.
2. Add a card for it in `blog.html`.
3. Commit and push.

The deployment workflow watches both top-level HTML files and `posts/**/*.html`, so new posts trigger the frontend deployment pipeline.

## Infrastructure As Code

The Azure infrastructure is modeled separately in the public IaC repo:

```text
https://github.com/MrGolbez/cloud-resume-infra
```

The Bicep modules currently cover:

- Azure Storage static website
- Azure Functions Flex Consumption plan
- Linux Python Function App
- Function runtime/deployment storage
- Cosmos DB Table API account
- `Counter` table used by the visitor counter

Cloudflare DNS/CDN settings are documented separately because they are not Azure Resource Manager resources. The cache purge integration lives in this frontend deployment workflow.

## Completed Project Status

The core Azure Cloud Resume Challenge implementation is complete:

- Static site live on a custom domain
- Visitor counter integrated with serverless backend
- Backend tests and deployment pipeline completed
- Frontend deployment pipeline completed
- Cloudflare cache purge automated
- Initial Bicep IaC modules created

Planned improvements include architecture diagrams, screenshots, deeper Cloudflare documentation, and an IaC validation workflow that runs Bicep build and Azure `what-if`.
