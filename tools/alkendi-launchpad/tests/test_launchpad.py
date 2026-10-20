import contextlib
import io
import json
import tempfile
import unittest
import zipfile
from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import launchpad

class LaunchpadTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.workspace = Path(self.tmp.name)
    def create(self, slug='demo-site', kind='client'):
        with contextlib.redirect_stdout(io.StringIO()):
            launchpad.main(['new', '--name', 'Demo & Company', '--slug', slug, '--kind', kind, '--workspace', str(self.workspace)])
        return self.workspace / slug
    def test_client_private_repository_and_policy(self):
        root = self.create()
        d = json.loads((root/'alkendi.project.json').read_text())
        self.assertEqual(d['repository'], 'Amankendi/client-demo-site')
        self.assertEqual(d['deploy_policy'], 'manual-owner-approval')
        self.assertIn('Demo &amp; Company', (root/'public/index.html').read_text())
    def test_internal_project_separate(self):
        root = self.create(kind='internal')
        d = json.loads((root/'alkendi.project.json').read_text())
        self.assertEqual(d['repository'], 'Amankendi/alkendi-demo-site')
    def test_doctor_source_only(self):
        root = self.create()
        with contextlib.redirect_stdout(io.StringIO()) as buf:
            launchpad.main(['doctor', str(root)])
        self.assertEqual(json.loads(buf.getvalue())['status'], 'PASS_SOURCE_ONLY')
    def test_export_excludes_env_and_git_and_handover(self):
        root = self.create()
        (root/'.env').write_text('DANGEROUS=abcd')
        (root/'.git').mkdir()
        (root/'.git'/'config').write_text('internal')
        (root/'public'/'private.key').write_text('secret')
        with contextlib.redirect_stdout(io.StringIO()):
            launchpad.main(['export', str(root), '--out', str(self.workspace/'exports')])
        z = self.workspace/'exports/demo-site-source-handover.zip'
        with zipfile.ZipFile(z) as archive:
            names = archive.namelist()
            self.assertTrue(any(n.endswith('HANDOVER-MANIFEST.json') for n in names))
            self.assertFalse(any('.env' in n or '/.git/' in n or n.endswith('.key') for n in names))
        self.assertTrue((self.workspace/'exports/demo-site-source-handover.zip.sha256').exists())
    def test_block_possible_leaked_secret(self):
        root = self.create()
        (root/'public'/'oops.txt').write_text('github_pat_dont_share')
        with self.assertRaises(ValueError):
            launchpad.scan(root)
    def test_block_duplicate(self):
        self.create()
        with self.assertRaises(ValueError):
            launchpad.new(type('A', (), {'slug':'demo-site','workspace':str(self.workspace),'name':'Again','kind':'client'})())
    def test_remote_dry_run_does_not_create_git(self):
        root = self.create()
        with contextlib.redirect_stdout(io.StringIO()):
            launchpad.main(['github', str(root)])
            launchpad.main(['deploy', str(root)])
        self.assertFalse((root/'.git').exists())
    def test_reject_unsafe_slug(self):
        with self.assertRaises(ValueError):
            launchpad.slug_checked('../../other')

if __name__ == '__main__':
    unittest.main()
