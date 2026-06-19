#!/usr/bin/env python3
import argparse
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import textwrap
import time

PLUGIN_NAME = "bixinho_krita_exporter"
OUTPUT_MARKER = ".bixinho-krita-export-dir"
DEFAULT_DPI = 300
DEFAULT_TIMEOUT_SECONDS = 180

PLUGIN_EXPORTER = r'''
import json
import os
import traceback

try:
    from PyQt6.QtCore import QCoreApplication, QRect, QTimer
except Exception:
    from PyQt5.QtCore import QCoreApplication, QRect, QTimer

from krita import Extension, InfoObject, Krita


def export_layers(parent_node, output_root, parent_dir, dpi):
    for node in parent_node.childNodes():
        node_name = node.name()
        new_dir = ""

        if node.type() == "grouplayer":
            new_dir = os.path.join(parent_dir, node_name)
            os.makedirs(os.path.join(output_root, new_dir), exist_ok=True)
        elif "filter" in node.type():
            continue
        else:
            file_format = "PNG"
            if "[jpeg]" in node_name:
                file_format = "jpeg"
            elif "[png]" in node_name:
                file_format = "png"

            layer_filename = os.path.join(output_root, parent_dir, f"{node_name}.{file_format}")
            node.save(layer_filename, dpi / 72.0, dpi / 72.0, InfoObject(), QRect())

        if node.childNodes():
            export_layers(node, output_root, new_dir, dpi)


def write_status(payload):
    status_path = os.environ.get("BIXINHO_EXPORT_STATUS")
    if status_path:
        with open(status_path, "w", encoding="utf-8") as status_file:
            json.dump(payload, status_file, ensure_ascii=False, indent=2)


class BixinhoKritaExporter(Extension):
    def __init__(self, parent):
        super().__init__(parent)

    def setup(self):
        load_status_path = os.environ.get("BIXINHO_EXPORT_LOAD_STATUS")
        if load_status_path:
            with open(load_status_path, "a", encoding="utf-8") as load_status:
                load_status.write("setup\n")
        QTimer.singleShot(1000, self.run_export)

    def createActions(self, window):
        pass

    def run_export(self):
        try:
            kra_path = os.environ["BIXINHO_KRA_PATH"]
            output_dir = os.environ["BIXINHO_EXPORT_DIR"]
            dpi = float(os.environ.get("BIXINHO_EXPORT_DPI", "300"))

            app = Krita.instance()
            app.setBatchmode(True)

            document = None
            for opened_document in app.documents():
                if os.path.abspath(opened_document.fileName()) == os.path.abspath(kra_path):
                    document = opened_document
                    break

            if document is None:
                document = app.openDocument(kra_path)

            if document is None:
                raise RuntimeError(f"nao foi possivel abrir: {kra_path}")

            app.setActiveDocument(document)
            document.waitForDone()

            document_name = os.path.splitext(os.path.basename(document.fileName() or kra_path))[0]
            output_root = os.path.join(output_dir, document_name)
            os.makedirs(output_root, exist_ok=True)

            export_layers(document.rootNode(), output_root, "", dpi)
            document.waitForDone()
            document.close()

            app.setBatchmode(True)
            write_status({"ok": True, "output_root": output_root})
        except BaseException as exc:
            write_status({
                "ok": False,
                "error": str(exc),
                "traceback": traceback.format_exc(),
            })
        finally:
            QTimer.singleShot(0, QCoreApplication.quit)
'''


def parse_args():
    parser = argparse.ArgumentParser(
        description="Exporta as layers de um .kra usando o Krita em batch."
    )
    parser.add_argument("kra_path", help="Arquivo .kra de entrada.")
    parser.add_argument("output_dir", help="Diretorio onde sera criada a pasta do arquivo.")
    parser.add_argument("--dpi", type=float, default=DEFAULT_DPI, help="DPI usado pelo node.save.")
    parser.add_argument(
        "--timeout",
        type=int,
        default=DEFAULT_TIMEOUT_SECONDS,
        help="Tempo maximo, em segundos, esperando o Krita terminar.",
    )
    return parser.parse_args()


def prepare_output_dir(output_dir, kra_path):
    output_path = Path(output_dir).resolve()
    output_path.mkdir(parents=True, exist_ok=True)

    marker_path = output_path / OUTPUT_MARKER
    has_contents = any(output_path.iterdir())
    if has_contents and not marker_path.exists():
        raise RuntimeError(
            f"{output_path} nao esta vazio e nao tem {OUTPUT_MARKER}; "
            "use uma pasta vazia ou uma pasta ja criada por este script."
        )

    marker_path.write_text("bixinho krita export\n", encoding="utf-8")

    export_root = output_path / Path(kra_path).stem
    if export_root.exists():
        if export_root.is_dir():
            shutil.rmtree(export_root)
        else:
            export_root.unlink()

    return output_path, export_root


def write_plugin(resource_dir):
    pykrita_dir = resource_dir / "pykrita"
    package_dir = pykrita_dir / PLUGIN_NAME
    package_dir.mkdir(parents=True, exist_ok=True)

    desktop = textwrap.dedent(
        f"""\
        [Desktop Entry]
        Type=Service
        ServiceTypes=Krita/PythonPlugin
        X-KDE-Library={PLUGIN_NAME}
        X-Krita-Manual=Manual.html
        X-Python-2-Compatible=false
        Name=Bixinho Krita Exporter
        Comment=Exporta layers do bichov.kra em batch
        """
    )
    init_py = textwrap.dedent(
        f"""\
        import os

        from krita import Krita
        from .exporter import BixinhoKritaExporter

        load_status_path = os.environ.get("BIXINHO_EXPORT_LOAD_STATUS")
        if load_status_path:
            with open(load_status_path, "a", encoding="utf-8") as load_status:
                load_status.write("init\\n")

        app = Krita.instance()
        app.addExtension(BixinhoKritaExporter(parent=app))
        """
    )

    (pykrita_dir / f"kritapykrita_{PLUGIN_NAME}.desktop").write_text(
        desktop, encoding="utf-8"
    )
    (package_dir / "__init__.py").write_text(init_py, encoding="utf-8")
    (package_dir / "exporter.py").write_text(PLUGIN_EXPORTER, encoding="utf-8")
    (package_dir / "Manual.html").write_text(
        "<html><body>Bixinho Krita Exporter</body></html>\n", encoding="utf-8"
    )


def write_krita_config(config_dir):
    config_dir.mkdir(parents=True, exist_ok=True)
    (config_dir / "kritarc").write_text(
        f"[python]\nenable_{PLUGIN_NAME}=true\n", encoding="utf-8"
    )


def choose_qt_platform(env):
    if env.get("QT_QPA_PLATFORM"):
        return env["QT_QPA_PLATFORM"]
    if env.get("WAYLAND_DISPLAY"):
        return "wayland"
    if env.get("DISPLAY"):
        return "xcb"
    return "offscreen"


def stop_process(process):
    if process.poll() is not None:
        return

    process.terminate()
    try:
        process.wait(timeout=5)
    except subprocess.TimeoutExpired:
        process.kill()
        process.wait(timeout=5)


def read_process_output(process):
    try:
        return process.communicate(timeout=5)
    except subprocess.TimeoutExpired:
        stop_process(process)
        return process.communicate(timeout=5)


def run_krita(kra_path, output_dir, dpi, timeout):
    temp = tempfile.mkdtemp(prefix="bixinho-krita-")
    cleanup_temp = True
    try:
        temp_dir = Path(temp)
        config_dir = temp_dir / "config"
        data_dir = temp_dir / "data"
        cache_dir = temp_dir / "cache"
        status_path = temp_dir / "status.json"
        load_status_path = temp_dir / "load-status.txt"

        write_plugin(data_dir / "krita")
        write_krita_config(config_dir)
        data_dir.mkdir(parents=True, exist_ok=True)
        cache_dir.mkdir(parents=True, exist_ok=True)

        env = os.environ.copy()
        env.update(
            {
                "QT_QPA_PLATFORM": choose_qt_platform(env),
                "XDG_CONFIG_HOME": str(config_dir),
                "XDG_DATA_HOME": str(data_dir),
                "XDG_CACHE_HOME": str(cache_dir),
                "BIXINHO_KRA_PATH": str(kra_path),
                "BIXINHO_EXPORT_DIR": str(output_dir),
                "BIXINHO_EXPORT_DPI": str(dpi),
                "BIXINHO_EXPORT_STATUS": str(status_path),
                "BIXINHO_EXPORT_LOAD_STATUS": str(load_status_path),
            }
        )

        command = [
            "krita",
            "--nosplash",
            str(kra_path),
        ]

        try:
            process = subprocess.Popen(
                command,
                env=env,
                text=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
            )
        except FileNotFoundError as exc:
            raise RuntimeError("krita nao foi encontrado no PATH.") from exc

        deadline = time.monotonic() + timeout
        while time.monotonic() < deadline:
            if status_path.exists() or process.poll() is not None:
                break
            time.sleep(0.25)
        else:
            cleanup_temp = False
            stop_process(process)
            stdout, stderr = read_process_output(process)
            raise RuntimeError(
                "krita demorou demais para exportar.\n"
                f"temp: {temp_dir}\n"
                f"stdout:\n{stdout}\n\nstderr:\n{stderr}"
            )

        if status_path.exists():
            stop_process(process)

        stdout, stderr = read_process_output(process)

        if not status_path.exists():
            cleanup_temp = False
            load_status = ""
            if load_status_path.exists():
                load_status = load_status_path.read_text(encoding="utf-8")
            raise RuntimeError(
                "krita terminou sem criar o status da exportacao.\n"
                f"temp: {temp_dir}\n"
                f"plugin-load-status:\n{load_status}\n"
                f"codigo: {process.returncode}\n"
                f"stdout:\n{stdout}\n\nstderr:\n{stderr}"
            )

        status = json.loads(status_path.read_text(encoding="utf-8"))
        if not status.get("ok"):
            cleanup_temp = False
            raise RuntimeError(status.get("traceback") or status.get("error"))

        if process.returncode not in (0, -15):
            cleanup_temp = False
            raise RuntimeError(
                "krita exportou, mas retornou erro.\n"
                f"temp: {temp_dir}\n"
                f"codigo: {process.returncode}\n"
                f"stdout:\n{stdout}\n\nstderr:\n{stderr}"
            )

        return Path(status["output_root"])
    finally:
        if cleanup_temp:
            shutil.rmtree(temp, ignore_errors=True)


def main():
    args = parse_args()
    kra_path = Path(args.kra_path).resolve()
    if not kra_path.exists():
        print(f"arquivo nao encontrado: {kra_path}", file=sys.stderr)
        return 2

    try:
        output_dir, _ = prepare_output_dir(args.output_dir, kra_path)
        output_root = run_krita(kra_path, output_dir, args.dpi, args.timeout)
    except RuntimeError as exc:
        print(str(exc), file=sys.stderr)
        return 1

    print(f"OK: exportacao criada em {output_root}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
