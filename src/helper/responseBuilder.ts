// TODO : Merge both methods and expose single generic ResponseEntity function .

export class ResponseBuilder {
  public buildSuccessResponse(
    data: any,
    message: string,
    success: boolean,
    statusCode: number
  ) {
    return { response: { data, message, success, statusCode } };
  }
  public buildFailureResponse(
    data: any,
    message: string,
    success: boolean,
    statusCode: number,
    errorMessage = ''
  ) {
    return {
      response: { data, message, success, statusCode, errorMessage }
    };
  }
}
