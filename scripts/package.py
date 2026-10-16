"""Create a deterministic offline minitool ZIP. Python 3 standard library only."""
import argparse
import hashlib
import json
from pathlib import Path
import zipfile

ROOT = Path(__file__).resolve().parents[1]
ALLOWED = {'.html', '.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.woff', '.woff2', '.json'}


def digest(content):
    return hashlib.sha256(content).hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--mode', choices=('public', 'brand'), default='public')
    args = parser.parse_args()
    dist = ROOT / 'dist' / args.mode
    out = ROOT / 'output'
    for folder in (ROOT / 'dist', dist, out):
        if folder.is_symlink() or (folder.exists() and folder.resolve() != folder):
            raise SystemExit('Refusing redirected output directory: ' + folder.name)
    out.mkdir(exist_ok=True)
    if not (dist / 'index.html').is_file():
        raise SystemExit('Build first: node scripts/build.cjs --mode ' + args.mode)
    files = sorted(p for p in dist.rglob('*') if p.is_file())
    if any(p.is_symlink() or not p.resolve().is_relative_to(dist) for p in dist.rglob('*')):
        raise SystemExit('Symlink or redirected path in dist')
    if any(p.suffix.lower() not in ALLOWED for p in files):
        raise SystemExit('Unexpected file type or symlink in dist')
    if len([p for p in files if p.suffix.lower() == '.html']) != 1:
        raise SystemExit('Exactly one HTML entry required')
    manifest = out / ('manifest-' + args.mode + '.json')
    if manifest.is_symlink():
        raise SystemExit('Refusing redirected manifest')
    expected = json.loads(manifest.read_text(encoding='utf-8'))
    entries = expected['files'] if isinstance(expected, dict) else expected
    expected_hashes = {e.get('file', e.get('path')): e['sha256'].lower() for e in entries}
    actual_hashes = {p.relative_to(dist).as_posix(): digest(p.read_bytes()) for p in files}
    if actual_hashes != expected_hashes:
        raise SystemExit('Dist differs from build manifest; rebuild and validate before packaging')
    version = json.loads((ROOT / 'package.json').read_text(encoding='utf-8'))['version']
    if not isinstance(version, str) or not version or any(c not in '0123456789.-' for c in version):
        raise SystemExit('Invalid package version')
    target = out / ('bagel-printer-picker-' + args.mode + '-v' + version + '.zip')
    if target.is_symlink():
        raise SystemExit('Refusing redirected ZIP target')
    with zipfile.ZipFile(target, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for p in files:
            name = p.relative_to(dist).as_posix()
            info = zipfile.ZipInfo(name, date_time=(2026, 10, 17, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.create_system = 3
            info.external_attr = 0o100644 << 16
            archive.writestr(info, p.read_bytes(), compresslevel=9)
    with zipfile.ZipFile(target) as archive:
        zipped = {name: digest(archive.read(name)) for name in archive.namelist()}
        if zipped != actual_hashes or archive.testzip() is not None:
            raise SystemExit('ZIP read-back verification failed')
    if target.stat().st_size > 10 * 1024 * 1024:
        raise SystemExit('ZIP exceeds platform 10 MiB limit')
    report = {
        'mode': args.mode, 'file': target.name, 'bytes': target.stat().st_size,
        'sha256': digest(target.read_bytes()), 'entries': len(zipped),
        'allHashesMatch': True, 'rootIndex': 'index.html' in zipped,
        'warning': 'Exceeds suggested 2 MiB target' if target.stat().st_size > 2 * 1024 * 1024 else None,
        'platformSimulator': 'PENDING', 'android': 'PENDING', 'ios': 'PENDING',
    }
    (out / ('zip-verification-' + args.mode + '.json')).write_text(json.dumps(report, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    print(json.dumps(report, ensure_ascii=True))


if __name__ == '__main__':
    main()
