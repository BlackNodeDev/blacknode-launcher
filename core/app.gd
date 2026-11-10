extends Node
## Local-only state. No account, telemetry, third-party assets or embedded secrets.
signal settings_changed
signal log_added

const SETTINGS_PATH: String = "user://settings.cfg"
const LOG_PATH: String = "user://launcher.log"
const MANIFEST_URL: String = "https://raw.githubusercontent.com/BlackNodeDev/blacknode-launcher/main/version.json"
const DEFAULT_ACCENT: Color = Color("67e8b2")
const MAX_LOG_LINES: int = 500

var accent: Color = DEFAULT_ACCENT
var ui_scale: float = 1.0
var version_data: Dictionary = {}
var log_lines: Array[String] = []

func _ready() -> void:
	version_data = read_json("res://version.json")
	var config := ConfigFile.new()
	if config.load(SETTINGS_PATH) == OK:
		var saved_color: Variant = config.get_value("appearance", "accent", DEFAULT_ACCENT)
		if saved_color is Color:
			accent = saved_color
		var saved_scale: Variant = config.get_value("appearance", "ui_scale", 1.0)
		if saved_scale is float or saved_scale is int:
			ui_scale = clampf(float(saved_scale), 0.85, 1.15)
	if FileAccess.file_exists(LOG_PATH):
		var previous := FileAccess.get_file_as_string(LOG_PATH).split("\n", false)
		for line: String in previous:
			log_lines.append(line)
		while log_lines.size() > MAX_LOG_LINES:
			log_lines.pop_front()
	log_event("BOOT", "BlackNode %s / factory. Compatibility renderer." % version_string())

func read_json(path: String) -> Dictionary:
	if not FileAccess.file_exists(path):
		return {}
	var parser := JSON.new()
	if parser.parse(FileAccess.get_file_as_string(path)) != OK:
		return {}
	var parsed: Variant = parser.data
	if parsed is Dictionary:
		return parsed
	return {}

func version_string() -> String:
	return str(version_data.get("version", "unknown"))

func set_appearance(color: Color, scale_value: float) -> Error:
	accent = color
	ui_scale = clampf(scale_value, 0.85, 1.15)
	var config := ConfigFile.new()
	config.set_value("appearance", "accent", accent)
	config.set_value("appearance", "ui_scale", ui_scale)
	var error: Error = config.save(SETTINGS_PATH)
	log_event("SETTINGS", "Appearance saved" if error == OK else "Save failed: %s" % error_string(error))
	settings_changed.emit()
	return error

func log_event(category: String, message: String) -> void:
	var stamp: String = Time.get_datetime_string_from_system(false, true)
	log_lines.append("%s  [%s] %s" % [stamp, category, message.replace("\n", " ")])
	while log_lines.size() > MAX_LOG_LINES:
		log_lines.pop_front()
	var file := FileAccess.open(LOG_PATH, FileAccess.WRITE)
	if file != null:
		file.store_string("\n".join(log_lines) + "\n")
	log_added.emit()

func log_text() -> String:
	return "\n".join(log_lines)
