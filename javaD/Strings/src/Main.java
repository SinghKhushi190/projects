import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
//        Scanner sc = new Scanner(System.in);
        //concatenation
        String firstName = "tony";
        String lastName = "stark";
        String fullName = firstName + " " + lastName;
        System.out.println(fullName.length());   // length of string

        //charAt
        for(int i =0; i<fullName.length(); i++){
            System.out.println(fullName.charAt(i));
        }
    }
}