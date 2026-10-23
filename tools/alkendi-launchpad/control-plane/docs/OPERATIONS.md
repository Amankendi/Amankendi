# ALKENDI Launchpad — Owner operating manual

## Daily use

1. Log into the protected control panel using your preconfigured owner identity. This is a **single account** rather than individual provider logins on each project.
2. Select **مشروعي** or **مشروع عميل**. Enter project name, English slug, and any creative brief in Arabic. Press **إنشاء مستودع خاص**.
3. The project's private repository contains a real starter and `docs/01_PROJECT_MASTER_SPEC.md` for the design/build agent. Ask ChatGPT/your approved coder to implement the actual design there, test and open a PR. Merge only after owner review.
4. Open project details and select **اعتماد نسخة**. The exact currently reviewed code SHA is stored. If the code changes, reapprove.
5. Select **اطلب النشر**. This sends a GitHub workflow request to the single, permissioned deployment broker; **not** instant publication. Verify Actions logs, link and live HTTP smoke test.
6. For customer delivery select **تصدير للعميل**. A ZIP is generated, but H01–H10 outputs, source rights and infrastructure transfer remain pending until independently verified and signed.

## Handling a problem

- **401:** Access JWT absent/invalid, not a dashboard bug. Review domain routing, Access login and email allowlist.
- **503:** one-time setup missing, missing secret or D1/ASSETS binding.
- **409 on create:** repo already exists; do not overwrite. Review metadata and recover manually.
- **409 on deploy:** SHA changed; inspect new PR and reapprove.
- **Dispatch request accepted but no live site:** inspect central Actions workflow, environment approval, Cloudflare token, worker build, GitHub failure logs. Do not report success without actual endpoint proof.
- **409 on export:** detected possible secret; rotate it if exposed and remove from Git history as needed before external handoff.

## Isolation and exit

Each new project has a private repo, independent Worker name, and no shared private data. Customers can obtain a source-only ZIP or a later GitHub repository transfer plus signed H01–H10 documents. Do not transfer your Launchpad central deployment tokens or your own GitHub account credentials.
