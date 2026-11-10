extends VBoxContainer

func _ready() -> void:
	add_theme_constant_override("separation", 24)
	UI.paragraph(self, "Live details reported by this device. Browser privacy rules can hide hardware information.")
	var device: String = OS.get_model_name()
	var memory: Dictionary = OS.get_memory_info()
	var renderer: String = str(ProjectSettings.get_setting("rendering/renderer/rendering_method", "gl_compatibility"))
	var values: Dictionary = {
		"Operating system": OS.get_name() + " " + OS.get_version(),
		"Device model": device if not device.is_empty() else "Not exposed by platform",
		"Screen size": str(DisplayServer.screen_get_size()) if DisplayServer.get_name() != "headless" else "Headless / not available",
		"Viewport": str(get_viewport_rect().size),
		"Godot version": str(Engine.get_version_info().get("string", "unknown")),
		"Renderer": renderer + " / " + DisplayServer.get_name(),
		"Physical memory": _memory_label(int(memory.get("physical", -1))),
		"Available memory": _memory_label(int(memory.get("available", -1))),
		"Process static memory": _memory_label(int(OS.get_static_memory_usage())),
		"Storage sandbox": "user:// (BlackNodeLauncher)"
	}
	for key: String in values:
		var row: VBoxContainer = UI.card(self)
		row.add_child(UI.label(key.to_upper(), 25, App.accent))
		row.add_child(UI.label(str(values[key]), 33))

func _memory_label(value: int) -> String:
	return "Not available on this platform" if value <= 0 else "%.1f MiB" % (float(value) / 1048576.0)
