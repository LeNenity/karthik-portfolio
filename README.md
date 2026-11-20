# Karthik Portfolio — V5

Static website. Open `index.html` using a local static server, or upload the contents of this folder to the existing GitHub repository connected to Render. No new backend, framework, build step or paid API. Preserve hosting settings and existing licences. Do not upload the ZIP itself. If using GitHub's web uploader, select files in batches if required.

## Current release

- Original light/dark design, artwork, transitions, project globe, three-featured-project carousel, header, résumé and certificate previews retained. No chatbot. All seven numbered projects remain accessible.
- Fixed the art pointer coordinate calculation: pointer and click events are converted from the CSS-scaled canvas bounding rectangle into drawing-space coordinates, including the actual transform origin and device-pixel ratio handling. The canvas design remains unchanged. Geometry regression checked at several desktop/mobile dimensions and scales.
- Magnetic interactions remain selective; no header or View Internship magnetism. The target position is held during pointer-down so a selected button does not drift during a click.
- Project snapshots simplified, model test-set and person-level limitations made prominent, and the evidence/physical prototype videos moved earlier on applicable project pages. Existing architecture explorers retained. Supplementary nonessential labs from prior versions remain removed. ML and road safety recorded-results explorers remain.
- Outpost 07 is identified throughout as a collaborative team project; no individual ownership invented. The separate visible link crediting another portfolio was removed. All five team members remain listed. Genuine screenshots are referenced directly from the team repository rather than the teammate's deployed portfolio. The trailer still uses the previously listed deployed video URL. Source provenance and third-party notices remain here.
- Added Open Graph/Twitter sharing metadata and a self-hosted 1200 × 630 social preview. Standardised page titles. Retained the hidden internship navigation preview because it is not an initial-load banner; its photograph is now lazy-loaded.
- Extracted 288,642 bytes of identical CSS into `shared-base.css`, reducing duplication by 1,154,568 bytes while keeping the exact stylesheet cascade. Removed unused JavaScript for deleted supplementary labs.
- Compressed the two-page scanned internship testimonial from 11,733,434 to 1,629,005 bytes at full original raster dimensions. Render comparison confirmed the same page count and dimensions and a mean channel difference of about 0.1/255. Five large photos were re-encoded without changing dimensions; original videos and technical diagrams were retained.

## Sources, permissions and remaining dependencies

- Team gameplay image repository: https://github.com/bigbobopenguin-abc/andrea-portfolio/tree/main/static/images/outpost-07
- Thirteen direct raw repository image URLs were checked and display genuine gameplay screenshots. Download attempts in the execution environment failed, so the release uses remote repository image URLs and explicitly labelled fallback artwork. Local media packaging is not complete. Confirm team permission and any applicable attribution before reuse; repository availability does not by itself establish a licence.
- Team submission: https://www.spaceappschallenge.org/2026/find-a-team/ctrl-alt-del/?tab=project (availability not verified). Game: https://www.roblox.com/games/132913017394841/Outpost-07-Junior-Astronaut-Mission . The original trailer link is retained; playback was not verified. Shared project context: https://andrea-lee-portfolio.onrender.com/projects/lunar-expedition.html .
- Uiverse inspiration: https://uiverse.io/elements ; hover-button reference https://uiverse.io/satyamchaudharydev/rude-wolverine-24 . Original CSS and JS implement similar interactions independently; no new third-party component source was imported or claimed. Keep THIRD_PARTY_LICENSES.txt.
- Earlier project numbering 01–06 is an assumed chronological sequence, not independently established completion dates. NASA remains 07 and the latest, as requested.
- The AEIS Book Prize was not found in the supplied certificate files, so it was not newly claimed. No trained ML model or raw sensor dataset was supplied. Existing demos use documented results, not invented inference.

## Optional local media setup

Once you have permission and internet access, download the 13 JPGs from the repository directory into `assets/outpost-07/` (same filenames). Replace the raw GitHub URL prefix in the HTML and `home.bundle.js` with `assets/outpost-07/`. Download the authorised trailer into the project assets folder and replace both the video source and trailer link. No change to the page structure is necessary.

## Verification

- All JavaScript files pass `node --check`. Local HTML asset and link checks, duplicate-ID checks, pointer geometry tests and archive integrity checks pass.
- The shared stylesheet plus each new page bundle reconstructs the corresponding V4 bundle byte-for-byte. This verifies the CSS split, not rendered appearance.
- Browser navigation remains blocked by the execution environment (`ERR_BLOCKED_BY_ADMINISTRATOR`). Actual desktop and mobile layout, click feel, animation smoothness, social preview rendering, gameplay video playback and runtime performance need local verification before deployment. No measured browser speedup or complete UI regression test is claimed.

### Homepage highlight update
- Added NYP Director’s List to the homepage highlights alongside the existing ITE awards. No award count, semester or certificate was supplied, so none is specified.

- Homepage rotating heading: restored the original AI & Data Engineering Student and Background in Electronics roles; replaced IoT Enthusiast with Applied Machine Learning.

## Adaptive performance (V5 automatic optimisation)

No performance controls or settings UI have been added. The website automatically selects an initial artwork quality using available hardware hints; unavailable hints do not establish that a device is weak. Short frame-timing samples after initial layout can lower quality after two consecutive poor samples. Quality only steps down during a page visit to avoid oscillation. Sampling pauses in background tabs and stops at the lowest tier or for reduced-motion users. Existing artwork, ripple coordinates, page transitions, selective magnetic buttons, three featured projects, and NYP Director's List are retained.

- Lower quality tiers reduce neural particle density, canvas backing resolution and globe/ambient rendering frequency; the original off-screen and hidden-tab animation guards are retained. Decorative effects are reduced selectively, not the content or navigation. The existing high-quality neural renderer is unchanged in its target frequency.
- Network hints are independent of hardware quality. Save-Data, 2G/3G, low reported throughput and high latency prevent speculative page prefetch. Unknown connections also do not prefetch. Known fast connections can prefetch at most two deliberately hovered local destinations after the current page has loaded; automatic idle/touch warming has been removed. The featured-card and globe preview images use lazy loading and low priority. The remote handwritten font no longer blocks initial paint.
- Converted NESSO field photograph and Tri-Star concept sketch to WebP at original dimensions and updated all references. Re-encoded both Tri-Star demonstration videos at their original 1920×1080 resolution and duration with fast-start MP4 metadata. Compression is lossy, but original V5 remains available as a backup.
- Node syntax checks, HTML local-asset/duplicate-ID checks, simulated quality controller scenarios (fast/balanced/weak hardware, sustained frame drops, slow/unknown links and background-tab pause), and video stream dimension/duration checks passed. Local browser navigation is blocked by the execution environment; actual Lighthouse scores, network throughput, visual quality and frame rates are not verified. External NASA media remains dependent on remote availability.
