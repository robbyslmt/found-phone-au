# Found Phone AU Library

Interactive found phone fan fiction for the web. The reader unlocks a fictional idol's phone with a PIN and experiences the story by snooping through it: chats, photos, notes, voice memos, music, calendar, wallet, and more. This repository is the deployable package of that site, plus the project handoff notes.

**Live beta (the link to share): https://found-phone-au.vercel.app**

Status as of 2026-10-23: feature complete, publicly deployed, in beta testing with friends.

## The original intent and goal

Robby (the owner) found the format at wonbin-phone.pages.dev, an interactive story told through a simulated iPhone, and wanted to recreate it as an original work with his own stories, fixing everything the original left fake. The full design blueprint lives in his workspace at `~/workspace/au-corner/Wonbin_Phone_AU_Blueprint.md` (21 sections: reader flow, app by app breakdown, recreation data model, story designs).

The goal: a small library of playable found phone stories (a Netflix style "Whose phone do you want to unlock?" selection screen), where every story is a full phone with working apps, a scripted chat that reacts to the reader, hidden clues to collect, and an ending, with progress saved per reader in their own browser.

### Rules the owner set, non negotiable

1. Every feature that looks tappable must actually work. Cosmetic or inert UI is a defect, not a style choice.
2. More apps and small realistic features than the format's origin, each with a story job or a real interaction.
3. App icons faithful to iOS, including the correct frosted dock (Phone, Safari, iMessage, Music) and KakaoTalk as its own yellow app.
4. No real photos of the artists, ever. Character portraits are fictional stand ins. Every image and video must come from a named free licence library (Pexels, Pixabay, Unsplash, Wikimedia Commons) with creator, source page, and licence recorded, and the in app Credits & About sheet must list every shipped asset, one entry per file, cross checked to match exactly.
5. Never invent a fact about the real artists. All chats, photos, calls, and stories are invented fiction, labeled as such (see the disclaimer at the bottom).

## The stories

| Story | Phone owner | PIN | Premise |
|---|---|---|---|
| Taekook, "Do Not Disturb" | Jungkook | 1230 (Taehyung's birthday, Dec 30) | University dorm roommates with opposite sleep problems. Sleep Focus lets only Taehyung through. Climax: a 2 AM FaceTime that breaks the Focus. Hook: two gallery exhibition tickets in Wallet |
| MaHae, "Two Time Zones" | Mark Lee | 0606 (Haechan's birthday, Jun 6) | University radio station. World Clock Seoul and Toronto is a real story feature. Climax: a live on air call. Wallet holds boarding passes to Toronto for both of them |
| Haechan x Ningning, "Duet, Take 7" | Haechan | 1023 (Ningning's birthday, Oct 23) | Vocal major rivals forced into a showcase duet. Separate universe from the MaHae story, labeled as such in app. Climax: playable Voice Memo takes 1 to 6, then Take 7 unlocks in Music |
| Partner POV (bonus, Taekook) | Taehyung | 0901 (Jungkook's birthday, Sep 1) | Taehyung's phone, unlocked only after finishing Jungkook's story. Mirror chat, his unsent drafts, his own clue set |
| Seasonal epilogue (bonus, Taekook) | Jungkook | n/a | "Exhibition Day", a short December chapter unlocked by finishing the main Taekook story. The Wallet tickets finally get used |

## Platform features

- Library selection screen with filters (pairing, trope), search, My List bookmarks, per story progress, and a Continue row.
- PIN entry in two modes: Easy (PIN shown) and Detective (only a riddle). Wrong PIN shakes with red dots and an attempt counter, hint after 3 fails.
- Detective Journal: 6 clues per main story plus 4 for the Partner POV, collected only when the reader actually finds them, with a detective score on the completion sheet.
- Chapters as Days on each story's detail sheet, deep linking into the chat at the chapter start.
- Live ambient incoming chats in every story: timed and exploration triggered message banners that deep link into the thread, persisted per story, never duplicated after reload.
- Shareable story cards on completion: a generated card image with Download PNG and Copy Summary.
- Platform UI in 7 languages, saved across stories. Story content itself is English, badged honestly in app.
- Per story saves in the reader's browser (localStorage). Save keys and schemas are frozen: testers lose progress if they change. Known keys include the platform key `fpau.platform.v1` and per story keys such as `dnd-taekook-v1` and `dnd-mahae-v1`, plus their equivalents for Duet and the POV phone.

## Architecture of this repository

The site was built as a Muse web artifact (slug `do-not-disturb-taekook-phone-au`, the source of truth for all content). This repo holds a static packaging of it, produced because the publishing routes available had hard limits (details under Publishing constraints):

| File | Role |
|---|---|
| `index.html` | The whole app (about 356 KB of HTML, CSS, and JS). Media references point at `assets/...` paths. A small injected bootstrap registers the service worker and reloads once on first visit so all asset requests resolve through it |
| `sw.js` | Service worker runtime (about 1 KB). Loads the store chunks with importScripts, intercepts requests to `assets/`, decodes the stored bytes, responds with the correct content type, and caches each asset after first use |
| `store-1.js` to `store-7.js` | The media store: all 42 assets (38 photos, 4 videos, about 10.3 MB decoded) as base64 data URIs in a JS map, split into chunks of roughly 2.7 MB each so each push stays under the transport limit |
| `README.md` | This file |

The 42 media files are byte identical to the artifact's assets. Every media reference in `index.html` matches a store key exactly (verified programmatically before every push).

## Current state

### Code and content
- Phases 1 to 3 are complete, plus a repair pass: 3 playable stories, Partner POV phone, chapters, story cards, seasonal epilogue.
- Image provenance audit passed: 42 shipped assets, 42 Credits entries, zero missing, zero extra. Sources: 41 files under the Pexels License, and the cheese tteokbokki photo from Wikimedia Commons under CC BY SA 2.0, all recorded in the in app Credits & About sheet.
- The Duet completion bug found in Phase 3 testing (story stalled at 60 percent after Take 7) was fixed at its root: the completion check tested an object property on a string story id, so it always took the offline branch.

### This repo
- Created 2026-10-23 as a public GitHub user site repo, filled by 4 pushes (the initial 14 MB single push was rejected by the server with a 413, so the store was chunked):
  - `722fd1b` Initial commit (owner, GitHub web)
  - `c0f17fc` Page, worker, readme, store 1
  - `3a660c0` Store 2 and 3
  - `04d3639` Store 4 and 5
  - `bfed8a1` Store 6 and 7
- Renamed by the owner on 2026-10-23 to `found-phone-au`. The rename killed the GitHub Pages user site (a user site only exists under the account named repo). That was accepted on purpose: the public face is Vercel now, and no public address should carry the owner's username. GitHub Pages is not enabled on this repo; enabling it would need a manual Settings toggle (no API tool exists in the owner's connector set) and would publish at a path under the account name anyway.

### Live deployment (Vercel)
- Project: `found-phone-au`, project id `prj_tVbI4I429rrTrEgBy6sC25VtXTAs`, under the owner's directions-projects team.
- Production address: **https://found-phone-au.vercel.app** (aliases also exist on the team domain). Nothing in the address references the owner.
- Deployments are created from this repo's `main` branch through the Vercel connector's gitSource deployment (the project is not GitHub linked in the dashboard sense, deployments are triggered per commit on request).
- Deployment protection: SSO protection was on by default and blocked anonymous visitors with a Vercel login page. It was disabled at project level on 2026-10-23 and the site redeployed; the production address now serves the app to logged out visitors (verified by anonymous fetch).
- A fresh deployment from the renamed repo was triggered right after the rename to prove the pipeline still works with the new repo name.

## Verification status and open findings

Verified live on the deployed site (browser test, 2026-10-23): library landing renders with all 3 story card covers as real photos; Taekook unlocks with PIN 1230 and the home screen renders fully; KakaoTalk scripted send, timed replies, notification banners, and avatars all work; every image loaded through the service worker with zero console errors and zero 404s.

Open findings, do not treat as settled:
1. PIN pad clicks: automated testers report the PIN digits not responding to synthetic mouse clicks (keyboard entry works, and it is a shipped feature). The same report appeared with the very first build and was traced to the test harness itself. A real touch check by the owner on his phone is the decisive test and is still pending. If real taps fail, treat it as a genuine lock screen overlay bug and fix it before wide sharing.
2. Reels location: a browser tester found no video element in the Taekook phone's Instagram (6 image posts, 4 image highlights). Earlier build probes did play a real stock video reel. Whether the reels live on another surface (the other story's phone, a feed view) or the Taekook reel surface regressed is unresolved. Pin this down before adding more video.

## Publishing constraints (learned the hard way, all retested live 2026-10-21 to 23)

- The Muse artifact Share action fails for this artifact with a generic "can't be shared at this time", no reason given, after multiple attempts. Do not plan around it.
- The owner's GitHub App integration cannot create repositories (403 "Resource not accessible by integration", 4 attempts) and exposes no Pages settings tool and no rename tool. Repo creation, renames, and Pages toggles are owner only actions in the GitHub web UI. Read and write access inside existing repos is fully granted (all repositories selected).
- GitHub pushes through the connector are text only. The snapshot validator allows up to 16 MiB total, but the transport rejected a 14 MB request with HTTP 413. Keep each push at roughly 5 MB or less, grouped logically, and record each confirmed push in the sync record file described below. Binary files cannot be pushed through the connector at all, which is why the media lives in the JS store.
- Vercel through the connector: calls that name the team id explicitly fail with a 403 scope error (the connection lacks a write grant for the directions-projects team scope; only the owner can grant it). Calls on the connection's default scope work: create_project, update_project, and create_deployment all succeeded that way. create_git_project cannot be used because it requires the team id. The upload_file tool is unusable for real assets: file data travels as a command line argument and dies with "Argument list too long" past roughly 96 KB of binary.
- There is no authenticated `gh` or `vercel` CLI on the owner's agent machine, and agent rules forbid asking the owner for tokens or passwords in chat.

## How to update the site

1. Edit the Muse artifact (slug above). It is the source of truth. Do not hand edit the generated package as the primary copy.
2. Export the artifact to a single self contained HTML file.
3. Rebuild the staging folder: extract every inlined data URI into an asset file, deduplicated by content hash, and rewrite the page's references to `assets/<name>` paths.
4. Rebuild this package from staging: inject the service worker bootstrap into `index.html` right after the opening head tag, regenerate `sw.js` and the `store-N.js` chunks from the asset files (about 2.7 MB of base64 per chunk, correct content types: image/jpeg, video/mp4).
5. Validate before pushing: every `assets/` reference in `index.html` exists as a store key and vice versa, every payload decodes byte identical to its staging asset, `node --check` passes on `sw.js` and every chunk, and the per push totals stay near 5 MB.
6. Push with the GitHub connector's push_files in grouped commits, and append each confirmed commit (SHA and exact paths) to the sync record at `~/workspace/au-corner/pages-package.muse-github-snapshot-sync.json` (the local package source is `~/workspace/au-corner/pages-package/`; local staging is `~/workspace/au-corner/deploy-staging/`). Never advance the record for a failed or unconfirmed push.
7. Redeploy Vercel: create_deployment on the connection's default scope (no team id), name `found-phone-au`, target production, gitSource github with this repo and ref `main`. Wait for state READY, then fetch https://found-phone-au.vercel.app anonymously and confirm the app answers instead of a Vercel login page. If a login page appears, the project's SSO protection was re enabled; set `ssoProtection` to null via update_project and redeploy.
8. Run a real browser pass: library covers, one unlock per story you touched, one chat flow, one reel. Report what was driven live versus only code reviewed.

Other working files in the owner's workspace: the design blueprint at `~/workspace/au-corner/Wonbin_Phone_AU_Blueprint.md`, and a ready made zip of the folder package (index.html plus real asset files, for drag and drop hosts) at `~/workspace/your_files/found-phone-au-beta.zip`.

## Handoff checklist for the next agent

- Read this file fully before touching anything. Then read the blueprint if you need story or design intent.
- Respect the owner's rules above, especially: no artist photos, credits stay one to one with shipped assets, save keys and PINs do not change, nothing goes to a public channel without the owner's explicit approval.
- Verify live state before claiming anything works. The owner tests claims and remembers corrections.
- Current open items, in order: (1) owner's real touch PIN check, (2) pin down where the reels live, (3) beta feedback from friends testing at the Vercel address.

## Credits and disclaimer

Unofficial fan fiction. All chats, photos, calls and stories here are invented. This project is not affiliated with or endorsed by the artists or their agencies. Character portraits are fictional stand ins: the people pictured are not the artists named in the stories.

Image and video credits, with creator, source page, and licence for every file, live inside the app under Credits & About and are part of the shipped product. Keep them in sync with the shipped assets on every update.
