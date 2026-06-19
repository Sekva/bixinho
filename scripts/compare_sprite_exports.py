#!/usr/bin/env python3
import hashlib
import os
import sys

try:
    from PIL import Image
except ImportError:
    Image = None


def list_files(root):
    files = {}
    for current_root, _, filenames in os.walk(root):
        for filename in filenames:
            full_path = os.path.join(current_root, filename)
            rel_path = os.path.relpath(full_path, root)
            files[rel_path] = full_path
    return files


def image_digest(path):
    with Image.open(path) as image:
        normalized = image.convert("RGBA")
        digest = hashlib.sha256()
        digest.update(str(normalized.size).encode("utf-8"))
        digest.update(normalized.tobytes())
        return normalized.size, digest.hexdigest()


def compare(expected_root, actual_root):
    expected = list_files(expected_root)
    actual = list_files(actual_root)

    missing = sorted(set(expected) - set(actual))
    extra = sorted(set(actual) - set(expected))
    changed = []

    for rel_path in sorted(set(expected) & set(actual)):
        expected_size, expected_digest = image_digest(expected[rel_path])
        actual_size, actual_digest = image_digest(actual[rel_path])

        if expected_size != actual_size or expected_digest != actual_digest:
            changed.append((rel_path, expected_size, actual_size))

    return missing, extra, changed


def main():
    if len(sys.argv) != 3:
        print("uso: compare_sprite_exports.py <recursos/imagens/bichov> <exportacao/bichov>", file=sys.stderr)
        return 2

    if Image is None:
        print("Pillow nao esta instalado. Instale o pacote python-pillow para comparar PNGs.", file=sys.stderr)
        return 2

    expected_root = os.path.abspath(sys.argv[1])
    actual_root = os.path.abspath(sys.argv[2])

    if not os.path.isdir(expected_root):
        print(f"diretorio esperado nao existe: {expected_root}", file=sys.stderr)
        return 2

    if not os.path.isdir(actual_root):
        print(f"diretorio exportado nao existe: {actual_root}", file=sys.stderr)
        return 2

    missing, extra, changed = compare(expected_root, actual_root)

    if not missing and not extra and not changed:
        print("OK: exportacao igual aos sprites atuais.")
        return 0

    print("Exportacao diferente dos sprites atuais.")

    if missing:
        print(f"\nArquivos faltando ({len(missing)}):")
        for rel_path in missing[:50]:
            print(f"  - {rel_path}")

    if extra:
        print(f"\nArquivos extras ({len(extra)}):")
        for rel_path in extra[:50]:
            print(f"  - {rel_path}")

    if changed:
        print(f"\nArquivos diferentes ({len(changed)}):")
        for rel_path, expected_size, actual_size in changed[:50]:
            print(f"  - {rel_path}: atual={expected_size}, exportado={actual_size}")

    return 1


if __name__ == "__main__":
    raise SystemExit(main())
