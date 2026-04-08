import java.util.Scanner;

public class marks {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
        int size = input.nextInt();
        int [] number = new int [size];

         for(int i=0;i<size;i++){
             number[i]=input.nextInt();
         }

        for (int i = 0; i < 6; i++){
            System.out.println(number[i]);
        }
    }
}
