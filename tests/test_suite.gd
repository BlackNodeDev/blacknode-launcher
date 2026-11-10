extends Node
## Run with the main scene: godot --headless --path . -- --self-test
var failures: Array[String] = []
var checks: int = 0

func check(condition: bool, message: String) -> void:
	checks += 1
	if not condition:
		failures.append(message)
		push_error("TEST FAIL: " + message)

func run(launcher: Control) -> void:
	check(launcher.registry.size() == 5, "Five registry programs")
	check(App.version_string() == "0.1.0", "Factory version loaded")
	check(ProjectSettings.get_setting("rendering/renderer/rendering_method") == "gl_compatibility", "Compatibility renderer")
	for entry: Dictionary in launcher.registry:
		launcher.open_program(str(entry.id))
		await get_tree().process_frame
		check(is_instance_valid(launcher.program_node), "Program scene instantiates: " + str(entry.id))
		check(launcher.current_id == str(entry.id), "Navigation selects program")
		launcher.show_home()
		check(launcher.current_id.is_empty(), "Home navigation resets selection")
	launcher.open_program("updater")
	var updater: Control = launcher.program_node
	check(updater.compare_versions("0.2.0", "0.1.0") == 1, "Newer release")
	check(updater.compare_versions("0.1.0", "0.1.0") == 0, "Equal release")
	check(updater.compare_versions("0.0.9", "0.1.0") == -1, "Older release")
	check(updater.compare_versions("bad", "0.1.0") == -2, "Malformed version rejected")
	updater._completed(HTTPRequest.RESULT_CANT_CONNECT, 0, PackedStringArray(), PackedByteArray())
	check("Offline" in updater.status.text and not updater.check_button.disabled, "Offline check recovers")
	updater._completed(HTTPRequest.RESULT_SUCCESS, 404, PackedStringArray(), PackedByteArray())
	check("404" in updater.status.text, "Private manifest HTTP error handled")
	updater._completed(HTTPRequest.RESULT_SUCCESS, 200, PackedStringArray(), "invalid".to_utf8_buffer())
	check("Invalid" in updater.status.text, "Malformed JSON handled")
	updater._completed(HTTPRequest.RESULT_SUCCESS, 200, PackedStringArray(), '{"version":"0.2.0","patch_notes":["Test note"]}'.to_utf8_buffer())
	check("0.2.0" in updater.status.text and "Test note" in updater.notes.text, "Valid update and notes")
	updater._completed(HTTPRequest.RESULT_SUCCESS, 200, PackedStringArray(), '{"version":1}'.to_utf8_buffer())
	check("Invalid" in updater.status.text, "Invalid schema handled")
	updater._completed(HTTPRequest.RESULT_SUCCESS, 200, PackedStringArray(), '{"version":"nope"}'.to_utf8_buffer())
	check("Invalid" in updater.status.text, "Invalid semantic version handled")
	launcher.open_program("files")
	var browser: Control = launcher.program_node
	browser._parent()
	check(browser.current_path == "user://", "Files root cannot go up")
	browser._open_dir("..")
	check(browser.current_path == "user://", "Traversal rejected")
	launcher.open_program("settings")
	var old_color: Color = App.accent
	var old_scale: float = App.ui_scale
	var saved: Error = App.set_appearance(Color("73caff"), 1.15)
	check(saved == OK, "Settings saved")
	var config := ConfigFile.new()
	check(config.load(App.SETTINGS_PATH) == OK, "Settings file reloads")
	check(is_equal_approx(float(config.get_value("appearance", "ui_scale", 0.0)), 1.15), "Scale persisted")
	check(config.get_value("appearance", "accent", Color.BLACK) == Color("73caff"), "Accent persisted")
	App.set_appearance(old_color, old_scale)
	await get_tree().process_frame
	launcher.open_program("settings")
	launcher._notification(Node.NOTIFICATION_WM_GO_BACK_REQUEST)
	check(launcher.current_id.is_empty(), "Android back returns home")
	launcher.open_program("files")
	var cancel := InputEventAction.new()
	cancel.action = "ui_cancel"
	cancel.pressed = true
	launcher._unhandled_input(cancel)
	check(launcher.current_id.is_empty(), "ui_cancel returns home")
	App.log_event("TEST", "Read-only log test event")
	launcher.open_program("terminal")
	check(not launcher.program_node.output.editable, "Terminal is read-only")
	check("Read-only log test event" in launcher.program_node.output.text, "Log viewer displays events")
	print("SELF_TEST: %d checks, %d failures" % [checks, failures.size()])
	await get_tree().process_frame
	get_tree().quit(0 if failures.is_empty() else 1)
