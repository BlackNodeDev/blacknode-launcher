extends VBoxContainer
## A read-only browser confined to the launcher's sandbox, not Android shared storage.
var current_path: String = "user://"
var listing: VBoxContainer
var path_label: Label
var preview: TextEdit

func _ready() -> void:
	add_theme_constant_override("separation", 24)
	UI.paragraph(self, "Launcher storage only. Read-only; no files are changed or deleted.")
	path_label = UI.label(current_path, 30, App.accent)
	add_child(path_label)
	add_child(UI.button("↑  Parent directory", _parent))
	listing = UI.column(self, 16)
	preview = UI.editor("Select a file to preview text (up to 32 KiB).", 480)
	add_child(preview)
	refresh()

func refresh() -> void:
	for child: Node in listing.get_children():
		listing.remove_child(child)
		child.queue_free()
	path_label.text = current_path
	var directory := DirAccess.open(current_path)
	if directory == null:
		UI.paragraph(listing, "Directory unavailable.")
		return
	var folders: PackedStringArray = directory.get_directories()
	var file_names: PackedStringArray = directory.get_files()
	folders.sort()
	file_names.sort()
	for folder: String in folders:
		listing.add_child(UI.button("[DIR]  " + folder, _open_dir.bind(folder)))
	for filename: String in file_names:
		listing.add_child(UI.button(filename, _open_file.bind(filename)))
	if folders.is_empty() and file_names.is_empty():
		UI.paragraph(listing, "This directory is empty.")

func _open_dir(folder: String) -> void:
	if folder.contains("/") or folder.contains("\\") or folder == "..":
		return
	current_path = current_path.path_join(folder)
	preview.text = "Select a file to preview."
	refresh()

func _parent() -> void:
	if current_path == "user://":
		return
	var relative: String = current_path.trim_prefix("user://")
	var slash: int = relative.rfind("/")
	current_path = "user://" + relative.left(slash) if slash >= 0 else "user://"
	refresh()

func _open_file(filename: String) -> void:
	if filename.contains("/") or filename.contains("\\"):
		return
	var path: String = current_path.path_join(filename)
	var file := FileAccess.open(path, FileAccess.READ)
	if file == null:
		preview.text = "Cannot open file."
		return
	var length: int = file.get_length()
	var data: PackedByteArray = file.get_buffer(mini(length, 32768))
	if 0 in data:
		preview.text = "%s\n%d bytes · binary file, no text preview." % [filename, length]
	else:
		preview.text = "%s · %d bytes\n\n%s%s" % [filename, length, data.get_string_from_utf8(), "\n[Preview truncated]" if length > 32768 else ""]
