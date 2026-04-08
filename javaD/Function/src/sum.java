import java.util.Scanner;

public class sum {
    public static void main(String[] args) {
//       int ans =  sum2();
//        System.out.println(ans);
        int ans = sum3(20,30);
        System.out.println(ans);
    }

//    pass the value of numbers when you are calling the method in main()
    static int sum3(int a, int b){
        int sum = a + b;
        return a+b;
    }


// return the value
    static int sum2(){
        Scanner in = new Scanner(System.in);
        System.out.println("Enter number 1:");
        int number1 =  in.nextInt();
        System.out.println("Enter number 2:");
        int number2 = in.nextInt();
        int sum = number1 + number2;
        System.out.println("The sum is " + sum);
        return sum;
    }
//     System.out.println("This will never execute");

    static void sum() {
        Scanner in = new Scanner(System.in);
        System.out.println("Enter number 1:");
        int number1 =  in.nextInt();
        System.out.println("Enter number 2:");
        int number2 = in.nextInt();
        int sum = number1 + number2;
        System.out.println("The sum is " + sum);

    }


/*
            return_type name () {
                      //body
                    return statement;
              }
                  */
}
