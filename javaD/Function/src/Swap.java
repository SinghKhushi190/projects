public class Swap {
    public static void main(String[] args){
        int a = 10;
        int b = 20;

        //swap numbers code
//        int temp = a;
//        a = b;
//        b = temp;
        swap(a,b);
        System.out.println(a+ "\n" + b);
        String name = "Rishu singh";
        changeName(name);                                /* there is no swapping between these given values because
                                                                       in JAVA Function weare only using call by value , we are not using call by reference
                                                                                   (here we are not modifying values)                                          */

        System.out.println(name);

    }

     static void changeName(String name) {
        name = "Khushi Kumari";            // Creating a new object
    }

 static void swap(int num1,int num2){
        int temp = num1;
        num1 = num2;
        num2 = temp;

        // this change will only be valid in this function scope only.
    }
}
