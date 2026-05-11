from __future__ import annotations

from jinja2 import Environment, FileSystemLoader, select_autoescape


class PromptManager:
    def __init__(self, base_path: str) -> None:
        self.env = Environment(
            loader=FileSystemLoader(base_path),
            autoescape=select_autoescape([]),
            trim_blocks=True,
            lstrip_blocks=True,
        )

    def render(self, template_name: str, **kwargs) -> str:
        template = self.env.get_template(template_name)
        return template.render(**kwargs)
