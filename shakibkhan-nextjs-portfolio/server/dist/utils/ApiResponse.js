"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    constructor(statusCode, data, message = "Success", info, traceId, pagination, links) {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
        this.info = info; // Assign the info field if provided
        this.pagination = pagination; // Assign the pagination field if provided
        this.links = links; // Assign the links field if pagination is provided and it contains a links object
        this.traceId = traceId; // Assign the traceId field if provided
    }
}
exports.ApiResponse = ApiResponse;
