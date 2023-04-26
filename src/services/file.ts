import axios from 'axios'
import { authService, API_DOMAIN } from './auth';

const API_URL = API_DOMAIN + '/api/file/';

class FileService {
	// ---------------------------------------------------------------------
	// File Management methods
	// ---------------------------------------------------------------------
	async uploadProfile(data: any, onProgress: any) {
		const login = authService.getLogin();
		let headers: any = {
			"Content-Type": "multipart/form-data"
		};
		if (login && login.AccessToken) {
			headers['x-access-token'] = login.AccessToken;
		}
		const response = await axios.post(API_URL + "profile", data, {
			headers: headers,
			onUploadProgress: onProgress,
		});
		return response.data;
	}

}

export var fileService = new FileService();