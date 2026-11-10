extends VBoxContainer

var request: HTTPRequest
var status: Label
var notes: Label
var check_button: Button

func _ready() -> void:
	add_theme_constant_override("separation", 28)
	var current: VBoxContainer = UI.card(self)
	current.add_child(UI.label("CURRENT RELEASE", 27, App.accent))
	current.add_child(UI.label("%s / %s" % [App.version_string(), App.version_data.get("codename", "factory")], 59))
	UI.paragraph(current, "Factory foundation · metadata checks only")
	check_button = UI.button("Check for updates", check_for_updates, true)
	add_child(check_button)
	status = UI.paragraph(self, "Ready. Nothing is downloaded or installed automatically.")
	var patches: VBoxContainer = UI.card(self)
	patches.add_child(UI.label("Patch notes", 41))
	notes = UI.paragraph(patches, _notes_text(App.version_data))
	UI.paragraph(self, "Private repository: the default feed will return 404 without authentication. A public manifest or authenticated proxy is needed later. Never ship a GitHub token in the app.")
	request = HTTPRequest.new()
	request.timeout = 12.0
	request.body_size_limit = 262144
	request.max_redirects = 3
	request.request_completed.connect(_completed)
	add_child(request)

func check_for_updates() -> void:
	check_button.disabled = true
	status.text = "Checking release manifest…"
	App.log_event("UPDATER", "Manifest check requested")
	var error: Error = request.request(App.MANIFEST_URL)
	if error != OK:
		_fail("Cannot start check: %s. Current version is unchanged." % error_string(error))

func _completed(result: int, response_code: int, _headers: PackedStringArray, body: PackedByteArray) -> void:
	check_button.disabled = false
	if result != HTTPRequest.RESULT_SUCCESS:
		_fail("Offline or network failure (%d). Current version is unchanged." % result)
		return
	if response_code != 200:
		_fail("Manifest unavailable (HTTP %d). Private feed access is not configured." % response_code)
		return
	var parser := JSON.new()
	if parser.parse(body.get_string_from_utf8()) != OK:
		_fail("Invalid JSON manifest. Nothing changed.")
		return
	var parsed: Variant = parser.data
	if parsed is not Dictionary or not parsed.get("version", null) is String:
		_fail("Invalid manifest. Expected a version string. Nothing changed.")
		return
	var remote: Dictionary = parsed
	var comparison: int = compare_versions(str(remote.version), App.version_string())
	if comparison == -2:
		_fail("Invalid manifest version. Use major.minor.patch. Nothing changed.")
		return
	status.text = "New version available: %s. Installation is not enabled in factory." % remote.version if comparison > 0 else "You are up to date. Current version: " + App.version_string()
	notes.text = _notes_text(remote)
	App.log_event("UPDATER", status.text)

func _fail(message: String) -> void:
	check_button.disabled = false
	status.text = message
	App.log_event("UPDATER", message)

func _notes_text(manifest: Dictionary) -> String:
	var values: Variant = manifest.get("patch_notes", [])
	var lines: Array[String] = []
	if values is Array:
		for item: Variant in values:
			if item is String:
				lines.append("• " + item.left(2000))
	return "\n".join(lines) if not lines.is_empty() else "No patch notes supplied."

func compare_versions(remote: String, local: String) -> int:
	var left: PackedStringArray = remote.split(".")
	var right: PackedStringArray = local.split(".")
	if left.size() != 3 or right.size() != 3:
		return -2
	for index: int in range(3):
		if not left[index].is_valid_int() or not right[index].is_valid_int() or int(left[index]) < 0 or int(right[index]) < 0:
			return -2
	for index: int in range(3):
		if int(left[index]) > int(right[index]):
			return 1
		if int(left[index]) < int(right[index]):
			return -1
	return 0
