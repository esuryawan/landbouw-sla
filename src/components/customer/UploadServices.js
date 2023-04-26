import axios from "axios";

export const http = axios.create({
	baseURL: "http://localhost:8080",
	headers: {
		"Content-type": "application/json"
	}
});

export function upload(file, onUploadProgress) {
	let formData = new FormData();
	formData.append("file", file);
	return http.post("/upload", formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
		onUploadProgress,
	});
}

export function getFiles() {
	return http.get("/files");
}
