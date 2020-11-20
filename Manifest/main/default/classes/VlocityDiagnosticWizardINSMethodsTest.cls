@isTest
private class VlocityDiagnosticWizardINSMethodsTest
{
	@isTest static void callSuperTest()
	{
		Map<String,Object> inputs = new Map<String,Object>();
		Map<String,Object> output = new Map<String,Object>();
		Map<String,Object> options = new Map<String,Object> {};
		String methodName = 'PLACEHOLDER';

		Type classType = Type.forName('VlocityDiagnosticWizardINSMethods');
		vlocity_ins.VlocityOpenInterface2 classInstance = (vlocity_ins.VlocityOpenInterface2) classType.newInstance();

		Object result = classInstance.invokeMethod(methodName, inputs, output, options);
		System.assertEquals(output.get('hasErrors'), false);
	}
}