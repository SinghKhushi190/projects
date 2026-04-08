import java.util.Scanner;

public class inputuser {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
        int size = input.nextInt();
        int number[] = new int[size];

        for (int i = 0; i < size; i++) {
            number[i] = input.nextInt();
        }
        int x = input.nextInt();

        for (int i = 0; i < number.length; i++) {
            if(number[i] == x){
                System.out.println("X found at index:" + i);
            }
        }
    }
}
