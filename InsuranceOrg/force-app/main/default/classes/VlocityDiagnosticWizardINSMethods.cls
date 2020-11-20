public class VlocityDiagnosticWizardINSMethods extends VlocityDiagnosticWizardBaseMethods
{
	/**
	 * The VlocityOpenInterface2 method override to dynamically call methods available for the INS Upgrade Wizard,
	 *    and in the VlocityDiagnosticWizardBaseMethods class
	 * @param  methodName  The name of the method that will be invoked
	 * @param  inputs      The inputs of the method
	 * @param  outputs     A map to store output information in
	 * @param  options     Any optional parameters
	 * @return Object      Returns the output map
	 */
	public override Object invokeMethod(String methodName,
	                                    Map<String,Object> inputs,
	                                    Map<String,Object> output,
	                                    Map<String,Object> options)
	{
		switch on methodName
		{
			when else
			{
				return super.invokeMethod(methodName, inputs, output, options);
			}
		}
	}
}