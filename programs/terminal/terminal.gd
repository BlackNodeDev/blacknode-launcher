extends VBoxContainer

var output: TextEdit

func _ready() -> void:
	add_theme_constant_override("separation", 24)
	UI.paragraph(self, "READ-ONLY SYSTEM LOG\nThis is not a command shell. No commands can be entered or executed.")
	output = UI.editor(App.log_text(), 950)
	add_child(output)
	App.log_added.connect(_refresh)
	UI.paragraph(self, "Last 500 events · user://launcher.log\nTimestamps use this device’s local clock.")

func _refresh() -> void:
	output.text = App.log_text()
	output.set_v_scroll(1.0e9)
