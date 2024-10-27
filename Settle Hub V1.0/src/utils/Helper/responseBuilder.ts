export class ResponseBuilder {
  private success: boolean;
  private data: any;
  private message: string;
  private statusCode: number;

  public buildSuccessResponse(data, message, success, statusCode) {
    return { response: { data, message, success, statusCode } };
  }
  public buildFailureResponse(
    data,
    message,
    success,
    statusCode,
    errorMessage = ''
  ) {
    return {
      response: { data, message, success, statusCode, errorMessage }
    };
  }
}
