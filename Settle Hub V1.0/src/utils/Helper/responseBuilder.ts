export class ResponseBuilder {
  public buildSuccessResponse(
    data: any,
    message: any,
    success: any,
    statusCode: any
  ) {
    return { response: { data, message, success, statusCode } };
  }
  public buildFailureResponse(
    data: any,
    message: any,
    success: any,
    statusCode: any,
    errorMessage = ""
  ) {
    return {
      response: { data, message, success, statusCode, errorMessage },
    };
  }
}
