class ApiResponse<T> {
    statusCode: number;
    data: T;
    message: string;
    success: boolean;
    info?: string; // Optional info field
    traceId?: string; // Optional traceId field
    pagination?: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      links?: {
        // Optional links object inside pagination
        self: string;
        first: string;
        prev: string;
        next: string;
        last: string;
      };
    }; // Optional pagination object
    links?: object; // Optional links object inside pagination
  
    constructor(
      statusCode: number,
      data: T,
      message: string = "Success",
      info?: string,
      traceId?: string,
      pagination?: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
        links?: {
          // Optional links object inside pagination
          self: string;
          first: string;
          prev: string;
          next: string;
          last: string;
        };
      },
      links?: object
    ) {
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
  
  export { ApiResponse };