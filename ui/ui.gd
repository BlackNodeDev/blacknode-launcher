class_name UI
extends RefCounted
## Shared, original system styling. All sizes are in 1080-wide design pixels.
const BG: Color = Color("080b10")
const SURFACE: Color = Color("11171f")
const BORDER: Color = Color("26313c")
const TEXT: Color = Color("eef4f7")
const MUTED: Color = Color("91a2b2")

static func font_size(value: int) -> int:
	return roundi(value * App.ui_scale)

static func label(text: String, size_value: int = 36, color: Color = TEXT) -> Label:
	var node := Label.new()
	node.text = text
	node.add_theme_font_size_override("font_size", font_size(size_value))
	node.add_theme_color_override("font_color", color)
	node.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	node.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	return node

static func box(color: Color = SURFACE, radius: int = 30) -> StyleBoxFlat:
	var style := StyleBoxFlat.new()
	style.bg_color = color
	style.border_color = BORDER
	style.set_border_width_all(2)
	style.set_corner_radius_all(radius)
	style.content_margin_left = 32
	style.content_margin_right = 32
	style.content_margin_top = 28
	style.content_margin_bottom = 28
	return style

static func button(text: String, action: Callable, accented: bool = false) -> Button:
	var node := Button.new()
	node.text = text
	node.custom_minimum_size.y = 112
	node.add_theme_font_size_override("font_size", font_size(34))
	node.add_theme_color_override("font_color", App.accent if accented else TEXT)
	node.add_theme_stylebox_override("normal", box(SURFACE, 22))
	node.add_theme_stylebox_override("hover", box(Color("1c2933"), 22))
	node.add_theme_stylebox_override("pressed", box(Color("223b37"), 22))
	var focus := box(SURFACE.lightened(0.08), 22)
	focus.border_color = App.accent
	node.add_theme_stylebox_override("focus", focus)
	node.pressed.connect(action)
	return node

static func column(parent: Node, separation: int = 24) -> VBoxContainer:
	var node := VBoxContainer.new()
	node.add_theme_constant_override("separation", separation)
	node.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	parent.add_child(node)
	return node

static func card(parent: Node) -> VBoxContainer:
	var panel := PanelContainer.new()
	panel.add_theme_stylebox_override("panel", box())
	parent.add_child(panel)
	return column(panel)

static func paragraph(parent: Node, text: String) -> Label:
	var node: Label = label(text, 33, MUTED)
	parent.add_child(node)
	return node

static func editor(text: String, min_height: float = 640) -> TextEdit:
	var node := TextEdit.new()
	node.text = text
	node.editable = false
	node.wrap_mode = TextEdit.LINE_WRAPPING_BOUNDARY
	node.custom_minimum_size.y = min_height
	node.add_theme_font_size_override("font_size", font_size(29))
	node.add_theme_color_override("font_color", TEXT)
	node.add_theme_stylebox_override("normal", box(BG, 20))
	node.size_flags_vertical = Control.SIZE_EXPAND_FILL
	return node
