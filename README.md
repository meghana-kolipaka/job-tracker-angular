# Job Tracker (Angular 19)

A small single-page app for tracking job applications: what you applied to, the current status, and notes. Built with Angular 19, TypeScript, RxJS and SCSS. Data is saved in the browser (localStorage), so there is no back end to set up.

## Run it

You need Node.js 20 or newer.

```bash
npm install
npm start        # opens http://localhost:4200
npm run build    # production build in dist/
```

## What it does

- Lists applications with a status bar and filter chips (Saved, Applied, Interview, Offer, Rejected)
- Searches by company, role or location
- Adds, edits and deletes applications with form validation
- Changes an application's status from the list or the detail page
- Loads sample data on first run, then keeps your changes in localStorage

## Where each Angular concept is used

| Concept | File |
| --- | --- |
| Standalone components, new control flow (`@if`, `@for`) | `src/app/components/*` |
| Lazy-loaded routes, route params, page titles | `src/app/app.routes.ts` |
| Injectable service with signals (`signal`, `computed`) | `src/app/services/application.service.ts` |
| `HttpClient` loading JSON | `application.service.ts` (`loadSeed`) |
| RxJS in a component (`debounceTime`, `distinctUntilChanged`, `toSignal`) | `application-list.component.ts` |
| Reactive forms, built-in and custom validators | `application-form.component.ts`, `src/app/utils/validators.ts` |
| Component input with signals (`input.required`) | `status-badge.component.ts` |
| Custom pipe | `src/app/pipes/days-ago.pipe.ts` |
| Typed models and union types | `src/app/models/application.model.ts` |
| Accessibility: labels, `aria-pressed`, skip link, visible focus | templates and `src/styles.scss` |

## Folder structure

```
src/app/
  components/
    application-list/     list, search, filters
    application-form/     add and edit form
    application-detail/   single application page
    status-badge/         reusable status label
  models/                 Application type and statuses
  pipes/                  daysAgo pipe
  services/               ApplicationService (state, HTTP, storage)
  utils/                  date helpers, custom validator
public/seed-applications.json   sample data (fictional companies)
```

## Push it to GitHub

```bash
git init
git add .
git commit -m "Job Tracker: Angular app for tracking applications"
git branch -M main
git remote add origin https://github.com/<your-username>/job-tracker-angular.git
git push -u origin main
```

## Ideas to extend it

- Add unit tests for `ApplicationService` and `DaysAgoPipe` with Jasmine and Karma (`npm test`)
- Replace localStorage with a small REST API (for example your Flask setup) and call it with `HttpClient`
- Add sorting options and a "follow up" reminder date
- Deploy it with GitHub Pages or Netlify and add the live link to your resume
