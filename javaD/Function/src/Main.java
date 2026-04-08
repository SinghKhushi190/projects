import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
//        Q: take input of 2 number and print the sum

        System.out.println("Enter number 1:");
        int number1 = input.nextInt();
        System.out.println("Enter number 2:");
        int number2 = input.nextInt();
        int sum = number1 + number2;
        System.out.println("The sum is " + sum);

    }
}
