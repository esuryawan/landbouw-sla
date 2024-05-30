import axios from 'axios';
import { AuthService, setAuthAPI_URL } from "ababil-auth";

export const API_DOMAIN = process.env.NODE_ENV === 'production' ?
	`https://${window.location.hostname}` :
	// 'http://localhost:7000';
	`https://sla.iasma.id`

const API_URL = API_DOMAIN + '/api/auth/';
setAuthAPI_URL(API_URL);

class AuthServiceSLA extends AuthService {

	// ---------------------------------------------------------------------
	// UserSLA Management methods
	// ---------------------------------------------------------------------
	async queryName(angkatan: number, nama: string) {
		this.setAccessToken(axios);
		const response = await axios.get(API_URL + `names/${angkatan}/${nama}`);
		return response.data;
	}

	async queryNameAll(angkatan: number, nama: string) {
		this.setAccessToken(axios);
		const response = await axios.get(API_URL + `namesall/${angkatan}/${nama}`);
		return response.data;
	}

	async queryEmail(email: string) {
		this.setAccessToken(axios);
		const response = await axios.get(API_URL + `email/${email}`);
		return response.data;
	}

	async queryAlumni(id: number) {
		this.setAccessToken(axios);
		const response = await axios.get(API_URL + `alumni/${id}`);
		return response.data;
	}

	async updateAlumni(id: number, data: any) {
		this.setAccessToken(axios);
		const response = await axios.patch(API_URL + `alumni/${id}`, data);
		return response.data;
	}

	async registrasi(data: any) {
		this.setAccessToken(axios);
		const response = await axios.post(API_URL + "register", data);
		return response.data;
	}

	async attendanceCode() {
		this.setAccessToken(axios);
		const response = await axios.post(API_URL + "attendanceCode", undefined);
		return response.data;
	}

	async attendanceCheck(data: any) {
		this.setAccessToken(axios);
		const response = await axios.post(API_URL + "attendanceCheck", data);
		return response.data;
	}

	async absensi(data: any) {
		this.setAccessToken(axios);
		const response = await axios.post(API_URL + "absensi", data);
		return response.data;
	}

	async roleList(page: number, size: number) {
		this.setAccessToken(axios);
		return axios.get(API_URL + `roles?p=${page}&s=${size}`);
	}

	async roleId(id: number) {
		this.setAccessToken(axios);
		return axios.get(API_URL + `roles/${id}`);
	}

	async roleSave(data: any) {
		this.setAccessToken(axios);
		const response = await axios.patch(API_URL + "roleSave", data);
		return response.data;
	}

	// ---------------------------------------------------------------------
	// Charts
	// ---------------------------------------------------------------------
	async chartRegistration() {
		this.setAccessToken(axios);
		const response = await axios.get(API_URL + `chart/registration`);
		return response.data;
	}

	async chartPresention() {
		this.setAccessToken(axios);
		const response = await axios.get(API_URL + `chart/presention`);
		return response.data;
	}

	async updateKehadiran(data: any) {
		this.setAccessToken(axios);
		const response = await axios.post(API_URL + 'attendanceConfirm', data);
		return response.data;
	}

	async queryConfirmationSummary() {
		this.setAccessToken(axios);
		const response = await axios.get(API_URL + `chart/confirmation`);
		return response.data;
	}

	async queryConfirmationNames(year: any) {
		this.setAccessToken(axios);
		const response = await axios.get(API_URL + `chart/confirm/${year}`);
		return response.data;
	}

	async queryPresentionSummary() {
		this.setAccessToken(axios);
		const response = await axios.get(API_URL + `chart/presention`);
		return response.data;
	}

	async queryPresentionNames(year: any) {
		this.setAccessToken(axios);
		const response = await axios.get(API_URL + `chart/present/${year}`);
		return response.data;
	}

}

export var authService = new AuthServiceSLA();
