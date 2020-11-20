@isTest
public class VlocityDiagnosticWizardTestHTTPCallout implements HttpCalloutMock {
	public Integer code;
	public String status;
	public String body;

	/**
	 * VlocityDiagnosticWizardTestHTTPCallout initializes the HttpCalloutMock with the given params
	 * @param  code            code is the returned HTTP Status code (eg. 200 or 400)
	 * @param  status          status is the HTTP Status message (eg. 'OK')
	 * @param  body            body is the HTTP Body (eg. {...})
	 */
	public VlocityDiagnosticWizardTestHTTPCallout(Integer code, String status, String body)
	{
		this.code = code;
		this.status = status;
		this.body = body;
	}

	/**
	 * respond returns a mocked HTTPResponse
	 * @param  req req is the HTTP request
	 * @return     return HTTPResponse
	 */
	public HTTPResponse respond(HTTPRequest req)
	{
		HttpResponse res = new HttpResponse();
		res.setBody(this.body);
		res.setStatusCode(this.code);
		res.setStatus(this.status);
		return res;
	}
}