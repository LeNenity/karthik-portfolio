KARTHIK PORTFOLIO — STATIC SITE OPTIMIZED FOR GITHUB WEB UPLOAD

This is the complete website. It has fewer than 100 files so you can upload
it in one batch through the GitHub browser interface.

HOW TO DEPLOY:
1. Extract this ZIP (do not upload the ZIP itself).
2. Open your GitHub repository and remove or replace the previous website files.
3. Upload every file and folder inside the "karthik-portfolio" folder together.
4. Commit the upload. For GitHub Pages, ensure index.html is at repository root.

WHAT CHANGED:
- Merged page CSS into a small number of ordered bundles.
- Merged deferred page JavaScript into one script per page type.
- Inlined only the small synchronous theme initializer, preserving loading order.
- Eliminated byte-for-byte duplicate images, fonts, PDF and video files.
- Rewrote asset references to retained canonical locations.
- Preserved all project pages, certificates, media and public content used by site.
- Retained font and icon licenses (THIRD_PARTY_LICENSES.txt).

All images and videos remain in normal files, not data URI blobs.
The optimized site remains plain HTML/CSS/JavaScript: no npm/build tools needed.
