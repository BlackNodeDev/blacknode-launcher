extends Control

var body: VBoxContainer
var clock: Label
var current_id: String = ""
var program_node: Control
var registry: Array[Dictionary] = []
var status_timer: Timer

func _ready() -> void:
	get_tree().quit_on_go_back = false
	RenderingServer.set_default_clear_color(UI.BG)
	_load_registry()
	App.settings_changed.connect(_appearance_changed)
	_show_boot()
	await get_tree().create_timer(0.65).timeout
	show_home()
	status_timer = Timer.new()
	status_timer.wait_time = 1.0
	status_timer.timeout.connect(_tick_clock)
	add_child(status_timer)
	status_timer.start()
	var args: PackedStringArray = OS.get_cmdline_user_args()
	if OS.is_debug_build() and "--self-test" in args:
		var suite: Node = load("res://tests/test_suite.gd").new()
		get_tree().root.add_child(suite)
		suite.run(self)
	elif OS.is_debug_build() and ("--screenshot-home" in args or "--screenshot-settings" in args):
		if "--screenshot-settings" in args:
			open_program("settings")
		await get_tree().process_frame
		await RenderingServer.frame_post_draw
		var filename: String = "settings.png" if "--screenshot-settings" in args else "home.png"
		var path: String = "/workspace/blacknode-launcher-shots/" + filename
		var result: Error = get_viewport().get_texture().get_image().save_png(path)
		print("SCREENSHOT %s: %s" % [path, error_string(result)])
		get_tree().quit(0 if result == OK else 1)

func _load_registry() -> void:
	var data: Dictionary = App.read_json("res://programs.json")
	var items: Variant = data.get("programs", [])
	if items is not Array:
		return
	for entry: Variant in items:
		if entry is Dictionary and entry.has("id") and entry.has("scene"):
			registry.append(entry)

func _clear() -> void:
	for child: Node in get_children():
		if child != status_timer:
			remove_child(child)
			child.queue_free()
	program_node = null
	clock = null

func _show_boot() -> void:
	_clear()
	var center := CenterContainer.new()
	center.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	add_child(center)
	var stack: VBoxContainer = UI.column(center, 24)
	var mark: Label = UI.label("BLACKNODE", 84, App.accent)
	mark.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	stack.add_child(mark)
	var caption: Label = UI.label("SYSTEM INITIALISING  /  FACTORY", 27, UI.MUTED)
	caption.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	stack.add_child(caption)

func _shell(title: String, is_home: bool) -> void:
	_clear()
	var system_theme := Theme.new()
	system_theme.default_font_size = UI.font_size(34)
	theme = system_theme
	var margin := MarginContainer.new()
	margin.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	for side: String in ["left", "right"]:
		margin.add_theme_constant_override("margin_" + side, 56)
	margin.add_theme_constant_override("margin_top", 56)
	margin.add_theme_constant_override("margin_bottom", 48)
	add_child(margin)
	var outer: VBoxContainer = UI.column(margin, 36)
	var status := HBoxContainer.new()
	outer.add_child(status)
	clock = UI.label("", 29, UI.MUTED)
	status.add_child(clock)
	var version_label: Label = UI.label("v%s  /  FACTORY" % App.version_string(), 27, App.accent)
	version_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
	status.add_child(version_label)
	_tick_clock()
	var header: VBoxContainer = UI.column(outer, 10)
	header.add_child(UI.label("BLACKNODE", 62, UI.TEXT))
	header.add_child(UI.label(title, 31, App.accent))
	var separator := HSeparator.new()
	outer.add_child(separator)
	var scroll := ScrollContainer.new()
	scroll.size_flags_vertical = Control.SIZE_EXPAND_FILL
	scroll.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	outer.add_child(scroll)
	body = UI.column(scroll, 28)
	var footer := HBoxContainer.new()
	footer.add_theme_constant_override("separation", 20)
	outer.add_child(footer)
	if not is_home:
		var back: Button = UI.button("‹  Home", show_home, true)
		back.custom_minimum_size.x = 240
		footer.add_child(back)
	var footer_label: Label = UI.label("SYSTEM ONLY  ·  NO APPS" if is_home else "BLACKNODE  /  SYSTEM", 25, UI.MUTED)
	footer_label.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	footer_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
	footer.add_child(footer_label)

func _tick_clock() -> void:
	if is_instance_valid(clock):
		var time: Dictionary = Time.get_time_dict_from_system()
		clock.text = "%02d:%02d" % [time.hour, time.minute]

func show_home() -> void:
	current_id = ""
	_shell("Your workspace starts here.", true)
	var banner: VBoxContainer = UI.card(body)
	banner.add_child(UI.label("FACTORY / 001", 29, App.accent))
	banner.add_child(UI.label("A clean foundation.", 55))
	UI.paragraph(banner, "Only the essentials. No apps, no clutter.\nReady for what you build next.")
	var heading := HBoxContainer.new()
	body.add_child(heading)
	heading.add_child(UI.label("System programs", 37))
	var count: Label = UI.label("%02d INSTALLED" % registry.size(), 25, UI.MUTED)
	count.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
	heading.add_child(count)
	var grid := GridContainer.new()
	grid.columns = 2
	grid.add_theme_constant_override("h_separation", 22)
	grid.add_theme_constant_override("v_separation", 22)
	body.add_child(grid)
	for entry: Dictionary in registry:
		var tile: Button = UI.button("", open_program.bind(str(entry.id)))
		tile.custom_minimum_size = Vector2(0, 270)
		tile.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		grid.add_child(tile)
		var inset := MarginContainer.new()
		inset.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
		inset.mouse_filter = Control.MOUSE_FILTER_IGNORE
		for side: String in ["left", "right", "top", "bottom"]:
			inset.add_theme_constant_override("margin_" + side, 30)
		tile.add_child(inset)
		var content: VBoxContainer = UI.column(inset, 12)
		content.mouse_filter = Control.MOUSE_FILTER_IGNORE
		var glyph: Label = UI.label(str(entry.get("glyph", "+")), 43, App.accent)
		content.add_child(glyph)
		content.add_child(UI.label(str(entry.get("name", entry.id)), 36))
		content.add_child(UI.label(str(entry.get("description", "System program")), 27, UI.MUTED))
		for child: Control in content.get_children():
			child.mouse_filter = Control.MOUSE_FILTER_IGNORE
	App.log_event("NAV", "Home")

func open_program(id: String) -> void:
	for entry: Dictionary in registry:
		if str(entry.id) != id:
			continue
		var scene_path: String = str(entry.scene)
		if not scene_path.begins_with("res://programs/") or not ResourceLoader.exists(scene_path):
			App.log_event("ERROR", "Missing system program: " + id)
			return
		var resource: Resource = load(scene_path)
		if resource is not PackedScene:
			return
		current_id = id
		_shell(str(entry.get("name", id)) + "  /  SYSTEM", false)
		program_node = resource.instantiate() as Control
		if program_node != null:
			body.add_child(program_node)
		App.log_event("NAV", "Opened " + id)
		return

func _appearance_changed() -> void:
	call_deferred("_refresh")

func _refresh() -> void:
	if current_id.is_empty():
		show_home()
	else:
		open_program(current_id)

func _unhandled_input(event: InputEvent) -> void:
	if event.is_action_pressed("ui_cancel"):
		show_home()
		get_viewport().set_input_as_handled()

func _notification(what: int) -> void:
	if what == NOTIFICATION_WM_GO_BACK_REQUEST:
		show_home()
