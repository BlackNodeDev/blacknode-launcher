extends VBoxContainer

var feedback: Label

func _ready() -> void:
	add_theme_constant_override("separation", 30)
	var appearance: VBoxContainer = UI.card(self)
	appearance.add_child(UI.label("Make it yours.", 48))
	UI.paragraph(appearance, "Appearance is stored on this device, not in your account.")
	appearance.add_child(UI.label("Accent colour", 35))
	var colors := GridContainer.new()
	colors.columns = 2
	colors.add_theme_constant_override("h_separation", 16)
	colors.add_theme_constant_override("v_separation", 16)
	appearance.add_child(colors)
	var palettes: Dictionary = {"Mint": Color("67e8b2"), "Ice": Color("73caff"), "Lilac": Color("bc9bff"), "Amber": Color("ffc777")}
	for name_value: String in palettes:
		var color: Color = palettes[name_value]
		var active: String = "  ✓" if App.accent.is_equal_approx(color) else ""
		var item: Button = UI.button(name_value + active, _save.bind(color, App.ui_scale))
		item.add_theme_color_override("font_color", color)
		item.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		colors.add_child(item)
	appearance.add_child(UI.label("UI scale", 35))
	var sizes := OptionButton.new()
	sizes.custom_minimum_size.y = 112
	sizes.add_theme_font_size_override("font_size", UI.font_size(34))
	sizes.get_popup().add_theme_font_size_override("font_size", UI.font_size(34))
	sizes.get_popup().add_theme_constant_override("v_separation", 30)
	for item: String in ["Compact · 85%", "Default · 100%", "Large · 115%"]:
		sizes.add_item(item)
	var selected: int = 0 if App.ui_scale < 0.95 else (2 if App.ui_scale > 1.05 else 1)
	sizes.select(selected)
	sizes.item_selected.connect(_scale_selected)
	appearance.add_child(sizes)
	feedback = UI.paragraph(self, "Saved automatically to user://settings.cfg")
	var storage: VBoxContainer = UI.card(self)
	storage.add_child(UI.label("Local by design", 35, App.accent))
	UI.paragraph(storage, "No telemetry. No sign-in. No bundled apps.\nFactory settings affect only BlackNode Launcher.")

func _scale_selected(index: int) -> void:
	var scales: Array[float] = [0.85, 1.0, 1.15]
	_save(App.accent, scales[index])

func _save(color: Color, scale_value: float) -> void:
	var error: Error = App.set_appearance(color, scale_value)
	if error != OK:
		feedback.text = "Could not save settings: " + error_string(error)
