//--------------------------------------------------------------------------
// Printing
import javax.print.Doc;
import javax.print.DocFlavor;
import javax.print.DocPrintJob;
import javax.print.PrintException;
import javax.print.PrintService;
import javax.print.PrintServiceLookup;
import javax.print.SimpleDoc;


//--------------------------------------------------------------------------
void printTicket(int id)
{

  imprimirLinia("****************************************\n");
  imprimirLinia("*       _THE HIGHEST HUMAN TOWER_      *\n");
  imprimirLinia("                                        \n");                            
  imprimirLinia("···················:`···················\n");
  imprimirLinia("················-md:····················\n");
  imprimirLinia("···············`yMd·····················\n");
  imprimirLinia("···············:smM`····················\n");
  imprimirLinia("················mm:·····················\n");
  imprimirLinia("···············`y:o·····················\n");
  imprimirLinia("··············`o-`+-`···················\n");
  imprimirLinia("·············s``Ny``s`··················\n");
  imprimirLinia("············`osmMMmo+`··················\n");
  imprimirLinia("···············sMMy·····················\n");
  imprimirLinia("···············mMMm·····················\n");
  imprimirLinia("···············MyhM·····················\n");
  imprimirLinia("··············`M.-M`····················\n");
  imprimirLinia("··············`N `d`····················\n");
  imprimirLinia("·············+-.ho.-+···················\n");
  imprimirLinia("············`ysyNmhos`··················\n");
  imprimirLinia("···············sMMy·····················\n");
  imprimirLinia("···············dMMm·····················\n");
  imprimirLinia("···············NmNN·····················\n");
  imprimirLinia("··············`M::M`····················\n");
  imprimirLinia("···············N `m·····················\n");
  imprimirLinia("·············::oo/+-:···················\n");
  imprimirLinia("············.h/+Nd++h`··················\n");
  imprimirLinia("·············`-hMMy`····················\n");
  imprimirLinia("···············hMMd·····················\n");
  imprimirLinia("···············NNMm·····················\n");
  imprimirLinia("··············.M/oM`····················\n");
  imprimirLinia("··············`N-.N·····················\n");
  imprimirLinia("·············`.+NNNm/···················\n");
  imprimirLinia("···········`sMMMMMMMMmd.················\n");
  imprimirLinia("··········+MMMMMMMMMMMMh················\n");
  imprimirLinia("··········dMMMMMMMMMMMM+················\n");
  imprimirLinia("··········dMMMMMMMMMMMM/················\n");
  imprimirLinia("··········mMMMMMMMMMMMMy················\n");
  imprimirLinia("··········NMMMmNMMMMMMNh`···············\n");
  imprimirLinia("****************************************\n");
  imprimirLinia("   YOU ID IS:"+new Integer(id).toString()+"\n" );
  imprimirLinia("   GO TO THE WEBSITE:                   \n" );
  imprimirLinia("   http://thehighesthumantower.com      \n" );
  imprimirLinia("****************************************\n");
  imprimirLinia("   PROJECT PRODUCED IN 2014 BY:         \n");
  imprimirLinia("   Varvara Guljajeva and Mar Canet      \n");
  imprimirLinia("   PROJECT COMISSIONED BY:              \n");
  imprimirLinia("   MOBILE WORLD CAPITAL                  \n");
  imprimirLinia("****************************************\n");
  imprimirLinia("\n");
  imprimirLinia("\n");
  imprimirLinia("\n");
  imprimirLinia("\n");
  imprimirLinia("\n");
  imprimirLinia("\n");
  imprimirLinia("\n");
  imprimirLinia("\n");
  imprimirLinia("\n");
  imprimirLinia("\n");
  imprimirLinia("\n");
  imprimirLinia("\n");
  imprimirLinia("\n");
  imprimirLinia("\n");
  imprimirLinia("\n");
  imprimirLinia("\n");
  imprimirLinia("\n");
  imprimirLinia("\n");
  imprimirLinia("\n");
  imprimirLinia("\n");
  imprimirLinia("\n");
}
//--------------------------------------------------------------------------
void imprimirLinia(String lineStr)
{
    PrintService printService = PrintServiceLookup.lookupDefaultPrintService();
    DocFlavor flavor = DocFlavor.BYTE_ARRAY.AUTOSENSE;
    DocPrintJob docPrintJob = printService.createPrintJob();
  
    Doc doc=new SimpleDoc(lineStr.getBytes(),flavor,null);
    try {
      docPrintJob.print(doc, null);
    }
    catch (PrintException e) {
      //System.out.println("Error al imprimir: "+e.getMessage());
    }
    System.out.println("FIN DE IMPRESION");
}
