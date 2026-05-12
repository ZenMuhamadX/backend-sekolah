import { HttpStatusCode } from 'axios';

export interface SuccessResponse {
	status: HttpStatusCode;
	succes: boolean;
	message: string;
	data: any;
	meta: any;
}
export interface ErrorResponse {
	status: HttpStatusCode;
	succes: boolean;
	message: string;
	errors: any;
}
