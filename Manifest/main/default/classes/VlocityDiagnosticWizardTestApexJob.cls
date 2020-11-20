public class VlocityDiagnosticWizardTestApexJob implements Queueable
{
    public void execute(QueueableContext context){
        Long startTime = DateTime.now().getTime();
        Long finishTime = DateTime.now().getTime();
        while ((finishTime - startTime) < 30000) {
            finishTime = DateTime.now().getTime();
        }
    }

}